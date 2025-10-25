import './App.css';

import { container } from 'src/infrastructure/di/container';

import * as React from 'react';
import { useEffect,useState } from 'react';

import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { RewriteRuleForm } from 'src/components/organisms/RewriteRuleForm';

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
    const saveUseCase = container.resolve(SaveRewriteRuleAndApplyToCurrentTabUseCase);
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
      
      const popupInitFormUseCase = container.resolve(PopupInitFormUseCase);
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
