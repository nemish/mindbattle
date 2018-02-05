import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import { createFetchAction } from '../utils/actions';
import {
    reduxStore,
} from '../redux-store';
import {
    RESET_USER,
    USER_LOGIN_FORM__CHANGE_VALUE
} from '../redux-store/actions';

Vue.use(Vuex);

const SET_USER_TOKEN = 'SET_USER_TOKEN';
const FECTH_CURRENT_USER = 'FECTH_CURRENT_USER';
const CHECK_USER_NAME = 'CHECK_USER_NAME';
const REGISTER_USER = 'REGISTER_USER';
const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';


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


const fetchChallenges = createFetchAction({
    url: '/check_user_name',
    method: 'post',
    event: CHECK_USER_NAME,
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
    console.log('handleEnterUser begin', state, data, fn);
    fn(commit, state, remain).then(ud => {
        console.log('handleEnterUser', ud, data, state);
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
    modules: {
        user: {
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
                logout({ commit, state }, data) {
                    commit(SET_USER_TOKEN, {token: null});
                    console.log('before dispatch reduxStore');
                    reduxStore.dispatch({
                        type: RESET_USER
                    });
                    // commit(RESET_USER);
                    return Promise.resolve();
                },
                checkUserName({ commit, state }, name) {
                    return checkUserNameHandler(commit, state, { name });
                },
                fetchChallengesInfo({ commit, state }) {
                    // return checkUserNameHandler(commit, state, { name });
                }
            },
            mutations: {
                [SET_USER_TOKEN](state, data) {
                    const { token } = data;
                    localStorage.setItem('jwt_token', token);
                    state.token = token;
                },
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
