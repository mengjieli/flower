class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouch, this);
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

    __setEnabled(val) {
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

    addUIComponentEvents() {
        super.addUIComponentEvents();
        this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onEXEClick(e) {
        if (this.onClickEXE && e.target == this) {
            this.onClickEXE.call(this);
        }
    }
}

exports.Button = Button;