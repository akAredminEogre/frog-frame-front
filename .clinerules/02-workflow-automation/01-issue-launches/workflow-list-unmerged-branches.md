workflow-list-unmerged-branches
<!-- TODO: makeコマンドにする -->
```cline-instructions
git fetch --all && git branch -a --no-merged develop | grep -v "HEAD"
```