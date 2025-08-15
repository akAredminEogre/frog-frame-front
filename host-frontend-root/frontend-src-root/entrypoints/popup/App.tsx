import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { getActiveTabOrigin } from '../../utils/tabUtils';
import { RewriteRule } from '../../src/domain/entities/RewriteRule';

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<Omit<RewriteRule, 'id'>>({
    oldString: '',
    newString: '',
    urlPattern: '',
    isRegex: false,
  });

  /** フォームの入力値を変更するハンドラ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setRewriteRule((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
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
      setRewriteRule({
        oldString: '',
        newString: '',
        urlPattern: '',
        isRegex: false,
      });

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
            // バックグラウンドスクリプトに通知して処理を依頼
            await new Promise<void>((resolve) => {
              chrome.runtime.sendMessage(
                {
                  type: 'applyRewriteRule', // このタイプ名はbackground.tsで定義されているもの
                  rule: ruleToSave,
                  targetTabId: currentTab.id
                },
                (response: any) => {
                  if (chrome.runtime.lastError || !response?.success) {
                    // エラーは無視して次に進む
                  }
                  resolve();
                }
              );
            });

            // 完了通知
            alert('保存して適用しました！');
          } catch {
            alert('保存しましたが、適用中にエラーが発生しました。');
          }
        } else {
          // URLパターンが一致しない場合
          alert('保存しました！（現在のURLにはパターンが一致しないため適用されません）');
        }
      });

    } catch {
      alert('保存に失敗しました。');
    }
  };

  /** コンポーネントがマウントされたときにルールを適用 */
  useEffect(() => {
    const initForm = async () => {
      // ストレージから一時的な選択テキストを取得
      const { tempSelectedText } = await chrome.storage.local.get('tempSelectedText');
      
      let selectedText = '';
      if (tempSelectedText) {
        selectedText = tempSelectedText;
        // 取得後は不要なので削除
        await chrome.storage.local.remove('tempSelectedText');
      }

      const origin = await getActiveTabOrigin();

      setRewriteRule((prev) => ({
        ...prev,
        oldString: selectedText || prev.oldString,
        urlPattern: origin || prev.urlPattern,
      }));
    };

    initForm();
  }, []);

  return (
    <div style={{ width: 300, padding: 10 }}>
      <h2>fklf: Rewrite Rule</h2>

      <div style={{ marginBottom: 8 }}>
        <label>
          置換前:
          <label style={{ marginLeft: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isRegex"
              checked={rewriteRule.isRegex}
              onChange={handleChange}
            />
            正規表現を使う
          </label>
          <textarea
            name="oldString"
            value={rewriteRule.oldString}
            onChange={handleChange}
            style={{ marginLeft: 4, width: '95%', minHeight: '60px', verticalAlign: 'top' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          置換後:
          <textarea
            name="newString"
            value={rewriteRule.newString}
            onChange={handleChange}
            style={{ marginLeft: 4, width: '95%', minHeight: '60px', verticalAlign: 'top' }}
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
