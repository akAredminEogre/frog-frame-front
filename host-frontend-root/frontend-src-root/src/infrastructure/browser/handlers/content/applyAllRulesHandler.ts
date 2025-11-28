// cspell:ignore usecases
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { contentContainer } from 'src/infrastructure/di/contentContainer';

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
export const applyAllRulesHandler = async () => {
  // Content Script用: DI containerからUseCaseを解決
  // IRewriteRuleRepository と ICurrentUrlService が自動的に注入される
  const applySavedRulesOnPageLoadUseCase = contentContainer.resolve(ApplySavedRulesOnPageLoadUseCase);

  await applySavedRulesOnPageLoadUseCase.exec(document.body);
  return { success: true };
};
