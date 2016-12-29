class VBWebSocket extends WebSocket {
    static id = 0;

    _remote;
    remotes = {};
    backs = {};
    zbacks = {};
    errorCodeType;

    constructor(remote = false, errorCodeType = "uint") {
        super();
        this._remote = remote;
        this.remotes = {};
        this.backs = {};
        this.zbacks = {};
        this.errorCodeType = errorCodeType;
    }

    get remote() {
        return this._remote;
    }

    onReceiveMessage(type, data) {
        var bytes = new VByteArray();
        if (type == "string") {
            bytes.readFromArray(JSON.parse(data));
        } else {
            bytes.readFromArray(data);
        }
        var pos;
        var cmd = bytes.readUInt();
        var removeList;
        var a;
        var i;
        var f;
        var backList;
        //trace("[receive] cmd = ",cmd," data = ",bytes.toString());
        if (cmd == 0) {
            var backCmd = bytes.readUInt();
            var zbackList = this.zbacks[backCmd];
            if (zbackList) {
                removeList = [];
                var errorCode;
                if (this.errorCodeType == "uint") {
                    errorCode = bytes.readUInt();
                } else if (this.errorCodeType == "int") {
                    errorCode = bytes.readInt();
                }
                a = zbackList.concat();
                for (i = 0; i < a.length; i++) {
                    a[i].func.call(a[i].thisObj, backCmd, errorCode, bytes);
                    if (a[i].once) {
                        removeList.push(a[i].id);
                    }
                }
                for (i = 0; i < removeList.length; i++) {
                    for (f = 0; f < this.zbacks[backCmd].length; f++) {
                        if (this.zbacks[backCmd][f].id == removeList[i]) {
                            this.zbacks[backCmd].splice(f, 1);
                            break;
                        }
                    }
                }
            }
            bytes.position = 0;
            bytes.readUInt();
            pos = bytes.position;
            backList = this.backs[cmd];
            if (backList) {
                removeList = [];
                a = backList.concat();
                for (i = 0; i < a.length; i++) {
                    bytes.position = pos;
                    a[i].func.call(a[i].thisObj, cmd, bytes);
                    if (a[i].once) {
                        removeList.push(a[i].id);
                    }
                }
                for (i = 0; i < removeList.length; i++) {
                    for (f = 0; f < this.backs[cmd].length; f++) {
                        if (this.backs[cmd][f].id == removeList[i]) {
                            this.backs[cmd].splice(f, 1);
                            break;
                        }
                    }
                }
            }
        } else {
            var remoteId = 0;
            if (this._remote) {
                remoteId = bytes.readUInt();
            }
            pos = bytes.position;
            if (remoteId) {
                var remote = this.remotes[remoteId];
                if (remote) {
                    remote.receive(cmd, bytes);
                }
            } else {
                backList = this.backs[cmd];
                if (backList) {
                    removeList = [];
                    a = backList.concat();
                    for (i = 0; i < a.length; i++) {
                        bytes.position = pos;
                        a[i].func.call(a[i].thisObj, cmd, bytes);
                        if (a[i].once) {
                            removeList.push(a[i].id);
                        }
                    }
                    for (i = 0; i < removeList.length; i++) {
                        for (f = 0; f < this.backs[cmd].length; f++) {
                            if (this.backs[cmd][f].id == removeList[i]) {
                                this.backs[cmd].splice(f, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    //send(data) {
    //    this.sendWebSocketBytes(data.data);
    //}

    registerRemote(remote) {
        this.remotes[remote.id] = remote;
    }

    removeRemote(remote) {
        delete this.remotes[remote.id];
    }

    register(cmd, back, thisObj) {
        if (this.backs[cmd] == null) {
            this.backs[cmd] = [];
        }
        this.backs[cmd].push({func: back, thisObj: thisObj, id: VBWebSocket.id++});
    }

    registerOnce(cmd, back, thisObj) {
        if (this.backs[cmd] == null) {
            this.backs[cmd] = [];
        }
        this.backs[cmd].push({func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++});
    }

    remove(cmd, back, thisObj) {
        var list = this.backs[cmd];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].func == back && list[i].thisObj == thisObj) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    registerZero(cmd, back, thisObj) {
        if (this.zbacks[cmd] == null) {
            this.zbacks[cmd] = [];
        }
        this.zbacks[cmd].push({func: back, thisObj: thisObj, id: VBWebSocket.id++});
    }

    removeZero(cmd, back, thisObj) {
        var list = this.zbacks[cmd];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].func == back && list[i].thisObj == thisObj) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    registerZeroOnce(cmd, back, thisObj) {
        if (this.zbacks[cmd] == null) {
            this.zbacks[cmd] = [];
        }
        this.zbacks[cmd].push({func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++});
    }
}

exports.VBWebSocket = VBWebSocket;