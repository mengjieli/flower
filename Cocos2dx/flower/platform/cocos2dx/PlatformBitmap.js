class PlatformBitmap {

    show;

    __texture;
    __x = 0;
    __y = 0;

    constructor() {
        this.show = new cc.Sprite();
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        console.log("native?" + Platform.native + "?" + cc.sys.isNative);
        if (Platform.native) {
            this.show.initWithTexture(texture.$nativeTexture);
        } else {
            this.show.setTexture(texture.$nativeTexture);
        }
        var source = texture.source;
        if (source) {
            this.show.setTextureRect(source, texture.sourceRotation, {
                width: source.width,
                height: source.height
            });
        }
        this.show.setAnchorPoint(0, 1);
        this.x = this.__x;
        this.y = this.__y;
    }

    set x(val) {
        this.__x = val;
        this.show.setPositionX(this.__x + this.__texture.offX);
    }

    set y(val) {
        this.__y = val;
        this.show.setPositionY(-this.__y + this.__texture.offY);
    }

    set scaleX(val) {
        console.log("set scaleX " + val);
        this.show.setScaleX(val);
    }

    set scaleY(val) {
        this.show.setScaleY(val);
    }

    set rotation(val) {
        console.log("rot?" + val);
        this.show.setRotation(val);
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
    }
}