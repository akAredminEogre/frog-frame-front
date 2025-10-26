import './App.css';

import React, { useEffect, useState } from 'react';

import { EditRulePage } from 'src/components/pages/EditRulePage';

const App: React.FC = () => {
  const [ruleId, setRuleId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getRuleIdFromUrl = (): string | undefined => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('ruleId') || undefined;
    };

    const urlRuleId = getRuleIdFromUrl();
    setRuleId(urlRuleId);
  }, []);

  // ruleIdが取得されるまでローディング表示
  if (ruleId === undefined) {
    return (
      <div className="app">
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="app">
      <EditRulePage ruleId={ruleId} />
    </div>
  );
};

export default App;
