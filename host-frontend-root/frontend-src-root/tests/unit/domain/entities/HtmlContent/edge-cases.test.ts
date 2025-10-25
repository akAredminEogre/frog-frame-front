import { describe, expect,it } from 'vitest';

import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * HtmlContent - replaceWith エッジケーステスト
 * 1. 不正なHTML（閉じタグなし）をoldStringに指定した場合のエラー回避確認
 */
describe('HtmlContent', () => {
  describe('replaceWith - edge cases', () => {
    it('should accept invalid html as oldString in rule', () => {
      const html = '<div>hello</div>';
      const rule = new RewriteRule(1, '<div', 'hi', '');
      const content = new HtmlContent(html, rule);
      expect(() => content.replace()).not.toThrow();
    });
  });
});
