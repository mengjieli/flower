class PlatformSocketClient extends flower.EventDispatcher {

    constructor(connection, big) {
        super();
        this.big = big;
        this.connection = connection;
        this.connection.on('data', this.onReceive.bind(this));
        this.connection.on('end', this.onClose.bind(this));
    }

    send(data) {
        this.connection.write(new Buffer(data.data));
    }

    onReceive(data) {

    }

    onClose(e) {
        this.dispatchWith(flower.Event.CLOSE);
    }
}