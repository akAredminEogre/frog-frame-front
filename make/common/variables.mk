# Common Variables
# Shared variables used across multiple Makefile modules

# Get the absolute path of the repository top directory
# Uses helper script to resolve path regardless of current working directory
_REPOSITORY_TOP_ABSOLUTE_PATH = $(shell scripts/get_repository_top_absolute_paths.sh get_repository_top_absolute_paths)

# Load environment variables (.env and .env.worktree if exists) and execute command
# This enables unified commands that work for both main repository and worktree modes
# - Main repository: only .env is loaded
# - Worktree mode: .env is loaded first, then .env.worktree overrides specific values
_load-env-exec = set -a && [ -f $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env ] && . $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env; [ -f $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env.worktree ] && . $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env.worktree; set +a &&
