import io from 'socket.io-client';
const HOST = 'http://' + window.location.hostname + ':3002';
export default io(HOST);