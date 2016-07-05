class UIEvent extends flower.Event {
    constructor(type, bubbles = false) {
        super(type, bubbles);
    }

    static CREATION_COMPLETE = "creation_complete";
}

exports.UIEvent = UIEvent;