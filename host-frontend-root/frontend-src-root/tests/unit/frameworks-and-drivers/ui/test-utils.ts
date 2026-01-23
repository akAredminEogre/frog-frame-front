/**
 * UIコンポーネント共通テストユーティリティ
 *
 * 複数のコンポーネントテストで共通に使用するユーティリティ関数を提供。
 * 重複を避けるため、テストヘルパー固有でないユーティリティはここに配置する。
 */

/**
 * React更新をフラッシュするためのユーティリティ
 *
 * 非同期React更新を完了させるためにマイクロタスクキューをフラッシュする。
 * 注意: act()の内部で使用すること（act外で使用するとReact警告が発生する可能性がある）
 *
 * @example
 * await act(async () => {
 *   root.render(<Component />);
 *   await flushPromises();
 * });
 */
export const flushPromises = (): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
};
