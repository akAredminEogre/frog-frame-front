#!/bin/bash

# Branch completion main entry point
# This file is sourced by scripts/worktree/main.sh
#
# TODO: Security - Filter/escape branch names before completion
# - Filter branch names to safe character set [A-Za-z0-9._/-]
# - Or escape metacharacters using printf '%q' or proper shell quoting
# See: https://github.com/akAredminEogre/frog-frame-front/pull/241#discussion_r2608634992

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
# Finds directories containing .git file (worktree marker) and returns relative paths
_wt_get_worktrees() {
    local worktree_dir="$REPO_ROOT/worktrees"
    if [ ! -d "$worktree_dir" ]; then
        return
    fi

    # Find directories with .git file (worktree marker) and extract branch names
    find "$worktree_dir" -name ".git" -type f 2>/dev/null | while read -r git_file; do
        # Get the directory containing .git file and make it relative to worktree_dir
        local worktree_path
        worktree_path="$(dirname "$git_file")"
        # Remove the worktree_dir prefix to get the branch name
        echo "${worktree_path#$worktree_dir/}"
    done
}

# Completion definitions: command=source_function
# Add new commands here to enable completion
_WT_COMPLETION_DEFS=(
    "wt-add=_wt_get_all_branches"
    "wt-init=_wt_get_all_branches"
    "wt-remove=_wt_get_worktrees"
    "wt-dev=_wt_get_all_branches"
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

# Source shell-specific completion
if [ -n "$BASH_VERSION" ]; then
    source "$COMPLETION_DIR/for-bash.sh"
elif [ -n "$ZSH_VERSION" ]; then
    source "$COMPLETION_DIR/for-zsh.sh"
fi
