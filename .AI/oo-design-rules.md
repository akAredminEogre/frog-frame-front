# Object-Oriented Design Rules (ThoughtWorks Anthology)

These 9 rules are strictly enforced:

1. One level of indentation per method
2. Don't use else clauses
3. Wrap all primitives and strings (exceptions: test mocks, sendMessage parameters, catch error objects)
4. One dot per line (exception: Chrome API calls)
5. Don't abbreviate names
6. Keep all entities small
7. Maximum 2 instance variables per class
8. Use first-class collections
9. No getters/setters/properties

## Method Design

- Methods MUST use instance variables (exception: infrastructure layer)
- Don't create unused methods (no speculative coding like `isValid()` or `equals()`)

## Class Design

- When adding a class, add unit tests too
- Prefer modifying methods to use instance variables rather than adding new ones

詳細は `docs/coding-standards/src/object-oriented-nine-rules.md` を参照。
