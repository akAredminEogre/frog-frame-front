import React from 'react';

import RuleTableRow from 'src/frameworks-and-drivers/ui/components/molecules/RuleTableRow/RuleTableRow';
import styles from 'src/components/organisms/RulesTable/RulesTable.module.css';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

interface RulesTableProps {
  rules: RewriteRule[];
  onEdit: (ruleId: string | number) => void;
  onToggle: (ruleId: number) => void;
  onDelete: (ruleId: number) => void;
  togglingIds: Set<number>;
  deletingIds: Set<number>;
}

const RulesTable: React.FC<RulesTableProps> = ({
  rules,
  onEdit,
  onToggle,
  onDelete,
  togglingIds,
  deletingIds,
}) => {
  return (
    <div className={styles.rulesTableContainer} data-testid="rules-table-container">
      <table className={styles.rulesTable} data-testid="rules-table">
        <thead>
          <tr>
            <th>有効</th>
            <th>編集</th>
            <th>削除</th>
            <th>URLパターン</th>
            <th>置換前</th>
            <th>置換後</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <RuleTableRow
              key={rule.id}
              rule={rule}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
              isToggling={togglingIds.has(rule.id)}
              isDeleting={deletingIds.has(rule.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RulesTable;