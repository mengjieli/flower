class PlatformMask extends PlatformSprite {

    static id = 0;

    constructor() {
        super();
        this.shapeWidth = 0;
        this.shapeHeight = 0;
        this.shapeX = 0;
        this.shapeY = 0;
    }


    initShow() {
    }

    setShape(shape, flowerShape) {
        this.shape = shape;
        this.flowerShape = flowerShape;
        //this.show.setStencil(shape.show);
    }

    dispose() {
        super.dispose();
    }
}