import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * TabIdのバリデーション失敗時にCurrentTabが適切にエラーをラップすることを確認
 * バリデーション規約：サブクラス（TabId）の詳細ではなく、成功/失敗パターンのみテスト
 */

const tabIdValidationFailureCases = [
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: undefined },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: null },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: '1' },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: 0 },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: -1 },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: 1.5 },
  { description: 'TabIdバリデーション失敗時にエラーがラップされる', input: NaN }
];

describe('CurrentTab.constructor - TabIdバリデーション失敗', () => {
  tabIdValidationFailureCases.forEach(({ description, input }) => {
    it(`${description} (入力: ${input})`, () => {
      expect(() => new CurrentTab(input as any, 'https://example.com')).toThrow('Failed to create CurrentTab:');
    });
  });
});
