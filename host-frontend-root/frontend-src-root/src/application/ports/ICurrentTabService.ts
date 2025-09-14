import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

export interface ICurrentTabService {
  getCurrentTab(): Promise<CurrentTab>;
}
