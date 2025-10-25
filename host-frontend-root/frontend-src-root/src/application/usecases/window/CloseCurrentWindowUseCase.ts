import { inject,injectable } from 'tsyringe';

import { IWindowService } from 'src/application/ports/IWindowService';

@injectable()
export class CloseCurrentWindowUseCase {
  constructor(
    @inject('IWindowService')
    private readonly windowService: IWindowService
  ) {}

  async execute(): Promise<void> {
    await this.windowService.closeCurrentWindow();
  }
}
