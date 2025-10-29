import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ElementSelector } from 'src/domain/entities/ElementSelector';

describe('ElementSelector - isWithinTable - boundary cases', () => {
  let elementSelector: ElementSelector;

  beforeEach(() => {
    elementSelector = new ElementSelector();
    vi.clearAllMocks();
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