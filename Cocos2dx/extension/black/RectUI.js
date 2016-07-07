class RectUI extends flower.Shape {

    constructor() {
        super();
        this.$RectUI = {
            0: 0, //width
            1: 0, //height
        };
        this.drawRect = null;
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        if (flags == 0x0002) {
            this.__flags |= 0x0400;
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

    $setFillColor(val) {
        if (super.$setFillColor(val)) {
            this.$resetRectUI();
        }
    }

    $setFillAlpha(val) {
        if (super.$setFillAlpha(val)) {
            this.$resetRectUI();
        }
    }

    $setLineWidth(val) {
        if (super.$setLineWidth(val)) {
            this.$resetRectUI();
        }
    }

    $setLineColor(val) {
        if (super.$setLineColor(val)) {
            this.$resetRectUI();
        }
    }

    $setLineAlpha(val) {
        if (super.$setLineAlpha(val)) {
            this.$resetRectUI();
        }
    }

    $setWidth(val) {
        val = +val || 0;
        var p = this.$RectUI;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$resetRectUI();
    }

    $resetRectUI() {
        var p = this.$Shape;
        if (p[9].length == 0) {
            p[9].push({});
        }
        var width = this.$RectUI[0];
        var height = this.$RectUI[1];
        var x = 0;
        var y = 0;
        p[9][0] = {
            points: [{x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height},
                {x: x, y: y}],
            fillColor: p[0],
            fillAlpha: p[1],
            lineWidth: p[2],
            lineColor: p[3],
            lineAlpha: p[4]
        };
        this.$addFlags(0x0400);
    }

    $setHeight(val) {
        val = +val || 0;
        var p = this.$RectUI;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$resetRectUI();
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

UIComponent.register(RectUI);
RectUI.prototype.__UIComponent = true;
exports.RectUI = RectUI;