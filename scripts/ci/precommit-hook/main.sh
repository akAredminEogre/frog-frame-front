#!/bin/bash

# Setup pre-commit hook for Claude Code Web environment
# This script installs lefthook and patches the pre-commit hook to find the correct node_modules path
#
# 使用例:
#   ./scripts/ci/precommit-hook/main.sh

set -e

# Source helper functions and constants
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/constants.sh"
source "${SCRIPT_DIR}/helper.sh"
source "${SCRIPT_DIR}/awk-helper.sh"
source "${SCRIPT_DIR}/npm-helper.sh"

# Check required commands (early return pattern)
require_command git "Please install Git."

REPO_ROOT="$(git rev-parse --show-toplevel)"
readonly REPO_ROOT
readonly FRONTEND_DIR="${REPO_ROOT}/host-frontend-root/frontend-src-root"
# Use git rev-parse --git-path to support worktrees and custom core.hooksPath
PRE_COMMIT_HOOK_REL="$(git rev-parse --git-path hooks/pre-commit)"
# Handle absolute paths (Unix /, Windows C:/ D:\, UNC //) and relative paths
# Check for: Unix absolute (/), Windows drive letter ([A-Za-z]:), or UNC path (//)
if [[ "${PRE_COMMIT_HOOK_REL}" = /* ]] || [[ "${PRE_COMMIT_HOOK_REL}" =~ ^[A-Za-z]: ]]; then
    readonly PRE_COMMIT_HOOK="${PRE_COMMIT_HOOK_REL}"
else
    readonly PRE_COMMIT_HOOK="${REPO_ROOT}/${PRE_COMMIT_HOOK_REL}"
fi

echo "Setting up pre-commit hook for Claude Code Web..."

require_command npx "Please install Node.js and npm."

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
    echo "Error: Failed to install lefthook."
    exit 1
fi

# Check pre-commit hook exists (early return pattern)
require_file "${PRE_COMMIT_HOOK}" "Pre-commit hook not found. lefthook install may have failed."

# Check if already patched (early return pattern)
# Note: EXPECTED_LEFTHOOK_PATH is defined in constants.sh
if grep -Fq "${EXPECTED_LEFTHOOK_PATH}" "${PRE_COMMIT_HOOK}"; then
    echo "Pre-commit hook already patched."
    echo "Pre-commit hook setup complete!"
    echo "The hook will run ESLint, stylelint, and markdownlint on staged files."
    exit 0
fi

# Patch pre-commit hook to find node_modules in host-frontend-root/frontend-src-root
echo "Patching pre-commit hook for custom node_modules path..."

# Create backup before modification
BACKUP_FILE="${PRE_COMMIT_HOOK}.backup"
if ! cp "${PRE_COMMIT_HOOK}" "${BACKUP_FILE}"; then
    echo "Error: Failed to create backup. Check disk space and permissions."
    exit 1
fi

# Use awk for cleaner multi-line insertion (portable across GNU/BSD)
# Insert custom path check after the @evilmartians/lefthook execution line
TEMP_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_patch.XXXXXX") || {
    echo "Error: Failed to create temporary file. Set TMPDIR if /tmp is unavailable."
    rm -f "${BACKUP_FILE}"
    exit 1
}
# Set trap immediately after first temp file creation
# Note: BACKUP_FILE excluded from trap - on error, backup is preserved for manual recovery;
# on success, backup is explicitly removed after verification (see end of script)
trap 'rm -f "${TEMP_FILE}"' EXIT

MATCH_STATUS_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_status.XXXXXX") || {
    echo "Error: Failed to create status file. Set TMPDIR if /tmp is unavailable."
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
echo "The hook will run ESLint, stylelint, and markdownlint on staged files."
