import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import { createFetchAction } from '../utils/actions';

Vue.use(Vuex);

const SET_USER_TOKEN = 'SET_USER_TOKEN';
const FECTH_CURRENT_USER = 'FECTH_CURRENT_USER';
const CHECK_USER_NAME = 'CHECK_USER_NAME';
const REGISTER_USER = 'REGISTER_USER';
const LOGIN_USER = 'LOGIN_USER';


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


const handleUser = (commit, state) => {
    if (state._id || state.loading) {
        return;
    }
    const token = localStorage.getItem('jwt_token');
    if (token && token !== state.token) {
        commit(SET_USER_TOKEN, token);
        return fetchCurrentUser(commit, state);
    }
};


const INITIAL_USER_STATE = {
    _id: null,
    name: null,
    loading: false,
    check: {
        status: null,
        loading: false
    }
};


const handleEnterUser = (commit, state, data, fn) => {
    const { router, ...remain } = data;
    fn(commit, state, remain).then(ud => {
        router.push('/board');
        commit(SET_USER_TOKEN, ud.token);
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
                }
            },
            actions: {
                fetchCurrentUser({ commit, state }) {
                    handleUser(commit, state);
                },
                registerUser({ commit, state }, data) {
                    handleEnterUser(commit, state, data, registerUser);
                },
                login({ commit, state }, data) {
                    handleEnterUser(commit, state, data, login);
                },
                checkUserName({ commit, state }, name) {
                    checkUserName(commit, state, { name });
                },
            },
            mutations: {
                [SET_USER_TOKEN](state, token) {
                    localStorage.setItem('jwt_token', data.token);
                    state.token = token;
                },
                [fetchCurrentUser.startEvent](state) {
                    state.loading = true;
                },
                [login.startEvent](state) {
                    state.loading = true;
                },
                [registerUser.startEvent](state) {
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
                [registerUser.successEvent](state) {
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
