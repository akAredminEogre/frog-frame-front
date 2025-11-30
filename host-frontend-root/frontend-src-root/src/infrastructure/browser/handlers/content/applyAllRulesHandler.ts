import { domMutationUseCaseInstance } from 'src/infrastructure/browser/content/instance/domMutationUseCaseInstance';
import { disconnectObserver, reconnectObserver } from 'src/infrastructure/browser/content/observer/onMutate';

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
 *
 * MutationObserverはルール適用中に一時停止される:
 * - DOM変更がMutationObserverをトリガーし、重複適用を引き起こすのを防ぐ
 * - 適用完了後に再開され、lazy loadコンテンツなどを監視する
 */
export const applyAllRulesHandler = async () => {
  console.log('[DEBUG] applyAllRulesHandler: START');
  console.log('[DEBUG] applyAllRulesHandler: calling disconnectObserver');
  disconnectObserver();
  console.log('[DEBUG] applyAllRulesHandler: disconnectObserver done');
  try {
    console.log('[DEBUG] applyAllRulesHandler: calling applyRulesToRoot');
    await domMutationUseCaseInstance.applyRulesToRoot(document.body);
    console.log('[DEBUG] applyAllRulesHandler: applyRulesToRoot done');
    return { success: true };
  } finally {
    console.log('[DEBUG] applyAllRulesHandler: calling reconnectObserver');
    reconnectObserver();
    console.log('[DEBUG] applyAllRulesHandler: END');
  }
};
