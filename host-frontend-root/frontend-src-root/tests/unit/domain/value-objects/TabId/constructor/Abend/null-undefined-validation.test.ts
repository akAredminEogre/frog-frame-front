import { describe, expect,it } from 'vitest';

import { TabId } from 'src/domain/value-objects/TabId';

/**
 * 1. undefinedの場合はエラーをthrowする
 * 2. nullの場合はエラーをthrowする
 */
describe('TabId.constructor - null/undefinedバリデーション', () => {
  it('undefinedの場合はエラーをthrowする', () => {
    expect(() => new TabId(undefined as any)).toThrow('TabId constructor received invalid value: undefined');
  });

  it('nullの場合はエラーをthrowする', () => {
    expect(() => new TabId(null as any)).toThrow('TabId constructor received invalid value: null');
  });
});
