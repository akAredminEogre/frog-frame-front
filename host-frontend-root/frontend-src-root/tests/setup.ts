/**
 * Vitest グローバルセットアップファイル
 * テスト実行前にブラウザAPIのモックを設定
 */
import { beforeAll,vi } from 'vitest';

/**
 * @webext-core/proxy-service で使用される browser.runtime.getManifest をモック
 * WxtVitestプラグインが@webext-core/fake-browserを設定するため、
 * 既存のbrowserオブジェクトのgetManifestメソッドをパッチする
 */
beforeAll(() => {
  // @webext-core/fake-browserが設定したbrowserオブジェクトが存在する場合
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
});
