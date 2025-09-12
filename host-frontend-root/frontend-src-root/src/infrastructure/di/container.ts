// Simple DI container without external dependencies for now
type ServiceResolver<T = any> = () => T;
type Constructor<T = any> = new (...args: any[]) => T;

export class SimpleContainer {
  private services = new Map<Constructor, ServiceResolver>();

  register<T>(constructor: Constructor<T>, resolver: ServiceResolver<T>): void {
    this.services.set(constructor, resolver);
  }

  resolve<T>(constructor: Constructor<T>): T {
    const resolver = this.services.get(constructor);
    if (!resolver) {
      throw new Error(`Service ${constructor.name} not found`);
    }
    return resolver() as T;
  }
}

export const container = new SimpleContainer();

// Register services
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleStorageChangedUseCase } from 'src/application/usecases/rule/HandleStorageChangedUseCase';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

container.register(HandleContextMenuReplaceDomElement, () => new HandleContextMenuReplaceDomElement());
container.register(ContextMenuSetupUseCase, () => new ContextMenuSetupUseCase());
container.register(HandleStorageChangedUseCase, () => new HandleStorageChangedUseCase());
container.register(ChromeTabsService, () => new ChromeTabsService());
