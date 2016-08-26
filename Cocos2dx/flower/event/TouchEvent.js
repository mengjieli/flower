class TouchEvent extends Event {

    $touchId = 0;
    $touchX = 0;
    $touchY = 0;
    $stageX = 0;
    $stageY = 0;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get touchId() {
        return this.$touchId;
    }

    get touchX() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchX;
        }
        return this.$touchX;
    }

    get touchY() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchY;
        }
        return this.$touchY;
    }

    get stageX() {
        return this.$stageX;
    }

    get stageY() {
        return this.$stageY;
    }

    static TOUCH_BEGIN = "touch_begin";
    static TOUCH_MOVE = "touch_move";
    static TOUCH_END = "touch_end";
    static TOUCH_RELEASE = "touch_release";
    /**
     * 此事件是在没有 touch 的情况下发生的，即没有按下
     * @type {string}
     */
    static MOVE = "move";
}

exports.TouchEvent = TouchEvent;