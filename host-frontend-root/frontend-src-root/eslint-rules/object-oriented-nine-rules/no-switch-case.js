// Rule 2: else句禁止 — switch-case使用禁止
// See: docs/coding-standards/src/object-oriented-nine-rules.md

import { BROWSER_GLOB, INTERACTORS_GLOB } from '#eslint-rules/object-oriented-nine-rules/globs.js';

// no-restricted-syntax selectors for this rule (aggregated per glob in main.js — see main.js).
export const noSwitchCaseRestrictedSyntax = [
  {
    selector: 'SwitchStatement',
    message:
      'switch-case is not allowed (Rule 2: else句禁止/switch-case分離). Use early return, guard clauses, or polymorphism instead.',
  },
];

// files globs this rule applies to (browser + interactors layers).
export const noSwitchCaseFiles = [BROWSER_GLOB, INTERACTORS_GLOB];
