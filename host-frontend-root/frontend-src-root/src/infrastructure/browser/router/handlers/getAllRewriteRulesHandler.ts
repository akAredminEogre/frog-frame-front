import { container } from 'src/infrastructure/di/container';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';

/**
 * getAllRules message handler
 * 保存されているすべてのrewrite ruleを取得する
 */
export const getAllRewriteRulesHandler = async () => {
  try {
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
    const rules = await getAllRulesUseCase.execute();
    
    return { 
      success: true, 
      rules: rules
    };
  } catch (error: any) {
    console.error('[background] getAllRules error:', error);
    return { success: false, error: error.message };
  }
};