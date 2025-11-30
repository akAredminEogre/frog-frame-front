import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { observerControl } from 'src/infrastructure/browser/content/observer/observerState';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

/**
 * Content Script用のApplyRulesOnDomMutationUseCaseシングルトンインスタンス
 *
 * ページロード時のルール適用（applyRulesToRoot）とDOM Mutation時のルール適用（handleMutations）
 * の両方で同一インスタンスを使用することで、状態管理を簡素化する
 *
 * 手動DI解決: tsyringeのデコレーターメタデータ問題を回避するため
 * Content Scriptではデコレーターが正しく動作しないので、依存関係を明示的にインスタンス化
 *
 * observerControl: observerState.tsから取得
 * - observer状態を別モジュールに分離することで循環参照を回避
 */
const repository = new ChromeRuntimeRewriteRuleRepository();
const currentUrlService = new WindowCurrentUrlService();
const debounceTimer = new DebounceTimer();

export const domMutationUseCaseInstance = new ApplyRulesOnDomMutationUseCase(
  repository,
  currentUrlService,
  debounceTimer,
  observerControl
);
