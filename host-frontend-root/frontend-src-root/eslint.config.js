// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import js from '@eslint/js';

// Import rule configurations
import base from './eslint-rules/base.js';
import importSort from './eslint-rules/import-sort.js';
import typescript from './eslint-rules/typescript.js';
import react from './eslint-rules/react.js';
import general from './eslint-rules/general.js';
import noRelativePaths from './eslint-rules/no-relative-paths.js';
import backgroundHandlers from './eslint-rules/clean-architecture/infrastructure/browser/handlers/background.js';
import contentHandlers from './eslint-rules/clean-architecture/infrastructure/browser/handlers/content.js';
import contentUsecases from './eslint-rules/clean-architecture/application/usecases/contentOnMessageReceived.js';
import domainLayer from './eslint-rules/clean-architecture/domain.js';
import ignores from './eslint-rules/ignores.js';

export default [
  js.configs.recommended,
  base,
  importSort,
  typescript,
  react,
  general,
  noRelativePaths,
  backgroundHandlers,
  contentHandlers,
  contentUsecases,
  domainLayer,
  ignores,
  ...storybook.configs["flat/recommended"],
];
