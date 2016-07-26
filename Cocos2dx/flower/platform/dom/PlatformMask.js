class PlatformMask extends PlatformSprite {

    static id = 0;

    constructor() {
        super();
        this.shapeWidth = 0;
        this.shapeHeight = 0;
        this.shapeX = 0;
        this.shapeY = 0;
        flower.EnterFrame.add(this.update, this);
    }

    update() {
        var width = 0;
        var height = 0;
        var x = 0;
        var y = 0;
        if (this.flowerShape) {
            var bounds = this.flowerShape.$getContentBounds();
            width = bounds.width;
            height = bounds.height;
            x = bounds.x;
            y = bounds.y;
        }
        if (width != this.shapeWidth || height != this.shapeHeight || x != this.shapeX || y != this.shapeY) {
            this.shapeWidth = width;
            this.shapeHeight = height;
            this.show.style.clip = "rect(" + x + "px," + width + "px," + height + "px," + y + "px)";
        }
    }


    initShow() {
        var mask = document.createElement("div");
        mask.style.position = "absolute";
        mask.style.left = "0px";
        mask.style.top = "0px";
        this.show = mask;
    }

    setShape(shape, flowerShape) {
        this.shape = shape;
        this.flowerShape = flowerShape;
        //this.show.setStencil(shape.show);
    }

    dispose() {
        flower.EnterFrame.remove(this.update, this);
        super.dispose();
    }
}