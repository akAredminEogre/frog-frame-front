#!/bin/bash

# Worktree check logic functions
# This file provides common validation functions for worktree operations

# Check if .env.worktree file exists
# Returns: 0 if exists, 1 if not exists (with message)
check_env_worktree_exists() {
    if [ ! -f .env.worktree ]; then
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
    branch=$(grep WORKTREE_ACTIVE_BRANCH .env.worktree 2>/dev/null | cut -d'=' -f2)

    if [ -z "$branch" ]; then
        echo "Error: Cannot determine current worktree branch" >&2
        return 1
    fi
    echo "$branch"
    return 0
}
