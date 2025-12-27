# 01-class-design.md ルール

Clean Architecture 4層に従った**理論的設計**を記載するドキュメント。

## 必須セクション

| セクション | 必須 | 説明 |
|-----------|------|------|
| 制御フロー | ○ | 処理の流れを示す図 |
| クラス一覧 | ○ | クラスと責務の表 |
| クラス図 | ○ | クラス間の関係を示す図 |
| 影響ドキュメント | ○ | 影響を受けるドキュメント一覧 |

**重要**: 既存実装に引っ張られず、Clean Architecture原則に基づいて設計する
- 既存クラスの現在位置は考慮しない
- 「あるべき層」にクラスを配置する

### クラス一覧
各層ごとにセクションを分け、下記の表に従って記載する:

**記述ルール**:
- クラス単位の責務の記述に留め、扱う値や型の詳細な記述はしない

例：
```markdown
## クラス一覧

### enterprise-business-rules (第1層)
| クラス | 責務 |
|---------------------|------|
| RewriteRule         | ルールエンティティ。URLマッチ判定や状態変更を担当。 |

```

## インターフェースの層配置ルール

**依存性ルール**: 内側の層は外側の層に依存してはならない

インターフェースは「それを使用する層」に配置する（実装する層ではない）:

| インターフェース種別 | 配置層 | 理由 |
|---------------------|--------|------|
| Input Port（例: IToggleRuleActiveUseCase） | application-business-rules (第2層) | Controller (第3層) が依存 |
| Output Port（例: IToggleRuleActivePresenter） | application-business-rules (第2層) | Interactor (第2層) が依存 |
| Gateway Interface（例: IRewriteRuleRepository, ITabsGateway） | application-business-rules (第2層) | Interactor (第2層) が依存 |

**誤りやすいパターン**:
- ❌ Gateway Interface を interface-adapters (第3層) に配置 → Interactor が外側の層に依存してしまう
- ✅ Gateway Interface を application-business-rules (第2層) に配置 → 依存性ルールを遵守

## 設計と実装の分離

- **コード例は記載しない**（実装は実際のソースコードが正）
- 設計書は「構造」と「責務」を示す
- 実装の詳細はソースコードを参照

| 記載する | 記載しない |
|----------|-----------|
| クラス名と責務 | 完全なコード例 |
| メソッドの目的 | メソッドの実装 |
| クラス間の関係 | import文 |

## 影響ドキュメント

`01-class-design.md` が変更された際には、以下のドキュメントも更新が必要：
- `02-sequence.puml`
