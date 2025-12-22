#!/bin/sh
# Setup pre-commit hook for Claude Code Web environment
# This script installs lefthook and patches the pre-commit hook to find the correct node_modules path

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
FRONTEND_DIR="$REPO_ROOT/host-frontend-root/frontend-src-root"
PRE_COMMIT_HOOK="$REPO_ROOT/.git/hooks/pre-commit"

echo "Setting up pre-commit hook for Claude Code Web..."

# Check if node_modules exists, if not install
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Installing npm dependencies..."
  cd "$FRONTEND_DIR" && npm install
fi

# Install lefthook
echo "Installing lefthook..."
cd "$REPO_ROOT" && npx --prefix "$FRONTEND_DIR" lefthook install

# Patch pre-commit hook to find node_modules in host-frontend-root/frontend-src-root
if [ -f "$PRE_COMMIT_HOOK" ]; then
  # Check if already patched
  if ! grep -q "host-frontend-root/frontend-src-root/node_modules" "$PRE_COMMIT_HOOK"; then
    echo "Patching pre-commit hook for custom node_modules path..."
    sed -i 's|\(\$dir/node_modules/@evilmartians/lefthook/bin/lefthook-\${osArch}-\${cpuArch}/lefthook" "\$@"\)|\1\n    elif test -f "$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook"\n    then\n      "$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook" "$@"|' "$PRE_COMMIT_HOOK"
    echo "Pre-commit hook patched successfully!"
  else
    echo "Pre-commit hook already patched."
  fi
else
  echo "Error: Pre-commit hook not found. lefthook install may have failed."
  exit 1
fi

echo "Pre-commit hook setup complete!"
echo "The hook will run ESLint with import sorting on staged TypeScript/JavaScript files."
