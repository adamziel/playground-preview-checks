# Repeat a copied-example Blueprint check

These records come from the actual live-example copies, not the synthetic README recipes in `checks/`.

From this repository's root, using Node 23.11.0 as in the recorded run:

```sh
npm ci --prefix checks --ignore-scripts --no-audit --no-fund
node --experimental-wasm-stack-switching live-checks/check-blueprint.mjs \
  live-checks/inputs/rerun-b-composer-vite-input.json /tmp/live-preview-result.json
cat /tmp/live-preview-result.json
```

The command must exit zero and write `"status": "pass"`. It downloads the public plugin ZIP, boots a temporary WordPress site, checks plugin activation and PHP output, then disposes the site. It does not change GitHub. The Composer/Vite check verifies autoloading, dependencies, and the built script; browser counter execution is recorded separately.

For the monorepo, use `inputs/update-c-monorepo-input.json`. The two initial monorepo ZIP URLs now return 404 because the cleanup test deliberately expired that commit set. Other saved URLs can also expire after future runs. Always use the current PR button for a fresh manual check.

`inputs/` records the generated Blueprint, PR body, source/publish run IDs and, for later phases, release snapshots. `results/` records CLI state. `downloads/` records public ZIP hashes matched against `gh run download` source bundles. Browser files contain selected rendered state and diagnostics; signed redirect query strings and WordPress nonces are excluded. `originals-unchanged.json` records the before/after comparison of original branches, PRs and releases.
