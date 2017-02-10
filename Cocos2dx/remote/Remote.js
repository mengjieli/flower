class Remote {

    __id;

    constructor(back, thisObj) {
        this.__id = Remote.id++;
        this.back = back;
        this.thisObj = thisObj;
        RemoteServer.getInstance().registerRemote(this);
    }

    send(msg) {
        RemoteServer.getInstance().send(msg);
    }

    receive(cmd, bytes) {
        if (this.back) {
            this.back.call(this.thisObj, cmd, bytes, this);
        }
    }

    dispose() {
        RemoteServer.getInstance().removeRemote(this);
    }

    get id() {
        return this.__id;
    }

    get remoteClientId() {
        return RemoteServer.getInstance().remoteClientId;
    }

    static id = 1;
}
exports.Remote = Remote;