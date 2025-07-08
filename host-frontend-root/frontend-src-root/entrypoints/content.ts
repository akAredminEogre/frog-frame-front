/**
 * 選択範囲のHTMLまたはテキストを取得する
 */
function getSelectionInfo(): { selection: string } {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { selection: '' };
  }

  const range = selection.getRangeAt(0);
  const { commonAncestorContainer } = range;

  // 選択範囲が単一の要素を完全に含んでいるかチェック
  const parentElement = commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
    ? commonAncestorContainer as Element
    : commonAncestorContainer.parentElement;

  if (parentElement && range.toString().trim() === parentElement.textContent?.trim()) {
    // 要素全体が選択されている場合
    return { selection: parentElement.outerHTML };
  }

  // 部分的な選択の場合、選択内容をHTMLとして取得
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  
  // コンテナに子要素が1つだけで、それがテキストノードでない場合、その要素のouterHTMLを返す
  if (container.children.length === 1 && container.firstChild?.nodeType !== Node.TEXT_NODE) {
    return { selection: container.children[0].outerHTML };
  }

  // それ以外の場合は、選択されたテキストを返す
  return { selection: selection.toString() };
}

import { replaceInNode } from '../utils/domUtils';
import { matchUrl } from '../utils/matchUrl';

export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
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
          const { oldString, newString, urlPattern } = ruleObj as any;
          if (!oldString || !newString) return;

          if (urlPattern) {
            const currentUrl = window.location.href;
            if (!currentUrl.startsWith(urlPattern)) {
              return;
            }
          }
          replaceInNode(document.body, oldString, newString);
        });
      });
    };

    // メッセージ受信ロジック
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // 1) 選択範囲の取得
      if (request.type === 'getSelection') {
        sendResponse(getSelectionInfo());
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
          replaceInNode(document.body, rule.oldString, rule.newString);
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
