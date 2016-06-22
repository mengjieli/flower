class TouchEvent extends Event {

    touchX;
    touchY;
    stageX;
    stageY;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    static TOUCH_BEGIN = "touch_begin";
    static TOUCH_MOVE = "touch_move";
    static TOUCH_END = "touch_end";
    static TOUCH_RELEASE = "touch_release";
}

exports.TouchEvent = TouchEvent;