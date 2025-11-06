import { describe, expect,it } from 'vitest';

import { TabId } from 'src/domain/value-objects/TabId';

/**
 * 1. 小数の場合はエラーをthrowする
 * 2. 負の小数の場合はエラーをthrowする
 * 3. NaNの場合はエラーをthrowする
 * 4. Infinityの場合はエラーをthrowする
 * 5. -Infinityの場合はエラーをthrowする
 */
describe('TabId.constructor - 整数バリデーション', () => {
  it('小数の場合はエラーをthrowする', () => {
    expect(() => new TabId(1.5)).toThrow('Tab ID must be an integer');
  });

  it('負の小数の場合はエラーをthrowする', () => {
    expect(() => new TabId(-1.5)).toThrow('Tab ID must be an integer');
  });

  it('NaNの場合はエラーをthrowする', () => {
    expect(() => new TabId(NaN)).toThrow('Tab ID must be an integer');
  });

  it('Infinityの場合はエラーをthrowする', () => {
    expect(() => new TabId(Infinity)).toThrow('Tab ID must be an integer');
  });

  it('-Infinityの場合はエラーをthrowする', () => {
    expect(() => new TabId(-Infinity)).toThrow('Tab ID must be an integer');
  });
});
