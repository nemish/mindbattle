import {
    createStore,
    applyMiddleware
} from 'redux';
import {
    createLogger
} from 'redux-logger';
import main from './reducers';
import {
    initStore
} from '../utils/redux-actions';

export const reduxStore = createStore(main, applyMiddleware(createLogger()));

initStore(reduxStore);

export default reduxStore;