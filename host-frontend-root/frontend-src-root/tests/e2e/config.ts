/**
 * E2Eテストの設定
 */

/**
 * 環境に応じた拡張機能のディレクトリ名を取得
 *
 * 環境変数EXTENSION_DIRで指定されたディレクトリを使用
 * 値が明示的に設定されていない場合はエラーをスロー
 *
 * NOTE: IDE (VS Code Playwright extension) での警告は無視してください。
 * 実際のテスト実行時には Docker コンテナ内で EXTENSION_DIR が設定されます。
 *
 * @returns 拡張機能が配置されているディレクトリ名
 * @throws {Error} EXTENSION_DIR環境変数が設定されていない場合
 */
export function getExtensionDirectory(): string {
  const extensionDir = process.env.EXTENSION_DIR;
  if (!extensionDir) {
    throw new Error('EXTENSION_DIR environment variable must be set');
  }
  return extensionDir;
}
