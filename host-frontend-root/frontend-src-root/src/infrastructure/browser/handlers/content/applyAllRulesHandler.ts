// cspell:ignore usecases
import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

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
  // 手動DI解決: tsyringeのデコレーターメタデータ問題を回避するため
  // 依存関係を明示的にインスタンス化してUseCaseを作成
  const repository = new ChromeRuntimeRewriteRuleRepository();
  const currentUrlService = new WindowCurrentUrlService();
  const applyRulesOnPageLoadUseCase = new ApplyRulesOnPageLoadUseCase(repository, currentUrlService);

  await applyRulesOnPageLoadUseCase.exec(document.body);
  return { success: true };
};
