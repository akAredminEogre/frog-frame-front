import { IObserverControl } from 'src/application/ports/IObserverControl';
import { domMutationUseCaseInstance } from 'src/infrastructure/browser/content/instance/domMutationUseCaseInstance';

let observer: MutationObserver | null = null;

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 *
 * domMutationUseCaseInstanceはシングルトンで、applyAllRulesHandler.tsと共有される
 * これにより、ページロード時とDOM Mutation時のルール適用の状態管理が簡素化される
 */
export function observerOnMutate() {
  observer = new MutationObserver((mutations) => domMutationUseCaseInstance.handleMutations(mutations));
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * MutationObserverを一時停止する
 *
 * ルール適用中にDOM変更がMutationObserverをトリガーし、重複適用を引き起こすのを防ぐ
 * 適用完了後はreconnectObserverを呼び出すこと
 */
export function disconnectObserver() {
  observer?.disconnect();
}

/**
 * MutationObserverを再開する
 *
 * disconnectObserverで停止したobserverを再開する
 */
export function reconnectObserver() {
  observer?.observe(document.body, { childList: true, subtree: true });
}

/**
 * IObserverControl実装インスタンス
 *
 * ApplyRulesOnDomMutationUseCaseに注入され、
 * ルール適用中のMutationObserver制御に使用される
 */
export const observerControlInstance: IObserverControl = {
  disconnect: disconnectObserver,
  reconnect: reconnectObserver,
};
