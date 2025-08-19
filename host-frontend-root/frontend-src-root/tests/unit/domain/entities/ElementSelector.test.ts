import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementSelector } from 'src/domain/entities/ElementSelector';

// SelectionServiceのモック
vi.mock('src/infrastructure/selection/SelectionService');

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

  describe('テーブル関連のテスト', () => {
    describe('isTableElement', () => {
      it('table要素の場合、trueを返す', () => {
        const mockTableElement = {
          tagName: 'TABLE'
        };
        
        // privateメソッドをテストするためにany型でキャスト
        const result = (elementSelector as any).isTableElement(mockTableElement);
        
        expect(result).toBe(true);
      });

      it('tr要素の場合、trueを返す', () => {
        const mockTrElement = {
          tagName: 'TR'
        };
        
        const result = (elementSelector as any).isTableElement(mockTrElement);
        
        expect(result).toBe(true);
      });

      it('td要素の場合、trueを返す', () => {
        const mockTdElement = {
          tagName: 'TD'
        };
        
        const result = (elementSelector as any).isTableElement(mockTdElement);
        
        expect(result).toBe(true);
      });

      it('th要素の場合、trueを返す', () => {
        const mockThElement = {
          tagName: 'TH'
        };
        
        const result = (elementSelector as any).isTableElement(mockThElement);
        
        expect(result).toBe(true);
      });

      it('tbody要素の場合、trueを返す', () => {
        const mockTbodyElement = {
          tagName: 'TBODY'
        };
        
        const result = (elementSelector as any).isTableElement(mockTbodyElement);
        
        expect(result).toBe(true);
      });

      it('thead要素の場合、trueを返す', () => {
        const mockTheadElement = {
          tagName: 'THEAD'
        };
        
        const result = (elementSelector as any).isTableElement(mockTheadElement);
        
        expect(result).toBe(true);
      });

      it('tfoot要素の場合、trueを返す', () => {
        const mockTfootElement = {
          tagName: 'TFOOT'
        };
        
        const result = (elementSelector as any).isTableElement(mockTfootElement);
        
        expect(result).toBe(true);
      });

      it('div要素の場合、falseを返す', () => {
        const mockDivElement = {
          tagName: 'DIV'
        };
        
        const result = (elementSelector as any).isTableElement(mockDivElement);
        
        expect(result).toBe(false);
      });

      it('span要素の場合、falseを返す', () => {
        const mockSpanElement = {
          tagName: 'SPAN'
        };
        
        const result = (elementSelector as any).isTableElement(mockSpanElement);
        
        expect(result).toBe(false);
      });
    });

    describe('isWithinTable', () => {
      it('テーブル内の要素の場合、trueを返す', () => {
        const mockTableElement = {
          tagName: 'TABLE'
        };

        const mockSpanElement = {
          tagName: 'SPAN',
          parentElement: mockTableElement
        };
        
        const result = (elementSelector as any).isWithinTable(mockSpanElement);
        
        expect(result).toBe(true);
      });

      it('ネストしたテーブル内の要素の場合、trueを返す', () => {
        const mockTableElement = {
          tagName: 'TABLE'
        };

        const mockTrElement = {
          tagName: 'TR',
          parentElement: mockTableElement
        };

        const mockTdElement = {
          tagName: 'TD',
          parentElement: mockTrElement
        };

        const mockSpanElement = {
          tagName: 'SPAN',
          parentElement: mockTdElement
        };
        
        const result = (elementSelector as any).isWithinTable(mockSpanElement);
        
        expect(result).toBe(true);
      });

      it('テーブル外の要素の場合、falseを返す', () => {
        const mockDivElement = {
          tagName: 'DIV',
          parentElement: document.body
        };

        const mockSpanElement = {
          tagName: 'SPAN',
          parentElement: mockDivElement
        };
        
        const result = (elementSelector as any).isWithinTable(mockSpanElement);
        
        expect(result).toBe(false);
      });

      it('document.bodyに到達した場合、falseを返す', () => {
        const mockSpanElement = {
          tagName: 'SPAN',
          parentElement: document.body
        };
        
        const result = (elementSelector as any).isWithinTable(mockSpanElement);
        
        expect(result).toBe(false);
      });
    });

    describe('テーブル内要素選択の統合テスト', () => {
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

        const mockSelection = {};

        mockSelectionService.hasValidSelection.mockReturnValue(true);
        mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
        mockSelectionService.getFirstRange.mockReturnValue(mockRangeForTableText);

        const result = elementSelector.getElementFromSelection();

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

        const mockSelection = {};

        mockSelectionService.hasValidSelection.mockReturnValue(true);
        mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
        mockSelectionService.getFirstRange.mockReturnValue(mockRangeForMultiCell);

        const result = elementSelector.getElementFromSelection();

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

        const mockSelection = {};

        mockSelectionService.hasValidSelection.mockReturnValue(true);
        mockSelectionService.getCurrentSelection.mockReturnValue(mockSelection);
        mockSelectionService.getFirstRange.mockReturnValue(mockRangeForNonTable);

        const result = elementSelector.getElementFromSelection();

        expect(result).toBe('<span class="non-table">通常のspan</span>');
      });
    });
  });
});
