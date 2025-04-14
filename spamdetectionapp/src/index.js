import React from 'react';
import ReactDOM from 'react-dom/client'; // Use react-dom/client
import './index.css'; // Your global styles
import App from './App'; // Import the App component from App.js
// Optional: If you use web vitals reporting
// import reportWebVitals from './reportWebVitals';

// Find the root DOM element (usually a div with id="root" in public/index.html)
const rootElement = document.getElementById('root');

// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: If you use web vitals reporting
// reportWebVitals();
