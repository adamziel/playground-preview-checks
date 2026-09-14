# Live-example checks — 2026-09-14

## Result

All four copied live examples built, published and opened successfully with the merged action version. No functional failure was found in the tested paths. This is not a claim that every browser, fork case, or older WordPress version has been covered.

- Eight disposable PRs across four new `adamziel/preview-check-*` repositories.
- 17 successful build executions and 17 successful publish executions: 30 distinct workflow runs, including four build reruns. No failed or unfinished runs remained.
- 17 generated Blueprints passed the CLI checks.
- 28 public, unauthenticated ZIP downloads matched the corresponding source artifact bytes. All archives passed ZIP integrity checks.
- 13 distinct preview revisions opened in fresh isolated Chrome contexts: four initial, four extra cases, four updates, and the final monorepo cleanup case.
- The four initial examples also passed in the in-app browser. The Composer/Vite counter visibly advanced in both browser environments.
- Update, rerun and cleanup checks passed. The original live examples were left unchanged.

GitHub API, PR, workflow, repository and artifact operations used `gh`; repository commits used Git. Public download checks intentionally used unauthenticated HTTP, and browser tools were used only for runtime checks after the request to use `gh`.

## Exact revisions and scope

Both copied reusable-workflow references were pinned to [`464a136c9f979c084d7b4e1be3aa6b2b34929403`](https://github.com/adamziel/action-wp-playground-pr-preview/commit/464a136c9f979c084d7b4e1be3aa6b2b34929403), the merged action-fork main revision. Its publisher internally calls the button action at `6a92c0ffc2cdddc4368a807ed79b696aa58eed3e`; that existing pin was not changed.

The actual source repos were copied at these commits:

| Example | Original repo | Original main SHA |
|---|---|---|
| simple | [preview-in-playground-button-v3-example-simple](https://github.com/adamziel/preview-in-playground-button-v3-example-simple) | `ccf7b8ccce93bedec8398fc8d44ddf0fa0a88d25` |
| monorepo | [preview-in-playground-button-v3-example-monorepo](https://github.com/adamziel/preview-in-playground-button-v3-example-monorepo) | `d987ef51e0c51829f57f94bf4faa3029d606864f` |
| selective | [preview-in-playground-button-v3-example-monorepo-selective](https://github.com/adamziel/preview-in-playground-button-v3-example-monorepo-selective) | `ff5033086a259a8ca9221e3524599b57f162f8fb` |
| composer-vite | [preview-in-playground-button-v3-example-composer-vite](https://github.com/adamziel/preview-in-playground-button-v3-example-composer-vite) | `4050f4ea095407aedf8d5e93d6cda08398e305a0` |

On each copied main branch, only the build and publish action references changed. The original build commands, ZIP layouts and Blueprint choices were preserved. The PR branches added visible A/B/C markers, or the small selective-change cases described below. These were not replacement fixture builds.

All remote writes were confined to the four new test repositories and this report repository, under `adamziel/`. No original example branch, PR or release was edited. Their main SHAs, all PR bodies/titles/states/head and base SHAs, and release metadata/asset IDs/names/sizes/digests matched the initial snapshots. The action fork and upstream version tags were not changed. See [the comparison](live-checks/originals-unchanged.json).

## Browser and functional checks

| Copied example | Current PR | Confirmed behavior |
|---|---|---|
| Simple | [#1](https://github.com/adamziel/preview-check-simple/pull/1) | Plugin active; expected marker; real `built-at.txt` timestamp shown. |
| Monorepo | [#1](https://github.com/adamziel/preview-check-monorepo/pull/1) | Both Site Toolkit and Site Analytics active, with the current marker. |
| Selective | [#1](https://github.com/adamziel/preview-check-selective/pull/1) | Alpha active; Beta not installed for an alpha-only change. |
| Composer/Vite | [#1](https://github.com/adamziel/preview-check-composer-vite/pull/1) | Plugin active; Composer class loading and `psr/log` available; built JS enqueued; visible counter running with the current marker. |

Each browser check used the URL from the actual generated PR button, then navigated to `/wp-admin/plugins.php`. WordPress opened already logged in as admin. Active rows and notices were read from the rendered page. The isolated browser was Chrome 152 on macOS, with no GitHub login in its fresh contexts. These were not checks against the user's installed Chrome profile.

The in-app Composer/Vite counter advanced from `17 / Preview A` to `141 / Preview A`. In isolated Chrome, the updated build displayed `38 / Preview B`. CLI checks used Node 23.11.0 and Playground CLI 3.1.53, loading WordPress 7.1 and PHP 8.3.33. CLI output alone does not prove browser JS execution; the browser checks cover that separately.

### Extra selection cases

- [Selective #2](https://github.com/adamziel/preview-check-selective/pull/2): beta-only change → only Beta active; `Preview Beta` visible.
- [Selective #3](https://github.com/adamziel/preview-check-selective/pull/3): both plugins changed → both active; `Preview Both` visible in both notices.
- [Selective #4](https://github.com/adamziel/preview-check-selective/pull/4): README-only change → the original fallback installs both plugins.
- [Monorepo #2](https://github.com/adamziel/preview-check-monorepo/pull/2): a second PR installs both plugins and shows its separate `Second Preview` marker on Site Toolkit.

All four passed in isolated Chrome and in the CLI. They were not repeated in the in-app browser. The selective build always publishes both ZIPs; its generated Blueprint chooses which to install. Two published ZIPs therefore do not mean two plugins should be active.

## Updates, reruns and cleanup

1. Pushed A → B in all four primary PRs. Each new button URL used the new head SHA. The generated Blueprint installed the B build in a fresh browser context and in the CLI.
2. Each description still had exactly one preview block. The text outside that block was unchanged. The original explanatory sentence mentioning A was deliberately preserved as part of this check.
3. Reran all four B source workflows with `gh run rerun`. All four reached attempt 2 and each triggered a new successful publish run. The PR body and button URL were unchanged, no comments were added, and release asset names did not multiply. Public ZIP bytes again matched the new source artifacts, and all four rerun Blueprints passed the CLI checks.
4. Pushed monorepo B → C. The default retention count kept two complete commit sets: both ZIPs for B and both for C. Both A ZIPs were removed, and their old URLs returned 404 as expected.
5. The second monorepo PR's two asset IDs, names, sizes and digests stayed unchanged. Its files were not pruned or replaced by PR #1's cleanup.
6. The C preview still installed and activated both plugins in Chrome and the CLI.

See [rerun checks](live-checks/rerun-results.json) and [cleanup checks](live-checks/retention-results.json). Reruns reuse the same commit-named URLs and can replace the bytes behind them; the simple example's build timestamp is intentionally regenerated. This run checked fresh downloads, not every browser/CDN cache policy.

## Findings and follow-ups

### 1. The README overstates the required ZIP shape

Three real examples—simple, monorepo and selective—put plugin files at the ZIP root. They installed and activated successfully. WordPress used a directory derived from the downloaded filename, for example:

```text
pr-1-5d94154830b0a3169255a69158247ceea49edac4-my-plugin/my-plugin.php
```

The Composer/Vite ZIP wraps its files in a stable folder and installed at:

```text
playground-demo-plugin/playground-demo-plugin.php
```

The README heading “Plugin zips must extract to a slug-named folder” is therefore too absolute for the behavior tested here. Keep the stable-folder packaging examples, but explain the actual benefit: predictable plugin paths across PRs and commits. Update the related references in the quick start, packaging guidance and checklist together. Do not claim that every root-level ZIP fails or always leaves the plugin missing. This testing task did not change the action README.

### 2. The old `pluginZipFile` field still works, but emits warnings

The original monorepo/selective Blueprints use `pluginZipFile`; the tested publisher's `kind: plugin` shortcut also generates it. Playground accepted all of them but warned that `pluginData` is the current field. A follow-up should cover both the example Blueprint JSON and the shortcut generator, not just one README snippet. No Blueprint fields were silently rewritten for these tests.

### 3. Browser ZIP downloads rely on Playground's proxy fallback

Direct GitHub release ZIP requests produced CORS errors. Playground then used `wordpress-playground-cors-proxy.net`, followed the release redirect and received HTTP 200. The plugins installed successfully. One initial monorepo proxy request failed transiently before a successful retry.

These console entries were recovered download attempts, not failed previews. The proxy is still a runtime dependency. The CLI's successful download alone would not have covered this browser behavior. Selected network records are in [the initial browser results](live-checks/browser-initial.json).

### 4. The browser console is not completely clean

Playground warned that loaded WordPress `7.1` differs from requested `latest`. It also reported a bare `Uncaught (in promise)` after navigating to the plugin admin page, without a useful stack or message.

Both appeared in a separate fresh Playground with an empty Blueprint and no active plugins. That control narrows the issue: these messages do not require the preview action or an example plugin. It does not establish the underlying cause. They did not prevent the tested pages from working. The monorepo also logged an unused-preload warning. See [the empty-Blueprint control](live-checks/browser-empty-control.json).

### 5. Hosted build tooling emits non-fatal deprecation warnings

The [Composer/Vite build](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34834564737) reported the Vite CommonJS Node API deprecation. GitHub also warned about actions targeting Node 20 being run with Node 24, along with `punycode` and `url.parse()` deprecations in action dependencies. All builds still succeeded. Updating those dependencies is separate maintenance, not a change needed to make the tested examples pass today.

## Limits and test-helper issues

- **No genuine fork-origin PR was tested.** `adamziel` is a personal account. An attempted fork of `adamziel/preview-check-simple` under a new name returned the existing repository with `fork: false`, despite exit status zero. That was not counted as fork coverage. No second-account or organization repo was created. A same-repo branch is not a substitute for a real fork event. See [the returned result](live-checks/fork-attempt.json).
- Access to the user's installed Chrome was not approved. It was not retried through another access route. The successful checks used a separate isolated Chrome instance and the in-app browser. Firefox, Safari, mobile layouts and older PHP/WordPress combinations were not covered.
- These four actual-example copies use the merged version only. This is not a new old-versus-new paired run. The earlier [README recipe comparison](RESULTS.md) is separate, at its own recorded SHAs. Successful current browser checks do not prove what caused an earlier browser failure to disappear.
- The first CLI helper called all admin-enqueue hooks without creating a full admin-page context and hit `get_current_screen()` being undefined in WordPress core. The helper was corrected to invoke the demo plugin's enqueue callback only when its class is loaded. All 17 final checks passed with that helper. The original failure was in the helper, not the workflow.
- The collector was called before publishing had finished in two phases. Those reads reported “publisher not ready”; later reads found successful runs. One dependent check then had no input file. The batch helpers were tightened to reject an empty input set, and the actual C checks were rerun successfully. Missing work was not counted as a pass.
- Screenshot file export was rejected by the browser tool's path check. The report uses saved rendered-state records instead; it does not claim screenshot coverage.

## Run matrix

Every row below passed publishing, a public ZIP/source-byte comparison, and the CLI state checks. Browser coverage is described above; reruns were rechecked with downloads and CLI, not another fresh browser for the same SHA.

| Example / phase | PR | Head | Source | Publisher | Result |
|---|---|---|---|---|---|
| composer-vite / initial | [#1](https://github.com/adamziel/preview-check-composer-vite/pull/1) | `6587857` | [build, attempt 1](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34834564737/attempts/1) | [publish](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34834606546) | Pass |
| monorepo / initial | [#1](https://github.com/adamziel/preview-check-monorepo/pull/1) | `7d7ed37` | [build, attempt 1](https://github.com/adamziel/preview-check-monorepo/actions/runs/34834566887/attempts/1) | [publish](https://github.com/adamziel/preview-check-monorepo/actions/runs/34834586970) | Pass |
| selective / initial | [#1](https://github.com/adamziel/preview-check-selective/pull/1) | `dbf06b0` | [build, attempt 1](https://github.com/adamziel/preview-check-selective/actions/runs/34834564131/attempts/1) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34834583837) | Pass |
| simple / initial | [#1](https://github.com/adamziel/preview-check-simple/pull/1) | `2ee17b8` | [build, attempt 1](https://github.com/adamziel/preview-check-simple/actions/runs/34834563247/attempts/1) | [publish](https://github.com/adamziel/preview-check-simple/actions/runs/34834579422) | Pass |
| monorepo / extra-second-preview | [#2](https://github.com/adamziel/preview-check-monorepo/pull/2) | `809ded7` | [build, attempt 1](https://github.com/adamziel/preview-check-monorepo/actions/runs/34838402126/attempts/1) | [publish](https://github.com/adamziel/preview-check-monorepo/actions/runs/34838420666) | Pass |
| selective / extra-beta-only | [#2](https://github.com/adamziel/preview-check-selective/pull/2) | `50b33c4` | [build, attempt 1](https://github.com/adamziel/preview-check-selective/actions/runs/34838386373/attempts/1) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34838408069) | Pass |
| selective / extra-both-plugins | [#3](https://github.com/adamziel/preview-check-selective/pull/3) | `963dbe4` | [build, attempt 1](https://github.com/adamziel/preview-check-selective/actions/runs/34838392393/attempts/1) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34838412395) | Pass |
| selective / extra-docs-only | [#4](https://github.com/adamziel/preview-check-selective/pull/4) | `70603ef` | [build, attempt 1](https://github.com/adamziel/preview-check-selective/actions/runs/34838396928/attempts/1) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34838411632) | Pass |
| composer-vite / update-b | [#1](https://github.com/adamziel/preview-check-composer-vite/pull/1) | `6614178` | [build, attempt 1](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34838889903/attempts/1) | [publish](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34838932376) | Pass |
| monorepo / update-b | [#1](https://github.com/adamziel/preview-check-monorepo/pull/1) | `7c9872d` | [build, attempt 1](https://github.com/adamziel/preview-check-monorepo/actions/runs/34838884820/attempts/1) | [publish](https://github.com/adamziel/preview-check-monorepo/actions/runs/34838950089) | Pass |
| selective / update-b | [#1](https://github.com/adamziel/preview-check-selective/pull/1) | `5660d58` | [build, attempt 1](https://github.com/adamziel/preview-check-selective/actions/runs/34838887993/attempts/1) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34839003506) | Pass |
| simple / update-b | [#1](https://github.com/adamziel/preview-check-simple/pull/1) | `5d94154` | [build, attempt 1](https://github.com/adamziel/preview-check-simple/actions/runs/34838883071/attempts/1) | [publish](https://github.com/adamziel/preview-check-simple/actions/runs/34838901947) | Pass |
| composer-vite / rerun-b | [#1](https://github.com/adamziel/preview-check-composer-vite/pull/1) | `6614178` | [build, attempt 2](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34838889903/attempts/2) | [publish](https://github.com/adamziel/preview-check-composer-vite/actions/runs/34839301759) | Pass |
| monorepo / rerun-b | [#1](https://github.com/adamziel/preview-check-monorepo/pull/1) | `7c9872d` | [build, attempt 2](https://github.com/adamziel/preview-check-monorepo/actions/runs/34838884820/attempts/2) | [publish](https://github.com/adamziel/preview-check-monorepo/actions/runs/34839270714) | Pass |
| selective / rerun-b | [#1](https://github.com/adamziel/preview-check-selective/pull/1) | `5660d58` | [build, attempt 2](https://github.com/adamziel/preview-check-selective/actions/runs/34838887993/attempts/2) | [publish](https://github.com/adamziel/preview-check-selective/actions/runs/34839278257) | Pass |
| simple / rerun-b | [#1](https://github.com/adamziel/preview-check-simple/pull/1) | `5d94154` | [build, attempt 2](https://github.com/adamziel/preview-check-simple/actions/runs/34838883071/attempts/2) | [publish](https://github.com/adamziel/preview-check-simple/actions/runs/34839272329) | Pass |
| monorepo / update-c | [#1](https://github.com/adamziel/preview-check-monorepo/pull/1) | `bdb3c16` | [build, attempt 1](https://github.com/adamziel/preview-check-monorepo/actions/runs/34839475134/attempts/1) | [publish](https://github.com/adamziel/preview-check-monorepo/actions/runs/34839490629) | Pass |

All [run records](live-checks/final-workflow-runs.json), [decoded inputs](live-checks/inputs), [CLI results](live-checks/results), [ZIP hashes](live-checks/downloads), and [repeat instructions](live-checks/README.md) are retained in this repository. Test PRs remain open and their current buttons remain available. Older snapshots can expire when retention removes their commit set.
