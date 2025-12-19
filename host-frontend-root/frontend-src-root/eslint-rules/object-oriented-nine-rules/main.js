// Object-Oriented Nine Rules ESLint configuration
// See: docs/coding-standards/src/object-oriented-nine-rules.md

import noElse from '#eslint-rules/object-oriented-nine-rules/no-else.js';
import oneDotPerLine from '#eslint-rules/object-oriented-nine-rules/one-dot-per-line.js';
import maxInstanceVariables from '#eslint-rules/object-oriented-nine-rules/max-instance-variables.js';
import noGetterSetter from '#eslint-rules/object-oriented-nine-rules/no-getter-setter.js';

export default [
  noElse,
  oneDotPerLine,
  maxInstanceVariables,
  noGetterSetter,
];
