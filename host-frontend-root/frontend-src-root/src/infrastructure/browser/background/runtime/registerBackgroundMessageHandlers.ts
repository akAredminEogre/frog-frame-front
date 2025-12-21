import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { Tab } from 'src/domain/value-objects/Tab';
import { container } from 'src/frameworks-and-drivers/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

/**
 * unknownエラーから安全にメッセージを抽出する
 * @param error 任意のエラー値
 * @returns エラーメッセージ文字列
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * getAllRulesリクエストを処理する共通ロジック
 * @returns GetAllRulesResponseオブジェクト
 */
async function handleGetAllRules() {
  try {
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
    const rules = await getAllRulesUseCase.execute();

    // エンティティをDTOに変換
    const mapper = new RewriteRuleMapper();
    const ruleDtos = rules.map((rule) => mapper.toDto(rule));

    return {
      success: true,
      rules: ruleDtos,
    };
  } catch (error: unknown) {
    console.error('[background] getAllRules error:', error);
    return { success: false, error: extractErrorMessage(error) };
  }
}

/**
 * applyAllRulesリクエストを処理する共通ロジック
 * @param tabId タブID
 * @param tabUrl タブURL
 * @returns ApplyAllRulesResponseオブジェクト
 */
async function handleApplyAllRules(tabId: number, tabUrl: string) {
  try {
    // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
    const chromeTabsService = container.resolve(ChromeTabsService);
    const tab = new Tab(tabId, tabUrl);
    const response = await chromeTabsService.sendApplyAllRulesMessage(tab);

    return { success: true, response };
  } catch (error: unknown) {
    console.error('[background] applyAllRules error:', error);
    return { success: false, error: extractErrorMessage(error) };
  }
}

/**
 * Background Script用メッセージハンドラーを登録
 * chrome.runtime.onMessageを使用してPopup/Content Scriptからのメッセージを処理
 *
 * 対応するメッセージタイプ:
 * - getAllRules: すべてのルールを取得
 * - applyAllRules: 指定タブにルール適用メッセージを転送
 *
 * 呼び出し元: entrypoints/background.ts
 */
export function registerBackgroundMessageHandlers() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'getAllRules') {
      handleGetAllRules().then(sendResponse);
      return true; // 非同期レスポンスを示す
    }

    if (message.type === 'applyAllRules') {
      const { tabId, tabUrl } = message;

      // tabId と tabUrl の存在チェック
      if (typeof tabId !== 'number' || typeof tabUrl !== 'string') {
        // 非同期パターンに統一するためPromise.resolve()でラップ
        Promise.resolve({
          success: false,
          error: 'Invalid message: tabId (number) and tabUrl (string) are required',
        }).then(sendResponse);
        return true;
      }

      handleApplyAllRules(tabId, tabUrl).then(sendResponse);
      return true;
    }

    return false;
  });
}
