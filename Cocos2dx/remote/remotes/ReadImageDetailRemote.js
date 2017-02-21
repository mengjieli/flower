class ReadImageDetailRemote extends Remote {

    __back;
    __thisObj;
    __path;

    constructor(back, thisObj, path) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;
        this.__path = path;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(112);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        this.send(msg);
    }

    receive(cmd, msg) {
        var list = [];
        var width = msg.readUInt();
        var height = msg.readUInt();
        if (this.__back) {
            this.__back.call(this.__thisObj, {
                width: width,
                height: height,
                path: this.__path
            });
        }
        this.dispose();
    }
}