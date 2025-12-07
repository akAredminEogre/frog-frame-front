import React from 'react';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import RuleTableRow from 'src/components/molecules/RuleTableRow/RuleTableRow';
import styles from 'src/components/organisms/RulesTable/RulesTable.module.css';

interface RulesTableProps {
  rules: RewriteRule[];
  onEdit: (ruleId: string | number) => void;
}

const RulesTable: React.FC<RulesTableProps> = ({ rules, onEdit }) => {
  return (
    <div className={styles.rulesTableContainer}>
      <table className={styles.rulesTable}>
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
            <RuleTableRow key={rule.id} rule={rule} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RulesTable;