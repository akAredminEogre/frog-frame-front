// cspell:ignore usecases
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';

type ApplyAllRulesMessage = { type: 'applyAllRules'; tabUrl: string };

/**
 * applyAllRules message handler for content script
 * ページに保存されたすべてのルールを適用する
 *
 * 呼び出し経路:
 * 1. chrome.runtime.onMessage.addListener が chrome から message を受信
 * 2. listeners/runtime/content.onMessage.ts の registerRuntimeOnMessageForContent が message を route 関数に渡す
 * 3. router/content/messageRouter.ts の createContentMessageRouter が message を適切な handler に振り分ける
 * 4. このハンドラーが呼び出される（router/content/messageRouter.ts の handler(message)）
 */
export const applyAllRulesHandler = async (msg: ApplyAllRulesMessage) => {
  // Content Script用: Chrome Runtime Messaging経由でデータアクセス
  const rewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
  const applySavedRulesOnPageLoadUseCase = new ApplySavedRulesOnPageLoadUseCase(
    rewriteRuleRepository
  );

  await applySavedRulesOnPageLoadUseCase.applyAllRules(document.body, msg.tabUrl);
  return { success: true };
};
