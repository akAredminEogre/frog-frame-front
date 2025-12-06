# Git Worktree Internal Helpers
# These targets are not meant for direct use (prefixed with _)
.PHONY: _wt-remove-orphaned _wt-setup-env
.PHONY: _wt-copy-override-template _wt-create-override _wt-dev-in-worktree _wt-init

# Include check logic
include make/worktree/helpers/check_logic.mk

# Remove orphaned worktree directory
_wt-remove-orphaned:
	@if rm -rf "$(WORKTREE_PATH)" 2>/dev/null; then \
		echo "Successfully removed orphaned directory."; \
	else \
		echo "Error: Cannot remove directory due to permission issues."; \
		echo "Please run: sudo rm -rf $(WORKTREE_PATH)"; \
		echo "Then run this command again."; \
		exit 1; \
	fi

# Setup .env files for worktree
_wt-setup-env:
	@echo "Setting up configuration files..."
	@if [ -f .env ]; then \
		cp .env $(WORKTREE_PATH)/.env; \
		echo "Copied .env to worktree"; \
	else \
		echo "Warning: .env not found in main repository"; \
		if [ -f .env.example ]; then \
			cp .env.example $(WORKTREE_PATH)/.env; \
			echo "Copied .env.example to worktree as .env"; \
		fi \
	fi
	@if [ -f host-frontend-root/frontend-src-root/src/utils/matchUrl.ts ]; then \
		mkdir -p $(WORKTREE_PATH)/host-frontend-root/frontend-src-root/src/utils/; \
		cp host-frontend-root/frontend-src-root/src/utils/matchUrl.ts $(WORKTREE_PATH)/host-frontend-root/frontend-src-root/src/utils/matchUrl.ts; \
		echo "Copied matchUrl.ts to worktree"; \
	else \
		echo "Warning: matchUrl.ts not found, checking for example file"; \
		if [ -f host-frontend-root/frontend-src-root/src/utils/matchUrl.ts.example ]; then \
			mkdir -p $(WORKTREE_PATH)/host-frontend-root/frontend-src-root/src/utils/; \
			cp host-frontend-root/frontend-src-root/src/utils/matchUrl.ts.example $(WORKTREE_PATH)/host-frontend-root/frontend-src-root/src/utils/matchUrl.ts; \
			echo "Copied matchUrl.ts.example to worktree as matchUrl.ts"; \
		fi \
	fi

# Internal helper: Copy override template to docker-compose.override.yml
_wt-copy-override-template:
	@echo "Setting up docker-compose.override.yml for worktree..."
	@if [ ! -f "docker-compose.override.yml.example" ]; then \
		echo "Error: Template file docker-compose.override.yml.example not found"; \
		exit 1; \
	fi
	@cp docker-compose.override.yml.example docker-compose.override.yml

# Create docker-compose.override.yml
_wt-create-override:
	@$(MAKE) -s _wt-copy-override-template
	@echo "Setting worktree environment variables..."
	@echo "# Worktree environment variables" > .env.worktree
	@echo "CURRENT_WORKTREE_PATH=./$(WORKTREE_PATH)" >> .env.worktree
	@echo "WORKTREE_ACTIVE_BRANCH=$(BRANCH)" >> .env.worktree

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

# Initialize worktree for development
_wt-init: _wt-check-branch _wt-check-exists
	@echo "Initializing worktree for development: $(BRANCH)..."
	@$(MAKE) _wt-setup-env BRANCH=$(BRANCH)
	@echo "Switching to worktree for initialization..."
	@$(MAKE) _wt-create-override BRANCH=$(BRANCH)
	@echo "Starting Docker services for worktree..."
	@$(MAKE) wt-up
	@echo "Installing npm dependencies in worktree..."
	@$(_wt-load-env-exec) docker compose exec frontend npm install
	@echo "Preparing WXT (generating .wxt/tsconfig.json) in worktree..."
	@$(_wt-load-env-exec) docker compose exec frontend npx wxt prepare
	@echo ""
	@echo "Worktree $(BRANCH) initialization complete!"
	@echo "The worktree is ready for development."
	@echo ""
	@echo "To start development:"
	@echo "  make wt-dev BRANCH=$(BRANCH)"
