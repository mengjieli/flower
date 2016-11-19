class SocketClient extends PlatformSocketClient {

    constructor(connection, big) {
        super(connection, big);
    }

    receive(data) {

    }

    send(data) {
        super.send(data);
    }
}


exports.SocketClient = SocketClient;