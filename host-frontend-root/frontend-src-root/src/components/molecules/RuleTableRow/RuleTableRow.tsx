import React from 'react';

import { Button } from 'src/components/atoms/Button';
import { TruncatedText } from 'src/components/atoms/TruncatedText';
import styles from 'src/components/molecules/RuleTableRow/RuleTableRow.module.css';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

interface RuleTableRowProps {
  rule: RewriteRule;
  onEdit: (ruleId: string | number) => void;
  onToggle: (ruleId: number) => void;
  isToggling: boolean;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, onEdit, onToggle, isToggling }) => {
  return (
    <tr className={styles.ruleRow}>
      <td className={styles.toggleCell}>
        <ToggleSwitch
          checked={rule.isActive}
          onChange={() => onToggle(rule.id)}
          ariaLabel={`ルール ${rule.id} の有効/無効を切り替え`}
          disabled={isToggling}
        />
      </td>
      <td>
        <Button onClick={() => onEdit(rule.id)}>編集</Button>
      </td>
      <td title={rule.urlPattern || ''} className="rule-url-pattern">
        <TruncatedText text={rule.urlPattern} maxLength={30} />
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