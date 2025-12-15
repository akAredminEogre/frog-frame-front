# Git Worktree Add Command
# Creates a new worktree for a branch (file copy only, no Docker)
#
# TODO: Security - Add branch name validation and quote shell variables
# - Validate BRANCH against safe character set [A-Za-z0-9._/-] in _wt-check-branch
# - Quote all variable references in shell commands to prevent injection
# See: https://github.com/akAredminEogre/frog-frame-front/pull/241#discussion_r2608419943
# See: https://github.com/akAredminEogre/frog-frame-front/pull/241#discussion_r2608585252

.PHONY: wt-add _wt-add-create

wt-add: _wt-check-branch
	@echo "Creating worktree for branch: $(BRANCH)..."
	@mkdir -p $(dir $(WORKTREE_PATH))
	@# Check write permissions on parent directory
	@if ! touch "$(dir $(WORKTREE_PATH)).write_test" 2>/dev/null; then \
		echo "Error: Cannot write to $(dir $(WORKTREE_PATH))"; \
		echo "The directory may have been created by Docker with root permissions."; \
		echo "Please fix permissions with: sudo chown -R $$(whoami) $(WORKTREE_DIR)/"; \
		exit 1; \
	fi
	@rm -f "$(dir $(WORKTREE_PATH)).write_test"
	@# Check if worktree already exists in git (idempotent handling)
	@if git worktree list | grep -q "^$(PWD)/$(WORKTREE_PATH) "; then \
		if git worktree list | grep "^$(PWD)/$(WORKTREE_PATH) " | grep -q "prunable"; then \
			echo "Found prunable worktree, cleaning up..."; \
			git worktree prune; \
			$(MAKE) _wt-add-create BRANCH="$(BRANCH)"; \
		else \
			echo "Worktree already exists at $(WORKTREE_PATH) (skipping creation)"; \
		fi; \
	else \
		$(MAKE) _wt-add-create BRANCH="$(BRANCH)"; \
	fi

# Internal helper: Actually create the worktree
_wt-add-create: _wt-check-branch
	@# Remove any orphaned directory
	@$(MAKE) _wt-remove-orphaned BRANCH="$(BRANCH)" 2>/dev/null || true
	@# Check if branch exists locally
	@if git show-ref --verify --quiet "refs/heads/$(BRANCH)"; then \
		echo "Using existing local branch: $(BRANCH)"; \
		git worktree add "$(WORKTREE_PATH)" "$(BRANCH)"; \
	elif git ls-remote --exit-code --heads origin "$(BRANCH)" >/dev/null 2>&1; then \
		echo "Creating local branch from remote: origin/$(BRANCH)"; \
		git worktree add --track -b "$(BRANCH)" "$(WORKTREE_PATH)" "origin/$(BRANCH)"; \
	else \
		echo "Creating new branch: $(BRANCH)"; \
		git worktree add -b "$(BRANCH)" "$(WORKTREE_PATH)"; \
	fi
	@echo "Worktree created at: $(WORKTREE_PATH)"
	@echo "Setting up environment files..."
	@$(MAKE) _wt-setup-env BRANCH="$(BRANCH)"
	@echo ""
	@echo "Worktree $(BRANCH) is ready."
	@echo "To initialize for development (Docker, npm install, wxt prepare):"
	@echo "  make wt-init BRANCH=$(BRANCH)"
	@echo ""
	@echo "Or start development directly (auto-initializes if needed):"
	@echo "  make wt-dev BRANCH=$(BRANCH)"
