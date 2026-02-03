#!/bin/bash

# Setup pre-commit hook for Claude Code Web environment
# This script installs lefthook and patches the pre-commit hook to find the correct node_modules path
#
# 使用例:
#   ./scripts/ci/precommit-hook/main.sh

set -e

# Source helper functions and constants
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check constants.sh exists before sourcing (consistent with check-and-setup.sh)
if [ ! -f "${SCRIPT_DIR}/constants.sh" ]; then
    echo "Error: constants.sh not found at ${SCRIPT_DIR}/constants.sh" >&2
    echo "Please verify the scripts/ci/precommit-hook directory is intact." >&2
    exit 1
fi
source "${SCRIPT_DIR}/constants.sh"

# Validate EXPECTED_LEFTHOOK_PATH is not empty (prevents false positive in grep -Fq "")
if [ -z "${EXPECTED_LEFTHOOK_PATH:-}" ]; then
    echo "Error: EXPECTED_LEFTHOOK_PATH is empty or not set in constants.sh" >&2
    exit 1
fi

# Check path-helper.sh exists before sourcing (required for resolve_precommit_hook_path)
if [ ! -f "${SCRIPT_DIR}/path-helper.sh" ]; then
    echo "Error: path-helper.sh not found at ${SCRIPT_DIR}/path-helper.sh" >&2
    echo "Please verify the scripts/ci/precommit-hook directory is intact." >&2
    exit 1
fi
source "${SCRIPT_DIR}/path-helper.sh"

# Check helper.sh exists before sourcing
if [ ! -f "${SCRIPT_DIR}/helper.sh" ]; then
    echo "Error: helper.sh not found at ${SCRIPT_DIR}/helper.sh" >&2
    echo "Please verify the scripts/ci/precommit-hook directory is intact." >&2
    exit 1
fi
source "${SCRIPT_DIR}/helper.sh"

# Check awk-helper.sh exists before sourcing
if [ ! -f "${SCRIPT_DIR}/awk-helper.sh" ]; then
    echo "Error: awk-helper.sh not found at ${SCRIPT_DIR}/awk-helper.sh" >&2
    echo "Please verify the scripts/ci/precommit-hook directory is intact." >&2
    exit 1
fi
source "${SCRIPT_DIR}/awk-helper.sh"

# Check npm-helper.sh exists before sourcing
if [ ! -f "${SCRIPT_DIR}/npm-helper.sh" ]; then
    echo "Error: npm-helper.sh not found at ${SCRIPT_DIR}/npm-helper.sh" >&2
    echo "Please verify the scripts/ci/precommit-hook directory is intact." >&2
    exit 1
fi
source "${SCRIPT_DIR}/npm-helper.sh"

# Check required commands (early return pattern)
require_command git "Please install Git."

# Use git -C to ensure consistent behavior regardless of current working directory
# This makes the script work correctly even when called from check-and-setup.sh
REPO_ROOT="$(git -C "${SCRIPT_DIR}" rev-parse --show-toplevel)"
readonly REPO_ROOT
readonly FRONTEND_DIR="${REPO_ROOT}/host-frontend-root/frontend-src-root"
# Resolve pre-commit hook path (supports worktrees, custom core.hooksPath, various path formats)
PRE_COMMIT_HOOK="$(resolve_precommit_hook_path "${REPO_ROOT}")" || exit 1
readonly PRE_COMMIT_HOOK

echo "Setting up pre-commit hook for Claude Code Web..."

require_command npx "Please install Node.js and npm."
require_command npm "Please install Node.js and npm."

# Check if frontend directory exists (early return pattern)
require_directory "${FRONTEND_DIR}" "Frontend directory not found at ${FRONTEND_DIR}"

# Install npm dependencies if lefthook package is not present
# Note: Checking for specific package is more robust than just node_modules existence
# Trade-off: This may skip installs when package.json updates; run `npm install` manually if needed
readonly LEFTHOOK_PACKAGE_DIR="${FRONTEND_DIR}/node_modules/@evilmartians/lefthook"

