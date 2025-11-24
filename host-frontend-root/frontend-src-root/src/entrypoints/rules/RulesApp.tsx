import 'src/entrypoints/rules/style.css';

import { container } from 'src/infrastructure/di/container';

import * as React from 'react';
import { useEffect,useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ExportRulesToJsonUseCase } from 'src/application/usecases/rule/ExportRulesToJsonUseCase';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { ImportRulesFromJsonUseCase } from 'src/application/usecases/rule/ImportRulesFromJsonUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { InvalidImportDataError } from 'src/domain/errors/InvalidImportDataError';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleExport = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const exportUseCase = container.resolve(ExportRulesToJsonUseCase);
      const jsonString = await exportUseCase.execute();

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.href = url;
      link.download = `rewrite-rules-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage('ルールをエクスポートしました');
    } catch (err) {
      setError('エクスポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleImportClick = () => {
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);

      const fileContent = await file.text();
      const importUseCase = container.resolve(ImportRulesFromJsonUseCase);
      await importUseCase.execute(fileContent);

      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
      const loadedRules = await getAllRulesUseCase.execute();
      setRules(loadedRules);

      setSuccessMessage('ルールをインポートしました');
    } catch (err) {
      if (err instanceof InvalidImportDataError) {
        setError('インポートエラー: ' + err.message);
      } else {
        setError('インポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container">
      <h1>保存されたルール一覧</h1>

      <div className="action-buttons">
        <button
          className="export-button"
          onClick={handleExport}
          type="button"
          disabled={loading}
        >
          エクスポート
        </button>
        <button
          className="import-button"
          onClick={handleImportClick}
          type="button"
          disabled={loading}
        >
          インポート
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

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
