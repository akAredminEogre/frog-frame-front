import { HtmlString } from '../value-objects/HtmlString';
import { RewriteRule } from './RewriteRule';

export class ReplaceResult {
  constructor(
    public readonly replacedHtml: string,
    public readonly matchCount: number,
  ) {}
}

export class HtmlContent {
  private readonly originalHtml: string;

  constructor(html: string) {
    this.originalHtml = html;
  }

  public replaceWith(rule: RewriteRule): ReplaceResult {
    const oldHtml = new HtmlString(rule.oldString);
    const newHtml = new HtmlString(rule.newString);

    const regex = new RegExp(oldHtml.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    let matchCount = 0;
    const replacedHtml = this.originalHtml.replace(regex, () => {
      matchCount++;
      return newHtml.toString();
    });

    return new ReplaceResult(replacedHtml, matchCount);
  }
}
