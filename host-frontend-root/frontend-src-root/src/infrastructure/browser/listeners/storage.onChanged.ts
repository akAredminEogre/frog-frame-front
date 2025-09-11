import type { SimpleContainer } from 'src/infrastructure/di/container';
import { HandleStorageChangedUseCase } from 'src/application/usecases/rule/HandleStorageChangedUseCase';

export function registerStorageOnChanged(container: SimpleContainer) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    const handleStorageChangedUseCase = container.resolve(HandleStorageChangedUseCase);
    handleStorageChangedUseCase.execute(changes, namespace);
  });
}
