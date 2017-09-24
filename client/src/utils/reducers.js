import { createAsyncActionsConf } from './actions';


export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}


export const createModalReducer = modalActions => {
    return createReducer({
        showWindow: false,
        modalData: {}
    }, {
        [modalActions.actions.open](state, action) {
            return {...state, showWindow: true, modalData: action.modalData}
        },
        [modalActions.actions.close](state, action) {
            return {...state, showWindow: false, modalData: {}}
        }
    })
}


export const createFetchReducer = (initParam, initialData = []) => {
    let conf = initParam;
    if (typeof initParam === 'string') {
        conf = createAsyncActionsConf(initParam);
    }
    return createReducer({loading: false, data: initialData}, {
        [conf.startEvent](state, action) {
            return {...state, loading: true};
        },
        [conf.successEvent](state, action) {
            return {...state, loading: false, data: action.data};
        },
        [conf.failEvent](state, action) {
            return {...state, loading: false};
        }
    })
}