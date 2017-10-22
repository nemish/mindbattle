import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import appReducer from './reducers/index';

// import {
//     routerMiddleware
// } from 'react-router-redux'


let middleware = [thunkMiddleware]
if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware, logger]
}

// middleware = [...middleware, routerMiddleware]

const composeEnhancers = compose;


export function configureStore(preloadedState) {
    const store = createStore(
        appReducer,
        preloadedState,
        composeEnhancers(applyMiddleware(...middleware))
    );
    configureStore.primaryStore = store;
    return store;
}

let store = null;

if (!store) {
    store = configureStore({});
}

export default store;