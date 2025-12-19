// Object-Oriented Nine Rules ESLint configuration
// See: docs/coding-standards/src/object-oriented-nine-rules.md

import noElse from './no-else.js';
import oneDotPerLine from './one-dot-per-line.js';
import maxInstanceVariables from './max-instance-variables.js';
import noGetterSetter from './no-getter-setter.js';

export default [
  noElse,
  oneDotPerLine,
  maxInstanceVariables,
  noGetterSetter,
];
