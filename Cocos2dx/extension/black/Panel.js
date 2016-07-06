class Panel extends Group {

    $Panel;

    constructor() {
        super();
        this.$Panel = {
            0: "",//title
            1: null, //titleLabel
            2: null, //closeButton
        }
    }

    __changeTitle() {
        var p = this.$Panel;
        if (p[0] && p[1]) {
            p[1].text = p[0];
        }
    }

    $onClose() {
        this.close();
    }

    close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    set title(val) {
        if (this.$Panel[0] == val) {
            return;
        }
        this.$Panel[0] = val;
        this.__changeTitle();
    }

    get title() {
        return this.$Panel[0];
    }

    get titleLabel() {
        return this.$Panel[1];
    }

    set titleLabel(val) {
        if (this.$Panel[1] == val) {
            return;
        }
        this.$Panel[1] = val;
        if (val.parent != this) {
            this.addChild(val);
        }
        this.__changeTitle();
    }

    get closeButton() {
        return this.$Panel[2];
    }

    set closeButton(val) {
        if (this.$Panel[2] == val) {
            return;
        }
        if (this.$Panel[2]) {
            this.$Panel[2].removeListener(flower.TouchEvent.TOUCH_END, this.$onClose, this);
        }
        this.$Panel[2] = val;
        if (val) {
            if (val.parent != this) {
                this.addChild(val);
            }
            val.addListener(flower.TouchEvent.TOUCH_END, this.$onClose, this);
        }
    }
}

exports.Panel = Panel;