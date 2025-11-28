import React from 'react';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
}

export const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, onEdit }) => {
  return (
    <tr className="rule-row">
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
          onClick={() => onEdit(rule.id)}
          type="button"
        >
          編集
        </button>
      </td>
    </tr>
  );
};