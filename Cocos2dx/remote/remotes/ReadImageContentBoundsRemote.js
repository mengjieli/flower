class ReadImageDataRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(110);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        this.send(msg);
    }

    receive(cmd, msg) {
        var list = [];
        var width = msg.readUInt();
        var height = msg.readUInt();
        var colors = [];
        for (var y = 0; y < height; y++) {
            colors[y] = [];
            for (var x = 0; x < width; x++) {
                colors[y].push(msg.readInt());
            }
        }
        if (this.__back) {
            this.__back.call(this.__thisObj, colors);
        }
        this.dispose();
    }
}