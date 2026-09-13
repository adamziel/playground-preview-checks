# Recipe check results — 2026-09-13

All repository writes were confined to `adamziel/playground-preview-checks`. The existing live examples, the action repository, and version tags were not changed.

## Revisions

- Baseline: `5e92f5e3c80d06126f22e83e4bb21221fbbd3e7f`.
- Merged: `4ae782ed46e391ac203fdbbf6959fd7d0b55f40e`.
- The callers use the adamziel action fork at full commit SHAs. Each reusable publisher retains its own internal action pin.
- Local runtime: Node 23.11.0 and Playground CLI 3.1.53. Installed WordPress/PHP versions are recorded for each case.

## Outcome

- 18 paired cases, using 36 disposable PRs.
- The action repository’s 105 local tests also passed.
- Initial recipe run: 34 successful GitHub source runs and two failures of the same missing-token example.
- The companion-plugin Blueprint also failed on both revisions when it tried to activate current WooCommerce on WordPress 6.6.
- After the two adjustments below, all 36 source workflows completed successfully and all 36 generated Blueprints passed the CLI checks.
- 22 unauthenticated release ZIP downloads matched the original build artifact bytes. All ZIPs opened correctly and had a single top-level folder.
- Nine lifecycle checks, two mode-switch checks, and two checks of GitHub-rendered templates passed.
- No new failure was found in these old-versus-new comparisons. Full browser sign-off remains open; see below.

## Two existing README problems

### Comment template omits the token input

The second template under “Customize the button text or add testing instructions” has no `github-token` input. Both revisions stop before posting a comment.

