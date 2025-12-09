#!/bin/bash

# Bash completion for worktree commands
# This file is sourced by scripts/worktree/branch-completion/main.sh

# Generate completion function name for Bash
# Example: "wt-add" -> "_wt_add_completion"
_wt_get_completion_function_name() {
    local command_name="$1"
    echo "_${command_name//-/_}_completion"
}

# Define a completion function dynamically
# Example: _wt_define_completion_function "_wt_add_completion" "_wt_get_all_branches"
_wt_define_completion_function() {
    local completion_function_name="$1"
    local source_function_name="$2"
    eval "$completion_function_name() {
        local cur=\"\${COMP_WORDS[COMP_CWORD]}\"
        COMPREPLY=(\$(compgen -W \"\$($source_function_name)\" -- \"\$cur\"))
    }"
}

# Register completion function for a command
# Example: _wt_register_completion "_wt_add_completion" "wt-add"
_wt_register_completion() {
    local completion_function_name="$1"
    local command_name="$2"
    complete -F "$completion_function_name" "$command_name"
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
    # Example: "wt-add" -> "_wt_add_completion"
    completion_function_name="$(_wt_get_completion_function_name "$command_name")"

    # Create and register completion function
    _wt_define_completion_function "$completion_function_name" "$source_function_name"
    _wt_register_completion "$completion_function_name" "$command_name"
done
