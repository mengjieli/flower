class WebSocketClient extends PlatformWebSocketClient {

    constructor(connection, big) {
        super(connection, big);
    }

    onReceive(data) {

    }

    send(data) {
        super.send(data);
    }
}


exports.WebSocketClient = WebSocketClient;