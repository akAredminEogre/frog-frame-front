FROM node:23.11-alpine

WORKDIR /opt/frontend-container-app-root/frontend-src-root

# Chromiumのインストール
RUN apk add --no-cache \
  chromium \
  && apk add --no-cache \
  curl \
  && apk add --no-cache \
  sudo

COPY ./host-frontend-root/frontend-src-root/package*.json ./

RUN npm install

COPY ./host-frontend-root/frontend-src-root /opt/frontend-container-app-root/frontend-src-root

RUN npx wxt prepare

# ビルド時に権限を設定
RUN chown -R 1000:1000 /opt/frontend-container-app-root/frontend-src-root

# コンテナが起動するユーザーに sudo 権限を付与
RUN echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node
