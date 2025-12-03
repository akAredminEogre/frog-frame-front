.PHONY: init-config help init-dev dev down ps unit e2e check testall testcheck testlint sortimports storybook wt-list wt-add wt-remove wt-prune wt-use wt-current wt-init

help:
	@echo "Available commands:"
	@echo "  make init-config  - Apply git configuration from template"
	@echo "  make init-dev     - Initial setup for development (first time only)"
	@echo "  make dev          - Start development server"
	@echo "  make down         - Stop Docker containers"
	@echo "  make ps           - List running containers"
	@echo "  make unit         - Run unit tests only"
	@echo "  make e2e          - Run E2E tests only"
	@echo "  make check        - Run compile, knip, tsr, and lint checks"
	@echo "  make testall      - Run all tests (unit + E2E)"
	@echo "  make testcheck    - Run tests with warnings"
	@echo "  make testlint     - Run comprehensive tests and linting (required before PR)"
	@echo "  make sortimports  - Sort imports in all files"
	@echo "  make storybook    - Start Storybook development server"
	@echo "  make wt-list      - List all git worktrees"
	@echo "  make wt-add       - Add a new worktree (usage: make wt-add BRANCH=branch-name)"
	@echo "  make wt-remove    - Remove a worktree (usage: make wt-remove BRANCH=branch-name)"
	@echo "  make wt-prune     - Prune stale worktree references"
	@echo "  make wt-use       - Switch to a worktree (usage: make wt-use BRANCH=branch-name)"
	@echo "  make wt-current   - Show the currently active worktree"
	@echo "  make wt-init      - Initialize a worktree for development (usage: make wt-init BRANCH=branch-name)"
	@echo "  make help         - Show this help message"

init-config:
	@echo "Applying git configuration from .gitconfig.template..."
	@git config core.repositoryformatversion 0
	@git config core.filemode false
	@git config core.bare false
	@git config core.logallrefupdates true
	@echo "Git configuration applied successfully!"
	@echo ""
	@echo "Current git core configuration:"
	@git config --get core.repositoryformatversion
	@git config --get core.filemode
	@git config --get core.bare
	@git config --get core.logallrefupdates

init-dev:
	@echo "Starting initial development setup..."
	@cp .env.example .env
	@cp host-frontend-root/frontend-src-root/src/utils/matchUrl.ts.example host-frontend-root/frontend-src-root/src/utils/matchUrl.ts
	@echo "Building and starting Docker containers..."
	@docker compose up -d --build
	@docker compose ps
	@echo "Installing npm dependencies..."
	@docker compose exec frontend npm install
	@echo "Preparing WXT (generating .wxt/tsconfig.json)..."
	@docker compose exec frontend npx wxt prepare
	@echo ""
	@echo "✅ Initial setup complete!"
	@echo "Starting development server..."
	@docker compose exec frontend npm run dev

dev:
	@echo "Starting development server..."
	@docker compose down
	@docker compose up -d
	@docker compose ps
	@docker compose exec frontend npm run dev

down:
	@echo "Stopping all Docker containers..."
	@docker compose down
	@docker compose ps

ps:
	@echo "Listing all running Docker containers..."
	@docker compose ps

unit:
	@echo "Running unit tests..."
	@docker compose exec frontend npm run test:unit

e2e:
	@echo "Running E2E tests..."
	@docker compose exec frontend npm run test:e2e

check:
	@echo "Running compile, knip, tsr, and lint checks..."
	@docker compose exec frontend sh -c 'npm run compile && (npm run knip:all || true) && (npm run tsr:check || true) && (npm run lint || true)'

testall:
	@echo "Running all tests..."
	@docker compose exec frontend npm run test:all

testcheck:
	@echo "Running tests with warnings..."
	@docker compose exec frontend npm run test:check

testlint:
	@echo "Running comprehensive tests and linting..."
	@docker compose exec frontend npm run test:lint

sortimports:
	@echo "Sorting imports in all files..."
	@docker compose exec frontend npm run sort:imports

npminstall:
	@echo "Installing npm dependencies..."
	@docker compose exec frontend npm install

storybook:
	@echo "Starting Storybook development server..."
	@docker compose exec frontend npm run storybook

# Git Worktree Commands
WORKTREE_DIR := worktrees

wt-list:
	@echo "Listing all git worktrees..."
	@git worktree list

wt-add:
ifndef BRANCH
	@echo "Error: BRANCH is required"
	@echo "Usage: make wt-add BRANCH=branch-name"
	@exit 1
