import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';

export class WindowCurrentUrlService implements ICurrentUrlService {
  getCurrentUrl(): string {
    return window.location.href;
  }
}
