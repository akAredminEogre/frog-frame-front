# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=02
実装が完了したらPROGRESS-02.mdを追記してコードレビューを依頼してください
## スクラム-02(06回目) の進捗
<!-- ここに進捗を記載 -->

PROGRESS-02-05.mdのレビューコメント「契約的プログラミングで対応したい」に対応完了しました。

具体的な変更内容：
1. **`findContainingElement`メソッドの契約的プログラミング化**：
   - `container.parentElement || document.body` から明示的な null チェックに変更
   - null の場合は `document.body` を直接返却（ユーザー入力提案用途に適した処理）
   ```typescript
   if (!container.parentElement) {
     return document.body;
   }
   return this.findTargetElement(container.parentElement);
   ```

2. **`findTargetElement`メソッドの型安全化**：
   - `let current: Element | null` を `let current: Element` に変更
   - null チェックを明示的に行うよう変更し、parentElement が null の場合は loop を break
   ```typescript
   let current: Element = element;
   while (current !== document.body) {
     if (this.isSuitableAsTarget(current)) {
       return current;
     }
     if (!current.parentElement) {
       break;  // 契約的プログラミング: null の場合は探索終了
     }
     current = current.parentElement;
   }
   ```

3. **設計思想の変更**：
   - 防御的プログラミングから契約的プログラミングへ移行
   - ユーザー入力提案用途に特化した設計に変更
   - 現時点では堅牢性よりもシンプルさを優先

これらの変更により、null 型を完全に排除しつつ、契約的プログラミングの考え方に基づいたクリーンな実装を実現しました。TypeScript コンパイル、全ての単体テスト（215件）、およびESLintチェックが正常に完了していることを確認済みです。

### 修正したファイル

- `src/domain/entities/ElementSelector.ts`

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->


### 本issueの対象外とする課題


### スクラム-02(06回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->

```
  private findContainingElement(range: Range, container: Node): Element {
    if (container.nodeType === Node.TEXT_NODE) {
      // Contract programming: if parentElement is null, use document.body as fallback
      if (!container.parentElement) {
        return document.body;
      }
      return this.findTargetElement(container.parentElement);
    }

    const element = container as Element;
    if (this.isMultiElementSelection(range)) {
      return this.findTargetElement(element);
    }

    const startElement = this.getStartElement(range);
    return this.findTargetElement(startElement);
  }
```
において、
```
      if (!container.parentElement) {
        return document.body;
      }
```
では、なく、
```
      if (!container.parentElement) {
        this.getStartElement(range);
      }
```
としてください。必要であればテストコードの期待値も変更してください。
findTargetElementは
```
  private findTargetElement(element: Element): Element {
    let current: Element | null = element;
    while (current && current !== document.body) {
      if (this.isSuitableAsTarget(current)) {
        return current;
      }
      current = current.parentElement;
    }
    return element; // 見つからなければ元の要素を返す
  }
```
のようにこちらで手動で修正しました。(nullチェックのための文が増えるくらいならElement | nullのままでよいと判断したため)
そのかわりに、契約的プログラミングがわかるように、`private findTargetElement(element: Element): Element {` の引数を非nullにしてください。

---