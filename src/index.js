import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
//import { initializeFirebase } from './push-notifications';

ReactDOM.render(<CookiesProvider><App /></CookiesProvider>, document.getElementById('root'));
//initializeFirebase();

serviceWorker.unregister();
