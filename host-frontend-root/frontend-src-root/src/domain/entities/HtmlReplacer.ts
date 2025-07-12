import { RewriteRule } from './RewriteRule';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): number {
    const { oldString, newString } = rule;
    const rootElement = root as Element;

    if (!rootElement.innerHTML) {
        return 0;
    }

    const originalHtml = rootElement.innerHTML;
    rootElement.innerHTML = originalHtml.split(oldString).join(newString);
    
    if (originalHtml === rootElement.innerHTML) {
        return 0;
    }

    // innerHTMLの置換では、正確な置換回数を数えるのは難しいので、
    // 変更があった場合は1を返すことにする。
    // 厳密な置換回数が必要な場合は、より高度なDOM操作が必要。
    return (originalHtml.match(new RegExp(oldString, 'g')) || []).length;
  }
}
