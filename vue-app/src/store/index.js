import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import {
    createFetchAction,
    createAsyncActionsConf,
    createFetchConf
} from '../utils/actions';
import {
    reduxStore,
} from '../redux-store';
import {
    RESET_USER,
    USER_LOGIN_FORM__CHANGE_VALUE
} from '../redux-store/actions';

const deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
}

Vue.use(Vuex);


const SET_USER_TOKEN = 'SET_USER_TOKEN';
const FECTH_CURRENT_USER = 'FECTH_CURRENT_USER';
const CHECK_USER_NAME = 'CHECK_USER_NAME';
const REGISTER_USER = 'REGISTER_USER';
const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const START_CHALLENGE = 'START_CHALLENGE';
const FETCH_CHALLENGE = 'FETCH_CHALLENGE';
const FETCH_CHALLENGE_LIST = 'FETCH_CHALLENGE_LIST';
const EXIT_CHALLENGE = 'EXIT_CHALLENGE';
const NEW_CHALLENGE = 'NEW_CHALLENGE';
const JOIN_CHALLENGE = 'JOIN_CHALLENGE';


const fetchCurrentUser = createFetchAction({
    url: '/get_user',
    authorized: true,
    event: FECTH_CURRENT_USER,
});


const registerUser = createFetchAction({
    url: '/register_user',
    method: 'post',
    event: REGISTER_USER,
});

const login = createFetchAction({
    url: '/login',
    method: 'post',
    event: LOGIN_USER,
});


const checkUserName = createFetchAction({
    url: '/check_user_name',
    method: 'post',
    event: CHECK_USER_NAME,
});


const CHALLENGE_GQL_SCHEMA = `
    _id
    userId
    types
    timestamp
    state
    access
    maxPlayers
    players {
        _id
        name
    }
    playersCount
    currentQuestion
    questions {
        options
        result
        operation
    }
    anwers {
        _id
        option
        elapsed
        timestamp
    }
`


const startChallenge = createFetchAction({
    event: START_CHALLENGE,
    method: 'post',
    graphql: payload => `
    mutation {
        startChallenge(id : "${payload.challengeId}") {
            ${CHALLENGE_GQL_SCHEMA}
        }
    }
    `
});

const startChallengeConf = createFetchConf({
    event: START_CHALLENGE,
    dataProcessor: data => {
        return data.data.startChallenge
    },
    initialData: {},
});


const INITIAL_CHALLENGE_STATE = deepClone(startChallengeConf.state);


const exitChallenge = createFetchAction({
    event: EXIT_CHALLENGE,
    method: 'post',
    graphql: payload => `
    mutation {
        exitChallenge(id : "${payload.challengeId}", userId : "${payload.userId}") {
            status
        }
    }
    `
});

const newChallenge = createFetchAction({
    event: NEW_CHALLENGE,
    method: 'post',
    graphql: payload => `
    mutation {
        newChallenge(userId : "${payload.userId}", access : "${payload.access}") {
            ${CHALLENGE_GQL_SCHEMA}
        }
    }
    `,
    dataProcessor: data => {
        return data.data.newChallenge
    }
});


const fetchChallenge = createFetchAction({
    event: FETCH_CHALLENGE,
    graphql: payload => `
    {
        challenge(_id : "${payload.challengeId}") {
            ${CHALLENGE_GQL_SCHEMA}
        }
    }
    `,
    dataProcessor: data => {
        return data.data.challenge
    }
});


const fetchChallenges = createFetchAction({
    event: FETCH_CHALLENGE_LIST,
    graphql: payload => `
    {
        challenges(exceptUserId: "${payload.exceptUserId}") {
            ${CHALLENGE_GQL_SCHEMA}
        }
    }
    `,
    dataProcessor: data => {
        return data.data.challenges
    },
    initialData: []
});


const INITIAL_CHALLENGE_LIST_STATE = deepClone(fetchChallenges.conf.state);


const joinChallenge = createFetchAction({
    event: JOIN_CHALLENGE,
    method: 'post',
    graphql: payload => `
    {
        joinChallenge(userId : "${payload.userId}", challengeId : "${payload.challengeId}") {
            ${CHALLENGE_GQL_SCHEMA}
        }
    }
    `,
    dataProcessor: data => {
        return data.data.joinChallenge
    }
});


const checkUserNameHandler = (commit, state, data) => {
    return checkUserName(commit, state, data).catch(err => {
        console.log('checkUserNameHandler', err, state);
    });
}


const handleUser = (commit, state) => {
    if (state._id || state.loading) {
        return Promise.reject();
    }
    const token = localStorage.getItem('jwt_token');
    if (token && token !== state.token) {
        commit(SET_USER_TOKEN, { token });
        return fetchCurrentUser(commit, state);
    }
};


const INITIAL_USER_STATE = {
    _id: null,
    name: null,
    loading: false,
    status: null,
    current_challenge_id: null,
    check: {
        status: null,
        loading: false
    }
};


const handleEnterUser = (commit, state, data, fn) => {
    const { router, ...remain } = data;
    fn(commit, state, remain).then(ud => {
        commit(SET_USER_TOKEN, {
            token: ud.token
        });
        reduxStore.dispatch({
            type: USER_LOGIN_FORM__CHANGE_VALUE,
            data: {
                passwd: null
            }
        });
        router.push('/board');
    }).catch(() => {
        // router.push('/');
    });
}


