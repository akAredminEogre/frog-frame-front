import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { getActiveTabOrigin } from 'src/domain/entities/tabUtils';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { container } from 'src/infrastructure/di/container';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { RewriteRuleForm } from 'src/components/organisms/RewriteRuleForm';

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<{
    oldString: string;
    newString: string;
    urlPattern: string;
    isRegex: boolean;
  }>({
    oldString: '',
    newString: '',
    urlPattern: '',
    isRegex: false,
  });

  /** 保存ボタンを押したとき、UseCaseを通して保存・適用処理を実行 */
  const handleSave = async () => {
    // 依存性を組み立て（DIコンテナから取得）
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
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
      const { selectedPageText } = await chrome.storage.local.get('selectedPageText');
      
      let selectedText = '';
      if (selectedPageText) {
        selectedText = selectedPageText;
        // 取得後は不要なので削除
        await chrome.storage.local.remove('selectedPageText');
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
    <RewriteRuleForm
      rule={rewriteRule}
      onRuleChange={setRewriteRule}
      onSave={handleSave}
    />
  );
}

export default App;
