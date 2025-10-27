// cspell:ignore usecases
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';

type GetElementSelectionMessage = { type: 'getElementSelection' };

/**
 * getElementSelection message handler for content script
 * 現在選択されている要素の情報を取得する
 *
 * @param _msg - メッセージオブジェクト（このハンドラーでは使用しないが、統一的なハンドラーシグネチャのために受け取る）
 *
 * 呼び出し経路:
 * 1. chrome.runtime.onMessage.addListener が chrome から message を受信
 * 2. content.runtime.onMessage.ts の registerRuntimeOnMessageForContent が message を route 関数に渡す
 * 3. content.messageRouter.ts の createContentMessageRouter が message を適切な handler に振り分ける
 * 4. このハンドラーが呼び出される（content.messageRouter.ts の 23行目: handler(message)）
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
export const getElementSelectionHandler = async (_msg: GetElementSelectionMessage) => {
  const getElementSelectionUseCase = new GetElementSelectionUseCase();
  return getElementSelectionUseCase.getElementSelectionInfo();
};
