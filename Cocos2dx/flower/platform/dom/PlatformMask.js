class PlatformMask extends PlatformSprite {

    constructor() {
        super();
    }

    initShow() {
        var mask = document.createElement("div");
        mask.style.position = "absolute";
        mask.style.left = "0px";
        mask.style.top = "0px";
        this.show = mask;
    }

    setShape(shape) {
        this.show.setStencil(shape.show);
    }
}