import { combineReducers } from 'redux';
import {
    createFetchReducer,
    createFetchReducerCallbacks,
    createReducer
} from '../utils/reducers';
import {
    fetchChallengeActions,
    formsActions,
    fetchCurrentUserActions,
    checkUserNameActions,
    registerUserActions,
    handshakeActions,
    createChallengeActions,
    CHOOSE_OPTION,
    USER_NAME__CHANGE,
    INIT_CREATE_CHALLENGE
} from '../actions/index';
import {
    routerReducer
} from 'react-router-redux';


const createFormReducer = (conf) => {
    return createReducer(conf.defaultData || {}, {
        [conf.changeActionName](state, action) {
            return {...state, [action.data.name]: action.data.value}
        }
    })
}


const createFormsReducer = actionsConfs => {
    let data = {};
    for (var key in actionsConfs) {
        if (actionsConfs.hasOwnProperty(key)) {
            const conf = actionsConfs[key];
            data[conf.key] = createFormReducer(conf);
        }
    }
    return combineReducers(data);
}

const forms = createFormsReducer(formsActions);


const userData = createReducer({name: '', id: null}, {

    // [USER_NAME__CHANGE](state, action) {
    //     return {
    //         ...state,
    //         name: action.data
    //     }
    // },
    [registerUserActions.successEvent](state, action) {
        if (action.data.status === 'ok') {
            return {
                registered: true,
                ...state,
                ...action.data.item
            };
        }
        return state;
    },
    [fetchCurrentUserActions.successEvent](state, action) {
        return action.data.item;
    }
});




const meta = createReducer({token: null}, {
    [handshakeActions.successEvent](state, action) {
        return {...state, token: action.data.token};
    }
});


const checkState = createFetchReducer(checkUserNameActions, {status: null});

const currentChallenge = createFetchReducer(
    createChallengeActions, {inited: false}, {
        [INIT_CREATE_CHALLENGE](state, action) {
            return {...state, inited: true};
        },
        ...createFetchReducerCallbacks(fetchChallengeActions)
    }
);

const user = combineReducers({
    userData,
    checkState,
    currentChallenge
});




export default combineReducers({
    forms,
    user,
    meta,
    router: routerReducer
});