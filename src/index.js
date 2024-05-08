import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import ScrollToTop from "./api/ScrollTop";


axios.defaults.baseURL = 'http://1.251.115.6:8089';
axios.defaults.withCredentials = true;



const root = createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
            <ScrollToTop />
            <App />
        </BrowserRouter>
);
reportWebVitals();
