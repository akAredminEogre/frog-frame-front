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

# ビルド時に権限を設定
RUN chown -R 1000:1000 /opt/frontend-container-app-root/frontend-src-root

# コンテナが起動するユーザーに sudo 権限を付与
RUN echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node
