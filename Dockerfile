FROM node:20-bullseye

ARG FRONTEND_WORKDIR
WORKDIR ${FRONTEND_WORKDIR}

# 必要なパッケージを apt でインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxrandr2 libxfixes3 libgbm1 libasound2 \
    # Playwright が要求する基本依存関係
    libxcursor1 libxi6 libgtk-3-0 \
    # Playwright WebKit用の追加依存関係
    libwoff1 libopus0 flite1-dev espeak-data \
    libharfbuzz-icu0 libenchant-2-2 libsecret-1-0 libhyphen0 \
    libmanette-0.2-0 libdw1 libegl1-mesa libgudev-1.0-0 \
    libgles2-mesa libx264-dev \
    # 追加のWebKit関連依存関係
    libharfbuzz-gobject0 \
  # HTTP クライアント
  curl \
  # sudo 権限付与用ツール
  sudo \
  && rm -rf /var/lib/apt/lists/*

ARG HOST_FRONTEND_ROOT_PATH
ARG CONTAINER_APP_ROOT
COPY ${HOST_FRONTEND_ROOT_PATH}/frontend-src-root/package*.json ./
RUN npm install

COPY ${HOST_FRONTEND_ROOT_PATH}/frontend-src-root ${CONTAINER_APP_ROOT}/frontend-src-root

RUN npx wxt prepare

# ノードユーザーのUIDとGIDをホストの一般的なユーザーIDに変更
ARG FRONTEND_UID
ARG FRONTEND_GID
ARG CONTAINER_APP_ROOT
RUN usermod -u ${FRONTEND_UID} node && groupmod -g ${FRONTEND_GID} node

# ディレクトリの所有権を明示的に設定
RUN chown -R node:node ${CONTAINER_APP_ROOT}

# コンテナが起動するユーザーに sudo 権限を付与
RUN echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Playwright 本体とテストランナーをインストール
USER node
RUN npm install -D @playwright/test

# Playwright が動作するためのブラウザと依存ライブラリを一括インストール
RUN npx playwright install --with-deps chromium

# WXTでビルド（.output/chrome-mv3-dev生成）
RUN npm run build
