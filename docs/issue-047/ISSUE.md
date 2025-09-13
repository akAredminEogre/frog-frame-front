# 概要
<!-- このチケットで解決したい課題 -->
App.tsxのchrome.runtime.sendMessage呼び出し部分をClean ArchitectureのApplication層に移管し、システム全体のアーキテクチャを改善する包括的なリファクタリングを実施する。

現在Presentation層（App.tsx）に直接記述されている以下のコードを適切な層に移管する：
```typescript
await new Promise<void>((resolve) => {
  chrome.runtime.sendMessage({
    type: 'applyRewriteRule',
    rule: ruleToSave, 
    targetTabId: currentTab.id
  }, (response: any) => {
    if (chrome.runtime.lastError || !response?.success) {
      // エラーは無視して次に進む
    }
    resolve();
  });
});
```

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [ ] `docker compose exec frontend npm run unused:safe` が成功すること
- [ ] 

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->
- 冗長な2段階通信（chrome.runtime.sendMessage → background script → messageHandlers → content script）の最適化による既存機能への影響
- URLパターンチェックをApplication層からcontent script側に移管することによる責任分離の妥当性
- Presentation層の責務範囲の見直しがClean Architectureの原則に適合するかどうか
- DIパターンの実装レベル（手動DI vs 高度なDIコンテナ）の選択による複雑性の増大

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->
- 既存のChrome Extension APIの制約内での実装
- 他ブラウザ対応を考慮した拡張可能な設計の維持
- 既存の機能に影響を与えないこと
- TypeScript完全準拠での実装

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
- [ ] infrastructure層のテストコード作成
