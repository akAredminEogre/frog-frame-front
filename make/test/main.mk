# Testing and Code Quality Commands
.PHONY: unit e2e check testall testcheck testlint sortimports lintmd lintmdfix checklinks

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

lintmd:
	@echo "Running markdownlint..."
	@npx markdownlint-cli2 'docs/**/*.md' 'docs-rules/**/*.md' '*.md'

lintmdfix:
	@echo "Running markdownlint with auto-fix..."
	@npx markdownlint-cli2 --fix 'docs/**/*.md' 'docs-rules/**/*.md' '*.md'

checklinks:
	@echo "Checking markdown links..."
	@find docs docs-rules -name '*.md' -exec npx markdown-link-check {} \;
