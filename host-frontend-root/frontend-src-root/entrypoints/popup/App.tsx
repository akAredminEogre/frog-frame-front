import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

/** 書き換えルールの型定義（暫定） */
type RewriteRule = {
  id?: string;   // UUIDなど一意識別子
  newText: string;
  pattern: string;
  urlPattern?: string; // URLの前方一致パターン
};

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<RewriteRule>({
    newText: '',
    pattern: '',
    urlPattern: '',
  });

  /** フォームの入力値を変更するハンドラ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRewriteRule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** 保存ボタンを押したとき、chrome.storage.localへ書き込み */
  const handleSave = async () => {
    try {
      // 一意のID（UUID）を仮に発行
      const id = crypto.randomUUID();

      // 保存する書き換えルール
      const ruleToSave = { ...rewriteRule, id };

      // chrome.storage.localに保存
      await chrome.storage.local.set({ [id]: ruleToSave });

      // フォームをリセット
      setRewriteRule({ newText: '', pattern: '', urlPattern: '' });

      // 現在アクティブなタブの情報を取得
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: chrome.tabs.Tab[]) => {
        const currentTab = tabs[0];
        if (!currentTab?.id) {
          alert('保存しました！（現在のタブへの適用に失敗しました）');
          return;
        }

        const currentUrl = currentTab.url || '';
        
        // ルールで指定されたURLパターンと現在のURLを比較
        let shouldApplyToCurrentTab = true;
        if (ruleToSave.urlPattern && currentUrl) {
          shouldApplyToCurrentTab = currentUrl.startsWith(ruleToSave.urlPattern);
        }

        if (shouldApplyToCurrentTab) {
          // 現在のタブにルールを適用
          try {
            // まず、バックグラウンドスクリプトに通知して処理を依頼
            await new Promise<void>((resolve) => {
              chrome.runtime.sendMessage(
                { 
                  type: 'applyRewriteRule', 
                  rule: ruleToSave,
                  targetTabId: currentTab.id  // 対象タブIDを明示的に指定
                }, 
                (response: any) => {
                  if (chrome.runtime.lastError) {
                    // エラーは無視
                  }
                  resolve();
                }
              );
            });

            // 次に、コンテンツスクリプトに直接メッセージを送信（currentTab.idは既にnullチェック済み）
            await new Promise<void>((resolve) => {
              if (currentTab.id) {
                chrome.tabs.sendMessage(
                  currentTab.id,
                  { type: 'applyRewriteRule', rule: ruleToSave },
                  (response: any) => {
                    if (chrome.runtime.lastError) {
                      // コンテンツスクリプトがまだロードされていない場合は正常
                    }
                    resolve();
                  }
                );
              } else {
                // ここに到達することはないはず（前のチェックでID存在確認済み）
                resolve(); // 解決してループを続行
              }
            });

            // 完了通知
            alert('保存して適用しました！');
          } catch (error) {
            alert('保存しましたが、適用中にエラーが発生しました。');
          }
        } else {
          // URLパターンが一致しない場合
          alert('保存しました！（現在のURLにはパターンが一致しないため適用されません）');
        }
      });

    } catch (error) {
      alert('保存に失敗しました。');
    }
  };

  /** ルールに基づいてDOMのテキストを置換する関数 */
  const updateElements = (rule: RewriteRule) => {
    const regex = new RegExp(rule.pattern, 'g');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) {
      const oldText = textNode.nodeValue;
      if (oldText) {
        const newText = oldText.replace(regex, rule.newText);
        if (newText !== oldText) {
          textNode.nodeValue = newText;
        }
      }
    }
  };

  /** コンポーネントがマウントされたときにルールを適用 */
  useEffect(() => {
    chrome.storage.local.get(null, (items: Record<string, any>) => {
      const rewriteRules = Object.values(items) as RewriteRule[];
      rewriteRules.forEach(updateElements);
    });
  }, []);

  return (
    <div style={{ width: 300, padding: 10 }}>
      <h2>fklf: Rewrite Rule</h2>

      <div style={{ marginBottom: 8 }}>
        <label>
          変更後のテキスト:
          <input
            type="text"
            name="newText"
            value={rewriteRule.newText}
            onChange={handleChange}
            style={{ marginLeft: 4 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          正規表現パターン:
          <input
            type="text"
            name="pattern"
            value={rewriteRule.pattern}
            onChange={handleChange}
            style={{ marginLeft: 4 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          URLパターン (前方一致):
          <input
            type="text"
            name="urlPattern"
            value={rewriteRule.urlPattern}
            onChange={handleChange}
            style={{ marginLeft: 4 }}
            placeholder="例: https://qiita.com/"
          />
        </label>
        <div style={{ fontSize: '0.8em', color: '#666', marginTop: 2 }}>
          ※ URLを指定することで任意のサイトで適用できます
        </div>
      </div>

      <button onClick={handleSave}>保存</button>
    </div>
  );
}

export default App;
