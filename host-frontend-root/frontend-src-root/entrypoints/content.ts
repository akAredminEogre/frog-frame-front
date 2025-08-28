/**
 * 選択されたテキストを含む最小のHTML要素を特定する
 */
function getElementSelectionInfo(): { selection: string } {
  const elementSelector = new ElementSelector();
  return { selection: elementSelector.getElementFromSelection() };
}

import { matchUrl } from '../src/utils/matchUrl';
import { NodeTextReplacer } from '../src/domain/entities/NodeTextReplacer';
import { RewriteRule } from '../src/domain/entities/RewriteRule';
import { ElementSelector } from '../src/domain/entities/ElementSelector';


export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
    const replacer = new NodeTextReplacer();

    const applyAllRules = () => {
      chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
          return;
        }
        const rewriteRules = Object.values(items);
        if (!rewriteRules.length) {
          return;
        }
        rewriteRules.forEach((ruleObj) => {
          if (!ruleObj || typeof ruleObj !== 'object') return;
          
          // プレーンオブジェクトをRewriteRuleインスタンスに変換
          const plainRule = ruleObj as {
            id: string;
            oldString: string;
            newString: string;
            urlPattern?: string;
            isRegex?: boolean;
          };
          if (!plainRule.oldString || !plainRule.newString) return;
          
          const id = plainRule.id;
          const oldString = plainRule.oldString;
          const newString = plainRule.newString;
          const urlPattern = plainRule.urlPattern;
          const isRegex = plainRule.isRegex;
          const rule = new RewriteRule(id, oldString, newString, urlPattern, isRegex);

          if (rule.urlPattern) {
            const currentUrl = window.location.href;
            if (!currentUrl.startsWith(rule.urlPattern)) {
              return;
            }
          }
          replacer.replace(document.body, rule);
        });
      });
    };

    // メッセージ受信ロジック
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // 1) 要素選択の取得（要素置換用）
      if (request.type === 'getElementSelection') {
        sendResponse(getElementSelectionInfo());
        return true; // 非同期応答
      }
      // 2) ページタイトルや任意の要素を取得
      else if (request.type === 'getPageInfo') {
        const title = document.title;
        const firstH1 = document.querySelector('h1')?.textContent || '(no <h1> found)';
        
        sendResponse({
          title,
          firstH1,
          // 必要に応じて追加情報
        });
      }

      // 3) ポップアップからの単一ルール適用メッセージ
      else if (request.type === 'applySingleRule') {
        const { rule } = request;
        if (rule && rule.oldString && rule.newString !== undefined && rule.newString !== null) {
          replacer.replace(document.body, rule);
          sendResponse({ success: true });
        }
        return true;
      }
      // 4) backgroundからの全ルール適用メッセージ
      else if (request.type === 'applyAllRules') {
        applyAllRules();
        sendResponse({ success: true });
        return true;
      }

      // 非同期応答を使う場合は true を返す必要がある
      return true;
    });
  },
});
