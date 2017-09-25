import { combineReducers } from 'redux';
import { createFetchReducer, createReducer } from '../utils/reducers';
import {
    fetchChallengeActions,
    checkUserNameActions,
    handshakeActions,
    createChallengeActions,
    CHOOSE_OPTION,
    USER_NAME__CHANGE
} from '../actions/index';
import {
    routerReducer
} from 'react-router-redux';


const question = createFetchReducer(fetchChallengeActions, {options: []});

const answer = createReducer({answer: null}, {
    [CHOOSE_OPTION](state, action) {
        return {
            answer: action.data
        }
    }
});


const userData = createReducer({name: '', id: null}, {
    [USER_NAME__CHANGE](state, action) {
        return {
            ...state,
            name: action.data
        }
    },
    [checkUserNameActions.successEvent](state, action) {
        if (action.data.status === 'ok') {
            return action.data.item;
        }
        return state;
    }
});


const meta = createReducer({token: null}, {
    [handshakeActions.successEvent](state, action) {
        return {...state, token: action.data.token};
    }
});


const checkState = createFetchReducer(checkUserNameActions, {status: null});


const currentChallenge = createFetchReducer(createChallengeActions, null);


const user = combineReducers({
    userData,
    checkState,
    currentChallenge
})


const challenge = combineReducers({
    question,
    answer
});


export default combineReducers({
    challenge,
    user,
    meta,
    router: routerReducer
});