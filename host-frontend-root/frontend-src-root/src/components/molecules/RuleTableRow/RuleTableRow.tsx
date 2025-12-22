import React from 'react';

import styles from 'src/components/molecules/RuleTableRow/RuleTableRow.module.css';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
  onToggle: (ruleId: number, isActive: boolean) => void;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, onEdit, onToggle }) => {
  return (
    <tr className={styles.ruleRow}>
      <td className={styles.toggleCell}>
        <ToggleSwitch
          checked={rule.isActive}
          onChange={(checked) => onToggle(rule.id, checked)}
          ariaLabel={`ルール ${rule.id} の有効/無効を切り替え`}
        />
      </td>
      <td>
        {/* TODO: <button>のatomsへの分離 */}
        <button
          className={styles.editButton}
          onClick={() => onEdit(rule.id)}
          type="button"
        >
          編集
        </button>
      </td>
      <td title={rule.urlPattern || ''} className="rule-url-pattern">
        {/* TODO: URLPattern moleculeへの分離、表示ビジネスロジックの分離 */}
        {rule.urlPattern
          ? (rule.urlPattern.length > 30
             ? rule.urlPattern.substring(0, 30) + '...'
             : rule.urlPattern)
          : '-'}
      </td>
      <td title={rule.oldString} className="rule-old-string">
        {rule.oldString}
      </td>
      <td title={rule.newString} className="rule-new-string">
        {rule.newString}
      </td>
    </tr>
  );
};

export default RuleTableRow;