#!/bin/bash

# Setup pre-commit hook for Claude Code Web environment
# This script installs lefthook and patches the pre-commit hook to find the correct node_modules path
#
# 使用例:
#   ./scripts/ci/precommit-hook/main.sh

set -e

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/helper.sh"

# Check required commands (early return pattern)
require_command git "Please install Git."

REPO_ROOT="$(git rev-parse --show-toplevel)"
readonly REPO_ROOT
readonly FRONTEND_DIR="${REPO_ROOT}/host-frontend-root/frontend-src-root"
readonly PRE_COMMIT_HOOK="${REPO_ROOT}/.git/hooks/pre-commit"

echo "Setting up pre-commit hook for Claude Code Web..."

require_command npx "Please install Node.js and npm."

# Check if frontend directory exists (early return pattern)
require_directory "${FRONTEND_DIR}" "Frontend directory not found at ${FRONTEND_DIR}"

# Install npm dependencies if lefthook package is not present
# Note: Checking for specific package is more robust than just node_modules existence
# Trade-off: This may skip installs when package.json updates; run `npm install` manually if needed
readonly LEFTHOOK_PACKAGE_DIR="${FRONTEND_DIR}/node_modules/@evilmartians/lefthook"

ensure_npm_dependencies() {
    if directory_exists "${LEFTHOOK_PACKAGE_DIR}"; then
        return 0
    fi

    echo "Installing npm dependencies..."
    if ! (cd "${FRONTEND_DIR}" && npm install --no-audit --no-fund); then
        echo "Error: Failed to install npm dependencies. Check permissions and network connectivity."
        return 1
    fi

    # Verify lefthook package was installed
    # Note: require_directory exits on failure (fatal error - npm install succeeded but package missing)
    require_directory "${LEFTHOOK_PACKAGE_DIR}" "lefthook package not found after npm install. Installation may be incomplete."
}

if ! ensure_npm_dependencies; then
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

# Expected patch path for verification
# Note: This is a literal grep pattern; shell variables ($dir, ${osArch}, etc.) are NOT expanded
readonly EXPECTED_PATH='$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook'

# Check if already patched (early return pattern)
if grep -Fq "${EXPECTED_PATH}" "${PRE_COMMIT_HOOK}"; then
    echo "Pre-commit hook already patched."
    echo "Pre-commit hook setup complete!"
    echo "The hook will run ESLint with import sorting on staged TypeScript/JavaScript files."
    exit 0
fi

# Patch pre-commit hook to find node_modules in host-frontend-root/frontend-src-root
echo "Patching pre-commit hook for custom node_modules path..."

# Create backup before modification
readonly BACKUP_FILE="${PRE_COMMIT_HOOK}.backup"
if ! cp "${PRE_COMMIT_HOOK}" "${BACKUP_FILE}"; then
    echo "Error: Failed to create backup. Check disk space and permissions."
    exit 1
fi

# Helper function to restore backup on failure
# Note: Exits on failure because corrupted hook state is unrecoverable
restore_backup() {
    if ! mv "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}"; then
        echo "Error: Failed to restore backup. Manual recovery required: cp ${BACKUP_FILE} ${PRE_COMMIT_HOOK}"
        exit 1
    fi
}

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

if ! awk -v STATUS_FILE="${MATCH_STATUS_FILE}" '
BEGIN { matched = 0; patched = 0 }
# Match the execution line for @evilmartians/lefthook (flexible pattern for arch and quote styles)
# Only patch the first occurrence to prevent duplicate patches
# Note: ['"'"'"]? handles optional single/double quotes via bash string concatenation:
#   '\'' embeds a literal single quote, and '"'"' concatenates quote sequences
/@evilmartians\/lefthook\/bin\/lefthook-[^/]+\/lefthook['"'"'"]?[ \t]+['"'"'"]?\$@['"'"'"]?[ \t]*$/ {
    matched = 1
    print
    # Early skip if already patched (prevents duplicate insertion)
    if (patched == 1) { next }
    patched = 1
    # Extract leading indentation from matched line (spaces and tabs only)
    match($0, /^[ \t]*/)
    base_indent = substr($0, RSTART, RLENGTH)
    # Remove one indentation level for elif/then (outer level)
    # Cascade logic: each check only runs if previous checks did not modify outer_indent
    # (detected via "outer_indent == base_indent" guard condition)
    len = length(base_indent)
    # Default: use same indentation (no removal)
    outer_indent = base_indent
    # Tab-based indentation: remove one tab (most common in shell scripts)
    if (len >= 1 && substr(base_indent, len, 1) == "\t") {
        outer_indent = substr(base_indent, 1, len - 1)
    }
    # Space-based indentation (2-space): only if tab check did not match
    if (outer_indent == base_indent && len >= 2 && substr(base_indent, len - 1, 2) == "  ") {
        outer_indent = substr(base_indent, 1, len - 2)
    }
    # Fallback for other indentation styles: only if both tab and space checks failed
    if (outer_indent == base_indent && len >= 1) {
        outer_indent = substr(base_indent, 1, len - 1)
    }
    print outer_indent "elif test -f \"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\""
    print outer_indent "then"
    print base_indent "\"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\" \"$@\""
    next
}
{ print }
END { print matched > STATUS_FILE }
' "${PRE_COMMIT_HOOK}" > "${TEMP_FILE}"; then
    echo "Error: awk processing failed."
    remove_file_with_warning "${BACKUP_FILE}"
    exit 1
fi

# Verify awk pattern matched
# Check status file exists and is non-empty (distinguishes awk failure from pattern mismatch)
if [ ! -s "${MATCH_STATUS_FILE}" ]; then
    echo "Error: Internal processing error. Status file is empty or missing."
    remove_file_with_warning "${BACKUP_FILE}"
    exit 1
fi
PATTERN_MATCHED=$(cat "${MATCH_STATUS_FILE}")
if [ "${PATTERN_MATCHED}" != "1" ]; then
    echo "Error: Failed to patch pre-commit hook. The awk pattern did not match lefthook format."
    echo "This may indicate lefthook version incompatibility. Check generated hook format."
    remove_file_with_warning "${BACKUP_FILE}"
    exit 1
fi

# Apply patched file with error handling
if ! mv "${TEMP_FILE}" "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to apply patch. Restoring backup."
    restore_backup
    exit 1
fi

if ! chmod +x "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to set execute permission. Restoring backup."
    restore_backup
    exit 1
fi

# Verify patch was applied successfully with exact string match
if ! grep -Fq "${EXPECTED_PATH}" "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to patch pre-commit hook. Patch verification failed."
    restore_backup
    exit 1
fi

# Clear trap and cleanup temp files on success
trap - EXIT
rm -f "${TEMP_FILE}" "${MATCH_STATUS_FILE}"
remove_file_with_warning "${BACKUP_FILE}"

echo "Pre-commit hook patched successfully!"
echo "Pre-commit hook setup complete!"
echo "The hook will run ESLint with import sorting on staged TypeScript/JavaScript files."
