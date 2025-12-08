#!/bin/zsh

# Zsh completion for worktree commands
# This file is sourced by scripts/worktree/branch-completion/main.sh

# Register completions from _WT_COMPLETION_DEFS
# Example: _WT_COMPLETION_DEFS=("wt-add=_wt_get_all_branches" "wt-dev=_wt_get_worktrees")
for def in "${_WT_COMPLETION_DEFS[@]}"; do
    # Extract command name from definition using parameter expansion
    # ${var%%pattern} removes longest match of pattern from the end
    # Example: "wt-add=_wt_get_all_branches" -> "wt-add"
    cmd="${def%%=*}"

    # Extract source function name from definition using parameter expansion
    # ${var#pattern} removes shortest match of pattern from the beginning
    # Example: "wt-add=_wt_get_all_branches" -> "_wt_get_all_branches"
    source_fn="${def#*=}"

    # Create completion function dynamically
    # ${cmd//-/_} replaces all "-" with "_" in cmd (e.g., "wt-add" -> "wt_add")
    # Example: For cmd="wt-add", creates function "_wt_add"
    # The function calls $source_fn to get completion candidates
    eval "_${cmd//-/_}() {
        local items
        items=(\"\${(@f)\$($source_fn)}\")
        _describe 'item' items
    }"

    # Register the completion function for the command
    # Example: compdef _wt_add wt-add
    compdef "_${cmd//-/_}" "$cmd"
done
