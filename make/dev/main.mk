# Development Commands
.PHONY: dev down ps npminstall storybook

# Include initialization commands
include make/dev/init-develop-environment.mk

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

npminstall:
	@echo "Installing npm dependencies..."
	@docker compose exec frontend npm install

storybook:
	@if [ -f .env.worktree ]; then \
		echo "Starting Storybook development server (worktree: $$(grep WORKTREE_ACTIVE_BRANCH .env.worktree | cut -d'=' -f2))..."; \
	else \
		echo "Starting Storybook development server (branch: $$(git branch --show-current))..."; \
	fi
	@$(_load-env-exec) docker compose exec frontend npm run storybook
