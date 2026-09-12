# Playground preview checks

Disposable fixtures for the action README recipes. All pull requests, comments, and release assets stay in this repository.

The `baseline/` branches use `5e92f5e3c80d06126f22e83e4bb21221fbbd3e7f`. The `current/` branches use `4ae782ed46e391ac203fdbbf6959fd7d0b55f40e`.

The `recipes/` directory contains the source YAML snippets. Workflow wrappers select one recipe by PR branch. Action references point to the adamziel fork at a full commit SHA. The hosted Blueprint example uses a file in this repository.

Both plugin and theme files live here so each root-path recipe can run. Build inputs and templates are copied from the README. Theme packaging is a companion case. Local npm lockfiles supply the fixture dependency versions.

Run records and results will be added after checks finish. Real fork PRs are outside this repository-only run.
