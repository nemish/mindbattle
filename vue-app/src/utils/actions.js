const HOST = 'http://localhost:8080'

function makeQuery(payload) {
    const esc = encodeURIComponent;
    return Object.keys(payload || {})
        .map(k => `${esc(k)}=${esc(payload[k])}`)
        .join('&');
}


export function createFetchAction(conf) {
    const startEvent = `${conf.event}__START`;
    const successEvent = `${conf.event}__SUCCESS`;
    const failEvent = `${conf.event}__FAIL`;

    const fetchAction = (commit, state, payload) => {
        commit(startEvent, payload);
        let url = conf.url;
        let method = conf.method;

        if (typeof url === 'function') {
            url = url(payload);
        }
        url = `${HOST}${url}`;

        if (typeof method === 'function') {
            method = method(payload);
        }

        const query = makeQuery(payload);
        let params = {
            credentials: 'same-origin',
        };
        const headers = {};
        if (method === 'post') {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        if (conf.authorized) {
            // const token = localStorage.getItem('jwt_token');
            const { token } = state;
            if (token && token.length) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        if (method === 'post') {
            params = {
                ...params,
                method: 'POST',
                body: JSON.stringify(payload),
            };
        } else if (!method || method === 'get') {
            const queryStr = query.length ? `?${query}` : '';
            url = `${url}${queryStr}`;
        }
        params.headers = headers;

        return fetch(url, params)
        .then((resp) => {
            if (!resp.ok) {
                return resp.json().then((err) => { throw err; });
            }
            if (resp.status === 401) {
                localStorage.setItem('jwt_token', null);
                window.location = '/';
            }
            return resp;
        })
        .then(resp => resp.json())
        .then((data) => {
            commit(successEvent, data);
            return data;
        })
        .catch((err) => {
            if (failEvent) {
                commit(failEvent, err);
            }
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