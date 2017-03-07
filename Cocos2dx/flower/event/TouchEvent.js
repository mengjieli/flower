class TouchEvent extends Event {

    $touchId = 0;
    $touchX = 0;
    $touchY = 0;
    $stageX = 0;
    $stageY = 0;
    $beginTouchX = 0;
    $beginTouchY = 0;
    $beginStageX = 0;
    $beginStageY = 0;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get touchId() {
        return this.$touchId;
    }

    get touchX() {
        if (this.currentTarget) {
            return this.currentTarget.mouseX;
        }
        return this.$touchX;
    }

    get touchY() {
        if (this.currentTarget) {
            return this.currentTarget.mouseY;
        }
        return this.$touchY;
    }

    get stageX() {
        return this.$stageX;
    }

    get stageY() {
        return this.$stageY;
    }

    get beginTouchX() {
        return this.$beginTouchX;
    }

    get beginTouchY() {
        return this.$beginTouchY;
    }

    get beginStageX() {
        return this.$beginStageX;
    }

    get beginStageY() {
        return this.$beginStageY;
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