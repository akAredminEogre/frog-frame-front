import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule';

describe('RewriteRule', () => {
  describe('createRedundantPattern', () => {
    it('正規表現パターンの場合は元のパターンに改行コード無視処理を追加する', () => {
      const rule = new RewriteRule('test-id', '<div>.*?</div>', 'replacement', undefined, true);

      const result = rule.createRedundantPattern();

      expect(result).toBe('(?:\\s*)<div>(?:\\s*).*?(?:\\s*)</div>(?:\\s*)');
    });

    it('通常文字列パターンの場合は特殊文字をエスケープして改行コード無視処理を追加する', () => {
      const rule = new RewriteRule('test-id', '<div>Hello World</div>', 'replacement', undefined, false);

      const result = rule.createRedundantPattern();

      expect(result).toBe('(?:\\s*)<div>(?:\\s*)Hello World(?:\\s*)</div>(?:\\s*)');
    });

    it('特殊文字を含む通常文字列の場合は正しくエスケープする', () => {
      const rule = new RewriteRule('test-id', '<div class="test">.*?</div>', 'replacement', undefined, false);

      const result = rule.createRedundantPattern();

      expect(result).toBe('(?:\\s*)<div class="test">(?:\\s*)\\.\\*\\?(?:\\s*)</div>(?:\\s*)');
    });

    it('HTMLタグを含まない通常文字列の場合は特殊文字のエスケープのみ行う', () => {
      const rule = new RewriteRule('test-id', 'Hello.*World', 'replacement', undefined, false);

      const result = rule.createRedundantPattern();

      expect(result).toBe('Hello\\.\\*World');
    });

    it('HTMLタグを含まない正規表現の場合はそのまま返す', () => {
      const rule = new RewriteRule('test-id', 'Hello.*World', 'replacement', undefined, true);

      const result = rule.createRedundantPattern();

      expect(result).toBe('Hello.*World');
    });

    it('空文字列の場合は空文字列を返す', () => {
      const rule = new RewriteRule('test-id', '', 'replacement', undefined, false);

      const result = rule.createRedundantPattern();

      expect(result).toBe('');
    });

    it('isRegexが未定義の場合はfalseとして扱う', () => {
      const rule = new RewriteRule('test-id', '<div>test</div>', 'replacement');

      const result = rule.createRedundantPattern();

      expect(result).toBe('(?:\\s*)<div>(?:\\s*)test(?:\\s*)</div>(?:\\s*)');
    });
  });
});
