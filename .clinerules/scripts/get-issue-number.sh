#!/bin/bash
# ブランチ名からissue番号を取得するスクリプト
# 使用例: nnn=$(bash .clinerules/scripts/get-issue-number.sh)

# カレントブランチ名を取得
branch_name=$(git branch --show-current)

# issue-XXX形式からXXXを抽出
# 例: issue-131-feat-numbering-shell -> 131
issue_number=$(echo "$branch_name" | sed -n 's/^issue-\([0-9]\+\).*/\1/p')

# 番号が取得できなかった場合はエラー
if [ -z "$issue_number" ]; then
    echo "Error: Cannot extract issue number from branch name: $branch_name" >&2
    exit 1
fi

# 番号を出力
echo "$issue_number"
