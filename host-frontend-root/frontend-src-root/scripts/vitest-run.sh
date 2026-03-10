#!/bin/bash
# vitest排他制御ラッパー（OOM防止・同時実行防止）
# flock があれば排他制御、なければそのまま実行（CI/Claude Code Web互換）
LOCK_FILE="/tmp/vitest-frog-frame-front.lock"
if command -v flock &>/dev/null; then
  echo "[vitest-run] flock検出 → 排他制御モード（$LOCK_FILE）"
  exec flock -w 120 "$LOCK_FILE" \
    sh -c 'echo "[vitest-run] ロック取得成功（PID=$$）"; exec "$@"' -- \
    env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx vitest run "$@"
else
  echo "[vitest-run] flock未検出 → 直接実行モード（CI/Cloud環境）"
  exec env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx vitest run "$@"
fi
