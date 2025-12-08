#!/bin/zsh

# Zsh completion for worktree commands
# This file is sourced by scripts/worktree/main.sh

# Completion for wt-add (all branches)
_wt_add() {
    local branches
    branches=("${(@f)$(_wt_get_all_branches)}")
    _describe 'branch' branches
}
compdef _wt_add wt-add

# Completion for wt-remove (existing worktrees)
_wt_remove() {
    local worktrees
    worktrees=("${(@f)$(_wt_get_worktrees)}")
    _describe 'worktree' worktrees
}
compdef _wt_remove wt-remove

# Completion for wt-dev (existing worktrees)
_wt_dev() {
    local worktrees
    worktrees=("${(@f)$(_wt_get_worktrees)}")
    _describe 'worktree' worktrees
}
compdef _wt_dev wt-dev

# Completion for wt-cd (existing worktrees)
_wt_cd() {
    local worktrees
    worktrees=("${(@f)$(_wt_get_worktrees)}")
    _describe 'worktree' worktrees
}
compdef _wt_cd wt-cd
