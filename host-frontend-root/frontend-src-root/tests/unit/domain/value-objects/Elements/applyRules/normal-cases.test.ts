import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';

const mockExec = vi.fn();

vi.mock(
  'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase',
  () => ({
    ApplyRulesOnPageLoadUseCase: vi.fn().mockImplementation(() => ({
      exec: mockExec,
    })),
  })
);

/**
 * Elements.applyRules - 正常系テスト
 *
 * 1. ApplyRulesOnPageLoadUseCaseをインスタンス化し、各要素に対してexecを実行する
 * 2. 空のElementsの場合はUseCaseをインスタンス化するが、execは実行しない
 * 3. 複数の要素がある場合、順番にexecを実行する
 */
describe('Elements.applyRules - 正常系', () => {
  const mockRepository = {} as Parameters<typeof Elements.prototype.applyRules>[0];
  const mockCurrentUrlService = {} as Parameters<typeof Elements.prototype.applyRules>[1];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute UseCase.exec for each element', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const elements = new Elements();
    elements.addElement(element1);
    elements.addElement(element2);

    // Act
    await elements.applyRules(mockRepository, mockCurrentUrlService);

    // Assert
    expect(mockExec).toHaveBeenCalledTimes(2);
    expect(mockExec).toHaveBeenCalledWith(element1);
    expect(mockExec).toHaveBeenCalledWith(element2);
  });

  it('should not execute UseCase.exec when empty', async () => {
    // Arrange
    const elements = new Elements();

    // Act
    await elements.applyRules(mockRepository, mockCurrentUrlService);

    // Assert
    expect(mockExec).not.toHaveBeenCalled();
  });

  it('should execute UseCase.exec sequentially', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const elements = new Elements();
    elements.addElement(element1);
    elements.addElement(element2);

    const callOrder: Element[] = [];
    mockExec.mockImplementation(async (el: Element) => {
      callOrder.push(el);
    });

    // Act
    await elements.applyRules(mockRepository, mockCurrentUrlService);

    // Assert
    expect(callOrder).toEqual([element1, element2]);
  });
});
