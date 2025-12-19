import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/GetByIdRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * Chrome Runtime APIを使用したRewriteRuleメッセージングサービス（スケルトン実装）
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
  /**
   * IDでルールを取得する
   * @param dto 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  async getById(dto: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    throw new Error(`Not implemented: getById with id=${dto.id}`);
  }

  /**
   * ルールの有効状態を更新する
   * @param dto 更新リクエストDTO
   */
  async updateActive(dto: UpdateRuleActiveRequestDTO): Promise<void> {
    throw new Error(`Not implemented: updateActive with id=${dto.id}, active=${dto.active}`);
  }
}
