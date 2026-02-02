#!/bin/bash

# Path resolution helper functions for precommit-hook scripts
# This file contains lightweight path-related functions that can be sourced
# by both check-and-setup.sh (fast startup) and main.sh

# Resolve pre-commit hook path using git rev-parse --git-path
# Supports worktrees, custom core.hooksPath, and various path formats
# Usage: resolve_precommit_hook_path <repo_root>
# Output: Prints the absolute path to pre-commit hook
# Returns: 0 on success, 1 on failure
#
# Supported path formats:
#   - Unix absolute paths: /path/to/hook
#   - Windows drive letters: C:/path or D:\path
#   - UNC paths: //server/share or \\server\share
#   - Relative paths: .git/hooks/pre-commit (converted to absolute)
resolve_precommit_hook_path() {
    local REPO_ROOT="$1"

    if [ -z "${REPO_ROOT}" ]; then
        echo "Error: REPO_ROOT is required" >&2
        return 1
    fi

    # Use git -C to ensure consistent behavior regardless of current working directory
    local PRE_COMMIT_HOOK_REL
    PRE_COMMIT_HOOK_REL="$(git -C "${REPO_ROOT}" rev-parse --git-path hooks/pre-commit 2>/dev/null)" || {
        echo "Error: Failed to resolve git hooks path" >&2
        return 1
    }

    # Handle absolute paths (Unix /, Windows C:/ D:\, UNC // or \\) and relative paths
    # Check for: Unix absolute (/), Windows drive letter ([A-Za-z]:), or UNC path (// or \\)
    if [[ "${PRE_COMMIT_HOOK_REL}" = /* ]] || [[ "${PRE_COMMIT_HOOK_REL}" =~ ^[A-Za-z]: ]] || [[ "${PRE_COMMIT_HOOK_REL}" == \\\\* ]]; then
        echo "${PRE_COMMIT_HOOK_REL}"
    else
        echo "${REPO_ROOT}/${PRE_COMMIT_HOOK_REL}"
    fi
}
