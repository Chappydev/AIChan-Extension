import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// const root = document.createElement('div');
// root.id = 'aichan-root';
// document.body.appendChild(root);

ReactDOM.createRoot(document.querySelector('#aichan-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
