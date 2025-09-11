# ISSUE-046 Clean Architecture改善: Repository Patternによる層間分離の実現

## タイトル
feat(storage): App.tsxの直接的なchrome.storage依存をRepository Patternで抽象化

## 概要と理由
App.tsxで直接chrome.storage.local.setを呼び出していた部分をRepository Patternに移行し、Clean Architectureの原則に従った適切な層間分離を実現しました。UI層からInfrastructure層への直接依存を排除し、Application層のインターフェースを通じた抽象化によってテスト性と保守性を向上させました。

## 主な変更点
- **Application層にIRewriteRuleRepositoryインターフェースを作成**: `src/application/ports/IRewriteRuleRepository.ts`にPorts & Adaptersパターンに従ってインターフェースを配置
- **Infrastructure層にRepository具象実装を完全実装**: `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`でsave, findById, findAll, deleteの全てのCRUD操作を実装
- **UI層の依存関係を抽象化**: `App.tsx`でChrome Storage APIの直接呼び出しを排除し、IRewriteRuleRepositoryインターフェースに依存するよう修正
- **適切なディレクトリ構造の確立**: Ports & Adaptersパターンに従い、application/portsとinfrastructure/persistance/storageという明確な構造を実現

## テスト方法
[動作確認の手順]
- [ ] `docker compose exec frontend npm run unused:safe` が成功すること
  - 既存自動テストとlinterを同時に確認
- [ ] Chrome拡張機能のポップアップが正常に動作すること
- [ ] 書き換えルールの保存・読み込みが従来通り動作すること

## 補足
この変更により、Chrome Extension特有のAPI呼び出しがInfrastructure層に完全に隠蔽され、UI層がテストしやすい抽象的なインターフェースに依存する構造になりました。Repository Patternの導入により、将来的にストレージ実装を変更する場合でもUI層への影響を最小限に抑えることができます。
