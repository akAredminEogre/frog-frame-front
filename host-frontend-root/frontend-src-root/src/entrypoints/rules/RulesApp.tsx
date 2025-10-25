import './style.css';

import { container } from 'src/infrastructure/di/container';

import * as React from 'react';
import { useEffect,useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
        const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
        const loadedRules = await getAllRulesUseCase.execute();
        setRules(loadedRules);
      } catch (err) {
        setError('ルールの読み込みに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">ルールを読み込んでいます...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const handleEdit = async (ruleId: string | number) => {
    const chromeTabsService = container.resolve<IChromeTabsService>('IChromeTabsService');
    const openRuleEditPageUseCase = new OpenRuleEditPageUseCase(chromeTabsService);
    await openRuleEditPageUseCase.execute(ruleId);
  };

  return (
    <div className="container">
      <h1>保存されたルール一覧</h1>
      
      {rules.length === 0 ? (
        <div className="empty-state">
          <p>保存されたルールがありません。</p>
          <p>拡張機能のポップアップからルールを作成してください。</p>
        </div>
      ) : (
        <div className="rules-table-container">
          <table className="rules-table">
            <thead>
              <tr>
                <th>URLパターン</th>
                <th>置換前</th>
                <th>置換後</th>
                <th>正規表現</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="rule-row">
                  <td className="rule-url-pattern" title={rule.urlPattern || ''}>
                    {rule.urlPattern 
                      ? (rule.urlPattern.length > 40 
                         ? rule.urlPattern.substring(0, 40) + '...'
                         : rule.urlPattern)
                      : '-'}
                  </td>
                  <td className="rule-old-string" title={rule.oldString}>
                    {rule.oldString}
                  </td>
                  <td className="rule-new-string" title={rule.newString}>
                    {rule.newString}
                  </td>
                  <td className="rule-regex">
                    {rule.isRegex ? (
                      <span className="regex-badge">✓</span>
                    ) : (
                      <span className="no-regex">-</span>
                    )}
                  </td>
                  <td className="rule-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(rule.id)}
                      type="button"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="footer">
        <p>合計 {rules.length} 件のルールが保存されています</p>
      </div>
    </div>
  );
}

export default RulesApp;
