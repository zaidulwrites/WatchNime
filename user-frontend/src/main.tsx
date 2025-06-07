// user-frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component
import './styles/index.css'; // Import global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
