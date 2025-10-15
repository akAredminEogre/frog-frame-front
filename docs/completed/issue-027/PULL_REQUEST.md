# ISSUE-027 PULL REQUEST

## タイトル
右クリック時のテーブルDOM選択修正：table全体からtr要素選択への変更

## 概要と理由
テーブル内のテキスト選択時に、拡張機能の「この要素を置換」機能で`table`要素全体が選択されてしまう問題を修正しました。本来は選択されたテキストを含む`tr`要素が選択されるべきです。

### 修正前の動作
```html
<!-- table全体が選択されてしまう -->
<table class="hoge">
  <tbody>
    <tr>
      <th><span>"商品番号""："</span></th>
      <td><span>moge-1234</span></td>
    </tr>
  </tbody>
</table>
```

### 修正後の動作
```html
<!-- tr要素のみが選択される -->
<tr>
  <th><span>"商品番号""："</span></th>
  <td><span>moge-1234</span></td>
</tr>
```

## 主な変更点
- **ElementSelector.tsの機能拡張**
  - `isTableElement`メソッド：テーブル関連要素の判定ロジック追加
  - `isWithinTable`メソッド：要素がテーブル内にあるかの判定ロジック追加
  - `isSuitableAsTarget`メソッド：テーブル内では`tr`要素を優先選択するロジック追加
  - `findTargetElement`メソッド：テーブル内探索時の適切な停止条件追加

- **包括的なテストケース実装**
  - テーブル要素判定のテスト（table、tr、td、th、tbody、thead、tfoot）
  - テーブル内要素検出のテスト
  - テーブル内要素選択の統合テスト（26テストケース）

## テスト方法
1. **単体テストの実行**
   ```bash
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose exec frontend npm test
   ```
   - 全26テストケースがパスすることを確認

2. **Lint・未使用コードチェック**
   ```bash
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose exec frontend npm run lint
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose exec frontend npm run unused:check
   ```

3. **動作確認**
   - テーブルを含むWebページでテキスト選択
   - 右クリック→「この要素を置換」選択
   - 置換前フォームに`tr`要素のHTMLが表示されることを確認

## 補足
- 既存のDOM選択ロジックには影響しないよう、テーブル内の場合のみ特別処理を適用
- テーブル外の要素選択動作は従来通り維持
- TypeScriptの型安全性を保ちながら実装
- 複雑なネストしたテーブル構造にも対応
- テスト駆動開発により品質を確保し、継続的な保守性を向上
