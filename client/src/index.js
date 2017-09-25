import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, {
    Board
} from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './store';
import { Route, BrowserRouter as Router } from 'react-router-dom';


const store = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path='/' component={App} />
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
