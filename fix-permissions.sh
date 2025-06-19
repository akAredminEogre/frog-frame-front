#!/bin/sh
# コンテナ内からホストへのファイル所有権を設定するスクリプト

echo "frontend-src-root ディレクトリの所有権を設定しています..."
# nodeユーザーで実行しているため、sudo が必要
sudo chown -R node:node /opt/frontend-container-app-root/frontend-src-root

# 権限も適切に設定
sudo chmod -R 755 /opt/frontend-container-app-root/frontend-src-root

echo "ファイル所有権を node:node (UID 1000:1000) に設定しました"
echo "パーミッションを 755 に設定しました"
