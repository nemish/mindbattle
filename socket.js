
export const connectedClients = {};

export const connectSocket = socketIO => {
    if (!connectedClients.socketIO) {
        connectedClients.socketIO = socketIO;
    }
    socketIO.on('connection', function (client) {
        // console.log('connection', client.client);
        connectedClients[client.client.id] = {};

        client.emit('connect-success', {id: client.client.id});
        // socketIO.emit('connect-success', {id: client.client.id});
        // client.broadcast.emit('connect-success-emit', {id: client.client.id});

        client.on('challenge_update', function (data) {
            console.log('challenge_update in socket', client.client.id);
            homeController.updateChallenge(data, socketIO);
        });

        client.on('info', function (data) {
            const { user_id } = data;
            connectedClients[client.client.id].userId = user_id;
        });

        client.on('disconnect', function () {
            console.log('disconnect', client.client.id, connectedClients[client.client.id]);
            delete connectedClients[client.client.id];
        })
    });
}
