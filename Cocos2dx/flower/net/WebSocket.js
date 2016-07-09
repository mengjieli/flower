class WebSocket extends flower.EventDispatcher {
    _ip;
    _port;
    _localWebSocket;

    constructor() {
        super();
    }

    connect(ip, port) {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket(this.localWebSocket);
        }
        this._ip = ip;
        this._port = port;
        this._localWebSocket = new PlatformWebSocket();
        this._localWebSocket.bindWebSocket(ip, port, this, this.onConnect, this.onReceiveMessage, this.onError, this.onClose);
    }

    get ip() {
        return this._ip;
    }

    get port() {
        return this._port;
    }

    onConnect() {
        this.dispatchWidth(flower.Event.CONNECT);
    }

    onReceiveMessage(type, data) {
    }

    send(data) {
        this._localWebSocket.sendWebSocketUTF(data);
    }

    onError() {
        this.dispatchWidth(flower.Event.ERROR);
    }

    onClose() {
        this.dispatchWidth(flower.Event.CLOSE);
    }

    close() {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket();
            this._localWebSocket = null;
        }
    }
}

exports.WebSocket = WebSocket;