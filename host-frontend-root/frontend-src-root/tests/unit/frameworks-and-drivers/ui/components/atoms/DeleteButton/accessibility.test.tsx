/**
 * DeleteButton コンポーネント - アクセシビリティテスト
 * 1. aria-label: "ルールを削除"が設定される
 * 2. role: button roleが設定される（暗黙的にbutton要素で満たされる）
 */
import { DeleteButtonTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/DeleteButton/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('DeleteButton - アクセシビリティ', () => {
  const helper = new DeleteButtonTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('aria-label="ルールを削除"が設定される', async () => {
    // Arrange & Act
    await helper.render();

    // Assert
    const button = helper.getButtonElement();
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-label')).toBe('ルールを削除');
  });

  it('button要素としてレンダリングされる（暗黙的にbutton roleを持つ）', async () => {
    // Arrange & Act
    await helper.render();

    // Assert
    const button = helper.getButtonElement();
    expect(button).not.toBeNull();
    expect(button?.tagName.toLowerCase()).toBe('button');
    expect(button?.getAttribute('type')).toBe('button');
  });
});
