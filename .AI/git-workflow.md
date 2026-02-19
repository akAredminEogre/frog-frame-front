# Git Workflow

## Branch Strategy

- **Base branch**: `develop`
- **Branch naming**: Issue-based branches (e.g., `issue-086-docs-how-to-set-up`)
- See `.clinerules/02-workflow-automation/01-issue-launches/workflow-create-branch.md` for branch creation workflow

## Documentation Structure

```
docs/
├── issue-XXX/              # In-progress issue documentation
├── completed/issue-XXX/    # Completed issue documentation
└── issue-000/             # Template for new issues
```

## Files to Exclude from Commits

- `WITH_CLINE.md` - Work-in-progress instructions
- `issues.md` - Task management file

## Pull Requests

- Create PRs using `gh` CLI
- Base PRs against `develop` branch
- Repository: `akAredminEogre/frog-frame-front`

## Git Worktree (Parallel Development)

詳細は [docs/GIT_WORKTREE.md](../docs/GIT_WORKTREE.md) を参照。
