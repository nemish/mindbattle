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
    return createStore(
        appReducer,
        preloadedState,
        composeEnhancers(applyMiddleware(...middleware))
    );
}