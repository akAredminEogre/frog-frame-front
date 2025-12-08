#!/bin/bash

# Branch completion main entry point
# This file is sourced by scripts/worktree/main.sh

# Get the directory where this script is located
COMPLETION_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get list of all branches (local and remote)
_wt_get_all_branches() {
    git -C "$REPO_ROOT" branch -a 2>/dev/null | \
        sed 's/^[* ]*//' | \
        sed 's|^remotes/origin/||' | \
        grep -v '^HEAD' | \
        sort -u
}

# Get list of existing worktrees
_wt_get_worktrees() {
    local worktree_dir="$REPO_ROOT/worktrees"
    if [ -d "$worktree_dir" ]; then
        ls -1 "$worktree_dir" 2>/dev/null
    fi
}

# Source shell-specific completion
if [ -n "$BASH_VERSION" ]; then
    source "$COMPLETION_DIR/for-bash.sh"
elif [ -n "$ZSH_VERSION" ]; then
    source "$COMPLETION_DIR/for-zsh.sh"
fi
