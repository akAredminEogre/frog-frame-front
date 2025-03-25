import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['contextMenus', 'storage'],
  },
  dev: {
    server: {
      hostname: '0.0.0.0',
      port: 3000,
    }
  },
  runner: {
    disabled: true,
  },
  vite:() =>  ({
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true, 
      hmr: {
        port: 3000,
      },
      ws: {
        host: process.env.CHROME_WS_HOST,
        port: process.env.CHROME_WS_PORT,
      }
    }
  }),
});
