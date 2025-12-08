# Git Worktree Commands
.PHONY: wt-list wt-add wt-remove wt-prune wt-current wt-dev wt-down wt-up wt-disable wt-storybook

# Common variables
WORKTREE_DIR := worktrees
WORKTREE_PATH = $(WORKTREE_DIR)/$(BRANCH)

# Include internal helpers
include make/worktree/helpers/main.mk

# Public commands

wt-list:
	@echo "Listing all git worktrees..."
	@git worktree list

wt-add: _wt-check-branch
	@echo "Creating worktree for branch: $(BRANCH)..."
	@mkdir -p $(WORKTREE_DIR)
	@# Check if worktree already exists in git
	@if git worktree list | awk '{print $$1}' | grep -q "^$(PWD)/$(WORKTREE_PATH)\$$"; then \
		echo "Error: Worktree already exists at $(WORKTREE_PATH)"; \
		echo "To remove it, run: make wt-remove BRANCH=$(BRANCH)"; \
		exit 1; \
	fi
	@# Remove any orphaned directory
	@$(MAKE) _wt-remove-orphaned BRANCH=$(BRANCH) 2>/dev/null || true
	@# Check if branch exists locally
	@if git show-ref --verify --quiet refs/heads/$(BRANCH); then \
		echo "Using existing local branch: $(BRANCH)"; \
		git worktree add $(WORKTREE_PATH) $(BRANCH); \
	elif git ls-remote --exit-code --heads origin $(BRANCH) >/dev/null 2>&1; then \
		echo "Creating local branch from remote: origin/$(BRANCH)"; \
		git worktree add --track -b $(BRANCH) $(WORKTREE_PATH) origin/$(BRANCH); \
	else \
		echo "Creating new branch: $(BRANCH)"; \
		git worktree add -b $(BRANCH) $(WORKTREE_PATH); \
	fi
	@echo "Worktree created at: $(WORKTREE_PATH)"
	@echo "Initializing worktree..."
	@$(MAKE) _wt-init BRANCH=$(BRANCH)

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

wt-down:
	@$(_load-env-exec) docker compose down || true

wt-up:
	@$(_load-env-exec) docker compose up -d

wt-dev: _wt-check-branch _wt-check-exists _wt-dev-in-worktree

wt-disable:
	@echo "Disabling worktree mode, returning to main repository..."
	@$(MAKE) down
	@rm -f docker-compose.override.yml .env.worktree
	@$(MAKE) dev
	@echo "Switched back to main repository mode"

wt-storybook:
	@echo "Starting Storybook in worktree mode..."
	@$(_load-env-exec) docker compose exec frontend npm run storybook
