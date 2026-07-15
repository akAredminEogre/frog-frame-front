// Rule 9: Getter、Setter、プロパティを使用しないこと
// See: docs/coding-standards/src/object-oriented-nine-rules.md

// no-restricted-syntax selectors for this rule (aggregated per glob in main.js — see main.js).
export const noGetterSetterRestrictedSyntax = [
  {
    selector: 'MethodDefinition[kind="get"]',
    message: 'Getter is not allowed (Rule 9: Getter、Setter、プロパティを使用しないこと)',
  },
  {
    selector: 'MethodDefinition[kind="set"]',
    message: 'Setter is not allowed (Rule 9: Getter、Setter、プロパティを使用しないこと)',
  },
];

// files glob this rule applies to (browser layer only).
export const noGetterSetterFiles = ['**/frameworks-and-drivers/browser/**/*.ts'];
