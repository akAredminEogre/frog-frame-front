#!/bin/zsh

# Zsh completion for worktree commands
# This file is sourced by scripts/worktree/branch-completion/main.sh

# Register completions from _WT_COMPLETION_DEFS
for def in "${_WT_COMPLETION_DEFS[@]}"; do
    cmd="${def%%=*}"
    source_fn="${def#*=}"

    # Create completion function dynamically
    eval "_${cmd//-/_}() {
        local items
        items=(\"\${(@f)\$($source_fn)}\")
        _describe 'item' items
    }"

    # Register the completion
    compdef "_${cmd//-/_}" "$cmd"
done
