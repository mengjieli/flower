class SocketServer extends PlatformSocketServer {

    constructor(clientClass, big = true) {
        super(clientClass || WebSocketClient, big);
    }
}

exports.SocketServer = SocketServer;