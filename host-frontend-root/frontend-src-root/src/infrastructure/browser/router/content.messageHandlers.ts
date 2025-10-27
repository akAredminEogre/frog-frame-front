import { applyAllRulesHandler } from 'src/infrastructure/browser/router/handlers/content/applyAllRulesHandler';
import { getElementSelectionHandler } from 'src/infrastructure/browser/router/handlers/content/getElementSelectionHandler';

/**
 * Content script message handlers aggregator
 * 各ハンドラを個別ファイルから集約してエクスポートする
 */
export const handlers = {
  getElementSelection: getElementSelectionHandler,
  applyAllRules: applyAllRulesHandler,
};
