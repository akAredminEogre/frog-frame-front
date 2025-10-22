# 概要
<!-- このチケットで解決したい課題 -->
package.jsonの
```
    "test:unit": "vitest --run",
    "test:e2e": "npx playwright install chromium && playwright test",
    "test:all": "npm run test  && npm run test:e2e",
    "test:lint": "npm run unused:complete && npm run test:all && npm run knip:all && echo 'recursive test passed and knip passed, so no unused code remains!' || (echo 'Either tests or knip found issues. Please address them.' && exit 1)",
    "test:check": "npm run compile && npm run test && npm run test:e2e && (npm run knip:all || true) && (npm run tsr:check || true) && (npm run lint || true) && echo 'Test-and-check completed. Check lint/knip/tsr warnings above if any.'"
  },
```
の部分を修正したので、これらのmakeコマンドを生成して。またドキュメントの該当部分も修正してください。


## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->