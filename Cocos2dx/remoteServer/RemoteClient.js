class RemoteClient extends WebSocketServerClient {


    id;
    hasLogin;
    ip;
    information;

    constructor(connection, big) {
        super(connection, big);
        this.id = RemoteClient.id++;
        this.hasLogin = false;
        this.ip = connection.remoteAddress;
        this.information = {};
    }

    receiveData(message) {
        var data;
        if (message.type == "utf8") {
            this.type = message.type;
            data = JSON.parse(message.utf8Data);
        }
        else if (message.type == "binary") {
            this.type = message.type;
            var data = message.binaryData;
        }
        var bytes = new VByteArray();
        bytes.readFromArray(data);
        var cmd = bytes.readUIntV();
        //console.log(cmd, " [bytes] ", bytes.bytes);
        switch (cmd) {
            case 0:
                //this.receiveHeart(bytes);
                return;
        }
        if (this.hasLogin == false && (cmd != 0 && cmd != 1)) {
            this.sendFail(10, cmd, bytes);
            this.close();
            return;
        }
        if (Config.cmds[cmd]) {
            var className = Config.cmds[cmd];
            var cls = eval(className);
            if (cls == null) {
                this.sendFail(5, cmd, bytes);
            } else {
                try {
                    new cls(this.user, this, cmd, bytes);
                } catch (e) {
                    console.log(e);
                    this.sendFail(6, cmd, bytes, e);
                }
            }
        } else {
            this.sendFail(5, cmd, bytes);
        }
    }

    sendFail(errorCode, cmd, bytes, message) {
        message = message || "";
        var msg = new VByteArray();
        msg.writeUIntV(0);
        msg.writeUIntV(cmd);
        msg.writeUIntV(errorCode);
        msg.writeUTFV(message);
        bytes.position = 0;
        bytes.readUIntV();
        msg.writeBytes(bytes, bytes.position, bytes.length - bytes.position);
        this.sendData(msg);
    }

    receiveHeart(data) {
        var a = data.readUIntV();
        var b = data.readUIntV();
        var c = data.readUIntV();
        if (!a && !b && !c) {
            this.checkTime = (new Date()).getTime() + 30000;
        }
    }

    checkHeart(time) {
        //if (time > this.checkTime) {
        //    //console.log(time, this.checkTime);
        //    this.close();
        //}
    }

    receiveAnonce(data) {
        var msg = data.readUTFV();
        this.sendAllAnonce(msg);
    }

    sendAllAnonce(msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.server.sendDataToAll(bytes);
    }

    sendAnonce(msg) {
        var bytes = new VByteArray();
        bytes.writeUIntV(201);
        bytes.writeUTFV(msg);
        this.sendData(bytes);
    }

    sendData(bytes) {
        if (this.type == "binary") {
            this.connection.sendBytes(new Buffer(bytes.data));
        } else {
            var str = "[";
            var array = bytes.data;
            for (var i = 0; i < array.length; i++) {
                str += array[i] + (i < array.length - 1 ? "," : "");
            }
            str += "]";
            this.connection.sendUTF(str);
        }
    }

    close() {
        console.log("close connection!");
        this.connection.close();
    }

    static id = 1;
}