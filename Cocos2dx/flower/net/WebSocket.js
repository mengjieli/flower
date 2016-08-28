class WebSocket extends flower.EventDispatcher {
    _ip;
    _port;
    _localWebSocket;
    _isConnect = false;

    constructor() {
        super();
    }

    connect(ip, port) {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket(this.localWebSocket);
        }
        this._isConnect = false;
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

    get isConnect() {
        return this._isConnect;
    }

    onConnect() {
        this._isConnect = true;
        this.dispatchWith(flower.Event.CONNECT);
    }

    onReceiveMessage(type, data) {
    }

    send(data) {
        if (data instanceof VByteArray) {
            this._localWebSocket.sendWebSocketBytes(data.bytes);
        } else {
            this._localWebSocket.sendWebSocketBytes(data);
        }
    }

    onError() {
        this.dispatchWith(flower.Event.ERROR);
    }

    onClose() {
        this.dispatchWith(flower.Event.CLOSE);
    }

    close() {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket();
            this._localWebSocket = null;
        }
    }
}

exports.WebSocket = WebSocket;