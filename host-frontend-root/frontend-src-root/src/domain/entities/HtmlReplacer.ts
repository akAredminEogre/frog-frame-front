import { RewriteRule } from './RewriteRule/RewriteRule';
import { ChildNodeList } from '../value-objects/ChildNodeList';
import { HtmlContent } from './HtmlContent';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): void {
    const rootElement = root as Element;
    if (!rootElement.innerHTML) {
      return;
    }

    const content = new HtmlContent(rootElement.innerHTML, rule);
    const result = content.replace();

    if (result.replacedHtml === rootElement.innerHTML) {
      return;
    }

    const htmlParserContainer = document.createElement('div');
    htmlParserContainer.innerHTML = result.replacedHtml;

    ChildNodeList.clearAllFrom(rootElement);

    const childNodes = new ChildNodeList(htmlParserContainer.childNodes);
    childNodes.appendAllTo(rootElement);
  }
}
