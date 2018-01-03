import {
    combineReducers
} from 'redux';
import {
    FETCH_CHALLENGE,
    USER_LOGIN_FORM__CHANGE_VALUE,
    RESET_USER
} from './actions';

import {
    createFetchReducer,
    createReducer
} from '../utils/reducers';

const challenge = createFetchReducer(FETCH_CHALLENGE, {});

const userInitial = {
    _id: null,
    name: '',
    passwd: '',
    status: null
};

const user = createReducer(userInitial, {
    [USER_LOGIN_FORM__CHANGE_VALUE](state, action) {
        return {
            ...state,
            [action.data.name]: action.data.value
        }
    },
    [RESET_USER](state, action) {
        return userInitial;
    }
});

export default combineReducers({
    challenge,
    user
});