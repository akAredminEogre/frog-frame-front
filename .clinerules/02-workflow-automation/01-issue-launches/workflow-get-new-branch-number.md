workflow-get-new-branch-number
```cline-instructions
issue番号の採番ロジック：

1. ブランチ情報を最新化し、全ブランチを取得
```bash
git fetch --prune origin
```

2. ローカル、origin、claudeの全ブランチからissue-で始まるブランチを取得し、最大の番号を見つける
```bash
git --no-pager branch -a | grep -E '(^|/)issue-[0-9]+' | sed -E 's/.*issue-([0-9]+).*/\1/' | sort -n | tail -n 1
```

3. 最大番号に+1して3桁にフォーマット
   - 最大番号が見つからなければ001から開始
   - 例: 最大が086なら、新規番号は087

4. 番号の重複チェックと確定
```bash
# nnnを新しい番号（3桁）として、以下のコマンドで既存ブランチがないことを確認
git --no-pager branch -a | grep -E "(^|/)issue-nnn(-|$)" | head -n 1
```
   - 上記コマンドで結果が空なら、その番号を使用
   - 結果があれば、番号を+1して再度チェック（空になるまで繰り返す）

5. 確定した番号を3桁の文字列として出力
   - 例: "087", "001", "123"

出力形式：
- 変数 `nnn` に3桁の番号を格納して後続処理で使用する
```
