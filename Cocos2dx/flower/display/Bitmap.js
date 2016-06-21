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
        this.invalidSize();
        return true;
    }

    calculateSize(size) {
        if (this.__texture) {
            size.width = this.__texture.width;
            size.height = this.__texture.height;
        } else {
            size.width = 0;
            size.height = 0;
        }
    }

    $setScale9Grid(val) {
        if (this.__scale9Grid == val) {
            return false;
        }
        this.__scale9Grid = val;
        this.$nativeShow.setScale9Grid(val);
        return true;
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