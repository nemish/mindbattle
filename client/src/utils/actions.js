import Cookies from 'js-cookie';

// function csrfSafeMethod(method) {
//     // these HTTP methods do not require CSRF protection
//     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
// }

// $.ajaxSetup({
//     beforeSend: function(xhr, settings) {
//         if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
//             xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
//         }
//     }
// });


export function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}


function makeQuery(payload) {
    var esc = encodeURIComponent;
    return Object.keys(payload || {})
        .map(k => `${esc(k)}=${esc(payload[k])}`)
        .join('&');
}


export function createAsyncAction(conf) {
  var startActionCreator = makeActionCreator(conf.startEvent || conf.event + '__START', 'data');
  var successActionCreator = makeActionCreator(conf.successEvent || conf.event + '__SUCCESS', 'data', 'payload');
  var failActionCreator = null;

  let failEvent = conf.failEvent;
  if (!failEvent) {
    failEvent = conf.event + '__FAIL';
  }

  if (failEvent) {
    failActionCreator = makeActionCreator(failEvent, 'data', 'payload');
  }

  return function makeRequest(payload) {
    return function (dispatch) {
      dispatch(startActionCreator(payload));
      let url = conf.url;
      let method = conf.method;
      if (typeof url === "function") {
        url = url(payload);
      }

      if (typeof method === "function") {
        method = method(payload);
      }

      const query = makeQuery(payload);
      let params = {}
      if (method == 'post') {
        params = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-csrf-token': Cookies.get('csrftoken')
            }
        }
      } else if (!method || method === 'get') {
        url = url + (query.length ? '?' + query : '');
      }
      return fetch(url, params)
        .then(resp => resp.json())
        .then(data => {
            dispatch(successActionCreator(data))
            return data;
        })
        .catch(err => {
            if (failEvent) {
                dispatch(failActionCreator(err));
            }
        });
    }
  }
}


export function createGridLoader(conf) {
    return createAsyncAction({
        ...conf,
        startEvent: conf.gridName + '__LOAD__START',
        successEvent: conf.gridName + '__LOAD__SUCCESS',
        failEvent: conf.gridName + '__LOAD__FAIL',
    });
}


export const createGridActions = conf => ({
    fetchItems: createGridLoader(conf),
    handlePageChange: makeActionCreator(conf.gridName + '__PAGE_CHANGE', 'data'),
    handleSortChange: makeActionCreator(conf.gridName + '__SORT_CHANGE', 'data'),
    changeFilterEvent: conf.gridName + '__FILTERS_CHANGE',
    updateDimensions: makeActionCreator(conf.gridName + '__DIMENSIONS_UPDATED', 'data')
});


export const createFormConstants = conf => ({
    saveSuccessEvent: conf.formName + '__SAVE_SUCCESS',
    changeFieldEvent: conf.formName + '__FIELD_CHANGE',
    saveStartEvent: conf.formName + '__SUBMIT__START',
    saveFailEvent: conf.formName + '__SAVE_FAIL',
    addConditionEvent: conf.formName + '__ADD_CONDITION',
    removeConditionEvent: conf.formName + '__REMOVE_CONDITION',
    resetConditionsEvent: conf.formName + '__RESET_CONDITIONS'
});


export const modalConstants = modalName => ({
    open: modalName + '__OPEN',
    close: modalName + '__CLOSE'
})


export const createModalActions = conf => {
    let constants = conf;
    if (typeof constants === 'string') {
        constants = modalConstants(constants);
    }
    return {
        open: makeActionCreator(constants.open, 'modalData'),
        close: makeActionCreator(constants.close),
        actions: constants
    }
}


export const createFormActions = (formConf, conf) => {
    return {
        onFormSubmit: createAsyncAction({
            ...conf,
            startEvent: formConf.saveStartEvent,
            successEvent: formConf.saveSuccessEvent,
            failEvent: formConf.saveFailEvent
        }),
        fieldChange: makeActionCreator(formConf.changeFieldEvent, 'data')
    }
}


export const createAsyncActionsConf = actionName => {
    return {
        actionName,
        startEvent: actionName + '__START',
        successEvent: actionName + '__SUCCESS',
        failEvent: actionName + '__FAIL',
    }
}


export const createFormDispatchActions = (formActions, dispatch) => {
    let obj = {};
    Object.keys(formActions).forEach(
        key => obj[key] = data => dispatch(formActions[key](data))
    )
    return obj;
}