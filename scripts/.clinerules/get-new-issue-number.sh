#!/bin/bash
# 新しいissue番号を採番するスクリプト
# 使用例:
#   nnn=$(scripts/.clinerules/get-new-issue-number.sh)
#   scripts/.clinerules/get-new-issue-number.sh --check 155  # issue-155が存在するかチェック

set -e

# ヘルパー関数: 指定した番号のissueブランチを検索
find_existing_issue_branch() {
    local issue_number="$1"
    git --no-pager branch -a | grep -E "(^|/)issue-${issue_number}(-|$)" | head -n 1
}

# オプション解析
CHECK_MODE=false
CHECK_NUMBER=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --check)
            CHECK_MODE=true
            CHECK_NUMBER="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

# リモート情報を最新化
git fetch --prune origin 2>/dev/null || true
git fetch --prune claude 2>/dev/null || true

# 指定番号の存在チェックモード
if [ "$CHECK_MODE" = true ]; then
    existing_branch=$(find_existing_issue_branch "$CHECK_NUMBER")
    [ -z "$existing_branch" ] && echo "available" || echo "exists"
    exit 0
fi

# 最大issue番号を取得
maximum_number=$(git --no-pager branch -a | grep -E '(^|/)issue-[0-9]+(-|$)' | sed -E 's/.*issue-([0-9]+).*/\1/' | sort -n | tail -n 1)

# 番号が見つからなければ0から開始
if [ -z "$maximum_number" ]; then
    maximum_number=0
fi

# +1して新番号を決定
new_number=$((maximum_number + 1))

# 重複チェックループ
formatted_number=$(printf "%03d" $new_number)
existing_branch=$(find_existing_issue_branch "$formatted_number")
while [ -n "$existing_branch" ]; do
    new_number=$((new_number + 1))
    formatted_number=$(printf "%03d" $new_number)
    existing_branch=$(find_existing_issue_branch "$formatted_number")
done

# 3桁でフォーマットして出力
printf "%03d\n" $new_number