- [Baseline failure](https://github.com/adamziel/playground-preview-checks/actions/runs/34726902017).
- [Merged-revision failure](https://github.com/adamziel/playground-preview-checks/actions/runs/34726946098).
- Adding `github-token: ${{ secrets.GITHUB_TOKEN }}` in the two disposable branches made both examples pass.

### The WooCommerce example pins an old WordPress version

The custom Blueprint pins `wp: "6.6"` but downloads current WooCommerce. In this run, WordPress 6.6.7 rejected activation because that WooCommerce package requires WordPress 7.0.
Changing only the two disposable copies to `wp: "latest"` made both Blueprints install and activate the fixture plugin and WooCommerce. The original YAML remains in `recipes/6.yml`.

These adjustments were made only in this test repository. The action README was not edited.

## Case matrix

“Pass” means the adjusted GitHub recipe produced a button and its Blueprint passed the CLI state checks. The two adjusted recipes are marked.

| Case | Baseline PR | Merged PR | Result |
|---|---|---|---|
| build-comment | [#18](https://github.com/adamziel/playground-preview-checks/pull/18) | [#33](https://github.com/adamziel/playground-preview-checks/pull/33) | Pass |
| build-composer | [#16](https://github.com/adamziel/playground-preview-checks/pull/16) | [#31](https://github.com/adamziel/playground-preview-checks/pull/31) | Pass |
| build-custom | [#17](https://github.com/adamziel/playground-preview-checks/pull/17) | [#32](https://github.com/adamziel/playground-preview-checks/pull/32) | Pass |
| build-monorepo | [#14](https://github.com/adamziel/playground-preview-checks/pull/14) | [#29](https://github.com/adamziel/playground-preview-checks/pull/29) | Pass |
| build-plugin | [#12](https://github.com/adamziel/playground-preview-checks/pull/12) | [#1](https://github.com/adamziel/playground-preview-checks/pull/1) | Pass |
| build-selective | [#15](https://github.com/adamziel/playground-preview-checks/pull/15) | [#30](https://github.com/adamziel/playground-preview-checks/pull/30) | Pass |
| build-theme | [#13](https://github.com/adamziel/playground-preview-checks/pull/13) | [#28](https://github.com/adamziel/playground-preview-checks/pull/28) | Pass |
| direct-blueprint | [#7](https://github.com/adamziel/playground-preview-checks/pull/7) | [#23](https://github.com/adamziel/playground-preview-checks/pull/23) | Pass after the documented adjustment |
| direct-both | [#6](https://github.com/adamziel/playground-preview-checks/pull/6) | [#22](https://github.com/adamziel/playground-preview-checks/pull/22) | Pass |
| direct-comment | [#9](https://github.com/adamziel/playground-preview-checks/pull/9) | [#25](https://github.com/adamziel/playground-preview-checks/pull/25) | Pass |
| direct-comment-template | [#11](https://github.com/adamziel/playground-preview-checks/pull/11) | [#27](https://github.com/adamziel/playground-preview-checks/pull/27) | Pass after the documented adjustment |
| direct-description-template | [#10](https://github.com/adamziel/playground-preview-checks/pull/10) | [#26](https://github.com/adamziel/playground-preview-checks/pull/26) | Pass |
| direct-hosted | [#8](https://github.com/adamziel/playground-preview-checks/pull/8) | [#24](https://github.com/adamziel/playground-preview-checks/pull/24) | Pass |
| direct-root | [#3](https://github.com/adamziel/playground-preview-checks/pull/3) | [#19](https://github.com/adamziel/playground-preview-checks/pull/19) | Pass |
| direct-subdir | [#4](https://github.com/adamziel/playground-preview-checks/pull/4) | [#20](https://github.com/adamziel/playground-preview-checks/pull/20) | Pass |
| direct-theme | [#5](https://github.com/adamziel/playground-preview-checks/pull/5) | [#21](https://github.com/adamziel/playground-preview-checks/pull/21) | Pass |
| legacy-current | [#34](https://github.com/adamziel/playground-preview-checks/pull/34) | [#36](https://github.com/adamziel/playground-preview-checks/pull/36) | Pass |
| legacy-workflow | [#35](https://github.com/adamziel/playground-preview-checks/pull/35) | [#2](https://github.com/adamziel/playground-preview-checks/pull/2) | Pass |

## Lifecycle checks

- Multi-ZIP update 2. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727299218).
- Multi-ZIP update 3. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727326354).
- Earlier build leaves the current preview unchanged. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727354673).
- Failed build leaves the last preview unchanged. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727373182).
- A successful build resumes publishing. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727395880).
- Comment update keeps the user note unchanged. [Run or result](https://github.com/adamziel/playground-preview-checks/pull/27#issuecomment-5649606175).
- Renaming a PR updates the same comment. [Run or result](https://github.com/adamziel/playground-preview-checks/pull/27#issuecomment-5649606175).
- Removing a description button restores one block and preserves user text.
- Reopening a PR keeps one bot comment. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727439583).
- Switch to append-to-description. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727498774).
- Switch to comment. [Run or result](https://github.com/adamziel/playground-preview-checks/actions/runs/34727512730).
- GitHub renders the title as text and preserves the template code span. [Run or result](https://github.com/adamziel/playground-preview-checks/pull/27#issuecomment-5649606175).
- GitHub renders the README description template.

Retention was tested with multiple ZIPs per commit. The last two successful commit sets remained together; assets for other PRs kept the same IDs. The original PR #29 ZIPs were then pruned as expected, so some historical URLs in the download record are intentionally no longer available.

## Browser check remains incomplete

The in-app browser loaded Playground but could not fetch the release ZIP for either the baseline or merged single-plugin button (`TypeError: Failed to fetch`). The direct recipe also hit a failed download of Playground’s PHP 8.2 JavaScript module. That module returned HTTP 200 from a separate command-line request.
The same ZIP URLs downloaded without login and booted WordPress through the CLI. This separates artifact validity from the unresolved browser download path; it does not prove the browser flow works. No browser protections or settings were changed.

## Scope limits

- All PRs were same-repository PRs. A genuine fork requires another namespace, which was excluded by the requested adamziel-only scope.
- Publishing used the normal workflow token. A separate user-authored comment tested that it remains unchanged, but the action itself was not run with a PAT.
- Cross-repository release storage and every optional legacy cleanup knob were not covered by these end-to-end cases.
- The fixture files are deliberately small. This is not a load test or a check of every third-party plugin.

## Reproduce and inspect

- [CLI instructions](checks/README.md).
- [Source and rerun records](checks/results/runs.json).
- [WordPress state checks](checks/results/blueprints.json).
- [Download hashes](checks/results/downloads.json).
- Original documentation snippets are under `recipes/`; workflow wrappers select a case by branch.
- The open PRs are left in place for inspection. No existing example PR was used as a test target.
