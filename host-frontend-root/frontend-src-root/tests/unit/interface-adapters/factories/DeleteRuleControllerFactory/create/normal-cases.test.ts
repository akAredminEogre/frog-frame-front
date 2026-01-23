/**
 * DeleteRuleControllerFactory.create - 正常系テスト
 * 1. create()がIDeleteRuleControllerを返す
 * 2. 削除成功時にonSuccessコールバックが呼ばれる
 * 3. 削除失敗時にonErrorコールバックが呼ばれる
 */
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';
import {
  DeleteErrorCallback,
  DeleteSuccessCallback,
} from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';

describe('DeleteRuleControllerFactory.create - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let onSuccess: DeleteSuccessCallback;
  let onError: DeleteErrorCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockTabsGateway = createMockTabsGateway();
    onSuccess = vi.fn();
    onError = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('create()がIDeleteRuleControllerを返す', () => {
    const factory = new DeleteRuleControllerFactory(mockRepository, mockTabsGateway);

    const controller = factory.create(onSuccess, onError);

    expect(controller).toBeDefined();
    expect(typeof controller.deleteRule).toBe('function');
  });

  it('削除成功時にonSuccessコールバックが呼ばれる', async () => {
    const ruleId = 1;
    const rule = new RewriteRule(ruleId, 'oldString', 'newString', 'https://example.com', false, true);
    (mockRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(rule);
    (mockRepository.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const factory = new DeleteRuleControllerFactory(mockRepository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    await controller.deleteRule(ruleId);

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(ruleId);
    expect(onError).not.toHaveBeenCalled();
  });

  it('削除失敗時にonErrorコールバックが呼ばれる', async () => {
    const ruleId = 999;
    const errorMessage = 'Rule not found';
    (mockRepository.getById as ReturnType<typeof vi.fn>).mockRejectedValue(new Error(errorMessage));

    const factory = new DeleteRuleControllerFactory(mockRepository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    await controller.deleteRule(ruleId);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(ruleId, errorMessage);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
