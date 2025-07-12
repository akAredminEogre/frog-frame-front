import { RewriteRule } from './RewriteRule';
import { HtmlString } from '../value-objects/HtmlString';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): number {
    const rootElement = root as Element;

    if (!rootElement.innerHTML) {
      return 0;
    }

    let oldHtml: HtmlString;
    let newHtml: HtmlString;
    try {
      oldHtml = new HtmlString(rule.oldString);
      newHtml = new HtmlString(rule.newString);
    } catch (error) {
      // oldString or newString is invalid, so no replacement is possible.
      return 0;
    }

    const originalHtml = rootElement.innerHTML;
    const regex = new RegExp(oldHtml.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    let matchCount = 0;
    const replacedHtml = originalHtml.replace(regex, (match) => {
      matchCount++;
      return newHtml.toString();
    });

    if (originalHtml === replacedHtml) {
      return 0;
    }

    rootElement.innerHTML = replacedHtml;

    return matchCount;
  }
}
