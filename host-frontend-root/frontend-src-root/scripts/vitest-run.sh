#!/bin/sh
# vitest排他制御ラッパー（OOM防止・同時実行防止）
# flock があれば排他制御、なければそのまま実行（CI/Claude Code Web互換）
# POSIX sh が動作する Unix系環境向けスクリプト（主に WSL2/Linux を想定）
LOCK_FILE="${VITEST_LOCK_FILE:-${TMPDIR:-/tmp}/vitest-frog-frame-front.lock}"
if command -v flock >/dev/null 2>&1; then
  echo "[vitest-run] flock検出 → 排他制御モード（$LOCK_FILE）"
  exec flock -w 120 "$LOCK_FILE" \
    sh -c 'echo "[vitest-run] ロック取得成功（PID=$$）"; exec "$@"' -- \
    env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx --no-install vitest run "$@"
else
  echo "[vitest-run] flock未検出 → 直接実行モード（flockがない環境）"
  exec env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx --no-install vitest run "$@"
fi
