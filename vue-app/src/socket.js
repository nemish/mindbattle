import io from 'socket.io-client';
import store from './redux-store';


function createSocket() {
    return io('http://localhost:8080');
}

let socket = createSocket();


export const withSocket = (comp, conf) => {
    if (!socket) {
        socket = createSocket();
        socket.on('disconnect', () => {
            console.log('DISCONNECT FROM SOCKET...');
            // socket = createSocket();
        });

        socket.on('connect_error', (error) => {
            console.log('SOCKET CONNECT ERROR...');
            socket = createSocket();
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