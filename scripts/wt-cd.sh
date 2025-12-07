#!/bin/bash

# Worktree navigation helper functions
# Add this to your shell profile: source /path/to/scripts/wt-cd.sh

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source the check logic functions
source "$SCRIPT_DIR/worktree/check_logic.sh"

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
    if ! check_env_worktree_exists; then
        return 0
    fi

    # Get the branch name from .env.worktree and validate
    if ! get_and_check_active_branch; then
        return 1
    fi

    # Delegate to wt-cd
    wt-cd "$BRANCH"
}
