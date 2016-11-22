class PlatformClient extends PlatformSocketClient {

    constructor(connection, big) {
        super(connection, big);
        this.buffer = new flower.VByteArray();
    }

    onReceive(data) {
        var buffer = this.buffer;
        for (var d = 0; d < data.length; d++) {
            buffer.writeByte(data[d]);
        }
        buffer.position = 0;
        var len = buffer.readUInt();
        while (buffer.bytesAvailable >= len) {
            var array = [];
            for (var l = 0; l < len; l++) {
                array.push(buffer.readByte());
            }
            var msg = new flower.VByteArray();
            msg.readFromArray(array);
            var cmd = msg.readUInt();
            this.onReceiveMessage(cmd, msg);
            if(buffer.bytesAvailable) {
                var oldPosition = buffer.position;
                try {
                    len = buffer.readUInt();
                } catch(e) {
                    buffer.position = oldPosition;
                    break;
                }
            } else {
                break;
            }
        }
        var newBuffer = new flower.VByteArray();
        while (buffer.bytesAvailable) {
            newBuffer.writeByte(buffer.readByte());
        }
        this.buffer = newBuffer;
    }

    onReceiveMessage(cmd, bytes) {
        console.log(cmd, bytes.data);
        if (cmd == 1) {
            Platform.init(bytes.readUInt(), bytes.readUInt());
        } else if (cmd == 11) {
            PlatformURLLoader.loadTextureBack(bytes.readUInt(), bytes.readUInt(), bytes.readUInt());
        } else if(cmd == 2) {
            var type = bytes.readUTF();
            var param1;
            var param2;
            if(type == "keyDown" || type == "keyUp") {
                param1 = bytes.readUInt();
            } else if(type == "touchDown" || type == "touchUp" || type == "mouseMove") {
                param1 = bytes.readUInt();
                param2 = bytes.readUInt();
            }
            Platform.receiveTouchKeyEvent(type,param1,param2);
        }
    }

    send(msg) {
        var array = msg.data;
        msg.clear();
        msg.writeUInt(array.length);
        array = msg.data.concat(array);
        msg.clear();
        msg.readFromArray(array);
        super.send(msg);
    }

    static message = {
        1: [{name: "width", type: "uint"}, {name: "height", type: "uint"}]
    }
}

