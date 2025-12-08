# Main Makefile - includes modular command files

# Include common variables first (used by multiple modules)
include make/common/variables.mk

# Include modular command files
include make/help/main.mk
include make/dev/main.mk
include make/test/main.mk
include make/worktree/main.mk
