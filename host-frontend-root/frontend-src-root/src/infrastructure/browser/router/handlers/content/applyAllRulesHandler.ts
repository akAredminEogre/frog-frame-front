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
 * 2. runtime.onMessage.content.ts の registerRuntimeOnMessageForContent が message を route 関数に渡す
 * 3. messageRouter.content.ts の createContentMessageRouter が message を適切な handler に振り分ける
 * 4. このハンドラーが呼び出される（messageRouter.content.ts の 23行目: handler(message)）
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
