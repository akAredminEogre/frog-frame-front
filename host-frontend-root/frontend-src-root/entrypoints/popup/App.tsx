import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { getActiveTabOrigin } from '../../src/domain/entities/tabUtils';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { ChromeStorageRewriteRuleRepository } from 'src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<{
    oldString: string;
    newString: string;
    urlPattern?: string;
    isRegex?: boolean;
  }>({
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

  /** 保存ボタンを押したとき、UseCaseを通して保存・適用処理を実行 */
  const handleSave = async () => {
    // 依存性を組み立て
    const repository = new ChromeStorageRewriteRuleRepository();
    const currentTabService = new ChromeCurrentTabService();
    const chromeRuntimeService = new ChromeRuntimeService();
    const saveUseCase = new SaveRewriteRuleAndApplyToCurrentTabUseCase(
      repository,
      currentTabService,
      chromeRuntimeService
    );

    const result = await saveUseCase.execute(rewriteRule);

    // 結果をユーザーに通知
    alert(result.message);

    // 成功時はフォームをリセット
    if (result.shouldResetForm) {
      setRewriteRule({
        oldString: '',
        newString: '',
        urlPattern: '',
        isRegex: false,
      });
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
