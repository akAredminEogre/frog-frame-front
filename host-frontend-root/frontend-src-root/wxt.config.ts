import { defineConfig } from 'wxt';
import tsconfigPaths from 'vite-tsconfig-paths';

// 環境変数から開発サーバー設定を取得
const devHost = process.env.WXT_DEV_HOST || 'localhost';
const devPort = process.env.WXT_DEV_PORT ? parseInt(process.env.WXT_DEV_PORT, 10) : 3000;

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['contextMenus', 'storage', 'tabs', 'scripting'],
    host_permissions: ['<all_urls>']
  },
  dev: {
    server: {
      host: devHost,
      port: devPort,
    }
  },
  webExt: {
    disabled: true,
  },
  vite:() =>  ({
    plugins: [tsconfigPaths()],
    server: {
      host: devHost,
      port: devPort,
      strictPort: true, 
      hmr: {
        port: devPort,
      }
    }
  }),
});
