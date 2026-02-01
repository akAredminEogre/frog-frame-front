#!/bin/bash

# Lightweight pre-commit hook check for SessionStart
# This script performs a fast check and only runs full setup when necessary
#
# 使用例:
#   ./scripts/ci/precommit-hook/check-and-setup.sh
#
# SessionStart hookから呼び出されることを想定。
# 既にセットアップ済みの場合は即座に終了し、起動時間への影響を最小化する。

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Get repository root
if ! REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"; then
    echo "Warning: Not in a git repository. Skipping pre-commit hook setup."
    exit 0
fi

readonly REPO_ROOT
readonly PRE_COMMIT_HOOK="${REPO_ROOT}/.git/hooks/pre-commit"

# Expected patch path for verification (must match main.sh)
# Note: This is a literal grep pattern; shell variables are NOT expanded
readonly EXPECTED_PATH='$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook'

# Fast check: if pre-commit hook exists AND is already patched, exit immediately
if [ -f "${PRE_COMMIT_HOOK}" ] && grep -Fq "${EXPECTED_PATH}" "${PRE_COMMIT_HOOK}" 2>/dev/null; then
    # Already configured - exit silently for fast startup
    exit 0
fi

# Not configured or needs patching - run full setup
echo "Pre-commit hook not configured. Running setup..."
exec "${SCRIPT_DIR}/main.sh"
