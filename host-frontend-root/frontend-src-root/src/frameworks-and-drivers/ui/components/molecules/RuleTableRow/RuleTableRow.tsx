import React from 'react';

import { Button } from 'src/components/atoms/Button';
import { TruncatedText } from 'src/components/atoms/TruncatedText';
import styles from 'src/frameworks-and-drivers/ui/components/molecules/RuleTableRow/RuleTableRow.module.css';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DeleteButton } from 'src/frameworks-and-drivers/ui/components/atoms/DeleteButton';
import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
  onToggle: (ruleId: number) => void;
  onDelete: (ruleId: number) => void;
  isToggling: boolean;
  isDeleting: boolean;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({
  rule,
  onEdit,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}) => {
  return (
    <tr className={styles.ruleRow}>
      <td className={styles.actionCell}>
        <ToggleSwitch
          checked={rule.isActive}
          onChange={() => onToggle(rule.id)}
          ariaLabel={`ルール ${rule.id} の有効/無効を切り替え`}
          disabled={isToggling}
        />
      </td>
      <td>
        <Button
          onClick={() => onEdit(rule.id)}
          data-testid="edit-button"
          aria-label={`ルール ${rule.id} を編集`}
        >
          編集
        </Button>
      </td>
      <td className={styles.actionCell}>
        <DeleteButton onClick={() => onDelete(rule.id)} disabled={isDeleting} />
      </td>
      <td title={rule.urlPattern || ''} className="rule-url-pattern">
        <TruncatedText text={rule.urlPattern} maxLength={30} />
      </td>
      <td title={rule.oldString} className="rule-old-string" data-testid="rule-old-string">
        {rule.oldString}
      </td>
      <td title={rule.newString} className="rule-new-string">
        {rule.newString}
      </td>
    </tr>
  );
};

export default RuleTableRow;