const HOST = 'http://localhost:8080'

function makeQuery(payload) {
    const esc = encodeURIComponent;
    return Object.keys(payload || {})
        .map(k => `${esc(k)}=${esc(payload[k])}`)
        .join('&');
}


export const createAsyncActionsConf = actionName => {
    return {
        actionName,
        startEvent: actionName + '__START',
        successEvent: actionName + '__SUCCESS',
        failEvent: actionName + '__FAIL',
    }
}


export function createFetchAction(conf) {
    const startEvent = `${conf.event}__START`;
    const successEvent = `${conf.event}__SUCCESS`;
    const failEvent = `${conf.event}__FAIL`;

    const fetchAction = (commit, state, payload) => {
      commit(startEvent, payload);
      let url = conf.url;
      let method = conf.method;
      if (typeof url === "function") {
        url = HOST + url(payload);
      } else if (conf.graphql) {
        url = HOST + '/gql'
      } else {
        url = HOST + url;
      }

      if (typeof method === "function") {
        method = method(payload);
      }

      let params = {
          credentials: 'same-origin'
      }
      let headers = {};
      if (method == 'post') {
        headers['Content-Type'] = 'application/json; charset=utf-8';
      }
      if (conf.authorized) {
        // const token = localStorage.getItem('jwt_token');
        const { token } = state;
        if (token && token.length) {
            headers['Authorization'] = 'Bearer ' + token;
        }
      }

      if (!method || method === 'get') {
        let query = {};
        if (conf.graphql) {
            query = makeQuery({
                query: conf.graphql(payload)
            });
        } else {
            query = makeQuery(payload);
        }
        url = url + (query.length ? '?' + query : '');
      }

      if (method === 'post') {
        params = {
            ...params,
            method: 'POST'
        }
        if (conf.graphql) {
            params.body = JSON.stringify({
                query: conf.graphql(payload)
            });
        } else {
            params.body = JSON.stringify(payload);
        }
      }

      params.headers = headers;

        return fetch(url, params)
        .then((resp) => {
            if (resp.ok) {
                // console.log('==== ERROR RESPONSE 222222 ====', resp);
                return resp;
            }
            console.log('==== ERROR RESPONSE ====', resp);

            if (resp.status === 401) {
                localStorage.setItem('jwt_token', null);
                // window.location = '/';
            }

            return Promise.reject(resp);
            // return resp;
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.errors && data.errors.length) {
                return Promise.reject(data);
            }
            commit(successEvent, data);
            return data;
        })
        .catch((err) => {
            console.log('cathc err', failEvent, err)
            commit(failEvent, err.err);
            return Promise.reject(err);
        });
    };
    Object.assign(fetchAction, {
        startEvent,
        successEvent,
        failEvent,
    });
    return fetchAction;
}

export default {
    createFetchAction
}