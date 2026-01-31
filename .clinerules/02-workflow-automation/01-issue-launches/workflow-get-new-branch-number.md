workflow-get-new-branch-number
````cline-instructions
issue番号の採番ロジック：

以下のスクリプトを実行して新しいissue番号を取得する：
```bash
nnn=$(scripts/.clinerules/get-new-issue-number.sh)
```

スクリプトの動作：
1. ブランチ情報を最新化（git fetch --prune origin）
2. ローカル、origin、claudeの全ブランチからissue-で始まるブランチを検索
3. 最大番号に+1して3桁にフォーマット（最大番号が見つからなければ0に設定し、+1して001から開始）
4. 重複チェックを行い、空いている番号を確定

オプション：
- 特定番号の存在チェック: `scripts/.clinerules/get-new-issue-number.sh --check 155`
  - 結果: "exists" または "available"

出力形式：
- 3桁の番号を標準出力に出力（例: "087", "001", "123"）
- 変数 `nnn` に格納して後続処理で使用する
````
