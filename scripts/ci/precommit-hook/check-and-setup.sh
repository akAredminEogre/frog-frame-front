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

# Source shared constants
source "${SCRIPT_DIR}/constants.sh"

# Check if git is available
if ! command -v git >/dev/null 2>&1; then
    echo "Warning: git command not found. Skipping pre-commit hook setup."
    exit 0
fi

# Get repository root
if ! REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"; then
    echo "Warning: Not in a git repository. Skipping pre-commit hook setup."
    exit 0
fi

readonly REPO_ROOT
readonly PRE_COMMIT_HOOK="${REPO_ROOT}/.git/hooks/pre-commit"

# Fast check: if pre-commit hook exists AND is already patched, exit immediately
if [ -f "${PRE_COMMIT_HOOK}" ] && grep -Fq "${EXPECTED_LEFTHOOK_PATH}" "${PRE_COMMIT_HOOK}" 2>/dev/null; then
    # Already configured - exit silently for fast startup
    exit 0
fi

# Not configured or needs patching - run full setup
readonly MAIN_SCRIPT="${SCRIPT_DIR}/main.sh"

# Validate main.sh exists and is executable before execution
if [ ! -x "${MAIN_SCRIPT}" ]; then
    echo "Error: main.sh not found or not executable at ${MAIN_SCRIPT}"
    echo "Please verify the scripts/ci/precommit-hook directory is intact."
    exit 1
fi

echo "Pre-commit hook not configured. Running setup..."
exec "${MAIN_SCRIPT}"
