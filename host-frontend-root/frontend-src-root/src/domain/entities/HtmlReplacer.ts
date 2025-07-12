import { RewriteRule } from './RewriteRule';
import { HtmlString } from '../value-objects/HtmlString';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): number {
    let oldHtml: HtmlString;
    let newHtml: HtmlString;
    try {
      oldHtml = new HtmlString(rule.oldString);
      newHtml = new HtmlString(rule.newString);
    } catch (error) {
      // oldString or newString is invalid, so no replacement is possible.
      return 0;
    }

    const rootElement = root as Element;

    if (!rootElement.innerHTML) {
      return 0;
    }

    const originalHtml = rootElement.innerHTML;
    const replacedHtml = originalHtml.split(oldHtml.toString()).join(newHtml.toString());

    if (originalHtml === replacedHtml) {
      return 0;
    }

    rootElement.innerHTML = replacedHtml;

    // `split`と`join`による置換回数は、`split`後の配列の長さ - 1 で計算できる
    return originalHtml.split(oldHtml.toString()).length - 1;
  }
}
