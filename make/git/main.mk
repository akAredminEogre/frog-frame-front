# Git Utility Commands
.PHONY: git-list-unmerged

# List all branches not merged into develop
git-list-unmerged:
	@echo "Fetching all branches and listing unmerged branches..."
	@git fetch --all && git branch -a --no-merged develop | grep -v "HEAD"
