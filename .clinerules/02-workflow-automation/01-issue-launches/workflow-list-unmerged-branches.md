workflow-list-unmerged-branches
```cline-instructions
## developにマージされていないブランチを一覧表示

### 1. 最新のdevelopブランチを取得
```
git checkout develop && git pull && git fetch --all --prune
```

### 2. ローカルブランチでdevelopにマージされていないものを表示
echo "=== ローカルブランチ（developにマージされていない） ==="
```
git branch --no-merged develop | grep -v '^\*' | sort
```

### 3. リモートブランチでdevelopにマージされていないものを表示
echo "=== リモートブランチ（developにマージされていない） ==="
```
git branch -r --no-merged develop | grep -v 'origin/HEAD' | grep -v 'origin/main' | sed 's/origin\///' | sort
```

### 4. 詳細情報付きで表示（最終コミット日時とコミッター）
echo ""
echo "=== 詳細情報（最終コミット日時順） ==="
echo "ブランチ名 | 最終コミット日時 | コミッター"
echo "----------------------------------------"

# ローカルとリモートの未マージブランチを統合して表示
```
{ 
  git branch --no-merged develop | grep -v '^\*' | sed 's/^[[:space:]]*//'
  git branch -r --no-merged develop | grep -v 'origin/HEAD' | grep -v 'origin/main' | sed 's/^[[:space:]]*origin\///'
} | sort -u | while read branch; do
  # ローカルブランチが存在するか確認
  if git show-ref --verify --quiet refs/heads/"$branch"; then
    last_commit=$(git log -1 --format="%ci | %cn" "$branch")
    echo "$branch | $last_commit"
  # リモートブランチの場合
  elif git show-ref --verify --quiet refs/remotes/origin/"$branch"; then
    last_commit=$(git log -1 --format="%ci | %cn" origin/"$branch")
    echo "$branch (remote) | $last_commit"
  fi
done | sort -k3 -r
```

### 5. サマリー表示
echo ""
echo "=== サマリー ==="
local_count=$(git branch --no-merged develop | grep -v '^\*' | wc -l)
remote_count=$(git branch -r --no-merged develop | grep -v 'origin/HEAD' | grep -v 'origin/main' | wc -l)
echo "ローカル未マージブランチ数: $local_count"
echo "リモート未マージブランチ数: $remote_count"
```