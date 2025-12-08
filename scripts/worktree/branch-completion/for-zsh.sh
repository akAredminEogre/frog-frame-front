#!/bin/zsh

# Zsh completion for worktree commands
# This file is sourced by scripts/worktree/branch-completion/main.sh

# Generate completion function name for Zsh
# Example: "wt-add" -> "_wt_add"
_wt_get_completion_function_name() {
    local command_name="$1"
    echo "_${command_name//-/_}"
}

# Register completions from _WT_COMPLETION_DEFS
# Example: _WT_COMPLETION_DEFS=("wt-add=_wt_get_all_branches" "wt-dev=_wt_get_worktrees")
for definition in "${_WT_COMPLETION_DEFS[@]}"; do
    # Extract command name using helper function
    # Example: "wt-add=_wt_get_all_branches" -> "wt-add"
    command_name="$(_wt_get_command_name "$definition")"

    # Extract source function name using helper function
    # Example: "wt-add=_wt_get_all_branches" -> "_wt_get_all_branches"
    source_function_name="$(_wt_get_source_function_name "$definition")"

    # Generate completion function name using helper function
    # Example: "wt-add" -> "_wt_add"
    completion_function_name="$(_wt_get_completion_function_name "$command_name")"

    # Create completion function dynamically
    # The function calls $source_function_name to get completion candidates
    eval "$completion_function_name() {
        local items
        items=(\"\${(@f)\$($source_function_name)}\")
        _describe 'item' items
    }"

    # Register the completion function for the command
    # Example: compdef _wt_add wt-add
    compdef "$completion_function_name" "$command_name"
done
