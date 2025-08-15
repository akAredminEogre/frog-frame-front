import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementSelector } from '../ElementSelector';

// SelectionServiceのモック
vi.mock('../../../infrastructure/selection/SelectionService');

// Nodeのモック
Object.defineProperty(global, 'Node', {
  value: {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1
  }
});

describe('ElementSelector', () => {
  let elementSelector: ElementSelector;
  let mockSelectionService: any;

  beforeEach(() => {
    mockSelectionService = {
      getCurrentSelection: vi.fn(),
      hasValidSelection: vi.fn(),
      getFirstRange: vi.fn(),
      getSelectedText: vi.fn()
    };
    elementSelector = new ElementSelector(mockSelectionService);
    vi.clearAllMocks();
  });

  describe('getElementFromSelection', () => {
    it('選択範囲がない場合、空文字列を返す', () => {
      mockSelectionService.hasValidSelection.mockReturnValue(false);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('');
    });

    it('選択範囲のカウントが0の場合、空文字列を返す', () => {
      mockSelectionService.hasValidSelection.mockReturnValue(false);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('');
    });

    it('共通祖先がdocumentの場合、フォールバック処理を実行する', () => {
      const mockTextNode = {
        nodeType: Node.TEXT_NODE,
        parentElement: {
          outerHTML: '<p>test content</p>'
        }
      };

      const mockRangeForDocument = {
        startContainer: mockTextNode,
        commonAncestorContainer: document
      };

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForDocument);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<p>test content</p>');
    });

    it('共通祖先がdocument.bodyの場合、フォールバック処理を実行する', () => {
      const mockElement = {
        nodeType: Node.ELEMENT_NODE,
        outerHTML: '<div>test content</div>'
      };

      const mockRangeForBody = {
        startContainer: mockElement,
        commonAncestorContainer: document.body
      };

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForBody);
      mockSelectionService.getSelectedText.mockReturnValue('test content');

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
        nodeType: Node.TEXT_NODE,
        parentElement: mockParentElement
      };

      const mockRangeForText = {
        commonAncestorContainer: mockTextNode
      };

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForText);

      const result = elementSelector.getElementFromSelection();

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

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForElement);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<div>element content</div>');
    });

    it('ターゲット要素がnullの場合、フォールバック処理を実行する', () => {
      const mockTextNodeWithoutParent = {
        nodeType: Node.TEXT_NODE,
        parentElement: null
      };

      const mockRangeForOrphanText = {
        startContainer: mockTextNodeWithoutParent,
        commonAncestorContainer: mockTextNodeWithoutParent
      };

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForOrphanText);
      mockSelectionService.getSelectedText.mockReturnValue('orphan text');

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('orphan text');
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

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForSpanText);

      const result = elementSelector.getElementFromSelection();

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

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForPartialText);

      const result = elementSelector.getElementFromSelection();

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

      const mockSelection = {};

      mockSelectionService.hasValidSelection.mockReturnValue(true);
      mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
      mockSelectionService.getFirstRange.mockReturnValue(mockRangeForMultiSpan);

      const result = elementSelector.getElementFromSelection();

      expect(result).toBe('<div><span>span1</span><span>span2</span></div>');
    });
  });
});
