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
      ? new RegExp(oldString, 'g')
      : new RegExp(oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    let matchCount = 0;
    const replacedHtml = this.originalHtml.replace(regex, (...args) => {
      matchCount++;
      // newString内の$1, $2などを後方参照で置換する
      return newString.replace(/\$(\d)/g, (_, index) => {
        return args[index] || '';
      });
    });

    return new ReplaceResult(replacedHtml, matchCount);
  }
}
