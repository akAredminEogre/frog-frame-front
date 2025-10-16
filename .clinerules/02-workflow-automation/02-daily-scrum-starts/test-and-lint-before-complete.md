workflow:test-and-lint-before-complete

**CRITICAL: attempt_completionツールを使用する前に、以下を必ず実行する：**

```bash
(cd 絶対パスでfrog-frame-frontに移動) && \
docker compose exec frontend npm run test-and-lint
```

- エラーまたは未使用コードが検出された場合は修正が必須
- 修正後、再度チェックを実行
- すべて正常になってからのみattempt_completion可能
- **このチェックなしでのタスク完了報告は禁止**
