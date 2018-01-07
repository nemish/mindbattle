import {
    createStore,
    applyMiddleware
} from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import main from './reducers';
import {
    initStore
} from '../utils/redux-actions';


const middlewares = [
    createLogger(),
    thunk
];

export const reduxStore = createStore(main, applyMiddleware(...middlewares));

initStore(reduxStore);


export default reduxStore;