import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { Tab } from 'src/domain/value-objects/Tab';
import { container } from 'src/frameworks-and-drivers/di/container';
import { backgroundMessaging } from 'src/frameworks-and-drivers/messaging/backgroundMessaging';
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
    const mapper = container.resolve(RewriteRuleMapper);
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
 * @webext-core/messagingを使用した新しいメッセージングパターン
 * 加えて、Content Script用にchrome.runtime.onMessageも登録
 *
 * 呼び出し元: entrypoints/background.ts
 */
export function registerBackgroundMessageHandlers() {
  const { onMessage } = backgroundMessaging;

  // @webext-core/messaging用ハンドラー（Popup等から使用）
  // getAllRulesハンドラー
  onMessage('getAllRules', async () => {
    return handleGetAllRules();
  });

  // applyAllRulesハンドラー
  onMessage('applyAllRules', async (message) => {
    const { tabId, tabUrl } = message.data;
    return handleApplyAllRules(tabId, tabUrl);
  });

  // Content Script用: chrome.runtime.onMessageリスナー
  // Content Scriptはchrome.runtime.sendMessage({ type: 'getAllRules' })を使用
  // @webext-core/messagingとは異なるメッセージ形式のため、別途リスナーが必要
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'getAllRules') {
      handleGetAllRules().then(sendResponse);
      return true; // 非同期レスポンスを示す
    }

    if (message.type === 'applyAllRules') {
      const { tabId, tabUrl } = message;
      handleApplyAllRules(tabId, tabUrl).then(sendResponse);
      return true;
    }

    return false;
  });
}
