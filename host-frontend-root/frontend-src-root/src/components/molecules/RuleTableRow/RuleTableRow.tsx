import React from 'react';

import styles from 'src/components/molecules/RuleTableRow/RuleTableRow.module.css';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, onEdit }) => {
  return (
    <tr className={styles.ruleRow}>
      <td>
        <button
          className={styles.editButton}
          onClick={() => onEdit(rule.id)}
          type="button"
        >
          編集
        </button>
      </td>
      <td title={rule.urlPattern || ''}>
        {rule.urlPattern 
          ? (rule.urlPattern.length > 30 
             ? rule.urlPattern.substring(0, 30) + '...'
             : rule.urlPattern)
          : '-'}
      </td>
      <td title={rule.oldString}>
        {rule.oldString}
      </td>
      <td title={rule.newString}>
        {rule.newString}
      </td>
    </tr>
  );
};

export default RuleTableRow;