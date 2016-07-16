class SaveFileRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path, data, type, width, height) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;
        if (typeof data == "string") {
            var msg = new flower.VByteArray();
            msg.writeUInt(20);
            msg.writeUInt(this.remoteClientId);
            msg.writeUInt(104);
            msg.writeUInt(this.id);
            msg.writeUTF(path);
            msg.writeUTF(type);
            msg.writeUTF(data);
            this.send(msg);
        } else {
            var len = data.length;
            var i = 0;
            var index = 0;
            while (i < len) {
                var msg = new flower.VByteArray();
                msg.writeUInt(20);
                msg.writeUInt(this.remoteClientId);
                msg.writeUInt(104);
                msg.writeUInt(this.id);
                msg.writeUTF(path);
                msg.writeUTF(type);
                msg.writeUInt(index);
                msg.writeUInt(Math.ceil(len / 1024) - 1);
                msg.writeUInt(width);
                msg.writeUInt(height);
                msg.writeUInt(i + 1024 < len ? 1024 : len - i);
                var count = 0;
                for (var j = 0; j < 1024 && i < len; j++) {
                    msg.writeUInt(data[i]);
                    i++;
                    count++;
                }
                this.send(msg);
                index++;
            }
        }
    }

    receive(cmd, msg) {
        var result = msg.readByte();
        if (result <= 1) {
            if (this.__back) {
                this.__back.call(this.__thisObj, result == 0 ? true : false);
            }
            this.__back = this.__thisObj = null;
        }
    }
}