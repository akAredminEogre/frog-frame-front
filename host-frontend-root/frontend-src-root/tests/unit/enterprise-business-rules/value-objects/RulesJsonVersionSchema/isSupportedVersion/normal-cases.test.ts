/**
 * RulesJsonVersionSchema.isSupportedVersion - 正常系テスト
 * 事前条件: isValidSchema() が true であること（version が文字列として存在する）
 * 1. version が '1.0' の場合はtrueを返す
 * 2. version が '2.0' の場合はfalseを返す
 * 3. version が '1' の場合はfalseを返す
 * 4. version が空文字の場合はfalseを返す
 */
import { describe, expect, it } from 'vitest';

import { RulesJsonVersionSchema, SUPPORTED_RULES_JSON_VERSION } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

describe('RulesJsonVersionSchema.isSupportedVersion', () => {
  const testCases = [
    {
      description: `version が '${SUPPORTED_RULES_JSON_VERSION}' の場合はtrueを返す`,
      input: { version: '1.0', rules: [] },
      expected: true,
    },
    {
      description: "version が '2.0' の場合はfalseを返す",
      input: { version: '2.0', rules: [] },
      expected: false,
    },
    {
      description: "version が '1' の場合はfalseを返す",
      input: { version: '1', rules: [] },
      expected: false,
    },
    {
      description: 'version が空文字の場合はfalseを返す',
      input: { version: '', rules: [] },
      expected: false,
    },
    {
      description: "version が '1.0.0' の場合はfalseを返す",
      input: { version: '1.0.0', rules: [] },
      expected: false,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const schema = new RulesJsonVersionSchema(testCase.input as Record<string, unknown>);
      expect(schema.isSupportedVersion()).toBe(testCase.expected);
    });
  });
});
