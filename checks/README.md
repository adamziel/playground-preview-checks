# Repeating a Blueprint check

The inputs are the actual Blueprints decoded from the disposable PR buttons.
The verifier boots WordPress, checks the active plugin/theme state, and checks
Composer, Vite, and the custom landing page where the recipe uses them.

From the repository root, using Node 23.11.0 as in this run:

```sh
npm ci --prefix checks --ignore-scripts --no-audit --no-fund
node --experimental-wasm-stack-switching checks/verify-blueprint.mjs \
  checks/inputs/current--build-plugin.json /tmp/preview-result.json
cat /tmp/preview-result.json
```

The output JSON's `status` field must be `pass`. The command records errors in
that file and exits with a nonzero status when a check fails.

Each run creates a temporary WordPress instance and disposes it afterward.
It downloads public fixture code and does not write to GitHub. Release cleanup
can expire older URLs. Use the current PR button if an old input no longer downloads.
CLI checks do not replace browser checks: browser downloads follow different rules.
