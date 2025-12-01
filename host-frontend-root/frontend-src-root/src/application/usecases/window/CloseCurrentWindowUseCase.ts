import { IWindowService } from 'src/application/ports/IWindowService';

export class CloseCurrentWindowUseCase {
  constructor(
    private readonly windowService: IWindowService
  ) {}

  async execute(): Promise<void> {
    await this.windowService.closeCurrentWindow();
  }
}
