class RemoteClient extends WebSocketServerClient {
    constructor(connection, big) {
        super(connection,big);
        console.log(connection.remoteAddress);
    }
}