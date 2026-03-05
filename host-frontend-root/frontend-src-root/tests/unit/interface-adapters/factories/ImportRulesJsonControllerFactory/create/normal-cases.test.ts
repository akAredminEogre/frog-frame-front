/**
 * ImportRulesJsonControllerFactory.create - 正常系テスト
 * 1. create()がpreviewControllerとconfirmControllerを返す
 * 2. previewController経由でプレビューするとonPreviewコールバックが呼ばれる
 * 3. confirmController経由で確定するとonSuccessコールバックが呼ばれる
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import {
  ImportErrorCallback,
  ImportSuccessCallback,
  PreviewCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';
import { ImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ImportRulesJsonControllerFactory';

describe('ImportRulesJsonControllerFactory.create - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockJsonParser: IJsonParser;
  let mockFileTextReader: IFileTextReader;
  let onPreview: PreviewCallback;
  let onSuccess: ImportSuccessCallback;
  let onError: ImportErrorCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockJsonParser = { parse: vi.fn(), parseAsObject: vi.fn() };
    mockFileTextReader = { readAsText: vi.fn() };
    onPreview = vi.fn();
    onSuccess = vi.fn();
    onError = vi.fn();

    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(new RewriteRules({}));
    (mockRepository.replaceAll as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('create()がpreviewControllerとconfirmControllerを返す', () => {
    const factory = new ImportRulesJsonControllerFactory(
      mockRepository,
      mockJsonParser,
      mockFileTextReader
    );

    const result = factory.create(onPreview, onSuccess, onError);

    expect(result).toBeDefined();
    expect(typeof result.previewController.previewRulesJson).toBe('function');
    expect(typeof result.confirmController.confirmImport).toBe('function');
  });

  it('previewController経由で有効なJSONをプレビューするとonPreviewが呼ばれる', async () => {
    const jsonData = {
      version: '1.0',
      rules: [{ id: 1, oldString: 'foo', newString: 'bar', urlPattern: '', isRegex: false, isActive: true }],
    };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(jsonData)
    );
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);

    const factory = new ImportRulesJsonControllerFactory(
      mockRepository,
      mockJsonParser,
      mockFileTextReader
    );
    const { previewController } = factory.create(onPreview, onSuccess, onError);

    const file = new File([''], 'rules.json', { type: 'application/json' });
    await previewController.previewRulesJson(file);

    expect(onPreview).toHaveBeenCalledTimes(1);
    expect(onPreview).toHaveBeenCalledWith(0, 1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('confirmController経由で確定するとonSuccessが呼ばれる', async () => {
    // Phase1: プレビューを実行してpendingRulesをconfirmInteractorにセット
    const jsonData = {
      version: '1.0',
      rules: [{ id: 1, oldString: 'foo', newString: 'bar', urlPattern: '', isRegex: false, isActive: true }],
    };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(jsonData)
    );
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);
    const existingRule = new RewriteRule(10, 'existing', '', '', false, true);
    (mockRepository.getAll as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(new RewriteRules({}))         // Phase1: 現在ルール0件
      .mockResolvedValueOnce(new RewriteRules({ '10': existingRule })); // Phase2: 既存1件

    const factory = new ImportRulesJsonControllerFactory(
      mockRepository,
      mockJsonParser,
      mockFileTextReader
    );
    const { previewController, confirmController } = factory.create(onPreview, onSuccess, onError);

    const file = new File([''], 'rules.json', { type: 'application/json' });
    await previewController.previewRulesJson(file);

    // Phase2: ゼロ引数で確定（pendingRulesはconfirmInteractorが保持）
    await confirmController.confirmImport();

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining('1'));
    expect(onError).not.toHaveBeenCalled();
  });
});
