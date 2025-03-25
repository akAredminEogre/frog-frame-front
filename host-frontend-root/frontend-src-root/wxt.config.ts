import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['contextMenus', 'storage'],
    content_security_policy: {
      extension_pages: "script-src 'self' 'unsafe-eval'; object-src 'self'"
    }
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
      }
    }
  }),
});
