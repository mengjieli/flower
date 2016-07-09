require("./com/requirecom");
require("./net/requirenet");
require("./ftp/requireftp");
require("./shell/requireshell");


var EditerClient = (function (_super) {

    __extends(EditerClient, _super);

    function EditerClient() {
        _super.call(this);
    }

    var d = __define, c = EditerClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            console.log("[Receive]",cmd,bytes);
            //switch (cmd) {
            //    case 0:
            //        var cmd = bytes.readUIntV();
            //        var code = bytes.readUIntV();
            //        if (code != 0) {
            //            console.log("[ErrorCode]", code,bytes.readUTFV());
            //        } else {
            //            this.netSuccess(cmd);
            //        }
            //        break;
            //    case 101:
            //        var url = bytes.readUTFV();
            //        console.log(url);
            //        var len = bytes.readUIntV();
            //        console.log("readdir back",url,len);
            //        for(var i = 0; i < len; i++) {
            //            var type = bytes.readByte();
            //            console.log(type,bytes.readUTFV());
            //        }
            //        break;
            //}
        }
    }

    p.netSuccess = function (cmd) {
        if (cmd == 1) {
            //console.log("success login");
            var bytes = new VByteArray();
            bytes.writeUIntV(100);
            bytes.writeUTFV("");
            this.sendData(bytes);
            //this.close();
        }
        console.log("[Success]",cmd);
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        console.log("connect!");
    }

    p.sendData = function (bytes) {
        this.connection.sendBytes(new Buffer(bytes.data));
    }

    p.close = function () {
        this.connection.close();
    }

    p.onClose = function () {
        _super.prototype.onClose.call(this);
    }

    return EditerClient;

})(WebScoektClient);

var client = new EditerClient();

client.connect("localhost", 9900);