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
  console.log('[DEBUG] observerOnMutate: creating MutationObserver');
  observer = new MutationObserver((mutations) => {
    console.log('[DEBUG] MutationObserver callback: received', mutations.length, 'mutations');
    domMutationUseCaseInstance.handleMutations(mutations);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[DEBUG] observerOnMutate: observer started');
}

/**
 * MutationObserverを一時停止する
 *
 * ルール適用中にDOM変更がMutationObserverをトリガーし、重複適用を引き起こすのを防ぐ
 * 適用完了後はreconnectObserverを呼び出すこと
 */
export function disconnectObserver() {
  console.log('[DEBUG] disconnectObserver: called, observer=', observer ? 'exists' : 'null');
  observer?.disconnect();
  console.log('[DEBUG] disconnectObserver: done');
}

/**
 * MutationObserverを再開する
 *
 * disconnectObserverで停止したobserverを再開する
 */
export function reconnectObserver() {
  console.log('[DEBUG] reconnectObserver: called, observer=', observer ? 'exists' : 'null');
  observer?.observe(document.body, { childList: true, subtree: true });
  console.log('[DEBUG] reconnectObserver: done');
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
