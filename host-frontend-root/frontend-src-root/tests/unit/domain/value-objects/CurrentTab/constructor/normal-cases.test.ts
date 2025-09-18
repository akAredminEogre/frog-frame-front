import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * 1. 正の整数での正常なインスタンス作成
 * 2. 大きな正の整数での正常なインスタンス作成
 */
describe('CurrentTab.constructor - 正常系', () => {
  it('正の整数で正常にインスタンスを作成できる', () => {
    const currentTab = new CurrentTab(1);
    expect(currentTab.getTabId().value).toBe(1);
  });
});