export const store = new Vuex.Store({
    plugins: [createLogger()],
    actions: {
        resetUser({ commit }) {
            commit('user/reset');
            commit('challenge/reset');
            commit('challenges/reset');
        }
    },
    modules: {
        app: {
            namespaced: true,
            actions: {
                updateState({ commit, state }, data) {
                    commit('user/UPDATE_STATE', data, {root: true});
                }
            }
        },
        challenges: {
            namespaced: true,
            state: INITIAL_CHALLENGE_LIST_STATE,
            actions: {
                fetchChallenges({ commit, state }, exceptUserId) {
                    return fetchChallenges(commit, state, {
                        exceptUserId
                    });
                },
                joinChallenge({ commit, state }, payload) {
                    return joinChallenge(commit, state, payload);
                }
            },
            mutations: {
                ...fetchChallenges.conf.mutations,
                reset(state, data) {
                    Object.assign(state, deepClone(INITIAL_CHALLENGE_LIST_STATE));
                },
            }
        },
        challenge: {
            namespaced: true,
            state: INITIAL_CHALLENGE_STATE,
            actions: {
                startChallenge({ commit, state }, challengeId) {
                    return startChallenge(commit, state, {
                        challengeId
                    });
                },
                fetchChallenge({ commit, state }, challengeId) {
                    return fetchChallenge(commit, state, {
                        challengeId
                    });
                },
                exitChallenge({ commit, state }, payload) {
                    return exitChallenge(commit, state, payload).then(() => {
                    });
                },
                createNewChallenge({ commit, state }, payload) {
                    return newChallenge(commit, state, payload);
                }
            },
            mutations: {
                ...startChallengeConf.mutations,
                ...fetchChallenge.conf.mutations,
                ...newChallenge.conf.mutations,
                [exitChallenge.startEvent](state) {
                    state.loading = true;
                },
                [exitChallenge.failEvent](state) {
                    state.loading = false;
                },
                [exitChallenge.successEvent](state) {
                    state.loading = false;
                    state.data._id = null;
                },
                reset(state, data) {
                    Object.assign(state, deepClone(INITIAL_CHALLENGE_STATE));
                },
            }
        },
        user: {
            namespaced: true,
            state: {
                ...INITIAL_USER_STATE,
            },
            getters: {
                check(state) {
                    return state.check;
                },
                loading(state) {
                    return state.loading || state.check.loading;
                }
            },
            actions: {
                fetchCurrentUser({ commit, state }) {
                    return handleUser(commit, state);
                },
                registerUser({ commit, state }, data) {
                    return handleEnterUser(commit, state, data, registerUser);
                },
                login({ commit, state }, data) {
                    return handleEnterUser(commit, state, data, login);
                },
                logout({ commit, state, dispatch }, data) {
                    commit(SET_USER_TOKEN, {token: null});
                    dispatch('resetUser', null, {root: true});
                    reduxStore.dispatch({
                        type: RESET_USER
                    });
                    return Promise.resolve();
                },
                checkUserName({ commit, state }, name) {
                    return checkUserNameHandler(commit, state, { name });
                },
                fetchChallengesInfo({ commit, state }) {
                    // return checkUserNameHandler(commit, state, { name });
                },
            },
            mutations: {
                [SET_USER_TOKEN](state, data) {
                    const { token } = data;
                    localStorage.setItem('jwt_token', token);
                    state.token = token;
                },
                ['UPDATE_STATE'](state, data) {
                    Object.keys(data).forEach(key => {
                        const elems = key.split('.');
                        if (elems[0] !== 'user') {
                            return
                        }

                        let scope = state;
                        elems.splice(1).forEach((elem, index) => {
                            if (index === elems.length - 2) {
                                scope[elem] = data[key];
                            } else {
                                scope = scope[elem];
                            }
                        });
                    })
                },
                reset(state, data) {
                    Object.assign(state, INITIAL_USER_STATE);
                },
                //     Object.assign(state, INITIAL_USER_STATE);
                // [RESET_USER](state) {
                //     Object.assign(state, INITIAL_USER_STATE);
                // },
                [fetchCurrentUser.startEvent](state) {
                    state.loading = true;
                },
                [login.startEvent](state) {
                    state.status = null;
                    state.loading = true;
                },
                [registerUser.startEvent](state) {
                    state.status = null;
                    state.loading = true;
                },
                [fetchCurrentUser.successEvent](state, data) {
                    Object.assign(state, data.item);
                    state.loading = false;
                },
                [login.successEvent](state, data) {
                    Object.assign(state, data.item);
                    state.loading = false;
                },
                [registerUser.successEvent](state, data) {
                    Object.assign(state, data.item);
                    state.loading = false;
                },
                [checkUserName.startEvent](state) {
                    state.check.loading = true;
                },
                [checkUserName.successEvent](state, data) {
                    Object.assign(state.check, data);
                    state.check.loading = false;
                },
                [checkUserName.failEvent](state) {
                    Object.assign(state.check, {loading: false, status: null});
                },
                [login.failEvent](state, data) {
                    state.loading = false;
                    state.status = 'LOGIN_FAILED';
                },
                [registerUser.failEvent](state, data) {
                    state.loading = false;
                },
                [fetchCurrentUser.failEvent](state, data) {
                    state.loading = false;
                },
            },
        },
    },
});

export default {
    store,
};
