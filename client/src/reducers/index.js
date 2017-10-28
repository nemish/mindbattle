import { combineReducers } from 'redux';
import {
    createFetchReducer,
    createFetchReducerCallbacks,
    createReducer,
    createModalReducer
} from '../utils/reducers';
import {
    fetchChallengeActions,
    formsActions,
    fetchCurrentUserActions,
    fetchPlayersActions,
    checkUserNameActions,
    joinChallengeActions,
    fetchChallengeListActions,
    registerUserActions,
    loginActions,
    handshakeActions,
    createChallengeActions,
    CHOOSE_OPTION,
    USER_NAME__CHANGE,
    CHALLENGE_UPDATE,
    INIT_CREATE_CHALLENGE,
    RESET_USER,
    LOGIN_FORM
} from '../actions/index';
import modalActions from '../actions/modalActions';
import {
    routerReducer
} from 'react-router-redux';


const pairize = (events, fn) => {
    return events.reduce((obj, event) => ({
        ...obj,
        [event]: fn
    }), {});
}


const resetter = events => {
    return pairize(events, (obj, event) => ({
        ...obj,
        event: (state, action) => {
            return {};
        }
    }));
}



const createFormReducer = (conf) => {
    let callbacks = {
        [conf.changeActionName](state, action) {
            return {...state, __isDirty: true, [action.data.name]: action.data.value}
        }
    }
    if (conf.cbs) {
        callbacks = {
            ...callbacks,
            ...conf.cbs
        }
    }
    return createReducer(conf.defaultData || {}, callbacks);
}


const createFormsReducer = actionsConfs => {
    let data = {};
    Object.keys(actionsConfs).forEach(name => {
        let conf = actionsConfs[name];
        if (additionalFormCallbacks[name]) {
            conf = {
                ...conf,
                cbs: additionalFormCallbacks[name]
            }
        }
        data = {
            ...data,
            [conf.key]: createFormReducer(conf)
        }
    });
    return combineReducers(data);
}


const additionalFormCallbacks = {
    LOGIN_FORM: pairize([
        registerUserActions.successEvent,
        registerUserActions.failEvent,
        checkUserNameActions.successEvent,
        checkUserNameActions.failEvent,
        loginActions.successEvent,
        loginActions.failEvent
    ], (state, action) => {
        return {...state, __isDirty: false}
    })
};

const forms = createFormsReducer(formsActions);

const INITIAL_USER_DATA = {name: '', id: null};

const userData = createReducer(INITIAL_USER_DATA, {
    [RESET_USER](state, action) {
        return INITIAL_USER_DATA;
    },
    ...pairize([
        registerUserActions.successEvent,
        loginActions.successEvent,
        fetchCurrentUserActions.successEvent
    ], (state, action) => {
        return {
            ...action.data.item,
            token: action.data.token
        }
    })
});


const resetErrorEvents = [
    RESET_USER,
    registerUserActions.successEvent,
    loginActions.successEvent
];


const userErrors = createReducer({}, {
    ...pairize([
        registerUserActions.failEvent,
        loginActions.failEvent
    ], (state, action) => {
        return {
            ...state,
            ...action.data
        }
    }),
    ...resetter(resetErrorEvents)
});


const errors = combineReducers({
    userErrors
});


const meta = createReducer({token: null}, {
    [handshakeActions.successEvent](state, action) {
        return {...state, token: action.data.token};
    }
});


const CHECK_USER_STATE_INITIAL = {data: {status: null}};

const checkState = createFetchReducer(checkUserNameActions, CHECK_USER_STATE_INITIAL, {
    [RESET_USER](state, action) {
        return CHECK_USER_STATE_INITIAL;
    }
});

const challengeList = createFetchReducer(fetchChallengeListActions, {items: []});

const currentChallengePlayers = createFetchReducer(fetchPlayersActions, []);

const currentChallenge = createFetchReducer(
    createChallengeActions, {inited: false}, {
        [INIT_CREATE_CHALLENGE](state, action) {
            return {...state, inited: true};
        },
        [CHALLENGE_UPDATE](state, action) {
            return {...state, data: {
                ...state.data,
                ...action.data.data
            }};
        },
        [joinChallengeActions.successEvent](state, action) {
            return {...state, inited: true, ...action.data}
        },
        ...createFetchReducerCallbacks(fetchChallengeActions),
    }
);

const user = combineReducers({
    userData,
    checkState,
    currentChallenge,
    currentChallengePlayers
});


let modalsConfig = {};
Object.keys(modalActions).forEach(key => {
    const ma = modalActions[key];
    modalsConfig[ma.name] = createModalReducer(ma);
});
const modals = combineReducers(modalsConfig);


export default combineReducers({
    modals,
    challengeList,
    forms,
    errors,
    user,
    meta,
    router: routerReducer
});