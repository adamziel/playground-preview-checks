import fs from 'node:fs';
import { runCLI } from '@wp-playground/cli';

const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const result = { branch: input.branch, url: input.links?.[0] };
let server;
try {
  const blueprint = input.blueprint || await (await fetch(input.blueprintUrl)).json();
  server = await runCLI({ command: 'server', blueprint, port: 0, workers: 1, internalCookieStore: true, verbosity: 'quiet' });
  const response = await server.playground.run({ code: `<?php
    require '/wordpress/wp-load.php';
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    echo json_encode([
      'plugins' => get_option('active_plugins'),
      'theme' => get_option('stylesheet'),
      'themeName' => wp_get_theme()->get('Name'),
      'blogname' => get_option('blogname'),
      'composer' => class_exists('Psr\\Log\\NullLogger'),
      'vite' => file_exists(WP_PLUGIN_DIR . '/my-plugin/dist/preview.js'),
      'pluginNames' => array_map(function ($p) { return $p['Name']; }, get_plugins()),
      'wp' => get_bloginfo('version'),
      'php' => PHP_VERSION
    ]);
  ` });
  if (response.exitCode !== 0 || response.errors) throw new Error('PHP check: ' + response.errors);
  result.state = JSON.parse(response.text);
  const expectedSlugs = {
    'direct-root': ['playground-preview-checks'], 'direct-subdir': ['my-awesome-plugin'],
    'direct-both': ['my-plugin'], 'direct-blueprint': ['playground-preview-checks', 'woocommerce'],
    'direct-hosted': ['my-plugin'], 'direct-comment': ['playground-preview-checks'],
    'direct-description-template': ['playground-preview-checks'], 'direct-comment-template': ['playground-preview-checks'],
    'build-plugin': ['my-plugin'], 'build-monorepo': ['site-toolkit', 'site-analytics'],
    'build-selective': ['alpha'], 'build-composer': ['my-plugin'], 'build-custom': ['my-plugin'],
    'build-comment': ['my-plugin'], 'legacy-current': ['my-plugin'], 'legacy-workflow': ['my-plugin']
  }[input.case] || [];
  const direct = input.type === 'direct';
  // Git directory resources choose their own folder names. The PHP entry file
  // and the active plugin list identify the fixture without assuming that name.
  const expected = expectedSlugs.map(s => direct ? (s === 'playground-preview-checks' ? 'my-plugin' : s) + '.php' : s).sort();
  const actual = result.state.plugins.map(p => direct ? p.split('/').at(-1) : p.split('/')[0]).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error('Plugin mismatch: ' + JSON.stringify({ actual, expected }));
  }
  if (['direct-theme', 'direct-both', 'build-theme'].includes(input.case) && result.state.themeName !== 'Preview Theme') {
    throw new Error('Fixture theme was not activated');
  }
  if (input.case === 'build-composer' && (!result.state.composer || !result.state.vite)) {
    throw new Error('Composer or Vite output missing');
  }
  if (input.case === 'build-custom') {
    let path = '/wp-admin/admin.php?page=my-plugin';
    let page;
    const cookies = new Map();
    for (let redirects = 0; redirects < 5; redirects++) {
      page = await server.playground.request({ url: path, headers: { cookie: [...cookies].map(([k,v]) => k + '=' + v).join('; ') } });
      for (const cookie of page.headers['set-cookie'] || []) {
        const pair = cookie.split(';')[0];
        cookies.set(pair.slice(0, pair.indexOf('=')), pair.slice(pair.indexOf('=') + 1));
      }
      if (![301,302,303,307,308].includes(page.httpStatusCode)) break;
      path = page.headers.location[0];
    }
    result.landingResponse = { status: page.httpStatusCode, path };
    result.landingPageWorks = page.httpStatusCode === 200 && page.text.includes('Preview fixture is active');
    if (!result.landingPageWorks) throw new Error('Custom admin page did not load');
  }
  result.status = 'pass';
} catch (error) {
  result.status = 'fail';
  result.error = String(error.stack || error);
} finally {
  if (server) await server[Symbol.asyncDispose]();
  fs.writeFileSync(process.argv[3], JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
  process.exitCode = result.status === 'pass' ? 0 : 1;
}
