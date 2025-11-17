/**
 * E2Eテストの設定
 */

/**
 * 環境に応じた拡張機能のディレクトリ名を取得
 * @returns 拡張機能が配置されているディレクトリ名
 */
export function getExtensionDirectory(): string {
  const isCI = process.env.CI;
  if (isCI) {
    return '.output/chrome-mv3';
  }
  return '.output/chrome-mv3-dev';
}
