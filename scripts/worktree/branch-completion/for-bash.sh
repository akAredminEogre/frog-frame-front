#!/bin/bash

# Bash completion for worktree commands
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

    # Generate completion function name
    # ${cmd//-/_} replaces all "-" with "_" in cmd (e.g., "wt-add" -> "wt_add")
    # Example: "wt-add" -> "_wt_add_completion"
    completion_fn="_${cmd//-/_}_completion"

    # Create completion function dynamically
    # The function calls $source_fn to get completion candidates
    eval "$completion_fn() {
        local cur=\"\${COMP_WORDS[COMP_CWORD]}\"
        COMPREPLY=(\$(compgen -W \"\$($source_fn)\" -- \"\$cur\"))
    }"

    # Register the completion function for the command
    # Example: complete -F _wt_add_completion wt-add
    complete -F "$completion_fn" "$cmd"
done
