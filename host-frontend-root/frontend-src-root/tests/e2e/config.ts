/**
 * E2Eテストの設定
 */

/**
 * 環境に応じた拡張機能のディレクトリ名を取得
 *
 * CI環境では環境変数EXTENSION_DIRで指定されたディレクトリを使用
 * ローカル環境ではdev用のディレクトリを使用
 *
 * @returns 拡張機能が配置されているディレクトリ名
 */
export function getExtensionDirectory(): string {
  const extensionDir = process.env.EXTENSION_DIR;
  if (extensionDir) {
    return extensionDir;
  }
  return '.output/chrome-mv3-dev';
}
