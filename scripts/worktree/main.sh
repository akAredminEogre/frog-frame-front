#!/bin/bash

# Worktree navigation helper functions
# This file is sourced by scripts/main.sh

# Get the directory where this script is located
# Note: These variables are evaluated once when sourcing this file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the repository root directory using git
# Note: These variables are evaluated once when sourcing this file
REPO_ROOT="$(cd "$SCRIPT_DIR" && git rev-parse --show-toplevel)"

# Source the check logic functions
source "$SCRIPT_DIR/check_logic.sh"

# Navigate to a specific worktree by branch name
# Usage: wt-cd branch-name
wt-cd() {
    local BRANCH="$1"

    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-cd <branch-name>"
        echo "Example: wt-cd feature-branch"
        return 1
    fi

    # TODO: "worktrees" is hardcoded here but also defined as WORKTREE_DIR in make/worktree/main.mk
    # Consider reading from a centralized config or environment variable for single source of truth
    local WORKTREE_PATH="$REPO_ROOT/worktrees/$BRANCH"

    if [ ! -d "$WORKTREE_PATH" ]; then
        echo "Error: Worktree directory does not exist: $WORKTREE_PATH"
        return 1
    fi

    echo "Moving to worktree: $WORKTREE_PATH"
    cd "$WORKTREE_PATH"
}

# Navigate to the currently active worktree
wt-cd-current() {
    # Check if .env.worktree exists
    if ! check_env_worktree_exists; then
        return 0
    fi

    # Get the branch name from .env.worktree and validate
    local BRANCH
    BRANCH=$(get_and_check_active_branch) || return 1

    # Delegate to wt-cd
    wt-cd "$BRANCH"
}

# Shell wrapper functions for worktree commands with Tab completion
# These provide shorter alternatives to make commands

# wt-add: Create worktree for branch
# Usage: wt-add <branch-name>
wt-add() {
    local BRANCH="$1"
    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-add <branch-name>"
        return 1
    fi
    make -C "$REPO_ROOT" wt-add BRANCH="$BRANCH"
}

# wt-remove: Remove worktree
# Usage: wt-remove <branch-name>
wt-remove() {
    local BRANCH="$1"
    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-remove <branch-name>"
        return 1
    fi
    make -C "$REPO_ROOT" wt-remove BRANCH="$BRANCH"
}

# wt-dev: Start development server for worktree
# Usage: wt-dev <branch-name>
wt-dev() {
    local BRANCH="$1"
    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-dev <branch-name>"
        return 1
    fi
    make -C "$REPO_ROOT" wt-dev BRANCH="$BRANCH"
}

# wt-init: Initialize worktree for development
# Usage: wt-init <branch-name>
wt-init() {
    local BRANCH="$1"
    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-init <branch-name>"
        return 1
    fi
    make -C "$REPO_ROOT" wt-init BRANCH="$BRANCH"
}

# Source branch completion functions
source "$SCRIPT_DIR/branch-completion/main.sh"
