import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/ToggleRuleActiveController';

export type ToggleSuccessCallback = (rule: RewriteRule) => void;
export type ToggleErrorCallback = (ruleId: number, message: string) => void;

export interface IToggleRuleActiveControllerFactory {
  create(
    onSuccess: ToggleSuccessCallback,
    onError: ToggleErrorCallback
  ): ToggleRuleActiveController;
}
