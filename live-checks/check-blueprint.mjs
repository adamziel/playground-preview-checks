import fs from 'node:fs';
import assert from 'node:assert/strict';
import { runCLI } from '../checks/node_modules/@wp-playground/cli/index.js';

const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const result={case:input.case,pr:input.url,sha:input.sha};
let server;
try {
  server=await runCLI({command:'server',blueprint:input.blueprint,port:0,workers:1,internalCookieStore:true,verbosity:'quiet'});
  const response=await server.playground.run({code:`<?php
    require '/wordpress/wp-load.php';
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    ob_start(); do_action('admin_notices'); $notices=ob_get_clean();
    if (class_exists('PlaygroundDemo\\Notice')) { \\PlaygroundDemo\\Notice::enqueueAdmin(); }
    $script=wp_scripts()->registered['playground-demo-admin'] ?? null;
    $active=get_option('active_plugins');
    $files=[];
    foreach ($active as $file) {
      $dir=dirname(WP_PLUGIN_DIR . '/' . $file);
      $files[$file]=[
        'builtAt'=>file_exists($dir.'/built-at.txt') ? trim(file_get_contents($dir.'/built-at.txt')) : null,
        'js'=>file_exists($dir.'/dist/admin.js') ? file_get_contents($dir.'/dist/admin.js') : null,
      ];
    }
    echo json_encode([
      'active'=>$active,'plugins'=>array_map(fn($p)=>$p['Name'],get_plugins()),
      'notices'=>strip_tags($notices),'composer'=>class_exists('Psr\\Log\\NullLogger'),
      'autoload'=>class_exists('PlaygroundDemo\\Notice'),'script'=>$script ? $script->src : null,
      'files'=>$files,'wp'=>get_bloginfo('version'),'php'=>PHP_VERSION
    ]);
  `});
  assert.equal(response.exitCode,0,response.errors);
  result.state=JSON.parse(response.text);
  const expected=input.expectedFiles || {simple:['my-plugin.php'],monorepo:['site-analytics.php','site-toolkit.php'],selective:['alpha.php'],'composer-vite':['playground-demo-plugin.php']}[input.case];
  assert.deepEqual(result.state.active.map(x=>x.split('/').at(-1)).sort(),expected.sort());
  const marker=input.marker===undefined ? 'Preview A' : input.marker;
  if (marker) assert.ok(result.state.notices.includes(marker),result.state.notices);
  if (input.case==='simple') assert.ok(Object.values(result.state.files)[0].builtAt);
  if (input.case==='composer-vite') {
    assert.ok(result.state.composer && result.state.autoload);
    assert.ok(result.state.script?.includes('/dist/admin.js'));
    assert.ok(Object.values(result.state.files)[0].js?.includes(marker));
  }
  result.status='pass';
} catch(error) {
  result.status='fail'; result.error=String(error.stack || error);
} finally {
  if(server) await server[Symbol.asyncDispose]();
  fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
  process.exitCode=result.status==='pass'?0:1;
}
