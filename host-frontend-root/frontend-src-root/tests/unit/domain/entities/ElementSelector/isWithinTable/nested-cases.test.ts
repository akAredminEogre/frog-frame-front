import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - isWithinTable - nested cases', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
  });

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
});