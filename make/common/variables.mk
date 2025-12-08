# Common Variables
# Shared variables used across multiple Makefile modules

# Load environment variables (.env and .env.worktree if exists) and execute command
# This enables unified commands that work for both main repository and worktree modes
# - Main repository: only .env is loaded
# - Worktree mode: .env is loaded first, then .env.worktree overrides specific values
_load-env-exec = set -a && [ -f .env ] && . ./.env; [ -f .env.worktree ] && . ./.env.worktree; set +a &&
