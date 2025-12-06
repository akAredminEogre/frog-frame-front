#!/bin/bash

# Worktree navigation helper functions
# Add this to your shell profile: source /path/to/scripts/wt-cd.sh

# Navigate to a specific worktree by branch name
# Usage: wt-cd branch-name
wt-cd() {
    local BRANCH="$1"

    if [ -z "$BRANCH" ]; then
        echo "Usage: wt-cd <branch-name>"
        echo "Example: wt-cd feature-branch"
        return 1
    fi

    local WORKTREE_PATH="worktrees/$BRANCH"

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
    if [ ! -f .env.worktree ]; then
        echo "No active worktree. Staying in the main repository."
        return 0
    fi

    # Get the branch name from .env.worktree
    local BRANCH=$(grep WORKTREE_ACTIVE_BRANCH .env.worktree 2>/dev/null | cut -d'=' -f2)

    if [ -z "$BRANCH" ]; then
        echo "Error: Cannot determine current worktree branch"
        return 1
    fi

    # Delegate to wt-cd
    wt-cd "$BRANCH"
}

# Aliases for convenience
alias wtcd='wt-cd-current'
