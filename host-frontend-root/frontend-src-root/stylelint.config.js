/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // CSS Modules support: allow :global and :local pseudo-selectors
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    // Allow CSS custom properties (CSS variables)
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    // Disable rules that conflict with CSS Modules patterns
    'selector-class-pattern': null,
    // Allow empty source files
    'no-empty-source': null,
  },
};
