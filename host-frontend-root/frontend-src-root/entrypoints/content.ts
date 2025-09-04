/**
 * 選択されたテキストを含む最小のHTML要素を特定する
 */
function getElementSelectionInfo(): { selection: string } {
  const elementSelector = new ElementSelector();
  return { selection: elementSelector.getElementFromSelection() };
}

import { matchUrl } from '../src/utils/matchUrl';
import { HtmlReplacer } from '../src/domain/entities/HtmlReplacer';
import { ElementSelector } from '../src/domain/entities/ElementSelector';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';


export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
    const replacer = new HtmlReplacer();
    const applySavedRulesOnPageLoadUseCase = new ApplySavedRulesOnPageLoadUseCase(replacer);

    // メッセージ受信ロジック
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // 1) 要素選択の取得（要素置換用）
      if (request.type === 'getElementSelection') {
        sendResponse(getElementSelectionInfo());
        return true; // 非同期応答
      }
      // 3) ポップアップからの単一ルール適用メッセージ
      else if (request.type === 'applySingleRule') {
        applySavedRulesOnPageLoadUseCase.applyAllRules().then(() => {
          sendResponse({ success: true });
        });
        return true;
      }
      // 4) backgroundからの全ルール適用メッセージ
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
