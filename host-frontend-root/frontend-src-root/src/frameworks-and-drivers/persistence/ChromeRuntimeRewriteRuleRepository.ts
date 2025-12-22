import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * Chrome Runtime Messaging を使用したRewriteRuleリポジトリの実装
 * Content Script用: IndexedDBの代わりにBackground Scriptとのメッセージングでデータアクセス
 * Clean Architectureのインフラストラクチャ層に配置
 * IRewriteRuleRepositoryインターフェースを実装
 *
 * ADR-002に従い、@webext-core/proxy-service経由でBackground Scriptと通信する
 *
 * 遅延初期化: proxy-serviceは実際にデータが必要になるまで呼び出されない。
 * これによりBackground Scriptの初期化完了を待てる。
 * 注意: このクラスは内部で直接proxy-serviceを呼び出し、DIコンテナを経由しない。
 *
 * 重要: proxy-serviceモジュールは動的importで読み込む。
 * 静的importだとContent Scriptのモジュールロード時に@webext-core/proxy-serviceの
 * 初期化が走り、E2Eテストに影響を与える可能性があるため。
 */
export class ChromeRuntimeRewriteRuleRepository implements IRewriteRuleRepository {
  private cachedProxyService: IRewriteRuleMessagingPort | null = null;

  /**
   * proxy-serviceを取得する（遅延初期化 + 動的import）
   * 初回呼び出し時にモジュールを動的importしてサービスを取得、以降はキャッシュを返す
   */
  private async getProxyService(): Promise<IRewriteRuleMessagingPort> {
    if (!this.cachedProxyService) {
      // 動的importでproxy-serviceモジュールを読み込む
      const { getRewriteRuleProxyService } = await import(
        'src/frameworks-and-drivers/messaging/RewriteRuleProxyService'
      );
      this.cachedProxyService = getRewriteRuleProxyService();
    }
    return this.cachedProxyService;
  }

  /**
   * DTOからエンティティに変換する
   * @param dto RewriteRuleDTO
   * @returns RewriteRuleエンティティ
   */
  private toEntity(dto: RewriteRuleDTO): RewriteRule {
    return new RewriteRule(
      dto.id,
      dto.oldString,
      dto.newString,
      dto.urlPattern,
      dto.isRegex,
      dto.isActive
    );
  }

  /**
   * すべてのルールを取得する
   * proxy-service経由でBackgroundからデータを取得し、Entityに変換
   * @returns RewriteRulesオブジェクト
   */
  async getAll(): Promise<RewriteRules> {
    const proxyService = await this.getProxyService();
    const dtos = await proxyService.getAll();

    const rulesObject: Record<string, RewriteRule> = {};
    dtos.forEach((dto) => {
      const rule = this.toEntity(dto);
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }

  /**
   * 新しいルールを作成する
   * Content Scriptでは作成操作は使用しないため、エラーをthrow
   * @param _rule 作成するRewriteRule
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async create(_rule: RewriteRule): Promise<void> {
    throw new Error('ChromeRuntimeRewriteRuleRepository does not support create operation in content script context');
  }

  /**
   * 既存のルールを更新する
   * Content Scriptでは更新操作は使用しないため、エラーをthrow
   * @param _rule 更新するRewriteRule
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async update(_rule: RewriteRule): Promise<void> {
    throw new Error('ChromeRuntimeRewriteRuleRepository does not support update operation in content script context');
  }

  /**
   * IDで指定されたルールを取定取得する
   * Content Scriptでは個別取得は使用しないため、エラーをthrow
   * @param id 検索するルールのID
   */
  async getById(id: number): Promise<RewriteRule> {
    throw new RewriteRuleNotFoundError(id);
  }

  /**
   * 指定されたURLにマッチするルールを取得する
   * @param currentUrl 現在のURL
   * @returns urlPatternがcurrentUrlの前方一致となるルールのRewriteRulesオブジェクト
   */
  async getRulesMatchingUrl(currentUrl: string): Promise<RewriteRules> {
    const allRules = await this.getAll();
    const matchingRules = allRules.toArray().filter((rule) => rule.matchesUrl(currentUrl));

    const rulesObject: Record<string, RewriteRule> = {};
    matchingRules.forEach((rule) => {
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }
}
