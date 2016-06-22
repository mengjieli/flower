class IOErrorEvent extends Event {

    static ERROR = "error";

    _message;

    constructor(type, message) {
        super(type);
    }

    get message() {
        return this._message;
    }

}

exports.IOErrorEvent = IOErrorEvent;