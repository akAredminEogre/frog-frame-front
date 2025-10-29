import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - isTableElement - table elements array', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

  const tableElementCases = [
    {
      description: 'table要素の場合、trueを返す',
      input: { tagName: 'TABLE' },
      expected: true,
    },
    {
      description: 'tr要素の場合、trueを返す',
      input: { tagName: 'TR' },
      expected: true,
    },
    {
      description: 'td要素の場合、trueを返す',
      input: { tagName: 'TD' },
      expected: true,
    },
    {
      description: 'th要素の場合、trueを返す',
      input: { tagName: 'TH' },
      expected: true,
    },
    {
      description: 'tbody要素の場合、trueを返す',
      input: { tagName: 'TBODY' },
      expected: true,
    },
    {
      description: 'thead要素の場合、trueを返す',
      input: { tagName: 'THEAD' },
      expected: true,
    },
    {
      description: 'tfoot要素の場合、trueを返す',
      input: { tagName: 'TFOOT' },
      expected: true,
    },
  ];

  tableElementCases.forEach((testCase) => {
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