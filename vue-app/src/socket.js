import io from 'socket.io-client';
import store from './redux-store';


function createSocket() {
    return io('http://localhost:8080');
}

let socket = createSocket();
let initiated = false;


export const withSocket = handler => {
    if (!socket) {
        socket = createSocket();
    }

    if (!initiated) {
        initiated = true;
        socket.on('disconnect', () => {
            console.log('DISCONNECT FROM SOCKET...');
            // socket = createSocket();
        });

        socket.on('connect_error', (error) => {
            console.log('SOCKET CONNECT ERROR...');
            socket = createSocket();
        });

        socket.on('connect-success', (data) => {
            console.log('Socket connection success', data);
        });

        socket.on('new-challenge', (data) => {
            console.log('new-challenge getting in socket');
            // comp.$getInstance().$store.dispath('new-challenge-inc');
            handler['new-challenge']();
            console.log('Socket new challenge', data);
        });

        socket.on('remove-challenge', (data) => {
            console.log('remove-challenge getting in socket');
            // comp.$getInstance().$store.dispath('remove-challenge-inc');
            handler['remove-challenge'](data);
            console.log('Socket remove challenge', data);
        });
    }

    return socket;
}

export default socket;