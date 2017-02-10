class PlatformBitmap extends PlatformDisplayObject {

    __texture = null;
    __textureScaleX = 1;
    __textureScaleY = 1;
    __scale9Grid;
    __settingWidth;
    __settingHeight;
    scaleX = 1;
    scaleY = 1;

    constructor() {
        super();

        var image = document.createElement("img");
        image.style.position = "absolute";
        image.style.left = "0px";
        image.style.top = "0px";
        image.style["transform-origin"] = "left top";
        this.show = image;

        //this.show = new cc.Sprite();
        //this.show.setAnchorPoint(0, 1);
        //this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        if (texture.$nativeTexture.url != "res/blank.png") {
            this.show.src = (texture.$nativeTexture.textrue);
        }
        var source = texture.source;
        if (source) {
            this.show.setTextureRect(source, texture.sourceRotation, {
                width: source.width,
                height: source.height
            });
        }
        //this.__textureScaleX = texture.scaleX;
        //this.__textureScaleY = texture.scaleY;
        //this.setX(this.__x);
        //this.setY(this.__y);
        //this.setScaleX(this.__scaleX);
        //this.setScaleY(this.__scaleY);
        this.setScale9Grid(this.__scale9Grid);
        //this.setFilters(this.__filters);

        //if (this.__programmer) {
        //    if (Platform.native) {
        //        this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
        //    } else {
        //        this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
        //    }
        //}
    }


    setFilters(filters) {
        if (!this.__texture) {
            this.__filters = filters;
            return;
        }
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
        this.__x = val;
        this.show.style.left = (this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX) + "px";
    }

    setY(val) {
        this.__y = val;
        this.show.style.top = (this.__y + (this.__texture ? this.__texture.offY : 0) * this.__scaleY) + "px";
    }

    setScaleX(val) {
        this.__scaleX = val;
        if (this.__texture && this.__settingWidth != null) {
            this.scaleX = (val * this.__textureScaleX * this.__settingWidth / this.__texture.width);
        } else {
            this.scaleX = (val * this.__textureScaleX);
        }
        this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
        if (this.__texture && this.__texture.offX) {
            this.show.style.left = (this.__x + this.__texture.offX * this.__scaleX) + "px";
        }
        //this.setScale9Grid(this.__scale9Grid);
    }

    setScaleY(val) {
        this.__scaleY = val;
        if (this.__texture && this.__settingHeight != null) {
            this.scaleY = (val * this.__textureScaleY * this.__settingHeight / this.__texture.height);
        } else {
            this.scaleY = (val * this.__textureScaleY);
        }
        this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
        if (this.__texture && this.__texture.offY) {
            this.show.style.top = (this.__y + this.__texture.offY * this.__scaleY) + "px";
        }
        //this.setScale9Grid(this.__scale9Grid);
    }

    setRotation(val) {
        this.__rotation = val;
        this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
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