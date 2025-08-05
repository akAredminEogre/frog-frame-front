import { test, expect } from './fixtures';

test('ポップアップを開くと、URLパターンのフォームにブラウザに表示されているページのURLのドメインが自動入力されている', async ({ page, context, popupPage }) => {

  // Arrange: Load the extension and navigate to a page where the content script runs.
  // await page.goto('https://example.com');

  // Act:
  // 1. Open the extension popup
  // const popup = await browser.newPage();
  // await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  // 2. Click the button in the popup that triggers DOM manipulation
  // await popup.locator('#run-dom-manipulation').click();

  // Assert: Verify that the DOM has been updated as expected.
  // await expect(page.locator('#target-element')).toHaveText('Hello from the test!');
});
