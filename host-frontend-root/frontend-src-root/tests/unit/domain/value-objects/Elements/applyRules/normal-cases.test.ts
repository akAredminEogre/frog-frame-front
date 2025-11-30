import { describe, expect, it, vi } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';

/**
 * Elements.applyRules - 正常系テスト
 *
 * 1. 各要素に対して非同期でルール適用関数を実行する
 * 2. 空のElementsの場合は何も実行しない
 * 3. 複数の要素がある場合、順番に実行する
 */
describe('Elements.applyRules - 正常系', () => {
  it('should execute apply function for each element', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const elements = new Elements();
    elements.addElement(element1);
    elements.addElement(element2);

    const applyRule = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.applyRules(applyRule);

    // Assert
    expect(applyRule).toHaveBeenCalledTimes(2);
    expect(applyRule).toHaveBeenCalledWith(element1);
    expect(applyRule).toHaveBeenCalledWith(element2);
  });

  it('should not execute apply function when empty', async () => {
    // Arrange
    const elements = new Elements();
    const applyRule = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.applyRules(applyRule);

    // Assert
    expect(applyRule).not.toHaveBeenCalled();
  });

  it('should execute apply function sequentially', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const elements = new Elements();
    elements.addElement(element1);
    elements.addElement(element2);

    const callOrder: Element[] = [];
    const applyRule = vi.fn().mockImplementation(async (el: Element) => {
      callOrder.push(el);
    });

    // Act
    await elements.applyRules(applyRule);

    // Assert
    expect(callOrder).toEqual([element1, element2]);
  });
});
