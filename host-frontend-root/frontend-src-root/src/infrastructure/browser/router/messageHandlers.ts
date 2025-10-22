import { applyAllRulesHandler } from 'src/infrastructure/browser/router/handlers/applyAllRulesHandler';
import { pingHandler } from 'src/infrastructure/browser/router/handlers/pingHandler';
import { getAllRewriteRulesHandler } from 'src/infrastructure/browser/router/handlers/getAllRewriteRulesHandler';

/**
 * Message handlers aggregator
 * 各ハンドラを個別ファイルから集約してエクスポートする
 */
export const handlers = {
  applyAllRules: applyAllRulesHandler,
  ping: pingHandler,
  getAllRules: getAllRewriteRulesHandler,
};
