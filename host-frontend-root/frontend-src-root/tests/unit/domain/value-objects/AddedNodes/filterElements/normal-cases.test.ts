import { describe, expect, it } from 'vitest';

import { AddedNodes } from 'src/domain/value-objects/AddedNodes/AddedNodes';

/**
 * AddedNodes.filterElements - 正常系テスト
 *
 * 1. Element要素のみを抽出して配列として返す
 * 2. Text nodeなどの非Element要素は除外する
 * 3. 空のNodeListの場合は空配列を返す
 */
describe('AddedNodes.filterElements - 正常系', () => {
  it('should return array containing only Element nodes', () => {
    // Arrange
    const element = document.createElement('div');
    const textNode = document.createTextNode('test');
    const nodeList = [element, textNode] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element, textNode]);
    const addedNodes = new AddedNodes(nodeList);

    // Act
    const result = addedNodes.filterElements();

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(element);
  });

  it('should return empty array when no Element nodes exist', () => {
    // Arrange
    const textNode = document.createTextNode('test');
    const nodeList = [textNode] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([textNode]);
    const addedNodes = new AddedNodes(nodeList);

    // Act
    const result = addedNodes.filterElements();

    // Assert
    expect(result).toHaveLength(0);
  });

  it('should return all Element nodes from multiple elements', () => {
    // Arrange
    const div = document.createElement('div');
    const span = document.createElement('span');
    const nodeList = [div, span] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([div, span]);
    const addedNodes = new AddedNodes(nodeList);

    // Act
    const result = addedNodes.filterElements();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toContain(div);
    expect(result).toContain(span);
  });
});
