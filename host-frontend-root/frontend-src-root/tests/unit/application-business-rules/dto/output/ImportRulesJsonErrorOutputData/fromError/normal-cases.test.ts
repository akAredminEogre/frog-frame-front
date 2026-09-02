/**
 * ImportRulesJsonErrorOutputData.fromError - マッピング正常系テスト
 * 1. JsonSyntaxError → 'parse' / InvalidJsonImportError メッセージ
 * 2. JsonStructureError → 'validation' / InvalidSchemaImportError メッセージ
 * 3. ImportFileSizeError → 'validation' / 元エラーメッセージをそのまま保持
 * 4. InvalidRulesJsonSchemaError → 'validation' / InvalidSchemaImportError メッセージ
 * 5. UnsupportedRulesJsonVersionError → 'validation' / 元エラーメッセージをそのまま保持
 * 6. EmptyRulesCollectionError → 'validation' / 元エラーメッセージをそのまま保持
 * 7. RulesCollectionCountExceededError → 'validation' / 元エラーメッセージをそのまま保持
 * 8. InvalidRuleIdError → 'validation' / 元エラーメッセージをそのまま保持
 * 9. 未登録エラー → 'storage' / StorageImportError でラップされたメッセージ
 */
import { describe, expect, it } from 'vitest';

import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { JsonStructureError, JsonSyntaxError } from 'src/application-business-rules/errors/JsonParserErrors';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';
import {
  EmptyRulesCollectionError,
  ImportRuleIdError,
  RulesCollectionCountExceededError,
} from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';
import {
  InvalidRulesJsonSchemaError,
  UnsupportedRulesJsonVersionError,
} from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

interface TestCase {
  description: string;
  input: { error: unknown };
  expected: { errorType: 'parse' | 'validation' | 'storage'; message: string };
}

describe('ImportRulesJsonErrorOutputData.fromError - マッピング正常系', () => {
  const testCases: TestCase[] = [
    {
      description: 'JsonSyntaxError → parse / InvalidJsonImportError メッセージ',
      input: { error: new JsonSyntaxError() },
      expected: { errorType: 'parse', message: '不正なJSONファイルです' },
    },
    {
      description: 'JsonStructureError → validation / InvalidSchemaImportError メッセージ',
      input: { error: new JsonStructureError() },
      expected: {
        errorType: 'validation',
        message: 'JSONスキーマが不正です（versionとrulesが必要です）',
      },
    },
    {
      description: 'ImportFileSizeError → validation / 元エラーメッセージをそのまま保持',
      input: { error: new ImportFileSizeError(6 * 1024 * 1024) },
      expected: {
        errorType: 'validation',
        message: `ファイルサイズが上限（5MB）を超えています (${6 * 1024 * 1024} bytes)`,
      },
    },
    {
      description: 'InvalidRulesJsonSchemaError → validation / InvalidSchemaImportError メッセージ',
      input: { error: new InvalidRulesJsonSchemaError() },
      expected: {
        errorType: 'validation',
        message: 'JSONスキーマが不正です（versionとrulesが必要です）',
      },
    },
    {
      description: 'UnsupportedRulesJsonVersionError → validation / 元エラーメッセージをそのまま保持',
      input: { error: new UnsupportedRulesJsonVersionError('2.0') },
      expected: {
        errorType: 'validation',
        message: '未対応のバージョンです: 2.0',
      },
    },
    {
      description: 'EmptyRulesCollectionError → validation / 元エラーメッセージをそのまま保持',
      input: { error: new EmptyRulesCollectionError() },
      expected: {
        errorType: 'validation',
        message: 'インポートするルールがありません',
      },
    },
    {
      description: 'RulesCollectionCountExceededError → validation / 元エラーメッセージをそのまま保持',
      input: { error: new RulesCollectionCountExceededError() },
      expected: {
        errorType: 'validation',
        message: 'ルール件数が上限（1000件）を超えています',
      },
    },
    {
      description: 'InvalidRuleIdError → validation / 元エラーメッセージをそのまま保持',
      input: { error: new InvalidRuleIdError(-1) },
      expected: {
        errorType: 'validation',
        message: 'Invalid RuleId: -1',
      },
    },
    {
      description: 'ImportRuleIdError → validation / 日本語・ルール#N 付きメッセージをそのまま保持',
      input: { error: new ImportRuleIdError(2, -1, new InvalidRuleIdError(-1)) },
      expected: {
        errorType: 'validation',
        message:
          'ルール#2 の ID「-1」は無効です（IDは安全整数の範囲内の正の整数である必要があり、未採番を表す 0 は指定できません）',
      },
    },
    {
      description: '未登録エラー → storage / StorageImportError でラップされたメッセージ',
      input: { error: new Error('未知のエラー') },
      expected: {
        errorType: 'storage',
        message: 'インポート処理中にエラーが発生しました: 未知のエラー',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const output = ImportRulesJsonErrorOutputData.fromError(testCase.input.error);

      expect(output.errorType).toBe(testCase.expected.errorType);
      expect(output.message).toBe(testCase.expected.message);
    });
  });
});
