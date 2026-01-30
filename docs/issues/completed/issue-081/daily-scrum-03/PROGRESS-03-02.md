# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=03
実装が完了したらPROGRESS-03-02.mdを追記してコードレビューを依頼してください
## スクラム-03(02回目) の進捗
<!-- ここに進捗を記載 -->

### 実施内容

レビューコメントへの対応を行いました。

#### 1. README.mdについて

ユーザー側で既に調整済みのため、こちらでの修正は不要です。

#### 2. ライセンスについての説明

Chrome拡張機能を公開する際のライセンスについて説明します。

##### ライセンスを記述する意図

1. **利用条件の明示**: ソフトウェアを他の人が使用・改変・配布する際の条件を明確にします
2. **法的保護**: 作者の権利を保護し、責任範囲を明確にします
3. **オープンソースコミュニティへの貢献**: 他の開発者がコードを参考にしたり、改良したりできるようにします
4. **Chrome Web Storeの要件**: 公開する際、ライセンス情報の記載が推奨されます

##### 主なライセンスの違い

**MIT ライセンス（最も自由度が高い）**
- ✅ 商用利用可能
- ✅ 改変可能
- ✅ 配布可能
- ✅ サブライセンス可能
- ⚠️ 著作権表示とライセンス表示が必須
- ⚠️ 無保証（作者は一切の責任を負わない）
- 👍 企業でも個人でも使いやすい、最もシンプル

**Apache License 2.0**
- MIT と同様の権利
- ➕ 特許権の明示的な許諾
- ➕ 商標権の保護
- ⚠️ 変更箇所の明記が必要

**GPL v3（コピーレフト型）**
- ✅ 商用利用可能
- ✅ 改変可能
- ⚠️ 派生物も GPL で公開する必要がある（強い相互性）
- 👍 オープンソースを維持したい場合に適している
- 👎 企業の商用利用には不向きな場合がある

**プロプライエタリ（独占的）**
- ⚠️ ソースコードを非公開にできる
- ⚠️ 利用条件を自由に設定できる
- 👎 オープンソースコミュニティからの貢献は期待できない

##### Chrome拡張機能での推奨

Chrome拡張機能の場合、以下の理由から **MIT ライセンス** が最も一般的です：

1. **シンプル**: 理解しやすく、管理が容易
2. **広く受け入れられている**: 多くの企業や個人が安心して使える
3. **柔軟**: 商用利用も可能で、将来の選択肢を狭めない
4. **Chrome Web Store との相性**: 特に制限がなく、審査もスムーズ

##### 実装する場合の例

```markdown
## License

MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

別途 `LICENSE` ファイルとしてプロジェクトルートに配置することも一般的です。

### 修正したファイル

なし（コード修正は不要）

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

- ライセンスの正式決定と追加（ユーザーの判断後）

### 本issueの対象外とする課題

特になし

### スクラム-03(02回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド workflow:daily-scrum-pass-review-scrum -->
ありがとうございます。MITライセンスを使用して、chromeウェブストアに公開したいと思います。
---
