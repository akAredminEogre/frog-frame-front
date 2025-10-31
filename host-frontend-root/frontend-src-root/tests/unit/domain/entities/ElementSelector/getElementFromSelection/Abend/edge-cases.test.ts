import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - getElementFromSelection - edge cases', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
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

    const result = elementSelector.getElementFromSelection(mockRangeForDocument as any, 'test content');

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

    const result = elementSelector.getElementFromSelection(mockRangeForBody as any, 'test content');

    expect(result).toBe('<div>test content</div>');
  });

  it('ターゲット要素がnullの場合、選択テキストをそのまま返す', () => {
    const mockTextNodeWithoutParent = {
      nodeType: Node.TEXT_NODE,
      parentElement: null
    };

    const mockRangeForOrphanText = {
      startContainer: mockTextNodeWithoutParent,
      commonAncestorContainer: mockTextNodeWithoutParent
    };

    const result = elementSelector.getElementFromSelection(mockRangeForOrphanText as any, 'orphan text');

    expect(result).toBe('orphan text');
  });
});