import { RewriteRule } from './RewriteRule';
import { ReplacementValue } from '../value-objects/ReplacementValue';
import { TextReplacer } from './TextReplacer';
import { HtmlReplacer } from './HtmlReplacer';

export class NodeTextReplacer {
  private textReplacer: TextReplacer;
  private htmlReplacer: HtmlReplacer;

  constructor(
    textReplacer: TextReplacer = new TextReplacer(),
    htmlReplacer: HtmlReplacer = new HtmlReplacer(),
  ) {
    this.textReplacer = textReplacer;
    this.htmlReplacer = htmlReplacer;
  }

  replace(root: Node, rule: RewriteRule): void {
    const replacementValue = new ReplacementValue(rule.oldString);

    if (replacementValue.isHtml()) {
      this.htmlReplacer.replace(root, rule);
    } else {
      this.textReplacer.replace(root, rule);
    }
  }
}
