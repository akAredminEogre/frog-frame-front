// cspell:ignore usecases
import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';
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
  // Content Script用: DI containerから依存関係を解決
  // Content Scriptでは@injectable()デコレーターが正しく動作しない場合があるため、
  // 依存関係を手動で解決してUseCaseを作成する
  const repository = contentContainer.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
  const currentUrlService = contentContainer.resolve<ICurrentUrlService>('ICurrentUrlService');
  const applyRulesOnPageLoadUseCase = new ApplyRulesOnPageLoadUseCase(repository, currentUrlService);

  await applyRulesOnPageLoadUseCase.exec(document.body);
  return { success: true };
};
