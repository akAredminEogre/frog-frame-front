# 04-arrow-diagram.md ルール

コンポーネント間の依存関係・データフローを ASCII Art 形式で図示するドキュメント。

## 必須セクション

| セクション | 必須 | 説明 |
|-----------|------|------|
| アローダイアグラム | ○ | コンポーネント間の依存関係・データフロー図 |
| 凡例 | ○ | 矢印の意味を説明 |

## 記法ルール

- ASCII Art を使用する
- UML ライクな表記を推奨
- 矢印の意味を凡例で示す
- 依存方向は Clean Architecture の原則に従う(外→内のみ許可)

### 凡例の例

```text
矢印の方向 = 依存の方向(外→内のみ許可)
→ : メソッド呼び出し / データの流れ
..> : 依存(インターフェース経由)
```

## 図の例

```text
[UI Component] → [Controller] → [UseCase] → [Repository Interface]
                                                      ↑
                                              [Repository Impl]
```

## 影響ドキュメント

`04-arrow-diagram.md` は以下のドキュメントと整合性を保つこと:

- `01-class-design.md`(クラス間の関係と一致すること)
- `03-directory-structure.md`(ディレクトリ配置と一致すること)
