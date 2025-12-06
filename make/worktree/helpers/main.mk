# Git Worktree Internal Helpers
# These targets are not meant for direct use (prefixed with _)
.PHONY: _wt-dev-in-worktree

# Include check logic
include make/worktree/helpers/check_logic.mk

# Include initialization helpers
include make/worktree/helpers/init-worktree-helper.mk

# Run dev server inside the worktree
_wt-dev-in-worktree:
	@echo "Stopping other worktree containers to avoid port conflicts..."
	@# Stop all frontend containers except the current worktree
	@for container in $$(docker ps --format "{{.Names}}" | grep -E "frontend-[0-9]+$$"); do \
		docker stop $$container || true; \
	done
	@# Also kill any process using port 3000 (in case dev server is running directly)
	@if lsof -ti:3000 >/dev/null 2>&1; then lsof -ti:3000 | xargs kill -9 2>/dev/null || true; fi
	@echo "Starting development server in worktree $(BRANCH)..."
	@echo "Setting up docker environment for worktree..."
	@$(MAKE) wt-down
	@$(MAKE) wt-up
	@echo "Starting npm dev in worktree container..."
	@$(_wt-load-env-exec) docker compose exec frontend npm run dev
