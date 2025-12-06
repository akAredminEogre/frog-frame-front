workflow-list-unmerged-branches
```cline-instructions
git fetch --all && git branch -a --no-merged develop | grep -v "HEAD"
```