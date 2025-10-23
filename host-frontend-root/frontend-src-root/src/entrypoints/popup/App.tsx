import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { SelectedPageTextRepository } from 'src/infrastructure/storage/SelectedPageTextRepository';
import { RewriteRuleForm } from 'src/components/organisms/RewriteRuleForm';
import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';

function App() {
  // フォーム入力を管理するState
  const [rewriteRule, setRewriteRule] = useState<RewriteRuleParams>({
    oldString: '',
    newString: '',
    urlPattern: '',
    isRegex: false,
  });

  /** 保存ボタンを押したとき、UseCaseを通して保存・適用処理を実行 */
  const handleSave = async () => {
    // Manual dependency construction to avoid DI conflicts
    const repository = new DexieRewriteRuleRepository();
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

  /** コンポーネントがマウントされたときにフォームを初期化 */
  useEffect(() => {
    const initForm = async () => {
      console.log('App: Starting form initialization...');
      
      // Manual dependency construction for PopupInitFormUseCase
      const currentTabService = new ChromeCurrentTabService();
      const selectedPageTextRepository = new SelectedPageTextRepository();
      const popupInitFormUseCase = new PopupInitFormUseCase(currentTabService, selectedPageTextRepository);
      
      // Execute the use case
      const result = await popupInitFormUseCase.execute();
      
      console.log('App: PopupInitFormUseCase executed successfully:', result);

      setRewriteRule((prev) => ({
        ...prev,
        oldString: result.selectedText || prev.oldString,
        urlPattern: result.urlPattern || prev.urlPattern,
      }));
      console.log('App: Form initialized successfully');
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
