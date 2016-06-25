class PlatformMask extends PlatformSprite {

    constructor() {
        super();
    }

    initShow() {
        this.show = new cc.ClippingNode();
        this.show.setAnchorPoint(0, 0);
        this.show.retain();
    }

    setShape(shape) {
        this.show.setStencil(shape.show);
    }
}