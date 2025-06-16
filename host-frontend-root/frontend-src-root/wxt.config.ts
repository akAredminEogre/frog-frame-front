import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['contextMenus', 'storage', 'tabs', 'scripting'],
    host_permissions: ['<all_urls>']
  },
  dev: {
    server: {
      host: 'localhost',
      port: 3000,
    }
  },
  webExt: {
    disabled: true,
  },
  vite:() =>  ({
    server: {
      host: 'localhost',
      port: 3000,
      strictPort: true, 
      hmr: {
        port: 3000,
      }
    }
  }),
});
