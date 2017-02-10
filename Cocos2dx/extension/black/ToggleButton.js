class ToggleButton extends Button {

    constructor() {
        super();

        this.$ToggleButton = {
            0: false, //
            1: null, //value
        };
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        var p = this.$ToggleButton;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                if (p[0]) {
                    this.currentState = "selectedDown";
                } else {
                    this.currentState = "selectedUp";
                }
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                if (e.type == flower.TouchEvent.TOUCH_END) {
                    this.selected = !this.selected;
                }
                if (p[0]) {
                    this.currentState = "down";
                } else {
                    this.currentState = "up";
                }
                break;
        }
    }

    __setEnabled(val) {
        super._setEnabled(val);
        if (val == false && this.$ToggleButton[0]) {
            this.selected = false;
        }
    }

    __setSelected(val) {
        var p = this.$ToggleButton;
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (!this.enabled || val == p[0]) {
            return;
        }
        p[0] = val;
        if (p[1] && p[1] instanceof flower.Value) {
            p[1].value = val;
            if (p[0] != p[1].value) {
                this.__valueChange();
            }
        }
        if (val) {
            this.currentState = "down";
        } else {
            this.currentState = "up";
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    __valueChange() {
        var p = this.$ToggleButton;
        if (p[1]) {
            this.selected = p[1] instanceof flower.Value ? p[1].value : p[1];
        }
    }

    __onValueChange(e) {
        this.__valueChange();
    }

    get selected() {
        return this.$ToggleButton[0];
    }

    set selected(val) {
        this.__setSelected(val);
    }

    set value(val) {
        var p = this.$ToggleButton;
        if (p[1] == val) {
            return;
        }
        if (p[1] && p[1] instanceof flower.Value) {
            p[1].removeListener(flower.Event.CHANGE, this.__onValueChange, this);
        }
        p[1] = val;
        if (p[1] && p[1] instanceof flower.Value) {
            p[1].addListener(flower.Event.CHANGE, this.__onValueChange, this);
        }
        this.__valueChange();
    }

    get value() {
        return this.$ToggleButton[1];
    }
}

exports.ToggleButton = ToggleButton;


UIComponent.registerEvent(ToggleButton, 1402, "change", flower.Event.CHANGE);