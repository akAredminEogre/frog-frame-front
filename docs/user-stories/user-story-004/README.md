# User Story 004: モックファクトリ配置規約への準拠

## ストーリー

> テストコードの保守性向上のため、モックファクトリを規約に準拠した配置に統一する

## 概要

現在、一部のモックファクトリが `mocks/` ディレクトリに配置されておらず、[basic-rule.md](../../coding-standards/tests/unit/common-rule/basic-rule.md) の「モック作成の分離ルール」に準拠していない。これらを規約に準拠した配置に移動し、参照しているテストファイルのインポートパスを更新する。

## 対象ファイル

| 現在のパス | 移動先 |
|-----------|--------|
| `tests/unit/application/ports/IChromeTabsService/createMockTabsService.ts` | `tests/unit/application/ports/IChromeTabsService/mocks/` |
| `tests/unit/application/ports/ICurrentUrlService/createMockCurrentUrlService.ts` | `tests/unit/application/ports/ICurrentUrlService/mocks/` |
| `tests/unit/application/ports/IPopupService/createMockPopupService.ts` | `tests/unit/application/ports/IPopupService/mocks/` |
| `tests/unit/application/ports/ISelectedPageTextRepository/createMockSelectedPageTextRepository.ts` | `tests/unit/application/ports/ISelectedPageTextRepository/mocks/` |
| `tests/unit/domain/ports/IDomRootChecker/createMockDomRootChecker.ts` | `tests/unit/domain/ports/IDomRootChecker/mocks/` |
| `tests/unit/domain/ports/IElementFactory/createMockElementFactory.ts` | `tests/unit/domain/ports/IElementFactory/mocks/` |
| `tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway.ts` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/` |

## タスク

### Phase 1: モックファクトリの移動

各モックファクトリを `mocks/` サブディレクトリに移動する。

- [x] `createMockTabsService.ts` を移動
- [x] `createMockCurrentUrlService.ts` を移動
- [x] `createMockPopupService.ts` を移動
- [x] `createMockSelectedPageTextRepository.ts` を移動
- [x] `createMockDomRootChecker.ts` を移動
- [x] `createMockElementFactory.ts` を移動
- [x] `createMockTabsGateway.ts` を移動

### Phase 2: インポートパスの更新

各モックファクトリを参照しているテストファイルのインポートパスを更新する。

- [x] 各モックファクトリの参照箇所を特定
- [x] インポートパスを新しいパスに更新
- [x] テストが正常に動作することを確認

### Phase 3: ドキュメント更新

- [x] `basic-rule.md` から未対応モック一覧を削除（すべて対応完了後）

## 受け入れ条件

- [x] すべてのモックファクトリが `mocks/` ディレクトリに配置されている
- [x] すべてのテストが正常に動作する
- [x] `basic-rule.md` の未対応モック一覧が空になっている
