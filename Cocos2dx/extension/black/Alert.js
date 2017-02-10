class Alert extends Panel {

    $Alert;

    constructor() {
        super();

        this.$Alert = {
            0: null, //confirmButton
            1: null, //cancelButton
            2: null, //contentLabel
            3: "", //content
        };
    }

    $onConfirm(e) {
        this.dispatchWith(flower.Event.CONFIRM);
        this.closePanel();
    }

    $onCancel(e) {
        this.dispatchWith(flower.Event.CANCEL);
        this.closePanel();
    }

    get confirmButton() {
        return this.$Alert[0];
    }

    set confirmButton(val) {
        if (this.$Alert[0] == val) {
            return;
        }
        if (this.$Alert[0]) {
            this.$Alert[0].removeListener(flower.TouchEvent.TOUCH_END, this.$onConfirm, this);
            if (this.$Alert[0].parent && this.$Alert[0].parent != this) {
                this.$Alert[0].parent.removeChild(this.$Alert[0]);
            }
        }
        this.$Alert[0] = val;
        if (val) {
            val.addListener(flower.TouchEvent.TOUCH_END, this.$onConfirm, this);
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get cancelButton() {
        return this.$Alert[1];
    }

    set cancelButton(val) {
        if (this.$Alert[1] == val) {
            return;
        }
        if (this.$Alert[1]) {
            this.$Alert[1].removeListener(flower.TouchEvent.TOUCH_END, this.$onCancel, this);
            if (this.$Alert[1].parent && this.$Alert[1].parent != this) {
                this.$Alert[1].parent.removeChild(this.$Alert[1]);
            }
        }
        this.$Alert[1] = val;
        if (val) {
            this.$Alert[1].addListener(flower.TouchEvent.TOUCH_END, this.$onCancel, this);
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get contentLabel() {
        return this.$Alert[2];
    }

    set contentLabel(val) {
        if (this.$Alert[2] == val) {
            return;
        }
        if (this.$Alert[2] && this.$Alert[2].parent && this.$Alert[2].parent != this) {
            this.$Alert[2].parent.removeChild(this.$Alert[2]);
        }
        this.$Alert[2] = val;
        if (val) {
            val.text = this.$Alert[3];
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get content() {
        return this.$Alert[3];
    }

    set content(val) {
        if (this.$Alert[3] == val) {
            return this.$Alert[3];
        }
        this.$Alert[3] = val;
        if (this.$Alert[2]) {
            this.$Alert[2].text = val;
        }
    }
}
UIComponent.registerEvent(Panel, 1130, "confirm", flower.Event.CONFIRM);
UIComponent.registerEvent(Panel, 1131, "cancel", flower.Event.CANCEL);

exports.Alert = Alert;