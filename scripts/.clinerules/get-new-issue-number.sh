#!/bin/bash
# 新しいissue番号を採番するスクリプト
# 使用例:
#   nnn=$(scripts/.clinerules/get-new-issue-number.sh)
#   scripts/.clinerules/get-new-issue-number.sh --check 155  # issue-155が存在するかチェック

set -e

# ヘルパー関数: 全issueブランチを取得
get_all_issue_branches() {
    git --no-pager branch -a | grep -E '(^|/)issue-[0-9]+(-|$)'
}

# ヘルパー関数: 入力値が数字のみかバリデーション
validate_digit_only() {
    local VALUE="$1"
    [[ "$VALUE" =~ ^[0-9]+$ ]] && return 0
    echo "Error: Invalid issue number format: $VALUE (digits only)" >&2
    exit 1
}

# ヘルパー関数: 指定した番号のissueブランチを検索
find_existing_issue_branch() {
    local ISSUE_NUMBER="$1"
    validate_digit_only "$ISSUE_NUMBER"
    get_all_issue_branches | grep -E "(^|/)issue-${ISSUE_NUMBER}(-|$)" | head -n 1
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
    [ -z "$CHECK_NUMBER" ] && echo "Error: --check requires an issue number argument" >&2 && exit 1
    EXISTING_BRANCH=$(find_existing_issue_branch "$CHECK_NUMBER")
    [ -z "$EXISTING_BRANCH" ] && echo "available" || echo "exists"
    exit 0
fi

# 最大issue番号を取得
MAXIMUM_NUMBER=$(get_all_issue_branches | sed -E 's/.*issue-([0-9]+).*/\1/' | sort -n | tail -n 1)

# 番号が見つからなければ0から開始
if [ -z "$MAXIMUM_NUMBER" ]; then
    MAXIMUM_NUMBER=0
fi

# +1して新番号を決定
NEW_NUMBER=$((MAXIMUM_NUMBER + 1))

# 重複チェックループ
FORMATTED_NUMBER=$(printf "%03d" $NEW_NUMBER)
EXISTING_BRANCH=$(find_existing_issue_branch "$FORMATTED_NUMBER")
while [ -n "$EXISTING_BRANCH" ]; do
    NEW_NUMBER=$((NEW_NUMBER + 1))
    FORMATTED_NUMBER=$(printf "%03d" $NEW_NUMBER)
    EXISTING_BRANCH=$(find_existing_issue_branch "$FORMATTED_NUMBER")
done

# 3桁でフォーマットして出力
printf "%03d\n" $NEW_NUMBER
