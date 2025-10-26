import 'src/entrypoints/popup/style.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/entrypoints/popup/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
