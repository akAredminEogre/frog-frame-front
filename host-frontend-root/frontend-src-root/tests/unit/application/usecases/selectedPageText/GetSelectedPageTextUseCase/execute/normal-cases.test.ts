import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GetSelectedPageTextUseCase } from 'src/application/usecases/selectedPageText/GetSelectedPageTextUseCase';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

describe('GetSelectedPageTextUseCase.execute() - normal cases', () => {
  let mockRepository: ISelectedPageTextRepository;
  let useCase: GetSelectedPageTextUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRepository = {
      getSelectedPageText: vi.fn(),
      removeSelectedPageText: vi.fn(),
    };
    
    useCase = new GetSelectedPageTextUseCase(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return selected text and remove it when text exists', async () => {
    // Arrange
    const selectedPageText = new SelectedPageText('test text');
    vi.mocked(mockRepository.getSelectedPageText).mockResolvedValue(selectedPageText);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBe('test text');
    expect(mockRepository.getSelectedPageText).toHaveBeenCalledTimes(1);
    expect(mockRepository.removeSelectedPageText).toHaveBeenCalledTimes(1);
  });

  it('should return empty text when no text exists', async () => {
    // Arrange
    const emptyText = new SelectedPageText('');
    vi.mocked(mockRepository.getSelectedPageText).mockResolvedValue(emptyText);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBe('');
    expect(mockRepository.getSelectedPageText).toHaveBeenCalledTimes(1);
    expect(mockRepository.removeSelectedPageText).not.toHaveBeenCalled();
  });
});