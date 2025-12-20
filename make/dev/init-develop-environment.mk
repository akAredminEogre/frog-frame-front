# Development Environment Initialization Commands
.PHONY: init-config init-dev init-hooks

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
	@echo "Initial setup complete!"
	@echo "Starting development server..."
	@docker compose exec frontend npm run dev

init-hooks:
	@echo "Installing Git hooks with Lefthook..."
	@cd host-frontend-root/frontend-src-root && npx lefthook install
	@echo "Git hooks installed successfully!"
	@echo ""
	@echo "The following hooks are now active:"
	@echo "  - pre-commit: Runs sortimports and lint on staged files"
