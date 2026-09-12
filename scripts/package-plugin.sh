set -euo pipefail
mkdir -p stage/my-plugin build
cp my-plugin.php stage/my-plugin/
(cd stage && zip -rq ../build/my-plugin.zip my-plugin)
