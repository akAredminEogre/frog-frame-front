#!/bin/bash

# Setup pre-commit hook for Claude Code Web environment
# This script installs lefthook and patches the pre-commit hook to find the correct node_modules path
#
# 使用例:
#   ./scripts/ci/precommit-hook/main.sh

set -e

# Check git availability (early return pattern)
if ! command -v git >/dev/null 2>&1; then
    echo "Error: git command not found. Please install Git."
    exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
FRONTEND_DIR="${REPO_ROOT}/host-frontend-root/frontend-src-root"
PRE_COMMIT_HOOK="${REPO_ROOT}/.git/hooks/pre-commit"
readonly REPO_ROOT FRONTEND_DIR PRE_COMMIT_HOOK

echo "Setting up pre-commit hook for Claude Code Web..."

# Check npx availability (early return pattern)
if ! command -v npx >/dev/null 2>&1; then
    echo "Error: npx command not found. Please install Node.js and npm."
    exit 1
fi

# Check if frontend directory exists (early return pattern)
if [ ! -d "${FRONTEND_DIR}" ]; then
    echo "Error: Frontend directory not found at ${FRONTEND_DIR}"
    exit 1
fi

# Install npm dependencies if lefthook package is not present
# Note: Checking for specific package is more robust than just node_modules existence
LEFTHOOK_PACKAGE_DIR="${FRONTEND_DIR}/node_modules/@evilmartians/lefthook"
readonly LEFTHOOK_PACKAGE_DIR

install_npm_dependencies() {
    if [ -d "${LEFTHOOK_PACKAGE_DIR}" ]; then
        return 0
    fi

    echo "Installing npm dependencies..."
    if ! (cd "${FRONTEND_DIR}" && npm install --no-audit --no-fund); then
        echo "Error: Failed to install npm dependencies. Check permissions and network connectivity."
        exit 1
    fi

    # Verify lefthook package was installed
    if [ ! -d "${LEFTHOOK_PACKAGE_DIR}" ]; then
        echo "Error: lefthook package not found after npm install. Installation may be incomplete."
        exit 1
    fi
}

install_npm_dependencies

# Install lefthook
# Note: --prefix specifies where to find node_modules, cd to REPO_ROOT ensures lefthook.yml is found
echo "Installing lefthook..."
if ! (cd "${REPO_ROOT}" && npx --prefix "${FRONTEND_DIR}" lefthook install); then
    echo "Error: Failed to install lefthook."
    exit 1
fi

# Check pre-commit hook exists (early return pattern)
if [ ! -f "${PRE_COMMIT_HOOK}" ]; then
    echo "Error: Pre-commit hook not found. lefthook install may have failed."
    exit 1
fi

# Expected patch path for verification
EXPECTED_PATH='$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook'
readonly EXPECTED_PATH

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
BACKUP_FILE="${PRE_COMMIT_HOOK}.backup"
readonly BACKUP_FILE
if ! cp "${PRE_COMMIT_HOOK}" "${BACKUP_FILE}"; then
    echo "Error: Failed to create backup. Check disk space and permissions."
    exit 1
fi

# Use awk for cleaner multi-line insertion (portable across GNU/BSD)
# Insert custom path check after the @evilmartians/lefthook execution line
TEMP_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_patch.XXXXXX") || {
    echo "Error: Failed to create temporary file for patching."
    rm -f "${BACKUP_FILE}"
    exit 1
}
# Set trap immediately after first temp file creation
trap 'rm -f "${TEMP_FILE}"' EXIT

MATCH_STATUS_FILE=$(mktemp "${TMPDIR:-/tmp}/precommit_status.XXXXXX") || {
    echo "Error: Failed to create status file for patching."
    rm -f "${BACKUP_FILE}"
    exit 1
}
# Update trap to include both temp files
trap 'rm -f "${TEMP_FILE}" "${MATCH_STATUS_FILE}"' EXIT

if ! awk -v STATUS_FILE="${MATCH_STATUS_FILE}" '
BEGIN { matched = 0; patched = 0 }
# Match the execution line for @evilmartians/lefthook (flexible pattern for arch and quote styles)
# Only patch the first occurrence to prevent duplicate patches
/@evilmartians\/lefthook\/bin\/lefthook-[^/]+\/lefthook['"'"'"]?[ \t]+['"'"'"]?\$@['"'"'"]?[ \t]*$/ {
    matched = 1
    print
    # Skip if already patched (patched flag prevents duplicate insertion)
    if (patched == 0) {
        patched = 1
        # Extract leading indentation from matched line (spaces and tabs only)
        match($0, /^[ \t]*/)
        base_indent = substr($0, RSTART, RLENGTH)
        # Remove one indentation level for elif/then (outer level)
        # Detect indent style: check if base_indent ends with tab or spaces
        len = length(base_indent)
        # Default: use same indentation (no removal)
        outer_indent = base_indent
        # Tab-based indentation: remove one tab
        if (len >= 1 && substr(base_indent, len, 1) == "\t") {
            outer_indent = substr(base_indent, 1, len - 1)
        }
        # Space-based indentation (2-space): remove 2 spaces (only if not tab-based)
        if (outer_indent == base_indent && len >= 2 && substr(base_indent, len - 1, 2) == "  ") {
            outer_indent = substr(base_indent, 1, len - 2)
        }
        print outer_indent "elif test -f \"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\""
        print outer_indent "then"
        print base_indent "\"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\" \"$@\""
    }
    next
}
{ print }
END { print matched > STATUS_FILE }
' "${PRE_COMMIT_HOOK}" > "${TEMP_FILE}"; then
    echo "Error: awk processing failed."
    rm -f "${BACKUP_FILE}" || echo "Warning: Failed to remove backup file: ${BACKUP_FILE}"
    exit 1
fi

# Verify awk pattern matched
readonly PATTERN_MATCHED=$(cat "${MATCH_STATUS_FILE}")
if [ "${PATTERN_MATCHED}" != "1" ]; then
    echo "Error: Failed to patch pre-commit hook. The awk pattern did not match lefthook format."
    echo "This may indicate lefthook version incompatibility. Check generated hook format."
    rm -f "${BACKUP_FILE}" || echo "Warning: Failed to remove backup file: ${BACKUP_FILE}"
    exit 1
fi

# Apply patched file with error handling
if ! mv "${TEMP_FILE}" "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to apply patch. Restoring backup."
    mv "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" || echo "Error: Failed to restore backup. Manual recovery required."
    exit 1
fi

if ! chmod +x "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to set execute permission. Restoring backup."
    mv "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" || echo "Error: Failed to restore backup. Manual recovery required."
    exit 1
fi

# Verify patch was applied successfully with exact string match
if ! grep -Fq "${EXPECTED_PATH}" "${PRE_COMMIT_HOOK}"; then
    echo "Error: Failed to patch pre-commit hook. Patch verification failed."
    # Restore backup on failure
    mv "${BACKUP_FILE}" "${PRE_COMMIT_HOOK}" || echo "Error: Failed to restore backup. Manual recovery required."
    exit 1
fi

# Clear trap and cleanup temp files on success
trap - EXIT
rm -f "${TEMP_FILE}" "${MATCH_STATUS_FILE}"
rm -f "${BACKUP_FILE}" || echo "Warning: Failed to remove backup file: ${BACKUP_FILE}"

echo "Pre-commit hook patched successfully!"
echo "Pre-commit hook setup complete!"
echo "The hook will run ESLint with import sorting on staged TypeScript/JavaScript files."
