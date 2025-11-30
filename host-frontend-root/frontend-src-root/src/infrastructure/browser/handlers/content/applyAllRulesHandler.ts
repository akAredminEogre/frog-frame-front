import { domMutationUseCaseInstance } from 'src/infrastructure/browser/content/instance/domMutationUseCaseInstance';

/**
 * applyAllRules message handler for content script
 * ページに保存されたすべてのルールを適用する
 *
 * 呼び出し経路:
 * 1. chrome.runtime.onMessage.addListener が chrome から message を受信
 * 2. listeners/runtime/content.onMessage.ts の registerRuntimeOnMessageForContent が message を route 関数に渡す
 * 3. router/content/messageRouter.ts の createContentMessageRouter が message を適切な handler に振り分ける
 * 4. このハンドラーが呼び出される（router/content/messageRouter.ts の handler(message)）
 *
 * domMutationUseCaseInstanceはシングルトンで、onMutate.tsと共有される
 * これにより、ページロード時とDOM Mutation時のルール適用の状態管理が簡素化される
 */
export const applyAllRulesHandler = async () => {
  await domMutationUseCaseInstance.applyRulesToRoot(document.body);
  return { success: true };
};
