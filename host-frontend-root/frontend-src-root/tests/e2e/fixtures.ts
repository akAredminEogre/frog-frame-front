/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
import { type BrowserContext, chromium, type Page,test as base } from '@playwright/test';
import path from 'path';
import { getExtensionDirectory } from 'tests/e2e/config';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  popupPage: Page;
  page: Page;
  rulesPage: Page;
  editPage: Page;
}>({
  context: async ({}, use) => {
    const extensionDir = getExtensionDirectory();
    const pathToExtension = path.join(process.cwd(), extensionDir);
    const isCI = !!process.env.CI;

    // Base Chrome args for loading extension
    const args = [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ];

    // CI requires sandbox bypass and headed mode (with xvfb-run for virtual display)
    // Local/Docker can use headless mode
    if (isCI) {
      args.push('--no-sandbox', '--disable-setuid-sandbox');
    }

    const context = await chromium.launchPersistentContext('', {
      headless: !isCI, // CI uses headed mode with xvfb-run virtual display
      args,
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  popupPage: async ({ context, extensionId }, use) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await use(popup);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
  rulesPage: async ({ context, extensionId }, use) => {
    const rulesPage = await context.newPage();
    await rulesPage.goto(`chrome-extension://${extensionId}/rules.html`);
    await use(rulesPage);
  },
  editPage: async ({ context, extensionId }, use) => {
    const editPage = await context.newPage();
    await editPage.goto(`chrome-extension://${extensionId}/edit.html?ruleId=sample-rule-id`);
    await use(editPage);
  },
});

export const expect = test.expect;
