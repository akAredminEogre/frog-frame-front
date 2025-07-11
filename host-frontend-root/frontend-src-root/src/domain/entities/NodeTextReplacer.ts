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

  replace(root: Node, rule: RewriteRule): number {
    const replacementValue = new ReplacementValue(rule.oldString);

    if (replacementValue.isHtml()) {
      return this.htmlReplacer.replace(root, rule);
    } else {
      return this.textReplacer.replace(root, rule);
    }
  }
}
