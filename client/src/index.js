import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './store';
import { Router, Route } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
// import {
//     ConnectedRouter
// } from 'react-router-redux';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();
// import createBrowserHistory from 'history/createBrowserHistory';

const store = configureStore({});
// const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={App} />
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();

        // <ConnectedRouter history={history}>
        //     <Route exact path="/" component={App}/>
        // </ConnectedRouter>