import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - getElementFromSelection - normal cases', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

  it('共通祖先がテキストノードの場合、親要素のouterHTMLを返す', () => {
    const mockParentElement = {
      outerHTML: '<span>selected text</span>',
      tagName: 'SPAN',
      hasAttributes: () => false,
      attributes: []
    };

    const mockTextNode = {
      nodeType: Node.TEXT_NODE,
      parentElement: mockParentElement
    };

    const mockRangeForText = {
      commonAncestorContainer: mockTextNode
    };

    const result = elementSelector.getElementFromSelection(mockRangeForText as any, 'selected text');

    expect(result).toBe('<span>selected text</span>');
  });

  it('共通祖先が要素ノードの場合、そのouterHTMLを返す', () => {
    const mockElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<div>element content</div>',
      tagName: 'DIV',
      hasAttributes: () => false,
      attributes: []
    };

    const mockRangeForElement = {
      startContainer: mockElement,
      commonAncestorContainer: mockElement
    };

    const result = elementSelector.getElementFromSelection(mockRangeForElement as any, 'element content');

    expect(result).toBe('<div>element content</div>');
  });

  it('span要素内の複数テキストノード選択時、span要素全体を取得する', () => {
    // span要素内の複数テキストノード（"商品番号" + "："）をモック
    const mockSpanElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span class="inline-flex">商品番号：</span>',
      tagName: 'SPAN',
      hasAttributes: () => true,
      attributes: [{ name: 'class', value: 'inline-flex' }]
    };

    const mockTextNode1 = {
      nodeType: Node.TEXT_NODE,
      textContent: '商品番号',
      parentElement: mockSpanElement
    };

    // 右クリック時の狭い選択範囲（テキストノード1の一部）をモック
    const mockRangeForSpanText = {
      startContainer: mockTextNode1,
      endContainer: mockTextNode1,
      commonAncestorContainer: mockSpanElement // 共通祖先はspan要素
    };

    const result = elementSelector.getElementFromSelection(mockRangeForSpanText as any, '商品番号');

    expect(result).toBe('<span class="inline-flex">商品番号：</span>');
  });

  it('span要素内テキストノードの一部選択時、親要素まで遡及してspan要素を取得する', () => {
    const mockSpanElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span class="inline-flex">商品番号：</span>',
      tagName: 'SPAN',
      hasAttributes: () => true,
      attributes: [{ name: 'class', value: 'inline-flex' }]
    };

    const mockTextNode = {
      nodeType: Node.TEXT_NODE,
      textContent: '商品番号：',
      parentElement: mockSpanElement
    };

    // 共通祖先がテキストノードの場合（狭い選択範囲）
    const mockRangeForPartialText = {
      startContainer: mockTextNode,
      endContainer: mockTextNode,
      commonAncestorContainer: mockTextNode
    };

    const result = elementSelector.getElementFromSelection(mockRangeForPartialText as any, '商品番号：');

    expect(result).toBe('<span class="inline-flex">商品番号：</span>');
  });

  it('複数のspan要素にまたがる選択の場合、適切な共通祖先要素を取得する', () => {
    const mockParentDiv = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<div><span>span1</span><span>span2</span></div>',
      tagName: 'DIV',
      hasAttributes: () => true,
      attributes: [{ name: 'class', value: 'parent' }]
    };

    const mockSpan1 = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span>span1</span>',
      tagName: 'SPAN',
      parentElement: mockParentDiv,
      hasAttributes: () => false,
      attributes: []
    };

    const mockSpan2 = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<span>span2</span>',
      tagName: 'SPAN',
      parentElement: mockParentDiv,
      hasAttributes: () => false,
      attributes: []
    };

    // 複数span要素をまたぐ選択の共通祖先
    const mockRangeForMultiSpan = {
      startContainer: mockSpan1,
      endContainer: mockSpan2,
      commonAncestorContainer: mockParentDiv
    };

    const result = elementSelector.getElementFromSelection(mockRangeForMultiSpan as any, 'span1span2');

    expect(result).toBe('<div><span>span1</span><span>span2</span></div>');
  });
});