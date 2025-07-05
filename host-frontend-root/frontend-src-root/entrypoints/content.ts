/**
 * ドラッグ選択したテキストのHTMLを取得するサンプル関数
 */
function getSelectedHtml(): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return '';
  }
  const container = document.createElement('div');
  for (let i = 0; i < selection.rangeCount; i++) {
    container.appendChild(selection.getRangeAt(i).cloneContents());
  }
  return container.innerHTML;
}

import { replaceTextInNode } from '../utils/domUtils';
import { matchUrl } from '../utils/matchUrl';

export default defineContentScript({
  matches: process.env.NODE_ENV === 'development' 
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {

    // ---- A) ページ再訪問時の書き換えロジック ----
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return;
      }
      // itemsの形: { [id]: { id, pattern, newText, ... }, ... }
      const rewriteRules = Object.values(items);
      if (!rewriteRules.length) {
        return;
      }

      // URLパターンで絞り込む場合はここで window.location.href と比較するなど可能
      rewriteRules.forEach((ruleObj) => {
        if (!ruleObj || typeof ruleObj !== 'object') return;

        const { pattern, newText, urlPattern } = ruleObj as {
          pattern?: string;
          newText?: string;
          urlPattern?: string;
        };
        if (!pattern || !newText) return; // 必要情報が無い場合はスキップ

        // URLパターンがある場合は、現在のURLと前方一致で比較
        if (urlPattern) {
          const currentUrl = window.location.href;
          // 前方一致チェック
          if (!currentUrl.startsWith(urlPattern)) {
            // URLが一致しない場合はこのルールを適用しない
            return;
          }
        }

        // 大文字小文字を区別しない場合は 'gi' など適宜指定
        const regex = new RegExp(pattern, 'g');
        replaceTextInNode(document.body, regex, newText);
      });
    });

    // ---- B) メッセージ受信ロジック ----
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // 1) ページタイトルや任意の要素を取得
      if (request.type === 'getPageInfo') {
        const title = document.title;
        const firstH1 = document.querySelector('h1')?.textContent || '(no <h1> found)';
        
        sendResponse({
          title,
          firstH1,
          // 必要に応じて追加情報
        });
      }

        // 2) 「この要素を登録」メニューから呼ばれた場合
      else if (request.type === 'registerElement') {
        // ドラッグ選択したテキストがある場合、選択範囲のHTMLを取得して返す
        const { selectionText } = request.info;
        if (selectionText) {
          const selectedHtml = getSelectedHtml();
          sendResponse({ selectedHtml });
        }
      }

      // 3) ポップアップからの書き換えルール適用メッセージを受信
      else if (request.type === 'applyRewriteRule') {
        const { rule } = request;
        if (rule && rule.pattern && rule.newText !== undefined && rule.newText !== null) {
          // URLパターンがある場合、現在のURLと照合
          if (rule.urlPattern) {
            const currentUrl = window.location.href;
            // 前方一致チェック
            if (!currentUrl.startsWith(rule.urlPattern)) {
              sendResponse({ success: false, reason: 'URL pattern mismatch' });
              return false;
            }
          }
          
          const regex = new RegExp(rule.pattern, 'g');
          replaceTextInNode(document.body, regex, rule.newText);
          sendResponse({ success: true });
        }
      }

      // 非同期応答を使わない限り、false を返してリスナー終了
      return false;
    });
  },
});
