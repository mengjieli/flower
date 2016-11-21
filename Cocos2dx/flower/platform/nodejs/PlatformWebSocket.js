class PlatformWebSocket {

    webSocket;
    connection;

    bindWebSocket(ip, port, path, thisObj, onConnect, onReceiveMessage, onError, onClose) {
        var websocket = new WSClient();
        this.webSocket = websocket;
        websocket.connect("ws://" + ip + ":" + port + "/");
        var openFunc = function (connection) {
            this.connection = connection;
            connection.on('message', receiveFunc);
            connection.on('error', errorFunc);
            connection.on('close', closeFunc);
            onConnect.call(thisObj);
        };
        websocket.on("connect", openFunc.bind(this));
        var openError = function () {
            onError.call(thisObj);
        }
        websocket.on("connectFailed", openError);
        var receiveFunc = function (message) {
            if (message.type == "binary") {
                onReceiveMessage.call(thisObj, "buffer", message.binaryData);
            } else if (message.type == "utf8") {
                onReceiveMessage.call(thisObj, "string", message.utf8Data);
            }
        };
        var errorFunc = function () {
            onError.call(thisObj);
        };
        var closeFunc = function () {
            onClose.call(thisObj);
        };
        PlatformWebSocket.webSockets.push({
            "webSocket": websocket
        });
        return websocket;
    }

    sendWebSocketUTF(data) {
        this.connection.send(data);
    }

    sendWebSocketBytes(data) {
        this.connection.sendBytes(new Buffer(data));
    }

    releaseWebSocket() {
        var item = null;
        var list = PlatformWebSocket.webSockets;
        var webSocket = this.webSocket;
        for (var i = 0; i < list.length; i++) {
            if (websocket == list[i].webSocket) {
                websocket.close();
                websocket.onopen = null;
                websocket.onmessage = null;
                websocket.onerror = null;
                websocket.onclose = null;
                this.webSocket = null;
                list.splice(i, 1);
                break;
            }
        }
    }

    static webSockets = [];
}