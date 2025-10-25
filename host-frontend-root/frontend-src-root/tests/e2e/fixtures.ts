/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
import { type BrowserContext, chromium, type Page,test as base } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  popupPage: Page;
  page: Page;
  rulesPage: Page;
  editPage: Page;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(process.cwd(), '.output/chrome-mv3-dev');
    const context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
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
