import { test, expect } from './fixtures';

test('ポップアップを開くと、URLパターンのフォームにブラウザに表示されているページのURLのドメインが自動入力されている', async ({  }) => {
  // Arrange: Load the extension and navigate to a page where the content script runs.   await page.goto('https://example.com');
  
  // Act:   
  // 1. Open the extension popup
  // const popup = await browser.newPage();
  // await popup.goto(`chrome-extension://${extensionId}/popup.html`);   
  
  // Assert: popup text has 'example.com'
  // await expect(popup.locator('body')).toContainText('example.com');

  
});