# Common Variables
# Shared variables used across multiple Makefile modules

# Load environment variables (.env and .env.worktree if exists) and execute command
# This enables unified commands that work for both main repository and worktree modes
# - Main repository: only .env is loaded
# - Worktree mode: .env is loaded first, then .env.worktree overrides specific values
# Note: Uses $(CURDIR) for absolute paths to ensure correct file resolution
_load-env-exec = set -a && [ -f $(CURDIR)/.env ] && . $(CURDIR)/.env; [ -f $(CURDIR)/.env.worktree ] && . $(CURDIR)/.env.worktree; set +a &&
