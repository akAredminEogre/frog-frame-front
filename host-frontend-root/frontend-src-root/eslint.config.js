// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import js from '@eslint/js';

// Import rule configurations
import base from '#eslint-rules/base.js';
import importSort from '#eslint-rules/import-sort.js';
import typescript from '#eslint-rules/typescript.js';
import reactRules from '#eslint-rules/react.js';
import general from '#eslint-rules/general.js';
import noRelativePaths from '#eslint-rules/no-relative-paths.js';
import noRelativePathsTests from '#eslint-rules/no-relative-paths-tests.js';
import cleanArchitecture from '#eslint-rules/clean-architecture/main.js';
import ignores from '#eslint-rules/ignores.js';

export default [
  js.configs.recommended,
  base,
  importSort,
  typescript,
  reactRules,
  general,
  noRelativePaths,
  noRelativePathsTests,
  ...cleanArchitecture,
  ignores,
  ...storybook.configs["flat/recommended"],
];
