import 'src/entrypoints/rules/style.css';

import { createRoot } from 'react-dom/client';

import { RulesListPage } from 'src/components/pages/RulesListPage';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(<RulesListPage />);
