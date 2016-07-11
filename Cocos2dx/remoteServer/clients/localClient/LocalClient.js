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
                    this.receiveRemote(bytes);
                    break;

            }
        }
    }

    p.receiveRemote = function (msg) {
        var taskId = msg.readUIntV();
        var cmd = msg.readUIntV();
        var bytes = new VByteArray();
        bytes.writeUIntV(502);
        bytes.writeUIntV(taskId);
        console.log("[Task]", cmd);
        switch (cmd) {
            case 100: //读取文件夹文件列表
                this.readWorkDirection(msg, bytes);
                break;
            case 102:
                this.readFile(msg, bytes);
                break;
            case 120: //保存文件
                this.saveFile(msg, bytes);
                break;
            case 122: //创建文件夹
                this.makeDirection(msg, bytes);
                break;
            case 124: //文件或者文件夹是否存在
                this.isFileExist(msg, bytes);
                break;
        }
        if (bytes) {
            this.sendData(bytes);
        }
    }

    p.readWorkDirection = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        if (url.charAt(0) == "/") {
            url = url.slice(1, url.length);
        }
        url = this.root + url;
        var file = new File(url);
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
                if (file.type == FileType.DIRECTION) {
                    bytes.writeByte(0);
                } else {
                    bytes.writeByte(1);
                }
                bytes.writeUTFV(file.url);
            }
        }
    }

    p.readFile = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        if (url.charAt(0) == "/") {
            url = url.slice(1, url.length);
        }
        url = this.root + url;
        var format = msg.readByte();
        if (format == 0) {
            bytes.writeUTFV("");
            var list = (new File(url)).readContent("binary");
            var buffer = new Buffer(list);
            var array = [];
            for (var i = 0; i < buffer.length; i++) {
                array[i] = buffer[i];
            }
            bytes.writeByteArray(array);
        } else if (format == 1) {
            bytes.writeUTFV((new File(url)).readContent());
        }
    }

    p.saveFile = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        if (url.charAt(0) == "/") {
            url = url.slice(1, url.length);
        }
        url = this.root + url;
        var type = msg.readByte();
        var content;
        if (type == 0) { //保存二进制内容
            content = msg.readUTFV();
            (new File(url)).save(new Buffer(content), "binary");
            bytes.writeByte(0);
        }
        else if (type == 1) { //保存为 utf-8
            content = msg.readUTFV();
            (new File(url)).save(content);
            bytes.writeByte(0);
        }
    }

    p.makeDirection = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        if (url.charAt(0) == "/") {
            url = url.slice(1, url.length);
        }
        url = this.root + url;
        File.mkdirsSync(url);
    }

    p.isFileExist = function (msg, bytes) {
        var url = msg.readUTFV();
        bytes.writeUTFV(url);
        if (url.charAt(0) == "/") {
            url = url.slice(1, url.length);
        }
        url = this.root + url;
        bytes.writeBoolean((new File(url)).isExist());
    }

    p.onConnect = function (connection) {
        _super.prototype.onConnect.call(this, connection);
        var content = (new File("config.json")).readContent();
        var cfg = JSON.parse(content);
        this.config = cfg.local;
        this.root = this.config.root;
        if (this.root.charAt(this.root.length - 1) != "/") {
            this.root += "/";
        }
        var bytes = new VByteArray();
        bytes.writeUIntV(1);
        bytes.writeUTFV("local");
        bytes.writeUTFV(this.root);
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

client.connect("localhost", 9900);