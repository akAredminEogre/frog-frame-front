import { matchUrl } from 'src/utils/matchUrl';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';


export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
    // Content Script用: Chrome Runtime Messaging経由でデータアクセス
    const rewriteRuleRepository: IRewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
    const applySavedRulesOnPageLoadUseCase = new ApplySavedRulesOnPageLoadUseCase(rewriteRuleRepository);
    const getElementSelectionUseCase = new GetElementSelectionUseCase();

    // メッセージ受信ロジック
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // 1) 要素選択の取得（要素置換用）
      if (request.type === 'getElementSelection') {
        sendResponse(getElementSelectionUseCase.getElementSelectionInfo());
        return true; // 非同期応答
      }
      // 2) backgroundからの全ルール適用メッセージ
      else if (request.type === 'applyAllRules') {
        console.log('[content] Received applyAllRules message', { 
          tabUrl: request.tabUrl,
          documentBody: !!document.body,
          currentUrl: window.location.href
        });
        
        console.log('[content] Calling applySavedRulesOnPageLoadUseCase.applyAllRules');
        applySavedRulesOnPageLoadUseCase.applyAllRules(document.body, request.tabUrl).then(() => {
          console.log('[content] applySavedRulesOnPageLoadUseCase.applyAllRules completed successfully');
          sendResponse({ success: true });
        }).catch((error) => {
          console.error('[content] applySavedRulesOnPageLoadUseCase.applyAllRules failed:', error);
          sendResponse({ success: false, error: error.message });
        });
        return true;
      }

      // 非同期応答を使う場合は true を返す必要がある
      return true;
    });
  },
});
