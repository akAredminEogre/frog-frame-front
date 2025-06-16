// 書き換えルールの型定義
type RewriteRule = {
  id?: string;
  newText: string;
  pattern: string;
  urlPattern?: string;
};

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // 保存されているルールからURLパターンを取得し、それらのページにもコンテンツスクリプトを挿入する
    const injectContentScriptsBasedOnRules = () => {
      chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
          return;
        }

        // 保存されているルールからURLパターンを取得
        const rewriteRules = Object.values(items) as RewriteRule[];
        const uniqueUrlPatterns = new Set<string>();
        
        rewriteRules.forEach((rule) => {
          if (rule.urlPattern) {
            uniqueUrlPatterns.add(rule.urlPattern);
          }
        });

      // 各URLパターンに対して、アクティブなタブを検索し、一致するものにコンテンツスクリプトを挿入
      uniqueUrlPatterns.forEach((urlPattern) => {
        // 前方一致検索用のパターンを作成
        const urlMatchPattern = urlPattern + '*';
        
        // chrome.scripting APIを使用してコンテンツスクリプトを動的に挿入
          
          // 既存のタブで該当するURLを開いているものがあれば、スクリプトを挿入
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              if (tab.url && tab.id && tab.url.startsWith(urlPattern)) {
                
                // 注入するルールをまとめて取得
                const relevantRules = rewriteRules.filter(rule => 
                  rule.urlPattern && tab.url?.startsWith(rule.urlPattern)
                );
                
                if (relevantRules.length === 0) {
                  return;
                }
                
                // WXTのコンテンツスクリプトを実行するために、正しい機能を使用
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  // function引数を使って直接コンテンツスクリプトの機能を注入
                  func: () => {
                    // ストレージからルールを取得して適用する
                    chrome.storage.local.get(null, (items) => {
                      if (chrome.runtime.lastError) {
                        return;
                      }
                      
                      // ルールがない場合は終了
                      const rewriteRules = Object.values(items);
                      if (!rewriteRules.length) {
                        return;
                      }
                      
                      // URLパターンで絞り込み
                      const currentUrl = window.location.href;
                      
                      rewriteRules.forEach((ruleObj) => {
                        if (!ruleObj || typeof ruleObj !== 'object') return;
                        
                        const { pattern, newText, urlPattern } = ruleObj as any;
                        if (!pattern || !newText) {
                          return;
                        }
                        
                        // URLパターンチェック
                        if (urlPattern) {
                          if (!currentUrl.startsWith(urlPattern)) {
                            return;
                          }
                        }
                        
                          // テキスト置換を行う
                          
                          // DOMツリーを走査し、テキストノードを正規表現で置換する関数
                          function replaceTextInNode(root: Node, pattern: string, replacement: string): number {
                            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
                            let textNode: Node | null;
                            let replaceCount = 0;
                            
                            while ((textNode = walker.nextNode())) {
                              const oldText = textNode.nodeValue;
                              if (oldText) {
                                const regex = new RegExp(pattern, 'g');
                                const newText = oldText.replace(regex, replacement);
                                if (newText !== oldText) {
                                  textNode.nodeValue = newText;
                                  replaceCount++;
                                }
                              }
                            }
                            
                            return replaceCount;
                          }
                          
                          replaceTextInNode(document.body, pattern, newText);
                      });
                    });
                  }
                }).catch((err) => {
                  console.error(`[background] Failed to inject script to tab ${tab.id}:`, err);
                });
              }
            });
          });
        });
      });
    };

    // ストレージの変更を監視し、URLパターンが変更されたらコンテンツスクリプトを再挿入
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        injectContentScriptsBasedOnRules();
      }
    });

    // タブの更新（リロードを含む）を監視
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      // タブの読み込みが完了したら
      if (changeInfo.status === 'complete' && tab.url) {
        
        // URLパターンに基づいて保存されたルールを確認
        chrome.storage.local.get(null, (items) => {
          if (chrome.runtime.lastError) {
            return;
          }
          
          // 保存されているルールを取得
          const rewriteRules = Object.values(items) as RewriteRule[];
          
          // 現在のURLに一致するルールがあるか確認
          const matchingRules = rewriteRules.filter(rule => 
            rule.urlPattern && tab.url?.startsWith(rule.urlPattern)
          );
          
          if (matchingRules.length > 0) {
            
            // コンテンツスクリプトを挿入して、保存されたルールを適用
            chrome.scripting.executeScript({
              target: { tabId },
              func: () => {
                // ストレージからルールを取得して適用する
                chrome.storage.local.get(null, (items) => {
                  if (chrome.runtime.lastError) {
                    return;
                  }
                  
                  const currentUrl = window.location.href;
                  
                  // ルールを適用
                  const rewriteRules = Object.values(items);
                  let appliedRulesCount = 0;
                  
                  rewriteRules.forEach((ruleObj: any) => {
                    if (!ruleObj || typeof ruleObj !== 'object') return;
                    
                    const { pattern, newText, urlPattern } = ruleObj;
                    if (!pattern || !newText) return;
                    
                    // URLパターンチェック
                    if (urlPattern && !currentUrl.startsWith(urlPattern)) {
                      return;
                    }
                    
                      // DOMツリーを走査し、テキストノードを正規表現で置換する関数
                      function replaceTextInNode(root: Node, pattern: string, replacement: string): number {
                        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
                        let textNode: Node | null;
                        let replaceCount = 0;
                        
                        while ((textNode = walker.nextNode())) {
                          const oldText = textNode.nodeValue;
                          if (oldText) {
                            const regex = new RegExp(pattern, 'g');
                            const newText = oldText.replace(regex, replacement);
                            if (newText !== oldText) {
                              textNode.nodeValue = newText;
                              replaceCount++;
                            }
                          }
                        }
                        
                        return replaceCount;
                      }
                      
                      const regex = new RegExp(pattern, 'g');
                      const replaceCount = replaceTextInNode(document.body, pattern, newText);
                      
                      if (replaceCount > 0) {
                        appliedRulesCount++;
                      }
                  });
                });
              }
            }).catch(err => { /* エラー処理は不要 */ });
          }
        });
      }
    });

    // 初期化時にもルールベースのコンテンツスクリプト挿入を実行
    injectContentScriptsBasedOnRules();

    // Executed when background is loaded, CANNOT BE ASYNC
    // 1) 拡張がインストール or 更新されたタイミングでコンテキストメニューを登録
    chrome.runtime.onInstalled.addListener(() => {
      // 既存のメニューがある場合は衝突を防ぐため removeAll
      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          id: 'fklf-register-element',
          title: 'fklf: この要素を登録',
          contexts: ['selection', 'link'], // テキスト選択時 と リンク上 でのみ表示
        });
      });
    });

    // メッセージリスナーを追加 (ポップアップからのメッセージを受け取る)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // ポップアップからの書き換えルール適用メッセージを受信
      if (request.type === 'applyRewriteRule') {
        // 特定のタブIDが指定されている場合は、そのタブに直接スクリプトを挿入
        if (request.targetTabId) {
          const tabId = request.targetTabId;
          
          // タブ情報を取得
          chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) {
              console.error(`[background] Failed to get tab ${tabId}:`, chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
              return;
            }

            if (!tab.url) {
              console.error(`[background] Tab ${tabId} has no URL`);
              sendResponse({ success: false, error: 'Tab has no URL' });
              return;
            }

            // URLパターンをチェック
            const { urlPattern } = request.rule;
            if (urlPattern && !tab.url.startsWith(urlPattern)) {
              sendResponse({ success: false, reason: 'URL pattern mismatch' });
              return;
            }

            // コンテンツスクリプトを挿入
            chrome.scripting.executeScript({
              target: { tabId },
              func: (rule) => {
                
                // DOMツリーを走査し、テキストノードを正規表現で置換する関数
                function replaceTextInNode(root: Node, pattern: string, replacement: string): number {
                  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
                  let textNode: Node | null;
                  let replaceCount = 0;
                  
                  while ((textNode = walker.nextNode())) {
                    const oldText = textNode.nodeValue;
                    if (oldText) {
                      const regex = new RegExp(pattern, 'g');
                      const newText = oldText.replace(regex, replacement);
                      if (newText !== oldText) {
                        textNode.nodeValue = newText;
                        replaceCount++;
                      }
                    }
                  }
                  
                  return replaceCount;
                }
                
                try {
                  const { pattern, newText } = rule;
                  const replaceCount = replaceTextInNode(document.body, pattern, newText);
                  return { success: true, replaceCount };
                } catch (err) {
                  return { success: false, error: String(err) };
                }
              },
              args: [request.rule]
            }).then((results) => {
              sendResponse({ success: true, results });
            }).catch((err) => {
              console.error(`[background] Failed to inject script to tab ${tabId}:`, err);
              sendResponse({ success: false, error: String(err) });
            });
            
            // 非同期応答を使う
            return true;
          });
          
          // 非同期応答を使う
          return true;
        } else {
          // 特定のタブIDが指定されていない場合は、ストレージの変更をトリガーとしてinjectContentScriptsBasedOnRulesが呼ばれるので、
          // ここでは単に成功を返す
          sendResponse({ success: true });
        }
      }
      
      // デフォルトは非同期応答を使わない
      return false;
    });

    // 2) コンテキストメニュークリック時の処理
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      // IDをチェックし、該当メニューならコンテントスクリプトにメッセージを送る
      if (info.menuItemId === 'fklf-register-element' && tab?.id != null) {
        // 選択テキストなどが info に格納される
        chrome.tabs.sendMessage(tab.id, {
          type: 'registerElement',
          info, // { selectionText, linkUrl, srcUrl, ... } 等
        });
      }
    });
  },
});
