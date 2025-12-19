import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/GetByIdRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';

/**
 * RewriteRuleのメッセージング操作を抽象化するポート
 */
export interface IRewriteRuleMessagingPort {
  /**
   * IDでルールを取得する
   * @param dto 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  getById(dto: GetByIdRequestDTO): Promise<RewriteRuleDTO>;

  /**
   * ルールの有効状態を更新する
   * @param dto 更新リクエストDTO
   */
  updateActive(dto: UpdateRuleActiveRequestDTO): Promise<void>;
}
