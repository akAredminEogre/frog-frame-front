import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';
import { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';

describe('ElementSelector - getElementFromSelection - edge cases', () => {
  let elementSelector: ElementSelector;
  let mockDomRootChecker: IDomRootChecker;

  beforeEach(() => {
    mockDomRootChecker = {
      isDocumentRoot: vi.fn().mockReturnValue(false),
      isAttachedToDocument: vi.fn().mockReturnValue(true)
    };
    elementSelector = new ElementSelector(mockDomRootChecker);
    vi.clearAllMocks();
  });

  it('共通祖先がdocumentの場合、フォールバック処理を実行する', () => {
    const mockDocumentNode = { nodeType: Node.DOCUMENT_NODE };
    const mockTextNode = {
      nodeType: Node.TEXT_NODE,
      parentElement: {
        outerHTML: '<p>test content</p>'
      }
    };

    const mockRangeForDocument = {
      startContainer: mockTextNode,
      commonAncestorContainer: mockDocumentNode
    };

    vi.mocked(mockDomRootChecker.isDocumentRoot).mockImplementation(
      (node) => node === (mockDocumentNode as unknown as Node)
    );

    const result = elementSelector.getElementFromSelection(mockRangeForDocument as any, 'test content');

    expect(result).toBe('<p>test content</p>');
  });

  it('共通祖先がdocument.bodyの場合、フォールバック処理を実行する', () => {
    const mockBodyNode = { nodeType: Node.ELEMENT_NODE, tagName: 'BODY' };
    const mockElement = {
      nodeType: Node.ELEMENT_NODE,
      outerHTML: '<div>test content</div>'
    };

    const mockRangeForBody = {
      startContainer: mockElement,
      commonAncestorContainer: mockBodyNode
    };

    vi.mocked(mockDomRootChecker.isDocumentRoot).mockImplementation(
      (node) => node === (mockBodyNode as unknown as Node)
    );

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