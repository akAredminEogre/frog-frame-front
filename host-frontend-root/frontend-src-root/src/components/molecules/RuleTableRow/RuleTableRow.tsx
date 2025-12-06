import React from 'react';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import styles from 'src/components/molecules/RuleTableRow/RuleTableRow.module.css';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, onEdit }) => {
  return (
    <tr className={styles.ruleRow}>
      <td className={styles.ruleUrlPattern} title={rule.urlPattern || ''}>
        {rule.urlPattern 
          ? (rule.urlPattern.length > 40 
             ? rule.urlPattern.substring(0, 40) + '...'
             : rule.urlPattern)
          : '-'}
      </td>
      <td className={styles.ruleOldString} title={rule.oldString}>
        {rule.oldString}
      </td>
      <td className={styles.ruleNewString} title={rule.newString}>
        {rule.newString}
      </td>
      <td className={styles.ruleRegex}>
        {rule.isRegex ? (
          <span className={styles.regexBadge}>✓</span>
        ) : (
          <span className={styles.noRegex}>-</span>
        )}
      </td>
      <td className={styles.ruleActions}>
        <button
          className={styles.editButton}
          onClick={() => onEdit(rule.id)}
          type="button"
        >
          編集
        </button>
      </td>
    </tr>
  );
};

export default RuleTableRow;