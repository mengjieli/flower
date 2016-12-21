class MouseEvent extends Event {

    $touchX;
    $touchY;
    $stageX;
    $stageY;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get mouseX() {
        if (this.currentTarget) {
            return this.currentTarget.mouseX;
        }
        return this.$touchX;
    }

    get mouseY() {
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

    /**
     * 此事件是在没有 touch 的情况下发生的，即没有按下
     * @type {string}
     */
    static MOUSE_MOVE = "mouse_move";
    static MOUSE_OVER = "mouse_over";
    static MOUSE_OUT = "mouse_out";
    static RIGHT_CLICK = "right_click";
}

exports.MouseEvent = MouseEvent;