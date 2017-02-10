class PlatformWebSocketClient extends flower.EventDispatcher {

    constructor(connection, big) {
        super();
        this.big = big;
        this.connection = connection;
        this.connection.on('message', this.onReceive.bind(this));
        this.connection.on('close', this.onClose.bind(this));
    }

    send(data) {
        this.connection.sendBytes(new Buffer(data.data));
    }

    onReceive(data) {

    }

    onClose(e) {
        this.dispatchWith(flower.Event.CLOSE);
    }
}