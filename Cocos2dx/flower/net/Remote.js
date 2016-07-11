class Remote {

    static id = 1;

    __id;

    constructor() {
        this.__id = Remote.id++;
    }

    get id() {
        return this.__id;
    }

    receiveMessage(cmd, msg) {
    }
}

exports.Remote = Remote;