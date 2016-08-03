class KeyboardEvent extends Event {

    __keyCode;
    __key;


    constructor(type, key, bubbles = true) {
        super(type, bubbles);
        this.__keyCode = key;
        this.__key = String.fromCharCode(key);
    }

    get keyCode() {
        return this.__keyCode;
    }

    get key() {
        return this.__key;
    }

    get shift() {
        return KeyboardEvent.$shift;
    }

    get control() {
        return KeyboardEvent.$control;
    }

    get alt() {
        return KeyboardEvent.$alt;
    }

    static $shift = false; //16
    static $control = false; //17
    static $alt = false; //18

    static KEY_DOWN = "key_down";
    static KEY_UP = "key_up";
}

exports.KeyboardEvent = KeyboardEvent;