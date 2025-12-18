// Clean Architecture ESLint rules
// Aggregates all clean-architecture layer-specific rules

import contentOnMessageReceivedUsecases from '#eslint-rules/clean-architecture/application/usecases/contentOnMessageReceived.js';
import domain from '#eslint-rules/clean-architecture/domain.js';
import backgroundHandlers from '#eslint-rules/clean-architecture/infrastructure/browser/handlers/background.js';
import contentHandlers from '#eslint-rules/clean-architecture/infrastructure/browser/handlers/content.js';

export default [
  domain,
  backgroundHandlers,
  contentHandlers,
  contentOnMessageReceivedUsecases,
];
