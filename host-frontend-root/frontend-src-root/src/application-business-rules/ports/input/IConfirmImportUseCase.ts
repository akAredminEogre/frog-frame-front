import { ConfirmImportInputData } from 'src/application-business-rules/dto/input/ConfirmImportInputData';

export interface IConfirmImportUseCase {
  confirmImport(inputData: ConfirmImportInputData): Promise<void>;
}
