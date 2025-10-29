import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - getElementFromSelection - table element cases', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

  it('テーブル内のspan要素選択時、tr要素を優先して返す', () => {
    // テーブル構造のモック
    const mockTrElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<tr><td><span class="product-id">商品番号：moge-1234</span></td></tr>',
      tagName: 'TR',
      hasAttributes: () => false,
      attributes: []
    };

    const mockTdElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<td><span class="product-id">商品番号：moge-1234</span></td>',
      tagName: 'TD',
      parentElement: mockTrElement,
      hasAttributes: () => false,
      attributes: []
    };

    const mockSpanElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span class="product-id">商品番号：moge-1234</span>',
      tagName: 'SPAN',
      parentElement: mockTdElement,
      hasAttributes: () => true,
      attributes: [{ name: 'class', value: 'product-id' }]
    };

    const mockTextNode = {
      nodeType: Node.TEXT_NODE,
      textContent: '商品番号：moge-1234',
      parentElement: mockSpanElement
    };

    // テーブル構造の親要素チェーンを設定
    mockTdElement.parentElement = mockTrElement;
    mockSpanElement.parentElement = mockTdElement;

    // テーブル要素かどうかの判定ロジックをモック
    vi.spyOn(elementSelector as any, 'isWithinTable').mockReturnValue(true);
    vi.spyOn(elementSelector as any, 'isTableElement').mockImplementation((element: any) => {
      return ['TABLE', 'TR', 'TD', 'TH', 'TBODY', 'THEAD', 'TFOOT'].includes(element.tagName);
    });

    const mockRangeForTableText = {
      startContainer: mockTextNode,
      endContainer: mockTextNode,
      commonAncestorContainer: mockSpanElement
    };

    const result = elementSelector.getElementFromSelection(mockRangeForTableText as any, '商品番号：moge-1234');

    expect(result).toBe('<tr><td><span class="product-id">商品番号：moge-1234</span></td></tr>');
  });

  it('テーブル内の複数セル選択時、適切な共通祖先を返す', () => {
    // 複数のtd要素を持つtr要素のモック
    const mockTrElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<tr><td>セル1</td><td>セル2</td></tr>',
      tagName: 'TR',
      hasAttributes: () => false,
      attributes: []
    };

    const mockTd1Element = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<td>セル1</td>',
      tagName: 'TD',
      parentElement: mockTrElement,
      hasAttributes: () => false,
      attributes: []
    };

    const mockTd2Element = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<td>セル2</td>',
      tagName: 'TD',
      parentElement: mockTrElement,
      hasAttributes: () => false,
      attributes: []
    };

    vi.spyOn(elementSelector as any, 'isWithinTable').mockReturnValue(true);
    vi.spyOn(elementSelector as any, 'isTableElement').mockImplementation((element: any) => {
      return ['TABLE', 'TR', 'TD', 'TH', 'TBODY', 'THEAD', 'TFOOT'].includes(element.tagName);
    });

    const mockRangeForMultiCell = {
      startContainer: mockTd1Element,
      endContainer: mockTd2Element,
      commonAncestorContainer: mockTrElement
    };

    const result = elementSelector.getElementFromSelection(mockRangeForMultiCell as any, 'セル1セル2');

    expect(result).toBe('<tr><td>セル1</td><td>セル2</td></tr>');
  });

  it('テーブル外の要素選択時、既存ロジックが動作する', () => {
    const mockSpanElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span class="non-table">通常のspan</span>',
      tagName: 'SPAN',
      hasAttributes: () => true,
      attributes: [{ name: 'class', value: 'non-table' }]
    };

    const mockTextNode = {
      nodeType: Node.TEXT_NODE,
      textContent: '通常のspan',
      parentElement: mockSpanElement
    };

    // テーブル外の要素として設定
    vi.spyOn(elementSelector as any, 'isWithinTable').mockReturnValue(false);

    const mockRangeForNonTable = {
      startContainer: mockTextNode,
      endContainer: mockTextNode,
      commonAncestorContainer: mockSpanElement
    };

    const result = elementSelector.getElementFromSelection(mockRangeForNonTable as any, '通常のspan');

    expect(result).toBe('<span class="non-table">通常のspan</span>');
  });
});