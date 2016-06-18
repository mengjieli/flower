class Bitmap extends DisplayObject {

    __texture;

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
            //if (this._width || this._height) {
            //    this.scaleX *= this._width / this.texture.width;
            //    this.scaleY *= this._height / this.texture.height;
            //}
            this.__texture.$addCount();


            this.$nativeShow.setTexture(this.__texture);

            //this._setX(this.x);
            //this._setY(this.y);

            //this.$addFlag(DisplayObjectFlag.BITMAP_SHADER_CHANGE);
            //this.$addShaderFlag(ShaderFlag.TEXTURE_CHANGE);
            //if (this._scale9Grid) {
            //    this.$addShaderFlag(ShaderFlag.SCALE_9_GRID);
            //}
        }
        else {
            this._width = 0;
            this._height = 0;
            this.$nativeShow.setTexture(Texture.$blank);
            //p.exe(this._show, flower.Texture2D.blank.$nativeTexture);
        }
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

    set texture(val) {
        this.$setTexture(val);
    }

    dispose() {
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
    }
}

exports.Bitmap = Bitmap;