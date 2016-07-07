class Label extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
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
        //if (this instanceof flower.Panel) {
        //    console.log("验证 ui 属性",flower.EnterFrame.frame);
        //}
        if (p[0] != null && p[1] == null && p [2] != null) {
            this.width = (p[2] - p[0]) * 2;
            this.x = parent.$getContentBounds().x + p[0];
        }
        else if (p[0] == null && p[1] != null && p[2] != null) {
            this.width = (p[1] - p[2]) * 2;
            this.x = parent.$getContentBounds().x + 2 * p[2] - p[1];
        } else if (p[0] != null && p[1] != null) {
            this.width = parent.width - p[1] - p[0];
            this.x = parent.$getContentBounds().x + p[0];
        } else {
            if (p[0] != null) {
                this.x = parent.$getContentBounds().x + p[0];
            }
            if (p[1] != null) {
                this.x = parent.$getContentBounds().x + parent.width - p[1] - this.width;
            }
            if (p[2] != null) {
                this.x = parent.$getContentBounds().x + (parent.width - this.width) * 0.5;
            }
            if (p[6]) {
                this.width = parent.width * p[6] / 100;
            }
        }
        if (p[3] != null && p[4] == null && p [5] != null) {
            this.height = (p[5] - p[3]) * 2;
            this.y = parent.$getContentBounds().y + p[3];
        } else if (p[3] == null && p[4] != null && p[5] != null) {
            this.height = (p[4] - p[5]) * 2;
            this.y = parent.$getContentBounds().y + 2 * p[5] - p[4];
        } else if (p[3] != null && p[4] != null) {
            this.height = parent.height - p[4] - p[3];
            this.y = parent.$getContentBounds().y + p[3];
        } else {
            if (p[3] != null) {
                this.y = parent.$getContentBounds().y + p[3];
            }
            if (p[4] != null) {
                this.y = parent.$getContentBounds().y + parent.height - p[4] - this.height;
            }
            if (p[5] != null) {
                this.y = parent.$getContentBounds().y + (parent.height - this.height) * 0.5;
            }
            if (p[7]) {
                this.height = parent.height * p[7] / 100;
            }
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }

    dispose() {
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}

UIComponent.register(Label);
Label.prototype.__UIComponent = true;
exports.Label = Label;