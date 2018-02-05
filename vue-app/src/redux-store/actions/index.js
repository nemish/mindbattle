import { createAsyncAction } from '../../utils/redux-actions';
export const FETCH_CHALLENGE = 'FETCH_CHALLENGE';
export const USER_LOGIN_FORM__CHANGE_VALUE = 'USER_LOGIN_FORM__CHANGE_VALUE';
export const RESET_USER = 'RESET_USER';
export const NEW_CHALLENGE = 'NEW_CHALLENGE';

export const createNewChallenge = createAsyncAction({
    event: NEW_CHALLENGE,
    graphql: payload => `
    mutation {
        newChallenge(userId : "${payload.userId}", access : "${payload.access}") {
            _id
        }
    }
    `,
    method: 'post'
});


export const fetchChallenge = createAsyncAction({
    event: FETCH_CHALLENGE,
    graphql: payload => `
    {
        challenge(_id : "${payload._id}") {
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
        }
    }
    `
});