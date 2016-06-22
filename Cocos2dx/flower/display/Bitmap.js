class Bitmap extends DisplayObject {

    __texture;
    __scale9Grid;

    constructor(texture) {
        super();
        this.$nativeShow = Platform.create("Bitmap");
        this.texture = texture;
    }

    $setTexture(val) {
        if (val == this.__texture) {
            return false;
        }
        if (this.__texture) {
            this.__texture.$delCount();
        }
        this.__texture = val;
        if (val) {
            this.__texture.$addCount();
            this.$nativeShow.setTexture(this.__texture);
        }
        else {
            this.$nativeShow.setTexture(Texture.$blank);
        }
        this.$invalidateContentBounds();
        return true;
    }

    $measureContentBounds(rect) {
        if (this.__texture) {
            rect.x = this.__texture.offX;
            rect.y = this.__texture.offY;
            rect.width = this.__texture.width;
            rect.height = this.__texture.height;
        } else {
            rect.x = rect.y = rect.width = rect.height = 0;
        }
        flower.trace("BitmapSize",rect.width,rect.height);
    }

    $setScale9Grid(val) {
        if (this.__scale9Grid == val) {
            return false;
        }
        this.__scale9Grid = val;
        this.$nativeShow.setScale9Grid(val);
        return true;
    }

    get texture() {
        return this.__texture;
    }

    set texture(val) {
        this.$setTexture(val);
    }

    set scale9Grid(val) {
        this.$setScale9Grid(val);
    }

    dispose() {
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
    }
}

exports.Bitmap = Bitmap;