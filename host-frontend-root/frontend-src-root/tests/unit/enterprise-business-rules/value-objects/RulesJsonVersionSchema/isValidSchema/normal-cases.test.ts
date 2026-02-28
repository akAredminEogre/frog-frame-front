/**
 * RulesJsonVersionSchema.isValidSchema - 正常系テスト
 * 1. version(文字列) + rules(配列)が揃っている場合はtrueを返す
 * 2. versionが欠落している場合はfalseを返す
 * 3. versionが文字列でない場合はfalseを返す
 * 4. rulesが欠落している場合はfalseを返す
 * 5. rulesが配列でない場合はfalseを返す
 * 6. 余分なフィールドがあってもtrueを返す（exportedAt等）
 */
import { describe, expect, it } from 'vitest';

import { RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

describe('RulesJsonVersionSchema.isValidSchema', () => {
  const testCases = [
    {
      description: 'version(文字列) + rules(配列)が揃っている場合はtrueを返す',
      input: { version: '1.0', rules: [] },
      expected: true,
    },
    {
      description: '余分なフィールドがあってもtrueを返す（exportedAt等）',
      input: { version: '1.0', exportedAt: '2026-01-01T00:00:00+09:00', rules: [] },
      expected: true,
    },
    {
      description: 'versionが欠落している場合はfalseを返す',
      input: { rules: [] },
      expected: false,
    },
    {
      description: 'versionが文字列でない場合（数値）はfalseを返す',
      input: { version: 1, rules: [] },
      expected: false,
    },
    {
      description: 'versionがnullの場合はfalseを返す',
      input: { version: null, rules: [] },
      expected: false,
    },
    {
      description: 'rulesが欠落している場合はfalseを返す',
      input: { version: '1.0' },
      expected: false,
    },
    {
      description: 'rulesが配列でない場合（オブジェクト）はfalseを返す',
      input: { version: '1.0', rules: {} },
      expected: false,
    },
    {
      description: 'rulesがnullの場合はfalseを返す',
      input: { version: '1.0', rules: null },
      expected: false,
    },
    {
      description: '空オブジェクトの場合はfalseを返す',
      input: {},
      expected: false,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const schema = new RulesJsonVersionSchema(testCase.input as Record<string, unknown>);
      expect(schema.isValidSchema()).toBe(testCase.expected);
    });
  });
});
