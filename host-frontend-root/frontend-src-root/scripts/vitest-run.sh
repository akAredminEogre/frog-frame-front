#!/bin/sh
# vitest排他制御ラッパー（OOM防止・同時実行防止）
# flock があれば排他制御、なければそのまま実行（CI/Claude Code Web互換）
# POSIX sh が動作する Unix系環境向けスクリプト（主に WSL2/Linux を想定）
LOCK_FILE="${VITEST_LOCK_FILE:-${TMPDIR:-/tmp}/vitest-frog-frame-front.lock}"
# ロック取得待ち時間（秒）。CI環境での長時間テスト並行実行を考慮した上限値
LOCK_WAIT="${VITEST_LOCK_WAIT:-120}"
if command -v flock >/dev/null 2>&1; then
  echo "[vitest-run] flock検出 → 排他制御モード（$LOCK_FILE）"
  flock -w "$LOCK_WAIT" -E 101 "$LOCK_FILE" \
    sh -c 'echo "[vitest-run] ロック取得成功（PID=$$）"; exec "$@"' -- \
    env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx --no-install vitest run "$@"
  STATUS=$?
  if [ "$STATUS" -eq 101 ]; then
    echo "[vitest-run] ロック取得タイムアウト（${LOCK_WAIT}秒待機）: 他プロセスがロック中" >&2
    exit 1
  fi
  exit "$STATUS"
else
  echo "[vitest-run] flock未検出 → 直接実行モード（flockがない環境）"
  exec env NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048" npx --no-install vitest run "$@"
fi
