#!/bin/bash

# Worktree check logic functions
# This file provides common validation functions for worktree operations
#
# TODO: Security - Add branch name validation
# - Validate branch names against safe character set [A-Za-z0-9._/-]
# - Apply proper quoting/escaping to prevent shell injection
# See: https://github.com/akAredminEogre/frog-frame-front/pull/241#discussion_r2608585266

# Get script directory and source repository path helper
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../get_repository_top_absolute_path.sh"

# Get repository top absolute path
_REPOSITORY_TOP_ABSOLUTE_PATH=$(get_repository_top_absolute_path)

# Check if .env.worktree file exists
# Returns: 0 if exists, 1 if not exists (with message)
check_env_worktree_exists() {
    if [ ! -f "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env.worktree" ]; then
        echo "No active worktree. Staying in the main repository."
        return 1
    fi
    return 0
}

# Get active branch from .env.worktree and validate it's not empty
# Outputs: branch name to stdout if valid
# Returns: 0 if valid, 1 if empty/invalid (with error message)
get_and_check_active_branch() {
    local branch
    branch=$(grep '^WORKTREE_ACTIVE_BRANCH=' "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env.worktree" 2>/dev/null | cut -d'=' -f2-)

    if [ -z "$branch" ]; then
        echo "Error: Cannot determine current worktree branch" >&2
        return 1
    fi
    echo "$branch"
    return 0
}
