import { DeleteRuleRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/DeleteRuleRequestDTO';
import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

/**
 * RewriteRuleのメッセージング操作を抽象化するポート
 * ADR-002, ADR-003に準拠
 */
export interface IRewriteRuleMessagingPort {
  /**
   * すべてのルールを取得する
   * @returns RewriteRuleDTO配列
   */
  getAll(): Promise<RewriteRuleDTO[]>;

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

  /**
   * ルールを削除する
   * @param dto 削除リクエストDTO
   */
  delete(dto: DeleteRuleRequestDTO): Promise<void>;
}
