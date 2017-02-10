class PlatformWebSocket {

    webSocket;

    bindWebSocket(ip, port, path, thisObj, onConnect, onReceiveMessage, onError, onClose) {
        var websocket = new LocalWebSocket("ws://" + ip + ":" + port + path);
        this.webSocket = websocket;
        var openFunc = function () {
            onConnect.call(thisObj);
        };
        websocket.onopen = openFunc;
        var receiveFunc = function (event) {
            if (!cc.sys.isNative && event.data instanceof Blob) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var list = [];
                    var data = new Uint8Array(this.result);
                    for (var i = 0; i < data.length; i++) {
                        list.push(data[i]);
                    }
                    onReceiveMessage.call(thisObj, "buffer", list);
                }
                reader.readAsArrayBuffer(event.data);
            } else if (cc.sys.isNative && event.data instanceof ArrayBuffer) {
                var list = [];
                var data = new Uint8Array(event.data);
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
                onReceiveMessage.call(thisObj, "buffer", list);
            } else {
                onReceiveMessage.call(thisObj, "string", event.data);
            }
        };
        websocket.onmessage = receiveFunc;
        var errorFunc = function () {
            onError.call(thisObj);
        };
        websocket.onerror = errorFunc;
        var closeFunc = function () {
            onClose.call(thisObj);
        };
        websocket.onclose = closeFunc;
        PlatformWebSocket.webSockets.push({
            "webSocket": websocket
        });
        return websocket;
    }

    sendWebSocketUTF(data) {
        this.webSocket.send(data);
    }

    sendWebSocketBytes(data) {
        this.webSocket.send(new Uint8Array(data));
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