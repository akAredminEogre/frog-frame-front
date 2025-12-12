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

# TODO: Display branch name for main repository, or worktree name for worktree mode
storybook:
	@echo "Starting Storybook development server..."
	@$(_load-env-exec) docker compose exec frontend npm run storybook
