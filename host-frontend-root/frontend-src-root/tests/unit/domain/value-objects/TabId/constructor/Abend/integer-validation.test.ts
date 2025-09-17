import { TabId } from 'src/domain/value-objects/TabId';
import { describe, it, expect } from 'vitest';

/**
 * 1. 小数の場合のエラー処理
 * 2. 負の小数の場合のエラー処理
 * 3. NaNの場合のエラー処理
 * 4. Infinityの場合のエラー処理
 * 5. -Infinityの場合のエラー処理
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
