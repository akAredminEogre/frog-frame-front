#!/bin/sh
# コンテナ内からホストへのファイル所有権を設定するスクリプト

# UID 1000:1000 は一般的にホストの最初のユーザーに対応します
echo "frontend-src-root ディレクトリの所有権を設定しています..."
chown -R 1000:1000 /opt/frontend-container-app-root/frontend-src-root

# 権限も適切に設定
chmod -R 755 /opt/frontend-container-app-root/frontend-src-root

echo "ファイル所有権を UID 1000:1000 に設定しました"
echo "パーミッションを 755 に設定しました"
