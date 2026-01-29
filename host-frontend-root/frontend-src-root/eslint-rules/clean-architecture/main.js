// Clean Architecture ESLint rules
// Aggregates all clean-architecture layer-specific rules

import contentOnMessageReceivedUsecases from '#eslint-rules/clean-architecture/application/usecases/contentOnMessageReceived.js';
import applicationBusinessRulesDto from '#eslint-rules/clean-architecture/application-business-rules/dto.js';
import domain from '#eslint-rules/clean-architecture/domain.js';
import frameworksAndDriversMessagingDto from '#eslint-rules/clean-architecture/frameworks-and-drivers/messaging/dto.js';
import frameworksAndDriversMessagingService from '#eslint-rules/clean-architecture/frameworks-and-drivers/messaging/service.js';
import frameworksAndDriversUiAtoms from '#eslint-rules/clean-architecture/frameworks-and-drivers/ui/atoms.js';
import backgroundHandlers from '#eslint-rules/clean-architecture/frameworks-and-drivers/messaging/handlers/background.js';
import contentHandlers from '#eslint-rules/clean-architecture/frameworks-and-drivers/messaging/handlers/content.js';

export default [
  ...applicationBusinessRulesDto,
  contentOnMessageReceivedUsecases,
  domain,
  ...frameworksAndDriversMessagingDto,
  frameworksAndDriversMessagingService,
  frameworksAndDriversUiAtoms,
  backgroundHandlers,
  contentHandlers,
];
