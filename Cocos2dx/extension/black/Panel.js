class Panel extends Group {

    $Panel;

    constructor() {
        super();
        this.$Panel = {
            0: "",//title
            1: null, //titleLabel
            2: null, //closeButton
            3: PanelScaleMode.NO_SCALE, //scaleMode
            4: null, //iconImage
            5: "", //icon
        }
    }

    __changeTitle() {
        var p = this.$Panel;
        if (p[0] && p[1]) {
            p[1].text = p[0];
        }
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        //console.log("验证 ui 属性");
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
        //console.log("验证 ui 属性",flower.EnterFrame.frame);
        if (p[0] != null && p[1] == null && p [2] != null) {
            this.width = (p[2] - p[0]) * 2;
            this.x = p[0];
        } else if (p[0] == null && p[1] != null && p[2] != null) {
            this.width = (p[1] - p[2]) * 2;
            this.x = 2 * p[2] - p[1];
        } else if (p[0] != null && p[1] != null) {
            this.width = parent.width - p[1] - p[0];
            this.x = p[0];
        } else {
            if (p[0] != null) {
                this.x = p[0];
            }
            if (p[1] != null) {
                this.x = parent.width - p[1] - this.width;
            }
            if (p[2] != null) {
                this.x = (parent.width - this.width) * 0.5 + p[2];
            }
            if (p[6]) {
                this.width = parent.width * p[6] / 100;
            }
        }
        if (p[3] != null && p[4] == null && p [5] != null) {
            this.height = (p[5] - p[3]) * 2;
            this.y = p[3];
        } else if (p[3] == null && p[4] != null && p[5] != null) {
            this.height = (p[4] - p[5]) * 2;
            this.y = 2 * p[5] - p[4];
        } else if (p[3] != null && p[4] != null) {
            this.height = parent.height - p[4] - p[3];
            this.y = p[3];
        } else {
            if (p[3] != null) {
                this.y = p[3];
            }
            if (p[4] != null) {
                this.y = parent.height - p[4] - this.height;
            }
            if (p[5] != null) {
                this.y = (parent.height - this.height) * 0.5 + p[5];
            }
            if (p[7]) {
                this.height = parent.height * p[7] / 100;
            }
        }
        this.$checkSetting();
        this.$validateChildrenUIComponent();
    }

    $checkSetting() {
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
    }

    $onClose() {
        this.dispatchWidth(flower.Event.CLOSE);
        this.closePanel();
    }

    closePanel() {
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
        if (this.$Panel[1] && this.$Panel[1].parent && this.$Panel[1].parent != this) {
            this.$Panel[1].parent.removeChild(this.$Panel[1]);
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
            if (this.$Panel[2].parent && this.$Panel[2].parent != this) {
                this.$Panel[2].parent.removeChild(this.$Panel[2]);
            }
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

    get iconImage() {
        return this.$Panel[4];
    }

    set iconImage(val) {
        if (this.$Panel[4] == val) {
            return;
        }
        if (this.$Panel[4] && this.$Panel[4].parent && this.$Panel[4].parent != this) {
            this.$Panel[4].parent.removeChild(this.$Panel[4]);
        }
        this.$Panel[4] = val;
        if (val) {
            val.source = this.$Panel[5];
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get icon() {
        return this.$Panel[5];
    }

    set icon(val) {
        if (this.$Panel[5] == val) {
            return;
        }
        if (this.$Panel[4]) {
            this.$Panel[4].source = val;
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

UIComponent.registerEvent(Panel, 1120, "close", flower.Event.CLOSE);

exports.Panel = Panel;