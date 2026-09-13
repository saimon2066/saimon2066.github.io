import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Self-hosted rather than pulled from Google Fonts: one less DNS lookup, one
// less TLS handshake and no third-party render block. Only the weights and
// subsets actually used, and latin-ext is not optional here, it carries the
// Š, ľ and č.
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import '@fontsource/jetbrains-mono/latin-ext-400.css';
import '@fontsource/jetbrains-mono/latin-ext-700.css';

import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
