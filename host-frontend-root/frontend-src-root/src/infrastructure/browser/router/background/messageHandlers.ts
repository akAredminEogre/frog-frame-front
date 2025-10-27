import { applyAllRulesHandler } from 'src/infrastructure/browser/handlers/background/applyAllRulesHandler';
import { getAllRewriteRulesHandler } from 'src/infrastructure/browser/handlers/background/getAllRewriteRulesHandler';

/**
 * Message handlers aggregator
 * 各ハンドラを個別ファイルから集約してエクスポートする
 */
export const handlers = {
  applyAllRules: applyAllRulesHandler,
  getAllRules: getAllRewriteRulesHandler,
};
