# Git Worktree Check Logic
# Validation and check helpers for worktree operations
.PHONY: _wt-check-branch _wt-check-exists _wt-check-no-active _wt-check-custom-override _wt-check-incomplete-setup _wt-check-initialized

# Check if BRANCH variable is defined and safe
_wt-check-branch:
ifndef BRANCH
	@echo "Error: BRANCH is required"
	@echo "Usage: make $(MAKECMDGOALS) BRANCH=branch-name"
	@exit 1
endif
	@# Validate branch name contains only safe characters (security measure)
	@if ! echo "$(BRANCH)" | grep -qE '^[A-Za-z0-9._/-]+$$'; then \
		echo "Error: Invalid branch name '$(BRANCH)'"; \
		echo "Branch names may only contain: A-Z, a-z, 0-9, '.', '_', '/', '-'"; \
		exit 1; \
	fi

# Check if worktree directory exists
_wt-check-exists:
	@if [ ! -d "$(WORKTREE_PATH)" ]; then \
		echo "Error: Worktree not found at $(WORKTREE_PATH)"; \
		echo "Available worktrees:"; \
		ls -1 "$(WORKTREE_DIR)" 2>/dev/null || echo "No worktrees found"; \
		exit 1; \
	fi

# Internal helper: Check if no worktree is active
_wt-check-no-active:
	@if [ ! -f .env.worktree ] && [ ! -f docker-compose.override.yml ]; then \
		echo "No worktree override active (using main repository)"; \
		exit 0; \
	fi

# Internal helper: Check for custom override (not managed by worktree)
_wt-check-custom-override:
	@if [ ! -f .env.worktree ] && [ -f docker-compose.override.yml ]; then \
		echo "Custom docker-compose.override.yml detected (not managed by worktree system)"; \
		exit 0; \
	fi

# Internal helper: Check for incomplete worktree setup
_wt-check-incomplete-setup:
	@if [ -f .env.worktree ] && [ ! -f docker-compose.override.yml ]; then \
		echo "Worktree environment configured but docker-compose.override.yml missing"; \
		exit 0; \
	fi

# Check if worktree is initialized for the specified branch
# Succeeds (exit 0) if initialized, fails (exit 1) if not initialized
# Uses check_env_worktree_exists and get_and_check_active_branch from scripts/worktree/check_logic.sh
_wt-check-initialized:
	@source scripts/worktree/check_logic.sh && \
	check_env_worktree_exists >/dev/null 2>&1 || exit 1; \
	ACTIVE_BRANCH=$$(get_and_check_active_branch 2>/dev/null) || exit 1; \
	[ "$$ACTIVE_BRANCH" = "$(BRANCH)" ] || exit 1
