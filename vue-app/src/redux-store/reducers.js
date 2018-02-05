import {
    combineReducers
} from 'redux';
import {
    USER_LOGIN_FORM__CHANGE_VALUE,
    RESET_USER,
    NEW_CHALLENGE,
    FETCH_CHALLENGE
} from './actions';

import {
    createFetchReducer,
    createReducer
} from '../utils/reducers';


const newCh = createFetchReducer(NEW_CHALLENGE, {}, {}, data => data.data.newChallenge);
const current = createFetchReducer(FETCH_CHALLENGE, {}, {
    [newCh.conf.successEvent](state, action) {
        return {
            ...state,
            data: {
                ...state.data,
                ...action.data.data.newChallenge
            }
        }
    }
}, data => data.data.challenge);

const challenge = combineReducers({
    newCh,
    current
});

const userInitial = {
    _id: null,
    name: '',
    passwd: '',
    status: null
};

const user = createReducer(userInitial, {
    [newCh.conf.successEvent](state, action) {
        return {
            ...state,
            current_challenge_id: action.data._id
        }
    },
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