/**
 * Vitest グローバルセットアップファイル
 * テスト実行前にブラウザAPIのモックを設定
 *
 * 重要: モックはトップレベルで設定する必要がある
 * beforeAll() を使用すると、DIコンテナのモジュール評価時には
 * まだモックが設定されていないため、エラーになる
 */
import { vi } from 'vitest';

/**
 * @webext-core/proxy-service で使用される browser.runtime.getManifest をモック
 * WxtVitestプラグインが@webext-core/fake-browserを設定するため、
 * 既存のbrowserオブジェクトのgetManifestメソッドをパッチする
 *
 * トップレベルで実行することで、DIコンテナなどのモジュールがインポートされる前に
 * モックが確実に設定される
 */
if (typeof browser !== 'undefined' && browser?.runtime) {
  // getManifestをモックで上書き
  browser.runtime.getManifest = vi.fn().mockReturnValue({
    name: 'Test Extension',
    version: '1.0.0',
    manifest_version: 3,
    background: {
      service_worker: 'background.js'
    }
  });
}
