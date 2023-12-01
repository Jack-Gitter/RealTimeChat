import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Lobby from './components/Lobby';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Lobby />
  </React.StrictMode>
);

