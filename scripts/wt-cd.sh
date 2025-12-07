#!/bin/bash

# Worktree helper functions with completion support
# Add this to your shell profile: source /path/to/scripts/wt-cd.sh

# ============================================================
# Worktree wrapper functions (with tab completion support)
# ============================================================

# Add a new worktree
# Usage: wt-add <branch-name>
wt-add() {
    if [ -z "$1" ]; then
        echo "Usage: wt-add <branch-name>"
        return 1
    fi
    make wt-add BRANCH="$1"
}

# Remove a worktree
# Usage: wt-remove <branch-name>
wt-remove() {
    if [ -z "$1" ]; then
        echo "Usage: wt-remove <branch-name>"
        return 1
    fi
    make wt-remove BRANCH="$1"
}

# Start dev server for a worktree
# Usage: wt-dev <branch-name>
wt-dev() {
    if [ -z "$1" ]; then
        echo "Usage: wt-dev <branch-name>"
        return 1
    fi
    make wt-dev BRANCH="$1"
}

# ============================================================
# Navigation helper
# ============================================================

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

# ============================================================
# Branch name completion
# ============================================================

# Get all branches (local + remote) for wt-add
_wt_get_all_branches() {
    git branch -a 2>/dev/null | sed 's/^[* ]*//' | sed 's|remotes/origin/||' | grep -v '^HEAD' | sort -u
}

# Get existing worktree branches for wt-remove and wt-dev
_wt_get_worktree_branches() {
    if [ -d "worktrees" ]; then
        ls -1 worktrees 2>/dev/null
    fi
}

# Bash completion
if [ -n "$BASH_VERSION" ]; then
    _wt_add_completion() {
        local cur="${COMP_WORDS[COMP_CWORD]}"
        COMPREPLY=( $(compgen -W "$(_wt_get_all_branches)" -- "$cur") )
    }

    _wt_remove_completion() {
        local cur="${COMP_WORDS[COMP_CWORD]}"
        COMPREPLY=( $(compgen -W "$(_wt_get_worktree_branches)" -- "$cur") )
    }

    _wt_dev_completion() {
        local cur="${COMP_WORDS[COMP_CWORD]}"
        COMPREPLY=( $(compgen -W "$(_wt_get_worktree_branches)" -- "$cur") )
    }

    complete -F _wt_add_completion wt-add
    complete -F _wt_remove_completion wt-remove
    complete -F _wt_dev_completion wt-dev
fi

# Zsh completion
if [ -n "$ZSH_VERSION" ]; then
    _wt_add() {
        local branches
        branches=("${(@f)$(_wt_get_all_branches)}")
        _describe 'branch' branches
    }

    _wt_remove() {
        local worktrees
        worktrees=("${(@f)$(_wt_get_worktree_branches)}")
        _describe 'worktree' worktrees
    }

    _wt_dev() {
        local worktrees
        worktrees=("${(@f)$(_wt_get_worktree_branches)}")
        _describe 'worktree' worktrees
    }

    compdef _wt_add wt-add
    compdef _wt_remove wt-remove
    compdef _wt_dev wt-dev
fi