if ! ensure_npm_dependencies "${FRONTEND_DIR}" "${LEFTHOOK_PACKAGE_DIR}" "lefthook package"; then
    exit 1
fi

# Install lefthook
# Note: --prefix specifies where to find node_modules, cd to REPO_ROOT ensures lefthook.yml is found
echo "Installing lefthook..."
if ! (cd "${REPO_ROOT}" && npx --prefix "${FRONTEND_DIR}" lefthook install); then
    echo "Error: Failed to install lefthook." >&2
    exit 1
fi

# Check pre-commit hook exists (early return pattern)
require_file "${PRE_COMMIT_HOOK}" "Pre-commit hook not found. lefthook install may have failed."

# Check if already patched (early return pattern)
# Note: EXPECTED_LEFTHOOK_PATH is defined in constants.sh
if grep -Fq "${EXPECTED_LEFTHOOK_PATH}" "${PRE_COMMIT_HOOK}"; then
    echo "Pre-commit hook already patched."
    # Ensure execute permission even when already patched (may be lost in ZIP extraction, Windows, etc.)
    if ! chmod +x "${PRE_COMMIT_HOOK}" 2>/dev/null; then
        echo "Warning: Failed to set execute permission on ${PRE_COMMIT_HOOK}" >&2
        echo "Pre-commit hook may not run. Check file permissions manually." >&2
    fi
    echo "Pre-commit hook setup complete!"
    echo "The hook will run ESLint (with simple-import-sort), stylelint, and markdownlint on staged files."
    exit 0
fi

# Patch pre-commit hook to find node_modules in host-frontend-root/frontend-src-root
echo "Patching pre-commit hook for custom node_modules path..."

# Create backup before modification
BACKUP_FILE="${PRE_COMMIT_HOOK}.backup"
if ! cp "${PRE_COMMIT_HOOK}" "${BACKUP_FILE}"; then
    echo "Error: Failed to create backup. Check disk space and permissions." >&2
    exit 1
fi

# Use awk for cleaner multi-line insertion (portable across GNU/BSD)
# Insert custom path check after the @evilmartians/lefthook execution line
TEMP_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_patch.XXXXXX") || {
    echo "Error: Failed to create temporary file. Set TMPDIR if /tmp is unavailable." >&2
    rm -f "${BACKUP_FILE}"
    exit 1
}
# Set trap immediately after first temp file creation
# Note: BACKUP_FILE excluded from trap - on error, backup is preserved for manual recovery;
# on success, backup is explicitly removed after verification (see end of script)
trap 'rm -f "${TEMP_FILE}"' EXIT

MATCH_STATUS_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_status.XXXXXX") || {
    echo "Error: Failed to create status file. Set TMPDIR if /tmp is unavailable." >&2
    rm -f "${BACKUP_FILE}"
    exit 1
}
# Update trap to include both temp files
trap 'rm -f "${TEMP_FILE}" "${MATCH_STATUS_FILE}"' EXIT

run_awk_patch "${SCRIPT_DIR}/patch-hook.awk" "${PRE_COMMIT_HOOK}" "${TEMP_FILE}" "${MATCH_STATUS_FILE}"

# Apply patched file with error handling (restore backup on any failure)
run_or_restore "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" "Failed to apply patch." mv "${TEMP_FILE}" "${PRE_COMMIT_HOOK}"
run_or_restore "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" "Failed to set execute permission." chmod +x "${PRE_COMMIT_HOOK}"
# Verify patch was applied successfully with exact string match
run_or_restore "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" "Patch verification failed." grep -Fq "${EXPECTED_LEFTHOOK_PATH}" "${PRE_COMMIT_HOOK}"

# Clear trap and cleanup temp files on success
trap - EXIT
rm -f "${TEMP_FILE}" "${MATCH_STATUS_FILE}"
remove_file_with_warning "${BACKUP_FILE}"

echo "Pre-commit hook patched successfully!"
echo "Pre-commit hook setup complete!"
echo "The hook will run ESLint (with simple-import-sort), stylelint, and markdownlint on staged files."
