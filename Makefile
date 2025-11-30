.PHONY: init-config help init-dev dev down ps unit e2e check testall testcheck testlint sortimports storybook wt-list wt-add wt-remove wt-prune

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
	@git worktree add $(WORKTREE_DIR)/$(BRANCH) $(BRANCH) 2>/dev/null || git worktree add -b $(BRANCH) $(WORKTREE_DIR)/$(BRANCH)
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
