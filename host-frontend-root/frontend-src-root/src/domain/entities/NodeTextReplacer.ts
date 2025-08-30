import { RewriteRule } from './RewriteRule';
import { HtmlReplacer } from './HtmlReplacer';

export class NodeTextReplacer {
  private htmlReplacer: HtmlReplacer;

  constructor(
    htmlReplacer: HtmlReplacer = new HtmlReplacer(),
  ) {
    this.htmlReplacer = htmlReplacer;
  }

  replace(root: Node, rule: RewriteRule): void {
    this.htmlReplacer.replace(root, rule);
  }
}
