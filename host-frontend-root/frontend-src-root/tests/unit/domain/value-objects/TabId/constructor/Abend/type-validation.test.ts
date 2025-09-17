import { TabId } from 'src/domain/value-objects/TabId';
import { describe, it, expect } from 'vitest';

/**
 * 1. 文字列の場合はエラーをthrowする
 * 2. 文字列数値の場合はエラーをthrowする
 * 3. booleanの場合はエラーをthrowする
 * 4. オブジェクトの場合はエラーをthrowする
 * 5. 配列の場合はエラーをthrowする
 * 6. 関数の場合はエラーをthrowする
 */
describe('TabId.constructor - 型バリデーション', () => {
  it('文字列の場合はエラーをthrowする', () => {
    expect(() => new TabId('1' as any)).toThrow('TabId constructor expected number, but received: string (1)');
  });

  it('文字列数値の場合はエラーをthrowする', () => {
    expect(() => new TabId('123' as any)).toThrow('TabId constructor expected number, but received: string (123)');
  });

  it('booleanの場合はエラーをthrowする', () => {
    expect(() => new TabId(true as any)).toThrow('TabId constructor expected number, but received: boolean (true)');
  });

  it('オブジェクトの場合はエラーをthrowする', () => {
    expect(() => new TabId({} as any)).toThrow('TabId constructor expected number, but received: object ([object Object])');
  });

  it('配列の場合はエラーをthrowする', () => {
    expect(() => new TabId([] as any)).toThrow('TabId constructor expected number, but received: object ()');
  });

  it('関数の場合はエラーをthrowする', () => {
    const func = () => {};
    expect(() => new TabId(func as any)).toThrow('TabId constructor expected number, but received: function');
  });
});
