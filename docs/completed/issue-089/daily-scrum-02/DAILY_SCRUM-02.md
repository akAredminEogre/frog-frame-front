# DAILY SCRUM-02回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
- 未使用コードの扱いに関する改善案を検討し、最適なアプローチを決定する

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
なし（検討・設計タスクのため）

## スクラム内残タスク
- [ ] スクラム01の調査結果を基に、複数の改善案を洗い出す
- [ ] 各改善案のメリット・デメリットを分析する
- [ ] 開発体験（DX）と品質保証のバランスを考慮した評価を行う
- [ ] 最適なアプローチを決定し、実装計画を立案する
- [ ] 決定した改善案をPLAN.mdに反映する

## 相談事項
<!-- workflow:01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-discussion-then-start-coding.md-->

改善案の検討において、ISSUE.mdに記載されている「アイデア出し」以外の選択肢も含めて提案します。開発者の運用スタイルや、このプロジェクトの開発フローに最も適したアプローチについて、検討結果を確認していただき、フィードバックをいただけると助かります。

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
調査結果が整理されているので、良い改善案を考えられそうです。開発者との対話を通じて、最適な解決策を見つけていきたいと思います。

# DAILY SCRUM-02作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

スクラム02では、未使用コード検出の扱いに関する改善案を検討し、最終的に`test-and-check`スクリプトを新設しました。これにより、粒度の細かいPRを実現しつつ、コード品質を維持する運用が可能になりました。

### 実施内容の詳細

1. **改善案の検討と決定（01回目）**
   - 5つの改善案を比較検討
   - 案4（段階的なワークフロー）を推奨案として決定
   - 実装計画（3フェーズ）を策定

2. **運用方針の再検討（02回目）**
   - レビューコメントに基づき、issue運用の見直しを検討
   - 案6（issue運用変更）と案7（現状運用維持）を提案
   - 開発者との対話により方針を決定

3. **test-and-checkスクリプトの実装（03-04回目）**
   - 当初test-and-lintを修正したが、最終的に新スクリプトとして分離
   - `test-and-check`: 警告レベルで実行（lint/knip/tsrが失敗しても継続）
   - `test-and-lint`: 厳格モードを維持（既存運用）

4. **.clinerulesワークフローの更新（05-06回目）**
   - `.clinerules`内のtest-and-lint参照をtest-and-checkに変更
   - ファイル名を`test-and-check-before-complete.md`に変更
   - 関連する参照箇所をすべて更新

### 最終的な実装内容

**package.jsonのスクリプト:**
- `test-and-check`: 単体テスト必須、lint系は警告レベル（新設）
- `test-and-lint`: 全チェック厳格実行（既存維持）

**.clinerulesの更新:**
- デイリースクラム完了時: `test-and-check`を使用
- issue完了時: `test-and-lint`を使用（従来通り）

## 修正したファイル

- `frog-frame-front/docs/issue-089/PLAN.md`
  - 改善案の詳細分析を追加（01回目）
  - 案6と案7の検討内容を追加（02回目）
- `frog-frame-front/host-frontend-root/frontend-src-root/package.json`
  - test-and-checkスクリプトを新設（04回目）
  - test-and-lintを元の厳格形式に戻した（04回目）
- `frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/test-and-lint-before-complete.md`
  - test-and-lintをtest-and-checkに変更（05回目）
  - ファイル名をtest-and-check-before-complete.mdに変更（06回目）
- `frog-frame-front/.clinerules/05-project-specific-rules.md`
  - test-and-lintをtest-and-checkに変更（05回目）
- `frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:code-according-to-the-rules.md`
  - 参照をtest-and-check-before-completeに更新（06回目）
