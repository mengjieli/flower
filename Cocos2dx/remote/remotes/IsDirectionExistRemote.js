class IsDirectionExistRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(100);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        this.send(msg);
    }

    receive(cmd, msg) {
        if (this.__back) {
            this.__back.call(this.__thisObj, msg.readBoolean());
        }
        this.__back = this.__thisObj = null;
        this.dispose();
    }
}