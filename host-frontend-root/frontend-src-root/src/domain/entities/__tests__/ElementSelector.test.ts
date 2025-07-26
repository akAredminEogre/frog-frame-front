import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementSelector } from '../ElementSelector';

// DOM環境のモック
const mockSelection = {
  rangeCount: 0,
  getRangeAt: vi.fn(),
  toString: vi.fn()
};

const mockRange = {
  startContainer: null,
  commonAncestorContainer: null
};

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
        outerHTML: '<span>selected text</span>'
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
        outerHTML: '<div>element content</div>'
      };

      const mockRangeForElement = {
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
  });
});
