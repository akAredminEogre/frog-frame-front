# Common Variables
# Shared variables used across multiple Makefile modules

# Get the absolute path of the repository top directory
# Uses helper script to resolve path regardless of current working directory
_REPOSITORY_TOP_ABSOLUTE_PATH = $(shell scripts/get_repository_top_absolute_path.sh get_repository_top_absolute_path)

# Load environment variables (.env and .env.worktree if exists) and execute command
# This enables unified commands that work for both main repository and worktree modes
# - Main repository: only .env is loaded
# - Worktree mode: .env is loaded first, then .env.worktree overrides specific values
# Uses check_env_worktree_exists from scripts/worktree/check_logic.sh
_load-env-exec = source scripts/worktree/check_logic.sh && \
	set -a && \
	[ -f $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env ] && . $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env; \
	check_env_worktree_exists >/dev/null 2>&1 && . $(_REPOSITORY_TOP_ABSOLUTE_PATH)/.env.worktree; \
	set +a &&
