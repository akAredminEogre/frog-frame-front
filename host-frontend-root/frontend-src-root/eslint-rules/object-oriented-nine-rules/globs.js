// Single source of truth for the OO9 layer globs.
// main.js aggregates every rule's no-restricted-syntax selectors per glob, while each rule file
// exports its own `*Files` scope for documentation. Both sides import these constants so the glob
// strings are defined exactly once — updating a layer's path here keeps every rule in sync and
// prevents the selection range from drifting between main.js and the individual rule files.
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export const BROWSER_GLOB = '**/frameworks-and-drivers/browser/**/*.ts';
export const INTERACTORS_GLOB = '**/application-business-rules/interactors/**/*.ts';
