/**
 * RulesJsonVersionSchema.isValidSchema - 正常系テスト
 * 1. version(文字列) + rules(配列)が揃っている場合はtrueを返す
 * 2. 余分なフィールドがあってもtrueを返す（exportedAt等）
 * 無効なスキーマの場合はコンストラクタがInvalidRulesJsonSchemaErrorをスローする
 */
import { describe, expect, it } from 'vitest';

import { InvalidRulesJsonSchemaError, RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

describe('RulesJsonVersionSchema.isValidSchema', () => {
  describe('有効なスキーマ: インスタンス生成後にtrueを返す', () => {
    const validCases = [
      {
        description: 'version(文字列) + rules(配列)が揃っている場合はtrueを返す',
        input: { version: '1.0', rules: [] },
      },
      {
        description: '余分なフィールドがあってもtrueを返す（exportedAt等）',
        input: { version: '1.0', exportedAt: '2026-01-01T00:00:00+09:00', rules: [] },
      },
    ];

    validCases.forEach((testCase) => {
      it(testCase.description, () => {
        const schema = new RulesJsonVersionSchema(testCase.input as Record<string, unknown>);
        expect(schema.isValidSchema()).toBe(true);
      });
    });
  });

  describe('無効なスキーマ: コンストラクタがInvalidRulesJsonSchemaErrorをスローする', () => {
    const invalidCases = [
      {
        description: 'versionが欠落している場合はInvalidRulesJsonSchemaErrorをスローする',
        input: { rules: [] },
      },
      {
        description: 'versionが文字列でない場合（数値）はInvalidRulesJsonSchemaErrorをスローする',
        input: { version: 1, rules: [] },
      },
      {
        description: 'versionがnullの場合はInvalidRulesJsonSchemaErrorをスローする',
        input: { version: null, rules: [] },
      },
      {
        description: 'rulesが欠落している場合はInvalidRulesJsonSchemaErrorをスローする',
        input: { version: '1.0' },
      },
      {
        description: 'rulesが配列でない場合（オブジェクト）はInvalidRulesJsonSchemaErrorをスローする',
        input: { version: '1.0', rules: {} },
      },
      {
        description: 'rulesがnullの場合はInvalidRulesJsonSchemaErrorをスローする',
        input: { version: '1.0', rules: null },
      },
      {
        description: '空オブジェクトの場合はInvalidRulesJsonSchemaErrorをスローする',
        input: {},
      },
    ];

    invalidCases.forEach((testCase) => {
      it(testCase.description, () => {
        expect(() => new RulesJsonVersionSchema(testCase.input as Record<string, unknown>)).toThrow(InvalidRulesJsonSchemaError);
      });
    });
  });
});
