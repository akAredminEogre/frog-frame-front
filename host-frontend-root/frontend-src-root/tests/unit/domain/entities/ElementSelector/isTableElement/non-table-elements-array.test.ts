import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - isTableElement - non-table elements array', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

  const nonTableElementCases = [
    {
      description: 'div要素の場合、falseを返す',
      input: { tagName: 'DIV' },
      expected: false,
    },
    {
      description: 'span要素の場合、falseを返す',
      input: { tagName: 'SPAN' },
      expected: false,
    },
  ];

  nonTableElementCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockElement = {
        tagName: testCase.input.tagName
      };
      
      // privateメソッドをテストするためにany型でキャスト
      const result = (elementSelector as any).isTableElement(mockElement);
      
      expect(result).toBe(testCase.expected);
    });
  });
});