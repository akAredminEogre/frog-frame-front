// Clean Architecture ESLint rules
// Aggregates all clean-architecture layer-specific rules

import contentOnMessageReceivedUsecases from './application/usecases/contentOnMessageReceived.js';
import domain from './domain.js';
import backgroundHandlers from './infrastructure/browser/handlers/background.js';
import contentHandlers from './infrastructure/browser/handlers/content.js';

export default [
  domain,
  backgroundHandlers,
  contentHandlers,
  contentOnMessageReceivedUsecases,
];
