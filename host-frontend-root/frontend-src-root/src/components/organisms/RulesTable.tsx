import React from 'react';

import { RuleTableRow } from 'src/components/molecules/RuleTableRow';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

interface RulesTableProps {
  rules: RewriteRule[];
  onEditRule: (ruleId: string | number) => void;
}

export const RulesTable: React.FC<RulesTableProps> = ({ rules, onEditRule }) => {
  return (
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
            <RuleTableRow
              key={rule.id}
              rule={rule}
              onEdit={onEditRule}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};