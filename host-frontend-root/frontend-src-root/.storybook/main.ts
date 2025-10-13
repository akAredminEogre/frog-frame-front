import tsconfigPaths from 'vite-tsconfig-paths';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (config: any) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tsconfigPaths());
    return config;
  }
};
export default config;
