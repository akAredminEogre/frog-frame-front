# PR: RewriteRuleMessagingService スケルトン実装（タスク3d-3a）

## Summary

- @webext-core/proxy-serviceライブラリを導入し、RewriteRuleMessagingServiceのスケルトン実装を追加
- 実際のロジック実装とbackground.tsへの統合は、E2Eテストへの影響があるため別タスク（3d-3b）に分割

## 変更内容

### 追加したパッケージ
- `@webext-core/proxy-service`: Chrome拡張機能のメッセージングを抽象化するライブラリ

### 追加したファイル
| ファイル | 説明 |
|----------|------|
| `src/frameworks-and-drivers/messaging/RewriteRuleMessagingService.ts` | スケルトン実装 |
| `src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO.ts` | ルールDTO |
| `src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO.ts` | 取得リクエストDTO |
| `src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO.ts` | 更新リクエストDTO |
| `src/interface-adapters/ports/IRewriteRuleMessagingPort.ts` | インターフェース |

### 変更したファイル
| ファイル | 変更内容 |
|----------|----------|
| `package.json` | @webext-core/proxy-service追加 |
| `src/frameworks-and-drivers/di/container.ts` | RewriteRuleMessagingServiceのDI登録 |
| `docs/user-stories/user-story-001/README.md` | タスク分割を記載 |

## タスク分割の経緯

proxy-serviceをbackground.tsで登録すると、既存のE2Eテストが失敗する問題が発生しました。

### 発生した問題
1. `defineProxyService`がモジュールロード時にブラウザAPIを呼び出す
2. background.tsでのimport時に拡張機能の初期化が影響を受ける
3. DOM置換機能が動作しなくなり、複数のE2Eテストが失敗

### 分割方針

| タスク | スコープ | 状態 |
|--------|----------|------|
| 3d-3a | パッケージ追加、スケルトン実装、DI登録 | ✅ 本PR |
| 3d-3b | ロジック実装、proxy-service統合、E2E修正 | 📋 後続タスク |

## Test plan

- [x] `npm run compile` - TypeScriptコンパイル成功
- [x] `npm run test:unit` - 86ファイル、357テスト全てパス
- [x] `npm run lint` - ESLintエラーなし
- [x] E2Eテスト - 本PRでは統合コードを含まないため既存テストに影響なし

## 関連ドキュメント

- ADR-002: messaging with proxy-service
- ADR-003: 統一されたDB操作アプローチ
- [user-story-001/README.md](./README.md) - タスク分割を記載
