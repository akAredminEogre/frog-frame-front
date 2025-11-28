import { describe, expect, it, vi } from 'vitest';

import { AddedNodes } from 'src/domain/value-objects/AddedNodes/AddedNodes';

/**
 * AddedNodes.forEachElement - 正常系テスト
 *
 * 1. Element要素に対してコールバックを実行する
 * 2. 非Element要素（テキストノード等）は無視する
 */
describe('AddedNodes.forEachElement - 正常系', () => {
  it('should call callback for Element nodes', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);
    const addedNodes = new AddedNodes(nodeList);
    const callback = vi.fn();

    // Act
    addedNodes.forEachElement(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(element);
  });

  it('should ignore non-Element nodes', () => {
    // Arrange
    const textNode = document.createTextNode('test');
    const nodeList = [textNode] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([textNode]);
    const addedNodes = new AddedNodes(nodeList);
    const callback = vi.fn();

    // Act
    addedNodes.forEachElement(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  it('should process only Element nodes from mixed list', () => {
    // Arrange
    const element = document.createElement('span');
    const textNode = document.createTextNode('text');
    const nodes = [textNode, element];
    const nodeList = nodes as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind(nodes);
    const addedNodes = new AddedNodes(nodeList);
    const callback = vi.fn();

    // Act
    addedNodes.forEachElement(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(element);
  });
});
