class PlatformMask extends PlatformSprite {

    constructor(id) {
        super(id);
        this.shapeWidth = 0;
        this.shapeHeight = 0;
        this.shapeX = 0;
        this.shapeY = 0;
    }


    initShow() {
        var msg = new flower.VByteArray();
        msg.writeUInt(6);
        msg.writeUInt(this.id);
        msg.writeUTF("Mask");
        Platform.sendToClient(msg);
    }

    setShape(shape, flowerShape) {
        this.shape = shape;
        this.flowerShape = flowerShape;
        var msg = new flower.VByteArray();
        msg.writeUInt(11);
        msg.writeUInt(this.id);
        msg.writeUInt(shape.id);
        Platform.sendToClient(msg);
        //this.show.setStencil(shape.show);
    }

    dispose() {
        super.dispose();
    }
}