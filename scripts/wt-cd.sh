#!/bin/bash

# Worktree navigation helper function
# Add this to your shell profile: source /path/to/scripts/wt-cd.sh

wt-cd-current() {
    # Check if .env.worktree exists
    if [ ! -f .env.worktree ]; then
        echo "No active worktree. Staying in the main repository."
        return 0
    fi
    
    # Get the worktree path from .env.worktree
    WORKTREE_PATH=$(grep CURRENT_WORKTREE_PATH .env.worktree 2>/dev/null | cut -d'=' -f2 | sed 's|^\./||')
    
    if [ -z "$WORKTREE_PATH" ]; then
        echo "Error: Cannot determine current worktree path"
        return 1
    fi
    
    if [ ! -d "$WORKTREE_PATH" ]; then
        echo "Error: Worktree directory does not exist: $WORKTREE_PATH"
        return 1
    fi
    
    echo "Moving to worktree: $WORKTREE_PATH"
    cd "$WORKTREE_PATH"
}

# Alias for convenience
alias wtcd='wt-cd-current'