endif
	@echo "Creating worktree for branch: $(BRANCH)..."
	@mkdir -p $(WORKTREE_DIR)
	@# Check if worktree already exists in git
	@if git worktree list | grep -q "$(WORKTREE_DIR)/$(BRANCH)"; then \
		echo "Error: Worktree already exists at $(WORKTREE_DIR)/$(BRANCH)"; \
		echo "To remove it, run: make wt-remove BRANCH=$(BRANCH)"; \
		exit 1; \
	fi
	@# Check if directory exists but not registered as worktree
	@if [ -d "$(WORKTREE_DIR)/$(BRANCH)" ]; then \
		echo "Warning: Directory $(WORKTREE_DIR)/$(BRANCH) exists but is not a registered worktree."; \
		echo "Attempting to remove orphaned directory..."; \
		if rm -rf "$(WORKTREE_DIR)/$(BRANCH)" 2>/dev/null; then \
			echo "Successfully removed orphaned directory."; \
		else \
			echo "Error: Cannot remove directory due to permission issues."; \
			echo "Please run: sudo rm -rf $(WORKTREE_DIR)/$(BRANCH)"; \
			echo "Then run this command again."; \
			exit 1; \
		fi \
	fi
	@# Check if branch exists locally
	@if git show-ref --verify --quiet refs/heads/$(BRANCH); then \
		echo "Using existing local branch: $(BRANCH)"; \
		git worktree add $(WORKTREE_DIR)/$(BRANCH) $(BRANCH); \
	elif git ls-remote --exit-code --heads origin $(BRANCH) >/dev/null 2>&1; then \
		echo "Creating local branch from remote: origin/$(BRANCH)"; \
		git worktree add --track -b $(BRANCH) $(WORKTREE_DIR)/$(BRANCH) origin/$(BRANCH); \
	else \
		echo "Creating new branch: $(BRANCH)"; \
		git worktree add -b $(BRANCH) $(WORKTREE_DIR)/$(BRANCH); \
	fi
	@echo "Worktree created at: $(WORKTREE_DIR)/$(BRANCH)"
	@echo ""
	@echo "To start development in this worktree:"
	@echo "  cd $(WORKTREE_DIR)/$(BRANCH)"
	@echo "  make dev"

wt-remove:
ifndef BRANCH
	@echo "Error: BRANCH is required"
	@echo "Usage: make wt-remove BRANCH=branch-name"
	@exit 1
endif
	@echo "Removing worktree for branch: $(BRANCH)..."
	@git worktree remove $(WORKTREE_DIR)/$(BRANCH) --force 2>/dev/null || echo "Worktree not found: $(WORKTREE_DIR)/$(BRANCH)"
	@echo "Worktree removed"

wt-prune:
	@echo "Pruning stale worktree references..."
	@git worktree prune -v
	@echo "Prune complete"

wt-use:
ifndef BRANCH
	@echo "Error: BRANCH is required"
	@echo "Usage: make wt-use BRANCH=branch-name"
	@exit 1
endif
	@echo "Switching to worktree for branch: $(BRANCH)..."
	@if [ ! -d "$(WORKTREE_DIR)/$(BRANCH)" ]; then \
		echo "Error: Worktree not found at $(WORKTREE_DIR)/$(BRANCH)"; \
		echo "Available worktrees:"; \
		ls -1 $(WORKTREE_DIR) 2>/dev/null || echo "No worktrees found"; \
		exit 1; \
	fi
	@echo "Setting up docker-compose.override.yml with environment variable..."
	@if [ ! -f "docker-compose.override.yml.example" ]; then \
		echo "Error: Template file docker-compose.override.yml.example not found"; \
		exit 1; \
	fi
	@echo "# Auto-generated by 'make wt-use' for worktree: $(BRANCH)" > docker-compose.override.yml
	@echo "# This file uses CURRENT_WORKTREE_PATH environment variable" >> docker-compose.override.yml
	@echo "# Set CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) before running docker compose" >> docker-compose.override.yml
	@echo "" >> docker-compose.override.yml
	@cat docker-compose.override.yml.example >> docker-compose.override.yml
	@echo "Setting CURRENT_WORKTREE_PATH environment variable..."
	@echo "CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH)" > .env.worktree
	@echo "Applying worktree configuration..."
	@CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) docker compose up -d
	@echo ""
	@echo "✅ Switched to worktree: $(BRANCH)"
	@echo "The Docker container now uses: $(WORKTREE_DIR)/$(BRANCH)"
	@echo ""
	@echo "Environment variable set: CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH)"
	@echo "To start development:"
	@echo "  CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) docker compose exec -w /opt/frontend-container-app-root/host-frontend-root/frontend-src-root frontend npm run dev"

