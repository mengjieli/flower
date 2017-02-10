class ReadDirectionListRemote extends Remote {

    __back;
    __thisObj;

    constructor(back, thisObj, path, autoUpdate = false) {
        super();
        this.__back = back;
        this.__thisObj = thisObj;

        var msg = new flower.VByteArray();
        msg.writeUInt(20);
        msg.writeUInt(this.remoteClientId);
        msg.writeUInt(102);
        msg.writeUInt(this.id);
        msg.writeUTF(path);
        msg.writeUTF(autoUpdate);
        this.send(msg);
        this.autoUpdate = autoUpdate;
    }

    receive(cmd, msg) {
        var list = [];
        var len = msg.readUInt();
        for (var i = 0; i < len; i++) {
            var isDirection = msg.readUInt();
            var path = msg.readUTF();
            list.push({
                isDirection: isDirection == 0 ? true : false,
                path: path,
                name: flower.Path.getName(path),
                fileType: flower.Path.getFileType(path)
            });
        }
        if (this.__back) {
            this.__back.call(this.__thisObj, list);
        }
        if (!this.autoUpdate) {
            this.__back = this.__thisObj = null;
            this.dispose();
        }
    }
}