import { TabId } from 'src/domain/value-objects/TabId';
import { describe, it, expect } from 'vitest';

/**
 * 1. 0の場合はエラーをthrowする
 * 2. 負の整数の場合はエラーをthrowする
 * 3. 大きな負の整数の場合はエラーをthrowする
 */
describe('TabId.constructor - 正の数バリデーション', () => {
  it('0の場合はエラーをthrowする', () => {
    expect(() => new TabId(0)).toThrow('Tab ID must be positive');
  });

  it('負の整数の場合はエラーをthrowする', () => {
    expect(() => new TabId(-1)).toThrow('Tab ID must be positive');
  });

  it('大きな負の整数の場合はエラーをthrowする', () => {
    expect(() => new TabId(-999999)).toThrow('Tab ID must be positive');
  });
});
