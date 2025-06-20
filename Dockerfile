FROM node:22-bookworm-slim

WORKDIR /opt/frontend-container-app-root/frontend-src-root

# 必要なパッケージを apt でインストール
RUN apt-get update && \
  apt-get install -y \
  # Chromium 本体（Playwright等の E2E テスト用）
  chromium \
  # HTTP クライアント
  curl \
  # sudo 権限付与用ツール
  sudo \
  && rm -rf /var/lib/apt/lists/*

COPY ./host-frontend-root/frontend-src-root/package*.json ./
RUN npm install

COPY ./host-frontend-root/frontend-src-root /opt/frontend-container-app-root/frontend-src-root

RUN npx wxt prepare

# ノードユーザーのUIDとGIDをホストの一般的なユーザーIDに変更
RUN usermod -u 1000 node && groupmod -g 1000 node

# ディレクトリの所有権を明示的に設定
RUN chown -R node:node /opt/frontend-container-app-root

# コンテナが起動するユーザーに sudo 権限を付与
RUN echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Playwright 本体とテストランナーをインストール
USER node
RUN npm install -D @playwright/test

# Playwright が動作するためのブラウザと依存ライブラリを一括インストール
RUN npx playwright install --with-deps