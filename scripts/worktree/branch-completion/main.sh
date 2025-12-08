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

# Completion definitions: command=source_function
# Add new commands here to enable completion
_WT_COMPLETION_DEFS=(
    "wt-add=_wt_get_all_branches"
    "wt-remove=_wt_get_worktrees"
    "wt-dev=_wt_get_worktrees"
    "wt-cd=_wt_get_worktrees"
)

# Extract command name from definition
# Example: "wt-add=_wt_get_all_branches" -> "wt-add"
_wt_get_command_name() {
    local def="$1"
    echo "${def%%=*}"
}

# Extract source function name from definition
# Example: "wt-add=_wt_get_all_branches" -> "_wt_get_all_branches"
_wt_get_source_function_name() {
    local def="$1"
    echo "${def#*=}"
}

# Generate completion function name from command name
# ${command_name//-/_} replaces all "-" with "_" (e.g., "wt-add" -> "wt_add")
# Example (Bash): "wt-add" -> "_wt_add_completion"
# Example (Zsh):  "wt-add" -> "_wt_add"
_wt_get_completion_function_name() {
    local command_name="$1"
    local base_name="_${command_name//-/_}"
    if [ -n "$BASH_VERSION" ]; then
        echo "${base_name}_completion"
    else
        echo "$base_name"
    fi
}

# Source shell-specific completion
if [ -n "$BASH_VERSION" ]; then
    source "$COMPLETION_DIR/for-bash.sh"
elif [ -n "$ZSH_VERSION" ]; then
    source "$COMPLETION_DIR/for-zsh.sh"
fi
