import io from 'socket.io-client';
import store from './redux-store';

let socket = null;


export const withSocket = comp => {
    if (!socket) {
        socket = io();
        socket.on('disconnect', () => {
            console.log('DISCONNECT FROM SOCKET...');
            socket = io();
        });

        socket.on('connect_error', (error) => {
            console.log('SOCKET CONNECT ERROR...');
            socket = io();
        });

        // function alert() {
        //     store.dispatch(alertModalActions.open({
        //         msg: [
        //             'Ooops... Something happend. Please refresh a page.',
        //             'Or it will refreshed automatically',
        //             'after 5 seconds...'
        //         ]
        //     }))
        //     setTimeout(() => window.location.reload(), 5000);
        // }
    }

    comp.socketAPI = socket;

    return comp;

}

export default socket;