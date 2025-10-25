import { describe, expect,it } from 'vitest';

import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

describe('SelectedPageText.constructor() - normal cases', () => {
  it('should create instance with string value', () => {
    // Arrange
    const value = 'test text';

    // Act
    const selectedPageText = new SelectedPageText(value);

    // Assert
    expect(selectedPageText).toBeInstanceOf(SelectedPageText);
    expect(selectedPageText.toString()).toBe(value);
  });

  it('should create instance with empty string', () => {
    // Arrange
    const value = '';

    // Act
    const selectedPageText = new SelectedPageText(value);

    // Assert
    expect(selectedPageText).toBeInstanceOf(SelectedPageText);
    expect(selectedPageText.toString()).toBe('');
  });
});