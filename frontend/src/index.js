import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { GlobalProvider } from './context/GlobalContext'; // Import GlobalProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalProvider>
            <Router>
                <App />
            </Router>
        </GlobalProvider>
    </React.StrictMode>
);



