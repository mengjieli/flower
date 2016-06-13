var WebSocketServerClient = (function (_super) {
    __extends(WebSocketServerClient, _super);

    function WebSocketServerClient(connection, big) {
        _super.call(this);
        if (big === void 0) {
            big = true;
        }
        this.big = big;
        this.connection = connection;
        var _this = this;
        this.connection.on('message', this.receiveData.bind(this));
        this.connection.on('close', this.onClose.bind(this));
    }

    var d = __define, c = WebSocketServerClient;
    p = c.prototype;

    p.receiveData = function (message) {
        //if(message.type == "binary") {
        //    var data = message.binaryData;
        //    var byte = new VByteArray();
        //    byte.readFromArray(data);
        //}
        //if(message.type == "utf8") {
        //    var data = message.utf8Data;
        //}
    }

    p.onClose = function () {
        this.dispatchEvent(new Event(Event.CLOSE));
    }

    return WebSocketServerClient;
})(EventDispatcher);

global.WebSocketServerClient = WebSocketServerClient;