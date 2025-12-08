#!/bin/bash

# Bash completion for worktree commands
# This file is sourced by scripts/worktree/branch-completion/main.sh

# Register completions from _WT_COMPLETION_DEFS
for def in "${_WT_COMPLETION_DEFS[@]}"; do
    cmd="${def%%=*}"
    source_fn="${def#*=}"

    # Create completion function dynamically
    eval "_${cmd//-/_}_completion() {
        local cur=\"\${COMP_WORDS[COMP_CWORD]}\"
        COMPREPLY=(\$(compgen -W \"\$($source_fn)\" -- \"\$cur\"))
    }"

    # Register the completion
    complete -F "_${cmd//-/_}_completion" "$cmd"
done
