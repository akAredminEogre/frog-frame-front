/**
 * RewriteRule.fromPlainObject - バリデーションエラーテスト
 * 配列形式でまとめた不正入力のテストケース
 */
import { describe, expect,it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.fromPlainObject - バリデーションエラー', () => {
  const invalidInputs = [
    { value: null, description: 'null' },
    { value: undefined, description: 'undefined' },
    { value: {}, description: '空オブジェクト' },
    { value: 'not an object', description: '文字列' },
    { value: 123, description: '数値' },
    { value: true, description: '真偽値' },
    { value: [], description: '配列' },
    { value: new Date(), description: 'Dateオブジェクト' },
  ];

  it.each(invalidInputs)('should throw error for $description input', ({ value }) => {
    expect(() => {
      RewriteRule.fromPlainObject(value);
    }).toThrow();
  });
});
