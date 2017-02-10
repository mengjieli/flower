class PlatformSocketServer extends flower.EventDispatcher {

    constructor(clientClass, big = true) {
        super();
        this.big = big;
        this.clientClass = clientClass || PlatformWebSocketServerClient;
        this.server = null;
        this.clients = [];
    }

    start(port) {
        this.server = net.createServer(this.connectClient.bind(this));
        this.server.listen(port, Platform.IPV4);
    }

    connectClient(socket) {
        var client = new this.clientClass(socket, this.big);
        client.addListener(flower.Event.CLOSE, this.closeClient, this);
        this.clients.push(client);
        this.dispatchWith(flower.Event.CONNECT, client);
        return client;
    }

    closeClient(event) {
        var client = event.currentTarget;
        client.removeListener(flower.Event.CLOSE, this.closeClient, this);
        for (var i = 0, len = this.clients.length; i < len; i++) {
            if (this.clients[i] == client) {
                this.clients.splice(i, 1);
                this.dispatchWith(flower.Event.CLOSE, client);
                break;
            }
        }
        return client;
    }
}