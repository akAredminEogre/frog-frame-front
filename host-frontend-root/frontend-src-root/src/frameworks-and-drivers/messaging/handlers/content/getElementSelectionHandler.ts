// cspell:ignore usecases
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { contentContainer } from 'src/frameworks-and-drivers/di/contentContainer';

type GetElementSelectionMessage = { type: 'getElementSelection' };

/**
 * getElementSelection message handler for content script
 * 現在選択されている要素の情報を取得する
 *
 * @param _msg - メッセージオブジェクト（このハンドラーでは使用しないが、統一的なハンドラーシグネチャのために受け取る）
 *
 * 呼び出し経路:
 * 1. @webext-core/messaging の onContentScriptMessage でメッセージを受信
 * 2. content/runtime/onMessageReceived.ts でハンドラーが登録される
 * 3. このハンドラーが呼び出される
 *
 * Awilix DIコンテナから解決: contentContainer.tsで登録されたインスタンスを取得
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
export const getElementSelectionHandler = async (_msg: GetElementSelectionMessage) => {
  const getElementSelectionUseCase = contentContainer.resolve(GetElementSelectionUseCase);
  return getElementSelectionUseCase.getElementSelectionInfo();
};
