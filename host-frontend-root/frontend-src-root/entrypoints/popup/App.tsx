import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

/** 書き換えルールの型定義（暫定） */
type RewriteRule = {
  id?: string;   // UUIDなど一意識別子
  newText: string;
  pattern: string;
};

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<RewriteRule>({
    newText: '',
    pattern: '',
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
      console.log('Saving rewrite rule:', rewriteRule);
      // 一意のID（UUID）を仮に発行
      const id = crypto.randomUUID();

      // 保存する書き換えルール
      const ruleToSave = { ...rewriteRule, id };

      // chrome.storage.localに保存
      await chrome.storage.local.set({ [id]: ruleToSave });

      console.log('Saved rewrite rule:', ruleToSave);

      // フォームをリセット
      setRewriteRule({ newText: '', pattern: '' });

      // 現在アクティブなタブにメッセージを送信して即時に変更を反映
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { type: 'applyRewriteRule', rule: ruleToSave },
            (response: any) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to send message to tab:', chrome.runtime.lastError.message);
              } else {
                console.log('Rule applied to current tab:', response);
              }
              
              // 簡易的な完了通知（ここでアラート）
              alert('保存して適用しました！');
            }
          );
        } else {
          console.error('No active tab found');
          // タブが見つからない場合でも保存は完了しているのでアラート表示
          alert('保存しました！（現在のタブへの適用に失敗しました）');
        }
      });

      // バックグラウンドスクリプトにも通知（他のタブなど用）
      chrome.runtime.sendMessage({ type: 'applyRewriteRule', rule: ruleToSave }, (response: any) => {
        if (chrome.runtime.lastError) {
          console.error('Failed to send message to background:', chrome.runtime.lastError.message);
        } else {
          console.log('Message sent to background successfully:', response);
        }
      });

    } catch (error) {
      console.error('Failed to save:', error);
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

      <button onClick={handleSave}>保存</button>
    </div>
  );
}

export default App;
