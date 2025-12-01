import { IObserverControl } from 'src/application/ports/IObserverControl';

/**
 * MutationObserverの状態を管理するモジュール
 *
 * onMutate.tsとdomMutationUseCaseInstance.tsの循環参照を解消するため、
 * observer関連の状態と操作をこのモジュールに分離する
 */
let observer: MutationObserver | null = null;

export function setObserver(obs: MutationObserver) {
  observer = obs;
}

export function getObserver(): MutationObserver | null {
  return observer;
}

/**
 * MutationObserverを一時停止する
 */
export function disconnectObserver() {
  observer?.disconnect();
}

/**
 * MutationObserverを再開する
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
export const observerControl: IObserverControl = {
  disconnect: disconnectObserver,
  reconnect: reconnectObserver,
};
