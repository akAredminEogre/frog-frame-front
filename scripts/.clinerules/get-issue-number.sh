#!/bin/bash
# ブランチ名からissue番号を取得するスクリプト
# 使用例: nnn=$(scripts/.clinerules/get-issue-number.sh)

# カレントブランチ名を取得
branch_name="$(git branch --show-current)"

# issue-XXX または claude/issue-XXX 形式からXXXを抽出
# 例: issue-131-feat-numbering-shell -> 131
# 例: claude/issue-131-feat-xxx-Ab12c -> 131
issue_number=$(echo "$branch_name" | sed -En 's/^(claude\/)?issue-([0-9]+).*/\2/p')

# 番号が取得できなかった場合はエラー
if [ -z "$issue_number" ]; then
    echo "Error: Cannot extract issue number from branch name: $branch_name" >&2
    exit 1
fi

# 番号を出力
echo "$issue_number"
