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
    handshakeActions,
    createChallengeActions,
    CHOOSE_OPTION,
    USER_NAME__CHANGE,
    CHALLENGE_UPDATE,
    INIT_CREATE_CHALLENGE
} from '../actions/index';
import modalActions from '../actions/modalActions';
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
    console.log(ma);
    modalsConfig[ma.name] = createModalReducer(ma);
});
const modals = combineReducers(modalsConfig);


export default combineReducers({
    modals,
    challengeList,
    forms,
    user,
    meta,
    router: routerReducer
});