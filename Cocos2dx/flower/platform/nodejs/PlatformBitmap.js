class PlatformBitmap extends PlatformDisplayObject {

    __texture = null;
    __textureScaleX = 1;
    __textureScaleY = 1;
    __scale9Grid;
    __settingWidth;
    __settingHeight;
    scaleX = 1;
    scaleY = 1;

    constructor(id) {
        super(id);


        var msg = new flower.VByteArray();
        msg.writeUInt(6);
        msg.writeUInt(this.id);
        msg.writeUTF("Bitmap");
        Platform.sendToClient(msg);
        //this.show = new cc.Sprite();
        //this.show.setAnchorPoint(0, 1);
        //this.show.retain();
    }

    setTexture(texture) {
        var msg = new flower.VByteArray();
        msg.writeUInt(12);
        msg.writeUInt(this.id);
        msg.writeUInt(texture.$nativeTexture.id);
        Platform.sendToClient(msg);
    }


    setFilters(filters) {
        super.setFilters(filters);
    }

    setSettingWidth(width) {
        this.__settingWidth = width;
        this.setScaleX(this.__scaleX);
    }

    setSettingHeight(height) {
        this.__settingHeight = height;
        this.setScaleY(this.__scaleY);
    }

    setScale9Grid(scale9Grid) {
        this.__scale9Grid = scale9Grid;
        if (!this.__texture) {
            return;
        }
        if (scale9Grid) {
            console.log(scale9Grid);
        }
    }

    setX(val) {
    }

    setY(val) {
    }

    setScaleX(val) {

    }

    setScaleY(val) {
    }

    setRotation(val) {
    }

    release() {
        this.setScale9Grid(null);
        this.__texture = null;
        this.scaleX = this.scaleY = 1;
        this.__textureScaleX = 1;
        this.__textureScaleY = 1;
        this.__scale9Grid = null;
        this.__colorFilter = null;
        this.__settingWidth = null;
        this.__settingHeight = null;
        super.release();
    }
}