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
        }
        var newBuffer = new flower.VByteArray();
        while (buffer.bytesAvailable) {
            newBuffer.writeByte(buffer.readByte());
        }
        this.buffer = newBuffer;
    }

    onReceiveMessage(cmd, bytes) {
        if (cmd == 1) {
            Platform.init(bytes.readUInt(), bytes.readUInt());
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

