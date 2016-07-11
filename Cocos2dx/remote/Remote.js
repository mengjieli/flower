class Remote {

    __id;

    constructor() {
        this.__id = Remote.id++;
        RemoteServer.getInstance().registerRemote(this);
    }

    send(msg) {
        RemoteServer.getInstance().send(msg);
    }

    receive(cmd, bytes) {
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