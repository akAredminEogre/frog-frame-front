import { IObserverControl } from 'src/application/ports/IObserverControl';
import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
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
 * observerControl: 遅延初期化で循環参照を回避
 * - このファイルとonMutate.tsが相互参照するため、observerControlは
 *   関数でラップしてランタイム解決する
 */
const repository = new ChromeRuntimeRewriteRuleRepository();
const currentUrlService = new WindowCurrentUrlService();
const debounceTimer = new DebounceTimer();

/**
 * 遅延解決のobserverControl
 *
 * onMutate.tsのobserverControlInstanceを直接参照すると循環参照で
 * undefined になる可能性があるため、関数呼び出し時に解決する
 */
const lazyObserverControl: IObserverControl = {
  disconnect: () => {
    console.log('[DEBUG] lazyObserverControl.disconnect: called');
    const { observerControlInstance } = require('src/infrastructure/browser/content/observer/onMutate');
    console.log('[DEBUG] lazyObserverControl.disconnect: observerControlInstance=', observerControlInstance ? 'exists' : 'undefined');
    observerControlInstance.disconnect();
  },
  reconnect: () => {
    console.log('[DEBUG] lazyObserverControl.reconnect: called');
    const { observerControlInstance } = require('src/infrastructure/browser/content/observer/onMutate');
    console.log('[DEBUG] lazyObserverControl.reconnect: observerControlInstance=', observerControlInstance ? 'exists' : 'undefined');
    observerControlInstance.reconnect();
  },
};

export const domMutationUseCaseInstance = new ApplyRulesOnDomMutationUseCase(
  repository,
  currentUrlService,
  debounceTimer,
  lazyObserverControl
);
