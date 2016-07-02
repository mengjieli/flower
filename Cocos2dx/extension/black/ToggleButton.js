class ToggleButton extends Button {

    __selected = false;
    onChangeEXE;

    constructor() {
        super();
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                if (this.__selected) {
                    this.currentState = "selectedDown";
                } else {
                    this.currentState = "down";
                }
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                if (e.type == flower.TouchEvent.TOUCH_END) {
                    this.selected = !this.selected;
                }
                if (this.__selected) {
                    this.currentState = "selectedUp";
                } else {
                    this.currentState = "up";
                }
                break;
        }
    }

    __setEnabled(val) {
        super._setEnabled(val);
        if (val == false && this.__selected) {
            this.selected = false;
        }
    }

    __setSelected(val) {
        val = !!val;
        if (!this.enabled || val == this.__selected) {
            return;
        }
        this.__selected = val;
        if (val) {
            this.currentState = "selectedUp";
        } else {
            this.currentState = "up";
        }
        if (this.onChangeEXE) {
            this.onChangeEXE.call(this);
        }
    }

    get selected() {
        return this.__selected;
    }

    set selected(val) {
        this.__setSelected(val);
    }

    set onChange(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onChangeEXE = val;
    }

    get onChange() {
        return this.onChangeEXE;
    }
}

exports.ToggleButton = ToggleButton;