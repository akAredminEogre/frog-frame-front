import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { createMockTabsService } from 'tests/unit/application/ports/IChromeTabsService/createMockTabsService';

/**
 * OpenRuleEditPageUseCase.execute - 正常系テスト
 * 1. 正常なruleIdでopenEditPageが呼ばれる
 */
describe('OpenRuleEditPageUseCase.execute - 正常系', () => {
  let useCase: OpenRuleEditPageUseCase;
  let mockChromeTabsService: IChromeTabsService;

  beforeEach(() => {
    mockChromeTabsService = createMockTabsService();

    useCase = new OpenRuleEditPageUseCase(mockChromeTabsService);
  });

  it('正常なruleIdで編集ページが開かれる', async () => {
    // Arrange
    const ruleId = 'rule-001';

    vi.mocked(mockChromeTabsService.openEditPage).mockResolvedValue();

    // Act
    await useCase.execute(ruleId);

    // Assert
    expect(mockChromeTabsService.openEditPage).toHaveBeenCalledTimes(1);
    expect(mockChromeTabsService.openEditPage).toHaveBeenCalledWith(ruleId);
  });

  it('異なるruleIdでも正しく処理される', async () => {
    // Arrange
    const ruleId = 'rule-abc-123';

    vi.mocked(mockChromeTabsService.openEditPage).mockResolvedValue();

    // Act
    await useCase.execute(ruleId);

    // Assert
    expect(mockChromeTabsService.openEditPage).toHaveBeenCalledTimes(1);
    expect(mockChromeTabsService.openEditPage).toHaveBeenCalledWith(ruleId);
  });
});
