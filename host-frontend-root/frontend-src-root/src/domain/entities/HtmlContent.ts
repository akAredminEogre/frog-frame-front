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
    const oldString = rule.oldString;
    const newString = rule.newString;

    const regex = rule.isRegex
      ? new RegExp(oldString, 'gs')
      : new RegExp(oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    const matches = [...this.originalHtml.matchAll(regex)];
    const matchCount = matches.length;

    if (matchCount === 0) {
      return new ReplaceResult(this.originalHtml, 0);
    }
    
    // The native replace method handles back-references like $1 automatically.
    const replacedHtml = this.originalHtml.replace(regex, newString);

    return new ReplaceResult(replacedHtml, matchCount);
  }
}
