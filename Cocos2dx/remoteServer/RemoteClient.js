class RemoteClient extends WebSocketServerClient {
    constructor(connection, big) {
        super(connection, big);
    }

    receiveData(message) {
        var data;
        if (message.type == "utf8") {
            this.type = "utf8";
            data = JSON.parse(message.utf8Data);
        }
        else if (message.type == "binary") {
            var data = message.binaryData;
        }
        var bytes = new VByteArray();
        bytes.readFromArray(data);
        var cmd = bytes.readUIntV();
        switch (cmd) {
            case 0:
                //this.receiveHeart(bytes);
                return;
        }
        //if (this.hasLogin == false && (cmd != 0 && cmd != 1)) {
        //    this.sendFail(10, cmd, bytes);
        //    this.close();
        //    return;
        //}
        console.log(bytes.bytes);
        if (Config.cmds[cmd]) {
            console.log("[cmd]", cmd);
            var cls = global[Config.cmds[cmd]];
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
        } else if (this.type == "utf8") {
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
}