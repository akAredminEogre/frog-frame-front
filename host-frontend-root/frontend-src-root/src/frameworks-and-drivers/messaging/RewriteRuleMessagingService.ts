import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * リポジトリファクトリの型定義
 * テスト時にモックリポジトリを注入可能にするためのファクトリパターン
 */
type RepositoryFactory = () => IRewriteRuleRepository;

/**
 * デフォルトのリポジトリファクトリ（本番用）
 * DexieRewriteRuleRepositoryを生成する
 */
let repositoryFactory: RepositoryFactory = () => new DexieRewriteRuleRepository();

/**
 * テスト用にリポジトリファクトリを設定する
 * @param factory モックリポジトリを返すファクトリ関数
 */
export function setRewriteRuleRepositoryFactory(factory: RepositoryFactory): void {
  repositoryFactory = factory;
}

/**
 * リポジトリファクトリをデフォルト（本番用）にリセットする
 * テスト後のクリーンアップ用
 */
export function resetRewriteRuleRepositoryFactory(): void {
  repositoryFactory = () => new DexieRewriteRuleRepository();
}

/**
 * 遅延初期化用のプロキシサービス参照
 * defineProxyServiceはモジュールロード時ではなく、registerRewriteRuleMessagingService呼び出し時に実行
 */
let proxyServiceInstance: {
  register: () => void;
  get: () => RewriteRuleMessagingService;
} | null = null;

/**
 * @webext-core/proxy-serviceを使用したRewriteRuleメッセージングサービス
 * Background Scriptで実行され、他のコンテキスト（Rules Page等）からのDB操作を仲介
 * ADR-002, ADR-003に従い、DTOを使用してメッセージング通信を行う
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
  private readonly repository: IRewriteRuleRepository;

  constructor(repository: IRewriteRuleRepository) {
    this.repository = repository;
  }

  /**
   * IDでルールを取得する
   * @param dto 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  async getById(dto: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    const rule = await this.repository.getById(dto.id);
    return this.convertEntityToDTO(rule);
  }

  /**
   * ルールの有効状態を更新する
   * @param dto 更新リクエストDTO
   */
  async updateActive(dto: UpdateRuleActiveRequestDTO): Promise<void> {
    const rule = await this.repository.getById(dto.id);
    const updatedRule = rule.withActive(dto.isActive);
    await this.repository.update(updatedRule);
  }

  /**
   * RewriteRuleエンティティをDTOに変換する
   * @param rule 変換元のRewriteRule
   * @returns RewriteRuleDTO
   */
  private convertEntityToDTO(rule: RewriteRule): RewriteRuleDTO {
    return {
      id: rule.id,
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex,
      isActive: rule.isActive
    };
  }
}

/**
 * プロキシサービスを遅延初期化する
 * defineProxyServiceはブラウザAPIに依存するため、モジュールロード時ではなく
 * 実際に必要になった時点で初期化する
 */
function initializeProxyService(): void {
  if (proxyServiceInstance !== null) {
    return;
  }

  // 動的インポートを避けるため、require-likeパターンで遅延実行
  const { defineProxyService } = require('@webext-core/proxy-service');

  const [register, get] = defineProxyService('RewriteRuleMessagingService', () => {
    const repository = repositoryFactory();
    return new RewriteRuleMessagingService(repository);
  });

  proxyServiceInstance = { register, get };
}

/**
 * Background Scriptでサービスを登録する
 * この関数を呼び出すとプロキシサービスが初期化され、メッセージリスナーが登録される
 */
export function registerRewriteRuleMessagingService(): void {
  initializeProxyService();
  proxyServiceInstance!.register();
}

/**
 * 他のコンテキスト（Rules Page等）からサービスを取得する
 * @returns RewriteRuleMessagingServiceのプロキシ
 */
export function getRewriteRuleMessagingService(): RewriteRuleMessagingService {
  initializeProxyService();
  return proxyServiceInstance!.get();
}
