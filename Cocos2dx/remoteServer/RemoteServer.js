class RemoteServer extends WebSocketServer {

    constructor() {
        super(RemoteClient);
    }
}

var serverPort = 9900;