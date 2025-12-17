import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { contentContainer } from 'src/frameworks-and-drivers/di/contentContainer';

/**
 * Content Script用のApplyRulesOnDomMutationUseCaseシングルトンインスタンス
 *
 * ページロード時のルール適用（applyRulesToRoot）とDOM Mutation時のルール適用（handleMutations）
 * の両方で同一インスタンスを使用することで、状態管理を簡素化する
 *
 * Awilix DIコンテナから解決: contentContainer.tsで登録されたインスタンスを取得
 */
export const domMutationUseCaseInstance = contentContainer.resolve(ApplyRulesOnDomMutationUseCase);
