import { createAsyncActionsConf, createAsyncAction, makeActionCreator } from '../utils/actions';
export const FETCH_CHALLENGE = 'FETCH_CHALLENGE';
export const CHOOSE_OPTION = 'CHOOSE_OPTION';
export const USER_NAME__CHANGE = 'USER_NAME__CHANGE';
export const CREATE_CHALLENGE = 'CREATE_CHALLENGE';
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const CHECK_USER_NAME = 'CHECK_USER_NAME';
export const HANDSHAKE = 'HANDSHAKE';


export const chooseOption = makeActionCreator(CHOOSE_OPTION, 'data');
export const userNameChange = makeActionCreator(USER_NAME__CHANGE, 'data');

export const fetchChallengeActions = createAsyncActionsConf(FETCH_CHALLENGE);
export const fetchChallenge = createAsyncAction({
    url: '/challenge',
    ...fetchChallengeActions
});


export const createChallengeActions = createAsyncActionsConf(CREATE_CHALLENGE);
export const createChallenge = createAsyncAction({
    url: '/challenge',
    method: 'post',
    ...createChallengeActions
});


export const checkUserNameActions = createAsyncActionsConf(CHECK_USER_NAME);
export const checkUserName = createAsyncAction({
    url: '/check_user_name',
    method: 'post',
    ...checkUserNameActions
});


export const fetchCurrentUserActions = createAsyncActionsConf(FETCH_CURRENT_USER);
export const fetchCurrentUser = createAsyncAction({
    url: payload => '/get_user/' + payload.user_id,
    method: 'get',
    ...checkUserNameActions
});


export const handshakeActions = createAsyncActionsConf(HANDSHAKE);
export const handshake = createAsyncAction({
    url: '/handshake',
    ...handshakeActions
});