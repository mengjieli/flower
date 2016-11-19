class WebSocketServer extends PlatformWebSocketServer {

    constructor(clientClass, big = true) {
        super(clientClass || WebSocketClient, big);
    }
}

exports.WebSocketServer = WebSocketServer;