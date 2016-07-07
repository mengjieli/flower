class Panel extends Group {

    $Panel;

    constructor() {
        super();
        this.$Panel = {
            0: "",//title
            1: null, //titleLabel
            2: null, //closeButton
            3: PanelScaleMode.NO_SCALE, //scaleMode
        }
    }

    __changeTitle() {
        var p = this.$Panel;
        if (p[0] && p[1]) {
            p[1].text = p[0];
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && this.width && this.height && this.$Panel[3] != PanelScaleMode.NO_SCALE) {
            var scaleMode = this.$Panel[3];
            var scaleX = this.parent.width / this.width;
            var scaleY = this.parent.height / this.height;
            if (scaleMode == PanelScaleMode.SHOW_ALL) {
                this.scaleX = scaleX < scaleY ? scaleX : scaleY;
                this.scaleY = scaleY < scaleY ? scaleX : scaleY;
            } else if (scaleMode == PanelScaleMode.NO_BORDER) {
                this.scaleX = scaleX > scaleY ? scaleX : scaleY;
                this.scaleY = scaleX > scaleY ? scaleX : scaleY;
            } else if (scaleMode == PanelScaleMode.SCALE_WIDTH) {
                this.height = this.parent.height / scaleX;
                this.scaleX = scaleX;
                this.scaleY = scaleX;
            } else if (scaleMode == PanelScaleMode.SCALE_HEIGHT) {
                this.width = this.parent.width / scaleY;
                this.scaleX = scaleY;
                this.scaleY = scaleY;
            }
        }
        super.$onFrameEnd();
    }

    $validateChildrenUIComponent() {
        if (this.width && this.height && this.$Panel[3] != PanelScaleMode.NO_SCALE) {
            var scaleMode = this.$Panel[3];
            var scaleX = this.parent.width / this.width;
            var scaleY = this.parent.height / this.height;
            if (scaleMode == PanelScaleMode.SHOW_ALL) {
                this.scaleX = scaleX < scaleY ? scaleX : scaleY;
                this.scaleY = scaleX < scaleY ? scaleX : scaleY;
            } else if (scaleMode == PanelScaleMode.NO_BORDER) {
                this.scaleX = scaleX > scaleY ? scaleX : scaleY;
                this.scaleY = scaleX > scaleY ? scaleX : scaleY;
            } else if (scaleMode == PanelScaleMode.SCALE_WIDTH) {
                this.height = this.parent.height / scaleX;
                this.scaleX = scaleX;
                this.scaleY = scaleX;
            } else if (scaleMode == PanelScaleMode.SCALE_HEIGHT) {
                this.width = this.parent.width / scaleY;
                this.scaleX = scaleY;
                this.scaleY = scaleY;
            }
        }
        super.$validateChildrenUIComponent();
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

    get scaleMode() {
        return this.$Panel[3];
    }

    set scaleMode(val) {
        if (this.$Panel[3] == val) {
            return;
        }
        this.$Panel[3] = val;
        this.$invalidateContentBounds();
    }
}

exports.Panel = Panel;