wt-current:
	@echo "Checking current worktree configuration..."
	@if [ -f docker-compose.override.yml ]; then \
		if grep -q "Auto-generated by 'make wt-use'" docker-compose.override.yml; then \
			WORKTREE=$$(grep "Auto-generated by 'make wt-use' for worktree:" docker-compose.override.yml | sed 's/.*worktree: //'); \
			echo "Active worktree: $$WORKTREE"; \
			if [ -f .env.worktree ]; then \
				echo "Environment: $$(cat .env.worktree)"; \
			fi \
		else \
			echo "Custom docker-compose.override.yml detected (not managed by wt-use)"; \
		fi \
	else \
		echo "No worktree override active (using main repository)"; \
	fi

wt-init:
ifndef BRANCH
	@echo "Error: BRANCH is required"
	@echo "Usage: make wt-init BRANCH=branch-name"
	@exit 1
endif
	@echo "Initializing worktree for development: $(BRANCH)..."
	@if [ ! -d "$(WORKTREE_DIR)/$(BRANCH)" ]; then \
		echo "Error: Worktree not found at $(WORKTREE_DIR)/$(BRANCH)"; \
		echo "Please create the worktree first with: make wt-add BRANCH=$(BRANCH)"; \
		exit 1; \
	fi
	@echo "Cleaning up duplicate frontend-src-root directory..."
	@if [ -d "$(WORKTREE_DIR)/$(BRANCH)/frontend-src-root" ]; then \
		rm -rf $(WORKTREE_DIR)/$(BRANCH)/frontend-src-root; \
		echo "Removed duplicate frontend-src-root directory"; \
	fi
	@echo "Setting up configuration files..."
	@if [ -f .env ]; then \
		cp .env $(WORKTREE_DIR)/$(BRANCH)/.env; \
		echo "Copied .env to worktree"; \
	else \
		echo "Warning: .env not found in main repository"; \
		if [ -f .env.example ]; then \
			cp .env.example $(WORKTREE_DIR)/$(BRANCH)/.env; \
			echo "Copied .env.example to worktree as .env"; \
		fi \
	fi
	@if [ -f host-frontend-root/frontend-src-root/src/utils/matchUrl.ts ]; then \
		mkdir -p $(WORKTREE_DIR)/$(BRANCH)/host-frontend-root/frontend-src-root/src/utils/; \
		cp host-frontend-root/frontend-src-root/src/utils/matchUrl.ts $(WORKTREE_DIR)/$(BRANCH)/host-frontend-root/frontend-src-root/src/utils/matchUrl.ts; \
		echo "Copied matchUrl.ts to worktree"; \
	else \
		echo "Warning: matchUrl.ts not found, checking for example file"; \
		if [ -f host-frontend-root/frontend-src-root/src/utils/matchUrl.ts.example ]; then \
			mkdir -p $(WORKTREE_DIR)/$(BRANCH)/host-frontend-root/frontend-src-root/src/utils/; \
			cp host-frontend-root/frontend-src-root/src/utils/matchUrl.ts.example $(WORKTREE_DIR)/$(BRANCH)/host-frontend-root/frontend-src-root/src/utils/matchUrl.ts; \
			echo "Copied matchUrl.ts.example to worktree as matchUrl.ts"; \
		fi \
	fi
	@echo "Switching to worktree for initialization..."
	@CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) $(MAKE) wt-use BRANCH=$(BRANCH)
	@echo "Installing npm dependencies in worktree..."
	@CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) docker compose exec -w /opt/frontend-container-app-root/host-frontend-root/frontend-src-root frontend npm install
	@echo "Preparing WXT (generating .wxt/tsconfig.json) in worktree..."
	@CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) docker compose exec -w /opt/frontend-container-app-root/host-frontend-root/frontend-src-root frontend npx wxt prepare
	@echo ""
	@echo "✅ Worktree $(BRANCH) initialization complete!"
	@echo "The worktree is ready for development."
	@echo ""
	@echo "To start development:"
	@echo "  CURRENT_WORKTREE_PATH=./$(WORKTREE_DIR)/$(BRANCH) docker compose exec -w /opt/frontend-container-app-root/host-frontend-root/frontend-src-root frontend npm run dev"
