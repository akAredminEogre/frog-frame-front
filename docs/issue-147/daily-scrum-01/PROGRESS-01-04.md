# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01.mdを追記してコードレビューを依頼してください
## スクラム-01(04回目) の進捗
<!-- ここに進捗を記載 -->

レビューコメント「DomDiffer.tsのimport修正を切り離そうと思います。先にやるのと、後にやるのどちらがよいでしょうか。あるいは影響範囲的に切り離すのが難しい場合はご指摘ください」に対する技術的分析を実施しました。

### DomDiffer.ts分離可能性の技術的分析結果

#### 1. 依存関係分析

**DomDiffer.tsの依存関係:**
- import元: `ElementMatchesFlexiblePattern`, `ReplaceElementPreservingState`, `RewriteRule`, `MatchingElements`
- 現在の状態: `RewriteRule`のimportは既に`enterprise-business-rules`層に更新済み ✓

**DomDiffer.tsの消費者:**
- `RewriteRules.ts` (`applyRulesWithDomDiffer`メソッドでDomDifferを直接インスタンス化)
- テストファイル6個（DomDiffer関連テスト）

#### 2. 分離影響度評価

**技術的課題:**
1. **密結合**: `RewriteRules.applyRulesWithDomDiffer()` → `DomDiffer` → `RewriteRule`の依存チェーンが密結合
2. **不整合状態**: `RewriteRules`が新RewriteRuleパスをimportする一方、`DomDiffer`が旧パスを参照すると依存関係の整合性が崩れる
3. **ドメイン層の凝集性**: `DomDiffer`と`RewriteRules`は共にコアドメイン概念で、同時移行が適切

#### 3. 推奨事項

**結論: DomDiffer.tsの分離は技術的に推奨しません**

**理由:**
- アーキテクチャ整合性: `RewriteRules` ↔ `DomDiffer` ↔ `RewriteRule`の三角依存が密結合
- 不完全状態の回避: import文の不整合による中間状態を避ける必要
- ドメインコンセプト保全: 書き換えルール適用という単一責務の維持

#### 4. 代替アプローチ

**オプション1: 現行PR1維持** (推奨)
- 範囲: 7ドメイン層ファイル + RewriteRule.ts
- メリット: アーキテクチャ的に整合性保持
- デメリット: 変更範囲が比較的大きい

**オプション2: 最小PR1**
- 範囲: RewriteRule.ts + enterprise-business-rules層のみ
- メリット: 変更範囲を最小化
- デメリット: ドメイン層が一時的に不整合状態

**オプション3: 全ドメイン層変更を後続PRに延期**
- 範囲: RewriteRule.ts移動のみ、ドメイン層import変更はPR2で実施
- メリット: PR1の範囲を大幅削減
- デメリット: ドメイン層の整合性確保がPR2まで延期

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->
<!-- 課題があれば、docs/issue-nnn/PLAN.md の `# DAILY-SCRUM単位のタスク` に追加してください -->

選択されたアプローチに基づく実装作業

### 本issueの対象外とする課題
<!-- 課題があれば、docs/issue-nnn/PLAN.md の `# 本issueの対象外とする課題` に追加してください -->

なし

### スクラム-01(04回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
分析ありがとうございます。であれば、RewriteRules ↔ DomDiffer ↔
  RewriteRuleだけ先に行い、それ以外のenterprise-business-rules層のファイルは後続に回すやりかたについて分析をお願いします
---