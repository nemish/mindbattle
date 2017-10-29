import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import storeObj from './store';
import { Route, BrowserRouter as Router } from 'react-router-dom';


export const store = storeObj;


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path='/' component={App} />
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
