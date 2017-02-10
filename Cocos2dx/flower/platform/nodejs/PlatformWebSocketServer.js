class PlatformWebSocketServer extends flower.EventDispatcher {

    constructor(clientClass, big = true) {
        super();
        this.big = big;
        this.clientClass = clientClass || PlatformWebSocketServerClient;
        this.server = null;
        this.clients = [];
    }

    start(port) {
        var server = http.createServer(function (request, response) {
        });
        server.listen(port, function () {
            this.dispatchWith(flower.Event.READY);
            //console.log("Server on " + port);
        }.bind(this));
        this.server = new webSocket({
            // WebSocket server is tied to a HTTP server. WebSocket request is just
            // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
            httpServer: server
        });
        this.server.on('request', this.connectClient.bind(this));
    }

    connectClient(request) {
        var connection = request.accept(null, request.origin);
        var client = new this.clientClass(connection, this.big);
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