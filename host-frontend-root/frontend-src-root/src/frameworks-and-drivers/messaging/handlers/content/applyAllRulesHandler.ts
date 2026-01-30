import { domMutationUseCaseInstance } from 'src/infrastructure/browser/content/instance/domMutationUseCaseInstance';
import { disconnectObserver, reconnectObserver } from 'src/infrastructure/browser/content/observer/onMutate';

/**
 * applyAllRules message handler for content script
 * ページに保存されたすべてのルールを適用する
 *
 * 呼び出し経路:
 * 1. @webext-core/messaging の onContentScriptMessage でメッセージを受信
 * 2. content/runtime/onMessageReceived.ts でハンドラーが登録される
 * 3. このハンドラーが呼び出される
 *
 * domMutationUseCaseInstanceはシングルトンで、onMutate.tsと共有される
 * これにより、ページロード時とDOM Mutation時のルール適用の状態管理が簡素化される
 *
 * MutationObserverはルール適用中に一時停止される:
 * - DOM変更がMutationObserverをトリガーし、重複適用を引き起こすのを防ぐ
 * - 適用完了後に再開され、lazy loadコンテンツなどを監視する
 */
export const applyAllRulesHandler = async () => {
  disconnectObserver();
  try {
    await domMutationUseCaseInstance.applyRulesToRoot(document.body);
    return { success: true };
  } finally {
    reconnectObserver();
  }
};
