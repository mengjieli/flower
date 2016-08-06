class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";

        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouch, this);
        this.addListener(flower.MouseEvent.MOUSE_OVER, this.__onMouse, this);
        this.addListener(flower.MouseEvent.MOUSE_OUT, this.__onMouse, this);
        this.addListener(flower.Event.REMOVED, this.__onRemoved, this);
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var target = super.$getMouseTarget(touchX, touchY, multiply);
        if (target) {
            target = this;
        }
        return target;
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                this.currentState = "down";
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                this.currentState = "up";
                break;
        }
    }

    __onMouse(e) {
        if (this.currentState == "up" || this.currentState == "over") {
            switch (e.type) {
                case flower.MouseEvent.MOUSE_OVER :
                    this.currentState = "over";
                    break;
                case flower.MouseEvent.MOUSE_OUT :
                    this.currentState = "up";
                    break;
            }
        }
    }

    __onRemoved(e) {
        this.currentState = "up";
    }

    __setEnabled(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (this._enabled == val) {
            return false;
        }
        this._enabled = val;
        if (this._enabled) {
            this.currentState = "up";
        } else {
            this.currentState = "disabled";
        }
        return true;
    }

    set enabled(val) {
        this.__setEnabled(val);
    }

    get enabled() {
        return this._enabled;
    }
}

UIComponent.registerEvent(Button, 1100, "click", flower.TouchEvent.TOUCH_END);

exports.Button = Button;