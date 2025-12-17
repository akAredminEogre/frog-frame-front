#!/bin/bash
# 新しいissue番号を採番するスクリプト
# 使用例:
#   nnn=$(scripts/.clinerules/get-new-issue-number.sh)
#   scripts/.clinerules/get-new-issue-number.sh --check 155  # issue-155が存在するかチェック

set -e

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

# 指定番号の存在チェックモード
if [ "$CHECK_MODE" = true ]; then
    result=$(git --no-pager branch -a | grep -E "(^|/)issue-${CHECK_NUMBER}(-|$)" | head -n 1)
    if [ -z "$result" ]; then
        echo "available"
        exit 0
    fi
    echo "exists"
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
while true; do
    formatted_number=$(printf "%03d" $new_number)
    existing_branch=$(git --no-pager branch -a | grep -E "(^|/)issue-${formatted_number}(-|$)" | head -n 1)
    if [ -z "$existing_branch" ]; then
        break
    fi
    new_number=$((new_number + 1))
done

# 3桁でフォーマットして出力
printf "%03d\n" $new_number
