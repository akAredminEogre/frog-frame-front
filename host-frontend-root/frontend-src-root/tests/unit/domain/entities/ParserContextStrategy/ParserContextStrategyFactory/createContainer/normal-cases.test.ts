import { describe, expect, it } from 'vitest';

import { ParserContextStrategyFactory } from 'src/domain/entities/ParserContextStrategy';
import { IElementFactory } from 'src/domain/ports/IElementFactory';

/**
 * テスト用のIElementFactory実装
 * テスト環境（happy-dom）のdocument.createElementを使用
 */
const mockElementFactory: IElementFactory = {
  createElement: (tagName: string) => document.createElement(tagName)
};

describe('ParserContextStrategyFactory', () => {
  describe('createContainer', () => {
    describe('normal cases', () => {
      const testCases = [
        {
          description: 'tr要素の場合、tbodyコンテナを返す',
          tagName: 'tr',
          expectedContainer: 'tbody',
          expectedParent: 'table'
        },
        {
          description: 'td要素の場合、trコンテナを返す',
          tagName: 'td',
          expectedContainer: 'tr',
          expectedParent: 'tbody'
        },
        {
          description: 'th要素の場合、trコンテナを返す',
          tagName: 'th',
          expectedContainer: 'tr',
          expectedParent: 'tbody'
        },
        {
          description: 'thead要素の場合、tableコンテナを返す',
          tagName: 'thead',
          expectedContainer: 'table',
          expectedParent: null
        },
        {
          description: 'tbody要素の場合、tableコンテナを返す',
          tagName: 'tbody',
          expectedContainer: 'table',
          expectedParent: null
        },
        {
          description: 'tfoot要素の場合、tableコンテナを返す',
          tagName: 'tfoot',
          expectedContainer: 'table',
          expectedParent: null
        },
        {
          description: 'div要素の場合、divコンテナを返す',
          tagName: 'div',
          expectedContainer: 'div',
          expectedParent: null
        },
        {
          description: 'span要素の場合、divコンテナを返す',
          tagName: 'span',
          expectedContainer: 'div',
          expectedParent: null
        },
        {
          description: 'p要素の場合、divコンテナを返す',
          tagName: 'p',
          expectedContainer: 'div',
          expectedParent: null
        }
      ];

      testCases.forEach(({ description, tagName, expectedContainer, expectedParent }) => {
        it(description, () => {
          // Arrange
          const element = document.createElement(tagName);
          const factory = new ParserContextStrategyFactory(mockElementFactory);

          // Act
          const container = factory.createContainer(element);

          // Assert
          expect(container.tagName.toLowerCase()).toBe(expectedContainer);

          if (expectedParent) {
            expect(container.parentElement?.tagName.toLowerCase()).toBe(expectedParent);
          }
        });
      });
    });
  });
});