/**
 * ConfirmDialog コンポーネント - Props反映テスト
 * 渡されたPropsが正しくレンダリングされることをテスト
 * - title: タイトルテキストが表示される
 * - message: メッセージテキストが表示される
 * - confirmLabel: カスタム確認ボタンラベル
 * - cancelLabel: カスタムキャンセルボタンラベル
 * - デフォルトラベル: デフォルト値が使用される
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - Props反映', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  describe('タイトルとメッセージ', () => {
    it('タイトルテキストが表示される', async () => {
      // Arrange & Act
      await helper.render({ title: 'カスタムタイトル' });

      // Assert
      const title = helper.getTitleElement();
      expect(title?.textContent).toBe('カスタムタイトル');
    });

    it('メッセージテキストが表示される', async () => {
      // Arrange & Act
      await helper.render({ message: 'カスタムメッセージ' });

      // Assert
      const message = helper.getMessageElement();
      expect(message?.textContent).toBe('カスタムメッセージ');
    });
  });

  describe('ボタンラベル', () => {
    const buttonLabelTestCases = [
      {
        description: 'カスタム確認ボタンラベルが表示される',
        input: { confirmLabel: '実行する' },
        expected: { button: 'confirm', label: '実行する' },
      },
      {
        description: 'カスタムキャンセルボタンラベルが表示される',
        input: { cancelLabel: '戻る' },
        expected: { button: 'cancel', label: '戻る' },
      },
      {
        description: 'confirmLabel未指定の場合、デフォルト値「削除」が使用される',
        input: {},
        expected: { button: 'confirm', label: '削除' },
      },
      {
        description: 'cancelLabel未指定の場合、デフォルト値「キャンセル」が使用される',
        input: {},
        expected: { button: 'cancel', label: 'キャンセル' },
      },
    ];

    buttonLabelTestCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange & Act
        await helper.render(testCase.input);

        // Assert
        const button =
          testCase.expected.button === 'confirm'
            ? helper.getConfirmButton()
            : helper.getCancelButton();
        expect(button?.textContent).toBe(testCase.expected.label);
      });
    });
  });
});
