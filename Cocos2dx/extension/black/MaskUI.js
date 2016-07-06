class MaskUI extends flower.Mask {

    constructor() {
        super();
        this.$initUIComponent();
    }

    $createShape() {
        var shape = new RectUI();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        this.__flags |= flags;
    }

    $validateChildrenUIComponent() {
        if (this.shape.__UIComponent) {
            this.shape.$validateUIComponent(this);
        }
        var children = this.__children;
        if (children) {
            var child;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child.__UIComponent) {
                    child.$validateUIComponent();
                }
            }
        }
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.shape.$onFrameEnd();
        this.$resetLayout();
    }
}
UIComponent.register(MaskUI, true);
MaskUI.prototype.__UIComponent = true;
exports.MaskUI = MaskUI;