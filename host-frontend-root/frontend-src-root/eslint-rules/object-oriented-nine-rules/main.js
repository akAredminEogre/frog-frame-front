// Object-Oriented Nine Rules ESLint configuration
// See: docs/coding-standards/src/object-oriented-nine-rules.md

import { useCaseRestrictedSyntax } from '#eslint-rules/clean-architecture/application-business-rules/use-cases.js';
import entitySize from '#eslint-rules/object-oriented-nine-rules/entity-size.js';
import { BROWSER_GLOB, INTERACTORS_GLOB } from '#eslint-rules/object-oriented-nine-rules/globs.js';
import indentDepth from '#eslint-rules/object-oriented-nine-rules/indent-depth.js';
import noElse, { noElseRestrictedSyntax } from '#eslint-rules/object-oriented-nine-rules/no-else.js';
import { noGetterSetterRestrictedSyntax } from '#eslint-rules/object-oriented-nine-rules/no-getter-setter.js';
import noNameAbbreviation from '#eslint-rules/object-oriented-nine-rules/no-name-abbreviation.js';
import { noSwitchCaseRestrictedSyntax } from '#eslint-rules/object-oriented-nine-rules/no-switch-case.js';
import { oneDotPerLineRestrictedSyntax } from '#eslint-rules/object-oriented-nine-rules/one-dot-per-line.js';

// ESLint flat config does NOT merge rule options across config objects: for a given rule key,
// the LAST matching config wins entirely. Previously no-else / one-dot-per-line / no-getter-setter
// / no-switch-case each declared their own `no-restricted-syntax` config on overlapping globs
// (browser / interactors), so only no-switch-case (last in the array) stayed effective and the
// other selectors were silently clobbered (verified via `eslint --print-config`).
//
// Fix: aggregate every `no-restricted-syntax` selector into a single config per glob so all
// selectors coexist. This includes OO9 selectors AND clean-architecture interactor selectors
// (useCaseRestrictedSyntax), because eslint.config.js spreads ...objectOrientedNineRules after
// ...cleanArchitecture — without aggregation the OO9 interactors config would clobber the
// clean-architecture use-cases no-restricted-syntax rules.
//
// Browser and interactors globs are disjoint, so exactly one of these configs matches any file.
// BROWSER_GLOB / INTERACTORS_GLOB come from globs.js (single source of truth).

// one-dot-per-line is excluded from test files ONLY: fluent assertions such as
// `expect(x).not.toHaveBeenCalledWith(y)` structurally cannot satisfy the rule. Every other
// selector (else / getter / setter / switch) still applies to tests, and production sources
// keep the full selector set.
const TESTS_GLOB = '**/tests/**';

const noRestrictedSyntaxBrowserSrc = {
  files: [BROWSER_GLOB],
  ignores: [TESTS_GLOB],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...noElseRestrictedSyntax,
      ...oneDotPerLineRestrictedSyntax,
      ...noGetterSetterRestrictedSyntax,
      ...noSwitchCaseRestrictedSyntax,
    ],
  },
};

// files: [[a, b]] (nested array) = a file must match BOTH patterns (tests ∩ browser glob).
const noRestrictedSyntaxBrowserTests = {
  files: [[TESTS_GLOB, BROWSER_GLOB]],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...noElseRestrictedSyntax,
      ...noGetterSetterRestrictedSyntax,
      ...noSwitchCaseRestrictedSyntax,
    ],
  },
};

const noRestrictedSyntaxInteractorsSrc = {
  files: [INTERACTORS_GLOB],
  ignores: [TESTS_GLOB],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...oneDotPerLineRestrictedSyntax,
      ...noSwitchCaseRestrictedSyntax,
      ...useCaseRestrictedSyntax,
    ],
  },
};

const noRestrictedSyntaxInteractorsTests = {
  files: [[TESTS_GLOB, INTERACTORS_GLOB]],
  rules: {
    'no-restricted-syntax': ['error', ...noSwitchCaseRestrictedSyntax],
  },
};

export default [
  noElse, // no-else-return only (its no-restricted-syntax selector is folded in above)
  noRestrictedSyntaxBrowserSrc,
  noRestrictedSyntaxBrowserTests,
  noRestrictedSyntaxInteractorsSrc,
  noRestrictedSyntaxInteractorsTests,
  ...indentDepth,
  noNameAbbreviation,
  ...entitySize,
];
