// Application Business Rules DTO naming conventions
// See: docs/coding-standards/src/application-business-rules/dto.md
//
// Input DTO: [機能名]InputData
// Output DTO: [機能名]OutputData

export default {
  files: [
    '**/application-business-rules/dto/input/**/*.ts',
    '**/application-business-rules/dto/output/**/*.ts',
  ],
  rules: {
    // DTO files must follow naming conventions
    // Input DTOs must end with "InputData"
    // Output DTOs must end with "OutputData"
    // Note: File naming conventions are documented; actual enforcement
    // would require a custom ESLint rule or eslint-plugin-filenames
  },
};
