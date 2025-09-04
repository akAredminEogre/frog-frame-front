import { matchUrl } from '../src/utils/matchUrl';
import { HtmlReplacer } from '../src/domain/entities/HtmlReplacer';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';


export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
    const replacer = new HtmlReplacer();
    const applySavedRulesOnPageLoadUseCase = new ApplySavedRulesOnPageLoadUseCase(replacer);
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
        applySavedRulesOnPageLoadUseCase.applyAllRules().then(() => {
          sendResponse({ success: true });
        });
        return true;
      }

      // 非同期応答を使う場合は true を返す必要がある
      return true;
    });
  },
});
