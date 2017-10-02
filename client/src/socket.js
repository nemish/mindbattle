import io from 'socket.io-client';
const HOST = window.location.protocol + '//' + window.location.hostname + ':3002';
export default io(HOST, {secure: window.location.protocol === 'https:'});