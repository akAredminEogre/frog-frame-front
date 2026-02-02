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

# Source shared constants (with explicit existence check for clearer error messages)
readonly CONSTANTS_FILE="${SCRIPT_DIR}/constants.sh"
if [ ! -f "${CONSTANTS_FILE}" ]; then
    echo "Error: constants.sh not found at ${CONSTANTS_FILE}"
    echo "Please verify the scripts/ci/precommit-hook directory is intact."
    exit 1
fi
source "${CONSTANTS_FILE}"

# Check if git is available
if ! command -v git >/dev/null 2>&1; then
    echo "Warning: git command not found. Skipping pre-commit hook setup."
    exit 0
fi

# Check if npx is available (required by main.sh for lefthook installation)
# Skip gracefully to maintain consistent behavior with git check
if ! command -v npx >/dev/null 2>&1; then
    echo "Warning: npx command not found. Skipping pre-commit hook setup."
    echo "Install Node.js to enable pre-commit hooks."
    exit 0
fi

# Get repository root (use -C to ensure we find repo based on script location, not cwd)
if ! REPO_ROOT="$(git -C "${SCRIPT_DIR}" rev-parse --show-toplevel 2>/dev/null)"; then
    echo "Warning: Not in a git repository. Skipping pre-commit hook setup."
    exit 0
fi

readonly REPO_ROOT
readonly PRE_COMMIT_HOOK="${REPO_ROOT}/.git/hooks/pre-commit"

# Fast check: if pre-commit hook is executable AND already patched, exit immediately
# Note: Use -x to also verify execute permission, ensuring the hook can actually run
if [ -x "${PRE_COMMIT_HOOK}" ] && grep -Fq "${EXPECTED_LEFTHOOK_PATH}" "${PRE_COMMIT_HOOK}" 2>/dev/null; then
    # Already configured - exit silently for fast startup
    exit 0
fi

# Not configured or needs patching - run full setup
readonly MAIN_SCRIPT="${SCRIPT_DIR}/main.sh"

# Validate main.sh exists before execution
# Note: Use -f (exists) instead of -x (executable) for compatibility with
# environments where permissions aren't preserved (ZIP extraction, Windows, etc.)
if [ ! -f "${MAIN_SCRIPT}" ]; then
    echo "Error: main.sh not found at ${MAIN_SCRIPT}"
    echo "Please verify the scripts/ci/precommit-hook directory is intact."
    exit 1
fi

echo "Pre-commit hook not configured. Running setup..."

# Change to repo root before calling main.sh to ensure git commands work correctly
# main.sh uses git rev-parse which depends on cwd being inside the repository
cd "${REPO_ROOT}" || {
    echo "Error: Failed to change to repository root: ${REPO_ROOT}"
    exit 1
}

exec bash "${MAIN_SCRIPT}"
