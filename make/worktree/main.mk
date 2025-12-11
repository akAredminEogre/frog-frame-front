# Git Worktree Commands
# Note: When adding/removing/modifying commands, also update docs/GIT_WORKTREE.md
.PHONY: wt-list wt-add wt-remove wt-prune wt-current wt-init wt-dev wt-down wt-up wt-disable

# Common variables
WORKTREE_DIR := worktrees
WORKTREE_PATH = $(WORKTREE_DIR)/$(BRANCH)

# Include internal helpers
include make/worktree/helpers/main.mk

# Include wt-add command
include make/worktree/wt-add.mk

# Public commands

wt-list:
	@echo "Listing all git worktrees..."
	@git worktree list

wt-remove: _wt-check-branch
	@echo "Removing worktree for branch: $(BRANCH)..."
	@git worktree remove $(WORKTREE_PATH) --force 2>/dev/null || echo "Worktree not found: $(WORKTREE_PATH)"
	@echo "Worktree removed"

wt-prune:
	@echo "Pruning stale worktree references..."
	@git worktree prune -v
	@echo "Prune complete"

wt-current:
	@echo "Checking current worktree configuration..."
	@# Check for no worktree setup (early return case)
	@$(MAKE) -s _wt-check-no-active
	@# Check for custom override (early return case)
	@$(MAKE) -s _wt-check-custom-override
	@# Check for incomplete worktree setup (early return case)
	@$(MAKE) -s _wt-check-incomplete-setup
	@# Active worktree configuration found (main case)
	@echo "Active worktree configuration found"
	@echo "Branch: $$(grep WORKTREE_ACTIVE_BRANCH .env.worktree 2>/dev/null | cut -d'=' -f2 || echo 'unknown')"
	@echo "Path: $$(grep CURRENT_WORKTREE_PATH .env.worktree 2>/dev/null | cut -d'=' -f2 || echo 'unknown')"

wt-init: _wt-check-branch
	@# Check if worktree exists, if not create it
	@$(MAKE) _wt-check-exists BRANCH="$(BRANCH)" 2>/dev/null || $(MAKE) wt-add BRANCH="$(BRANCH)"
	@echo "Initializing worktree for development: $(BRANCH)..."
	@echo "Switching to worktree for initialization..."
	@$(MAKE) _wt-create-override BRANCH="$(BRANCH)"
	@echo "Stopping existing Docker services..."
	@$(MAKE) wt-down
	@echo "Starting Docker services for worktree..."
	@$(MAKE) wt-up
	@echo "Installing npm dependencies in worktree..."
	@$(_load-env-exec) docker compose exec frontend npm install
	@echo "Preparing WXT (generating .wxt/tsconfig.json) in worktree..."
	@$(_load-env-exec) docker compose exec frontend npx wxt prepare
	@echo ""
	@echo "Worktree $(BRANCH) initialization complete!"
	@echo "The worktree is ready for development."
	@echo ""
	@echo "To start development:"
	@echo "  make wt-dev BRANCH=$(BRANCH)"

wt-down:
	@$(_load-env-exec) docker compose down || true

wt-up:
	@$(_load-env-exec) docker compose up -d

wt-dev: _wt-check-branch
	@# Check if initialized for this branch, if not initialize it (which also creates worktree if needed)
	@$(MAKE) _wt-check-initialized BRANCH="$(BRANCH)" 2>/dev/null || $(MAKE) wt-init BRANCH="$(BRANCH)"
	@$(MAKE) _wt-dev-in-worktree BRANCH="$(BRANCH)"

wt-disable:
	@echo "Disabling worktree mode, returning to main repository..."
	@$(MAKE) down
	@rm -f docker-compose.override.yml .env.worktree
	@$(MAKE) dev
	@echo "Switched back to main repository mode"
