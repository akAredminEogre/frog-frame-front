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

# Check if .env file exists
# Returns: 0 if exists, 1 if not exists
check_env_exists() {
    [ -f "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env" ]
}

# Check if .env.example file exists
# Returns: 0 if exists, 1 if not exists
check_env_example_exists() {
    [ -f "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env.example" ]
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

# Get CONTAINER_APP_ROOT from .env or .env.example, with fallback to default
# Outputs: CONTAINER_APP_ROOT path to stdout
# Returns: 0 always (uses default if not found)
get_container_app_root() {
    local container_root
    local default_value="/opt/frontend-container-app-root"

    # Try .env first
    if check_env_exists; then
        container_root=$(grep '^CONTAINER_APP_ROOT=' "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env" | cut -d'=' -f2)
        echo "$container_root"
        return 0
    fi

    # Try .env.example
    if check_env_example_exists; then
        container_root=$(grep '^CONTAINER_APP_ROOT=' "$_REPOSITORY_TOP_ABSOLUTE_PATH/.env.example" | cut -d'=' -f2)
        echo "$container_root"
        return 0
    fi

    # Fallback to default
    echo "$default_value"
    return 0
}
