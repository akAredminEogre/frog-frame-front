import { TabId } from 'src/domain/value-objects/TabId';
import { describe, it, expect } from 'vitest';

/**
 * 1. 正の整数での正常なインスタンス作成
 * 2. 大きな正の整数での正常なインスタンス作成
 */
describe('TabId.constructor - 正常系', () => {
  it('正の整数で正常にインスタンスを作成できる', () => {
    const tabId = new TabId(1);
    expect(tabId.value).toBe(1);
  });

  it('大きな正の整数で正常にインスタンスを作成できる', () => {
    const tabId = new TabId(999999);
    expect(tabId.value).toBe(999999);
  });
});
