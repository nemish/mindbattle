import { createAsyncActionsConf } from './redux-actions';


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


export const createFetchReducerCallbacks = (initParam, initialData) => {
    let conf = initParam;
    if (typeof initParam === 'string') {
        conf = createAsyncActionsConf(initParam);
    }
    return {
        [conf.startEvent](state, action) {
            return {...state, loading: true};
        },
        [conf.successEvent](state, action) {
            return {...state, loading: false, data: action.data};
        },
        [conf.failEvent](state, action) {
            return {...state, loading: false};
        }
    }
}


export const createFetchReducer = (initParam, initialData = [], callbacks = {}) => {
    return createReducer({loading: false, data: initialData}, {
        ...createFetchReducerCallbacks(initParam, initialData),
        ...callbacks
    })
}


export const createFormReducer = (conf) => {

    const defaultFormState = {
        _dataState: {
            formReady: true
        }
    };

    return (state = defaultFormState, action) => {
        if (conf.customActions && conf.customActions[action.type]) {
            return conf.customActions[action.type](state, action);
        }

        switch (action.type) {
            case conf.initEvent:
                let extraData = {};
                if (conf.getExtraData) {
                    extraData = conf.getExtraData(action.item);
                }
                return {
                    ...state,
                    ...action.item,
                    ...extraData,
                    _dataState: {
                        ...state._dataState,
                        formReady: true,
                        itemId: action.item ? action.item.id : null
                    }
                }

            case conf.saveSuccessEvent:
            case conf.formDestroyEvent:
                return defaultFormState;

            case conf.changeFieldEvent:
                return {...state, [action.data.name]: action.data.value}
            case conf.saveStartEvent:
                return {...state, _dataState: {
                    ...state._dataState, isSubmitting: true
                }}
            case conf.saveFailEvent:
                return {...state, _dataState: {
                    ...state._dataState, isSubmitting: false
                }}
            default:
                return state
        }
    }
}