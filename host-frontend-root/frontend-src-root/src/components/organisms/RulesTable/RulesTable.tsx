import React from 'react';

import RuleTableRow from 'src/components/molecules/RuleTableRow/RuleTableRow';
import styles from 'src/components/organisms/RulesTable/RulesTable.module.css';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

interface RulesTableProps {
  rules: RewriteRule[];
  onEdit: (ruleId: string | number) => void;
  onToggle: (ruleId: number, isActive: boolean) => void;
  togglingIds: Set<number>;
}

const RulesTable: React.FC<RulesTableProps> = ({ rules, onEdit, onToggle, togglingIds }) => {
  return (
    <div className={styles.rulesTableContainer} data-testid="rules-table-container">
      <table className={styles.rulesTable} data-testid="rules-table">
        <thead>
          <tr>
            <th>有効</th>
            <th>操作</th>
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
              isToggling={togglingIds.has(rule.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RulesTable;