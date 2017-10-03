import io from 'socket.io-client';
let secure = false;
let { protocol } = window.location;
console.log('choosing protocol', protocol)
if (window.location.protocol == 'https:') {
    secure = true;
    protocol = 'wss:'
    console.log('secure protocol', protocol)
}
// const HOST = protocol + '//' + window.location.hostname + ':3002';
// const HOST = protocol + '//' + window.location.hostname;
// export default io(HOST, {secure: window.location.protocol === 'https:'});
// export default io(HOST, {secure});
// export default io('wss://mathbattle3000.herokuapp.com/', {secure: true});
// export default io(':3002');
export default io();