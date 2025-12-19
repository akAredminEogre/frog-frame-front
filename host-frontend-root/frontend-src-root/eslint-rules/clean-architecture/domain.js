// Domain layer entities: prohibit direct access to global document object
// See: docs/design/clean-architecture/domain/entities.md

export default {
  files: [
    '**/domain/entities/ElementSelector.ts',
    '**/domain/entities/ParserContextStrategy.ts',
    '**/domain/value-objects/Elements/Elements.ts',
  ],
  rules: {
    'no-restricted-globals': [
      'error',
      {
        name: 'document',
        message: 'Direct access to "document" is prohibited in Domain layer. Use IDomRootChecker via dependency injection instead.',
      },
    ],
  },
};
