import { RewriteRule } from './RewriteRule';
import { ChildNodeList } from '../value-objects/ChildNodeList';
import { HtmlContent } from './HtmlContent';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): number {
    const rootElement = root as Element;
    if (!rootElement.innerHTML) {
      return 0;
    }

    const content = new HtmlContent(rootElement.innerHTML);
    const result = content.replaceWith(rule);

    if (result.matchCount === 0) {
      return 0;
    }

    const htmlParserContainer = document.createElement('div');
    htmlParserContainer.innerHTML = result.replacedHtml;

    ChildNodeList.clearAllFrom(rootElement);

    const childNodes = new ChildNodeList(htmlParserContainer.childNodes);
    childNodes.appendAllTo(rootElement);

    return result.matchCount;
  }
}
