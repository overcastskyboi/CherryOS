import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { OSProvider } from './context/OSContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/CherryOS">
      <OSProvider>
        <App />
      </OSProvider>
    </BrowserRouter>
  </React.StrictMode>
);
