import { inject, injectable } from 'tsyringe';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';

@injectable()
export class GetSelectedPageTextUseCase {
  constructor(
    @inject('ISelectedPageTextRepository')
    private readonly selectedPageTextRepository: ISelectedPageTextRepository
  ) {}

  async execute(): Promise<string> {
    const selectedPageText = await this.selectedPageTextRepository.getSelectedPageText();
    const textValue = selectedPageText.toString();
    if (textValue !== '') {
      await this.selectedPageTextRepository.removeSelectedPageText();
    }
    return textValue;
  }
}