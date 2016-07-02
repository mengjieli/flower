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
        this.__flags |= flags;
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
        super.dispose();
    }
}

UIComponent.register(RectUI);
RectUI.prototype.__UIComponent = true;
exports.RectUI = RectUI;