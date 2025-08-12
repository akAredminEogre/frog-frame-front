import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementSelector } from '../ElementSelector';

// DOM環境のモック

// window.getSelectionのモック
Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: vi.fn()
});

// Nodeのモック
Object.defineProperty(global, 'Node', {
  value: {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1
  }
});

describe('ElementSelector', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

  describe('getElementFromSelection', () => {
    it('選択範囲がない場合、空文字列を返す', () => {
      (window.getSelection as any).mockReturnValue(null);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('');
    });

    it('選択範囲のカウントが0の場合、空文字列を返す', () => {
      (window.getSelection as any).mockReturnValue({
        rangeCount: 0
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('');
    });

    it('共通祖先がdocumentの場合、フォールバック処理を実行する', () => {
      const mockTextNode = {
        nodeType: 3, // TEXT_NODE
        parentElement: {
          outerHTML: '<p>test content</p>'
        }
      };

      const mockRangeForDocument = {
        startContainer: mockTextNode,
        commonAncestorContainer: document
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForDocument)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<p>test content</p>');
    });

    it('共通祖先がdocument.bodyの場合、フォールバック処理を実行する', () => {
      const mockElement = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<div>test content</div>'
      };

      const mockRangeForBody = {
        startContainer: mockElement,
        commonAncestorContainer: document.body
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForBody),
        toString: vi.fn().mockReturnValue('test content')
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<div>test content</div>');
    });

    it('共通祖先がテキストノードの場合、親要素のouterHTMLを返す', () => {
      const mockParentElement = {
        outerHTML: '<span>selected text</span>',
        tagName: 'SPAN',
        hasAttributes: () => false,
        attributes: []
      };

      const mockTextNode = {
        nodeType: 3, // TEXT_NODE
        parentElement: mockParentElement
      };

      const mockRangeForText = {
        commonAncestorContainer: mockTextNode
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForText)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<span>selected text</span>');
    });

    it('共通祖先が要素ノードの場合、そのouterHTMLを返す', () => {
      const mockElement = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<div>element content</div>',
        tagName: 'DIV',
        hasAttributes: () => false,
        attributes: []
      };

      const mockRangeForElement = {
        startContainer: mockElement,
        commonAncestorContainer: mockElement
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForElement)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<div>element content</div>');
    });

    it('ターゲット要素がnullの場合、フォールバック処理を実行する', () => {
      const mockTextNodeWithoutParent = {
        nodeType: 3, // TEXT_NODE
        parentElement: null
      };

      const mockRangeForOrphanText = {
        startContainer: mockTextNodeWithoutParent,
        commonAncestorContainer: mockTextNodeWithoutParent
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForOrphanText),
        toString: vi.fn().mockReturnValue('orphan text')
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('orphan text');
    });

    it('span要素内の複数テキストノード選択時、span要素全体を取得する', () => {
      // span要素内の複数テキストノード（"商品番号" + "："）をモック
      const mockSpanElement = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<span class="inline-flex">商品番号：</span>',
        tagName: 'SPAN',
        hasAttributes: () => true,
        attributes: [{ name: 'class', value: 'inline-flex' }]
      };

      const mockTextNode1 = {
        nodeType: 3, // TEXT_NODE
        textContent: '商品番号',
        parentElement: mockSpanElement
      };

      // 右クリック時の狭い選択範囲（テキストノード1の一部）をモック
      const mockRangeForSpanText = {
        startContainer: mockTextNode1,
        endContainer: mockTextNode1,
        commonAncestorContainer: mockSpanElement // 共通祖先はspan要素
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForSpanText)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<span class="inline-flex">商品番号：</span>');
    });

    it('span要素内テキストノードの一部選択時、親要素まで遡及してspan要素を取得する', () => {
      const mockSpanElement = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<span class="inline-flex">商品番号：</span>',
        tagName: 'SPAN',
        hasAttributes: () => true,
        attributes: [{ name: 'class', value: 'inline-flex' }]
      };

      const mockTextNode = {
        nodeType: 3, // TEXT_NODE
        textContent: '商品番号：',
        parentElement: mockSpanElement
      };

      // 共通祖先がテキストノードの場合（狭い選択範囲）
      const mockRangeForPartialText = {
        startContainer: mockTextNode,
        endContainer: mockTextNode,
        commonAncestorContainer: mockTextNode
      };

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForPartialText)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<span class="inline-flex">商品番号：</span>');
    });

    it('複数のspan要素にまたがる選択の場合、適切な共通祖先要素を取得する', () => {
      const mockParentDiv = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<div><span>span1</span><span>span2</span></div>',
        tagName: 'DIV',
        hasAttributes: () => true,
        attributes: [{ name: 'class', value: 'parent' }]
      };

      const mockSpan1 = {
        nodeType: 1, // ELEMENT_NODE
        outerHTML: '<span>span1</span>',
        tagName: 'SPAN',
        parentElement: mockParentDiv,
        hasAttributes: () => false,
        attributes: []
      };

      const mockSpan2 = {
        nodeType: 1, // ELEMENT_NODE
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

      (window.getSelection as any).mockReturnValue({
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue(mockRangeForMultiSpan)
      });

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<div><span>span1</span><span>span2</span></div>');
    });
  });
});
