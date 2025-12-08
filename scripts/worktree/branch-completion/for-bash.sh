#!/bin/bash

# Bash completion for worktree commands
# This file is sourced by scripts/worktree/main.sh

# Completion for wt-add (all branches)
_wt_add_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    COMPREPLY=($(compgen -W "$(_wt_get_all_branches)" -- "$cur"))
}
complete -F _wt_add_completion wt-add

# Completion for wt-remove (existing worktrees)
_wt_remove_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    COMPREPLY=($(compgen -W "$(_wt_get_worktrees)" -- "$cur"))
}
complete -F _wt_remove_completion wt-remove

# Completion for wt-dev (existing worktrees)
_wt_dev_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    COMPREPLY=($(compgen -W "$(_wt_get_worktrees)" -- "$cur"))
}
complete -F _wt_dev_completion wt-dev

# Completion for wt-cd (existing worktrees)
_wt_cd_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    COMPREPLY=($(compgen -W "$(_wt_get_worktrees)" -- "$cur"))
}
complete -F _wt_cd_completion wt-cd
