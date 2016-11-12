var GameClient = (function (_super) {

    __extends(GameClient, _super);

    function GameClient(data,id) {
        _super.call(this);
        this.data = data;
        this.id = id;
        this.dispatcher = new EventDispatcher();
        this.hasConnect = false;
        this.isConnect = true;
        this.connect(data.gameIp, 13211, "empery");
    }

    var d = __define, c = GameClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            //console.log("[receive]", data);
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            //console.log("[receive]", cmd);
            switch (cmd) {
                case 0:
                    var cmd = bytes.readUIntV();
                    var code = bytes.readUIntV();
                    if (code != 0) {
                        console.log("[ErrorCode]", code);
                    }
                    break;
                case 501:
                    break;
                case 69:
                    var msgCount = bytes.readUIntV();
                    for (var i = 0; i < msgCount; i++) {
                        var subCmd = bytes.readUIntV();
                        var len = bytes.readUIntV();
                        //console.log("[Receive]", subCmd, len)
                        var subBuff = new VByteArray();
                        subBuff.writeUIntV(subCmd);
                        var pos = 0;
                        while (pos < len) {
                            subBuff.writeByte(bytes.readByte());
                            pos++;
                        }
                        subBuff.position = 0;
                        subBuff.readUIntV();
                        this.dispatcher.dispatchEvent(new Event(subCmd, {cmd: subCmd, msg: subBuff}));
                    }
                    break;

            }
        }
    }


    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        this.hasConnect = true;
        this.isConnect = false;

        var _this = this;
        setTimeout(function () {
            var bytes = new VByteArray();
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            bytes.writeByte(0);
            _this.sendData(bytes);
        }, 10000);

        var login = new LoginGame(this.data, this, this.dispatcher,this.id);
    }

    p.sendData = function (bytes) {
        this.connection.sendBytes(new Buffer(bytes.data));
    }

    p.close = function () {
        if (this.hasConnect || this.isConnect) {
            this.connection.close();
        }
    }

    p.onClose = function () {
        this.hasConnect = false;
        this.dispatcher.dispatchEvent(new Event("loginOut"));
        _super.prototype.onClose.call(this);
    }

    return GameClient;

})(WebScoektClient);

global.GameClient = GameClient;