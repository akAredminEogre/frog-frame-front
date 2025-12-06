/**
 * MutationObserverの制御を抽象化するポートインターフェース
 *
 * ルール適用中にDOM変更がMutationObserverをトリガーし、
 * 重複適用を引き起こすのを防ぐために使用する
 */
export interface IObserverControl {
  disconnect(): void;
  reconnect(): void;
}
