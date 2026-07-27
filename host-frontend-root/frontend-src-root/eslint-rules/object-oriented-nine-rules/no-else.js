// Rule 2: else句を使用しないこと
// See: docs/coding-standards/src/object-oriented-nine-rules.md

import { BROWSER_GLOB } from '#eslint-rules/object-oriented-nine-rules/globs.js';

// no-restricted-syntax selectors for this rule. Exported as data and aggregated per glob in
// main.js — ESLint flat config does not merge rule options, so multiple config objects each
// setting `no-restricted-syntax` on overlapping globs would clobber (last match wins entirely).
export const noElseRestrictedSyntax = [
  {
    selector: 'IfStatement > .alternate',
    message: 'else clause is not allowed (Rule 2: else句を使用しないこと)',
  },
];

// files glob this rule applies to (browser layer only).
export const noElseFiles = [BROWSER_GLOB];

// Non no-restricted-syntax rules keep their own config object (unique rule keys never clobber).
export default {
  files: noElseFiles,
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
  },
};
