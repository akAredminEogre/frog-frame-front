/**
 * ルールJSONインポートの入力データ
 * CA準拠: ControllerはFileをDTOにラップしてUseCase（Interactor）に渡す。
 * fileの読み取り・サイズチェックはInteractor内で実施する。
 */
export class ImportRulesJsonInputData {
  constructor(
    public readonly file: File
  ) {}
}
