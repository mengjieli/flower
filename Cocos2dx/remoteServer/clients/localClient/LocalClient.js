require("./../../com/requirecom");
require("./../../shell/requireshell");
require("./../../ftp/requireftp");
require("./../../net/requirenet");


var LocalClient = (function (_super) {

    __extends(LocalClient, _super);

    function LocalClient() {
        _super.call(this);
        this.config = null;
    }

    var d = __define, c = LocalClient;
    var p = c.prototype;

    p.receiveData = function (message) {
        if (message.type == "binary") {
            var data = message.binaryData;
            var bytes = new VByteArray();
            bytes.readFromArray(data);
            var cmd = bytes.readUIntV();
            //console.log("[receive]",cmd, bytes.bytes);
            switch (cmd) {
                case 0:
                    var cmd = bytes.readUIntV();
                    var code = bytes.readUIntV();
                    if (code != 0) {
                        console.log("[ErrorCode]", code);
                    }
                    break;
                case 100:
                    this.isFileExist(bytes);
                    break;
                case 102:
                    this.readDirectionList(bytes);
                    break;
                case 104:
                    this.saveFile(bytes);
                    break;
                case 501:
                    this.receiveRemote(bytes);
                    break;

            }
        }
    }

    p.isFileExist = function (msg) {
        var clientId = msg.readUIntV();
        var remoteId = msg.readUIntV();
        var url = msg.readUTFV();
        var file = new File(this.root + url);
        var bytes = new VByteArray();
        bytes.writeUIntV(22);
        bytes.writeUIntV(clientId);
        bytes.writeUIntV(101);
        bytes.writeUIntV(remoteId);
        bytes.writeBoolean(file.isExist());
        this.sendData(bytes);
    }

    p.saveFile = function (msg) {
        var clientId = msg.readUIntV();
        var remoteId = msg.readUIntV();
        var url = msg.readUTFV();
        var type = msg.readUTFV();
        var result = 0;
        try {
            if (type == "text") {
                var content = msg.readUTFV();
                var file = new File(this.root + url);
                file.save(content);
            } else if (type == "png") {
                var msgIndex = msg.readUIntV();
                var max = msg.readUIntV();
                var width = msg.readUIntV();
                var height = msg.readUIntV();
                var len = msg.readUIntV();
                var colors = [];
                if (msgIndex == 0) {
                    this.colors = colors;
                    this.colorsIndex = 0;
                } else {
                    colors = this.colors;
                }
                var index = this.colorsIndex;
                var all = width * height;
                var row;
                if (colors.length) {
                    row = colors[colors.length - 1];
                }
                var i = 0;
                while (index < all && i < len) {
                    if (index % width == 0) {
                        colors.push(row = []);
                    }
                    var r = msg.readUIntV();
                    var g = msg.readUIntV();
                    var b = msg.readUIntV();
                    var a = msg.readUIntV();
                    row.push(a << 24 | r << 16 | g << 8 | b);
                    i += 4;
                    index++;
                    this.colorsIndex++;
                }
                if (msgIndex == max) {
                    while (index < all) {
                        if (index % width == 0) {
                            colors.push(row = []);
                        }
                        row.push(0);
                        index++;
                    }
                    var encoder = new PNGEncoder();
                    encoder.encode(colors, 6);
                    var buffer = new Buffer(encoder.getData());
                    file = new File(this.root + url);
                    file.save(buffer, "binary");
                } else {
                    result = 2;
                }
            }
        } catch (e) {
            console.log(e);
            result = 1;
        }
        var bytes = new VByteArray();
        bytes.writeUIntV(22);
        bytes.writeUIntV(clientId);
        bytes.writeUIntV(105);
        bytes.writeUIntV(remoteId);
        bytes.writeByte(result);
        this.sendData(bytes);
    }

    p.readDirectionList = function (msg) {
        var clientId = msg.readUIntV();
        var remoteId = msg.readUIntV();
        var bytes = new VByteArray();
        bytes.writeUIntV(22);
        bytes.writeUIntV(clientId);
        bytes.writeUIntV(103);
        bytes.writeUIntV(remoteId);

        var url = msg.readUTFV();
        var file = new File(this.root + url);
        if (file.isExist() == false) {
            bytes.writeUIntV(0);
        } else {
            var list = file.readDirectionList();
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.url == url) {
                    list.splice(i, 1);
                    i--;
                }
            }
            bytes.writeUIntV(list.length);
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.url == url) continue;
                if (file.isDirection()) {
                    bytes.writeByte(0);
                } else {
                    bytes.writeByte(1);
                }
                bytes.writeUTFV(file.url.slice(this.root.length, file.url.length));
            }
        }
        this.sendData(bytes);
    }
    //
    //p.readFile = function (msg, bytes) {
    //    var url = msg.readUTFV();
    //    bytes.writeUTFV(url);
    //    if (url.charAt(0) == "/") {
    //        url = url.slice(1, url.length);
    //    }
    //    url = this.root + url;
    //    var format = msg.readByte();
    //    if (format == 0) {
    //        bytes.writeUTFV("");
    //        var list = (new File(url)).readContent("binary");
    //        var buffer = new Buffer(list);
    //        var array = [];
    //        for (var i = 0; i < buffer.length; i++) {
    //            array[i] = buffer[i];
    //        }
    //        bytes.writeByteArray(array);
    //    } else if (format == 1) {
    //        bytes.writeUTFV((new File(url)).readContent());
    //    }
    //}
    //
    //p.saveFile = function (msg, bytes) {
    //    var url = msg.readUTFV();
    //    bytes.writeUTFV(url);
    //    if (url.charAt(0) == "/") {
    //        url = url.slice(1, url.length);
    //    }
    //    url = this.root + url;
    //    var type = msg.readByte();
    //    var content;
    //    if (type == 0) { //保存二进制内容
    //        content = msg.readUTFV();
    //        (new File(url)).save(new Buffer(content), "binary");
    //        bytes.writeByte(0);
    //    }
    //    else if (type == 1) { //保存为 utf-8
    //        content = msg.readUTFV();
    //        (new File(url)).save(content);
    //        bytes.writeByte(0);
    //    }
    //}
    //
    //p.makeDirection = function (msg, bytes) {
    //    var url = msg.readUTFV();
    //    bytes.writeUTFV(url);
    //    if (url.charAt(0) == "/") {
    //        url = url.slice(1, url.length);
    //    }
    //    url = this.root + url;
    //    File.mkdirsSync(url);
    //}

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        this.config = cfg.local;
        this.root = this.config.root;
        if (this.root.charAt(this.root.length - 1) != "/") {
            this.root += "/";
        }
        this.httpServer = cfg.httpServer;
        var httpServer = new HttpServer(this.httpServer.port, this.root);
        httpServer.start();
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUIntV(0);
        bytes.writeUTFV("local");
        bytes.writeUTFV(this.config.user);
        bytes.writeUTFV(this.root);
        bytes.writeUIntV(this.httpServer.port);
        //bytes.writeUTFV(cfg.name);
        //bytes.writeUTFV(cfg.password);
        this.sendData(bytes);
        var _this = this;
        //setTimeout(function () {
        //    var bytes = new VByteArray();
        //    bytes.writeByte(0);
        //    bytes.writeByte(0);
        //    bytes.writeByte(0);
        //    bytes.writeByte(0);
        //    _this.sendData(bytes);
        //}, 10000);
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

    return LocalClient;

})(WebScoektClient);

var client = new LocalClient();
var content = (new File("config.json")).readContent();
var cfg = JSON.parse(content);
client.connect(cfg.server.ip, cfg.server.port);