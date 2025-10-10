import { Tab } from 'src/domain/value-objects/Tab';
import { Tabs } from 'src/domain/value-objects/Tabs';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect } from 'vitest';

/**
 * Tabs.filterByRule メソッドの正常系テスト
 * 1. 全てのタブがマッチする場合、全てのタブを含むTabsを返す
 * 2. 一部のタブがマッチする場合、マッチしたタブのみを含むTabsを返す
 * 3. 1つもマッチしない場合、空のTabsを返す
 * 4. 空のTabsに対してフィルタリングすると、空のTabsを返す
 */
describe('Tabs.filterByRule - 正常系', () => {
  const testCases = [
    {
      description: '全てのタブがマッチする場合、全てのタブを含むTabsを返す',
      input: {
        tabs: [
          { tabId: 1, tabUrl: 'https://example.com/page1' },
          { tabId: 2, tabUrl: 'https://example.com/page2' },
          { tabId: 3, tabUrl: 'https://example.com/page3' },
        ],
        urlPattern: 'https://example.com',
      },
      expected: {
        count: 3,
        tabIds: [1, 2, 3],
      },
    },
    {
      description: '一部のタブがマッチする場合、マッチしたタブのみを含むTabsを返す',
      input: {
        tabs: [
          { tabId: 1, tabUrl: 'https://example.com/matched/page1' },
          { tabId: 2, tabUrl: 'https://other.com/page' },
          { tabId: 3, tabUrl: 'https://example.com/matched/page2' },
          { tabId: 4, tabUrl: 'https://another.com/page' },
        ],
        urlPattern: 'https://example.com/matched',
      },
      expected: {
        count: 2,
        tabIds: [1, 3],
      },
    },
    {
      description: '1つもマッチしない場合、空のTabsを返す',
      input: {
        tabs: [
          { tabId: 1, tabUrl: 'https://example.com/page1' },
          { tabId: 2, tabUrl: 'https://example.com/page2' },
        ],
        urlPattern: 'https://other.com',
      },
      expected: {
        count: 0,
        tabIds: [],
      },
    },
    {
      description: '空のTabsに対してフィルタリングすると、空のTabsを返す',
      input: {
        tabs: [],
        urlPattern: 'https://example.com',
      },
      expected: {
        count: 0,
        tabIds: [],
      },
    },
    {
      description: '1件のTabsに対してマッチする場合、その1件を含むTabsを返す',
      input: {
        tabs: [
          { tabId: 1, tabUrl: 'https://example.com/page1' },
        ],
        urlPattern: 'https://example.com/page1',
      },
      expected: {
        count: 1,
        tabIds: [1],
      },
    },
    {
      description: '1件のTabsに対してマッチしない場合、空のTabsを返す',
      input: {
        tabs: [
          { tabId: 1, tabUrl: 'https://example.com/page1' },
        ],
        urlPattern: 'https://other.com',
      },
      expected: {
        count: 0,
        tabIds: [],
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const tabInstances = testCase.input.tabs.map(
        (tab) => new Tab(tab.tabId, tab.tabUrl)
      );
      const tabs = new Tabs(tabInstances);
      const rule = new RewriteRule(
        'test-rule',
        'oldText',
        'newText',
        testCase.input.urlPattern,
        false
      );

      const result = tabs.filterByRule(rule);
      const resultArray = result.toArray();

      expect(resultArray.length).toBe(testCase.expected.count);
      const resultTabIds = resultArray.map((tab) => tab.getTabId().value);
      expect(resultTabIds).toEqual(testCase.expected.tabIds);
    });
  });
});
