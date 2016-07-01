class PlatformBitmap extends PlatformDisplayObject {

    __texture;
    __textureScaleX = 1;
    __textureScaleY = 1;
    __scale9Grid;
    __settingWidth;
    __settingHeight;

    constructor() {
        super();
        this.show = new cc.Sprite();
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        this.show.initWithTexture(texture.$nativeTexture.textrue);
        var source = texture.source;
        if (source) {
            this.show.setTextureRect(source, texture.sourceRotation, {
                width: source.width,
                height: source.height
            });
        }
        this.__textureScaleX = texture.scaleX;
        this.__textureScaleY = texture.scaleY;
        this.show.setAnchorPoint(0, 1);
        this.setX(this.__x);
        this.setY(this.__y);
        this.setScaleX(this.__scaleX);
        this.setScaleY(this.__scaleY);
        this.setScale9Grid(this.__scale9Grid);
        if (this.__programmer) {
            if (Platform.native) {
                this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
            } else {
                this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
            }
        }
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
        if (scale9Grid && this.__texture) {
            this.addProgrammerFlag(0x0001);
            var width = this.__texture.width;
            var height = this.__texture.height;
            var setWidth = this.__texture.width * this.__scaleX * (this.__settingWidth != null ? this.__settingWidth / this.__texture.width : 1);
            var setHeight = this.__texture.height * this.__scaleY * (this.__settingHeight != null ? this.__settingHeight / this.__texture.height : 1);

            //flower.trace("setScal9Grid:", width, height, scale9Grid.x, scale9Grid.y, scale9Grid.width, scale9Grid.height, setWidth, setHeight);
            //width /= this.__textureScaleX;
            //height /= this.__textureScaleY;
            //scale9Grid.x /= this.__textureScaleX;
            //scale9Grid.y /= this.__textureScaleY;
            //scale9Grid.width /= this.__textureScaleX;
            //scale9Grid.height /= this.__textureScaleY;
            var scaleX = setWidth / width;
            var scaleY = setHeight / height;
            var left = scale9Grid.x / width;
            var top = scale9Grid.y / height;
            var right = (scale9Grid.x + scale9Grid.width) / width;
            var bottom = (scale9Grid.y + scale9Grid.height) / height;
            var tleft = left / scaleX;
            var ttop = top / scaleY;
            var tright = 1.0 - (1.0 - right) / scaleX;
            var tbottom = 1.0 - (1.0 - bottom) / scaleY;
            var scaleGapX = (right - left) / (tright - tleft);
            var scaleGapY = (bottom - top) / (tbottom - ttop);
            var programmer = this.__programmer.$nativeProgrammer;
            if (Platform.native) {
                programmer.setUniformInt("scale9", 1);
            } else {
                programmer.use();
                programmer.setUniformLocationI32(programmer.getUniformLocationForName("scale9"), 1);
            }
            if (Platform.native) {
                programmer.setUniformFloat("left", left);
                programmer.setUniformFloat("top", top);
                programmer.setUniformFloat("tleft", tleft);
                programmer.setUniformFloat("ttop", ttop);
                programmer.setUniformFloat("tright", tright);
                programmer.setUniformFloat("tbottom", tbottom);
                programmer.setUniformFloat("scaleGapX", scaleGapX);
                programmer.setUniformFloat("scaleGapY", scaleGapY);
                programmer.setUniformFloat("scaleX", scaleX);
                programmer.setUniformFloat("scaleY", scaleY);
            } else {
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("left"), left);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("top"), top);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("tleft"), tleft);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("ttop"), ttop);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("tright"), tright);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("tbottom"), tbottom);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleGapX"), scaleGapX);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleGapY"), scaleGapY);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleX"), scaleX);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleY"), scaleY);
            }
        } else {
            this.removeProgrammerFlag(0x0001);
            if (this.__programmer) {
                var programmer = this.__programmer.$nativeProgrammer;
                if (Platform.native) {
                    programmer.setUniformInt("scale9", 0);
                    programmer.setUniformFloat("width", this.__width);
                    programmer.setUniformFloat("height", this.__height);
                } else {
                    this.__programmer.use();
                    programmer.setUniformLocationI32(programmer.getUniformLocationForName("scale9"), 0);
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("width"), this.__width);
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("height"), this.__height);
                }
            }
        }
    }

    setX(val) {
        this.__x = val;
        this.show.setPositionX(this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX);
    }

    setY(val) {
        this.__y = val;
        this.show.setPositionY(-this.__y - (this.__texture ? this.__texture.offY : 0) * this.__scaleY);
    }

    setScaleX(val) {
        this.__scaleX = val;
        if (this.__texture && this.__settingWidth != null) {
            this.show.setScaleX(val * this.__textureScaleX * this.__settingWidth / this.__texture.width);
        } else {
            this.show.setScaleX(val * this.__textureScaleX);
        }
        if (this.__texture && this.__texture.offX) {
            this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
        }
        this.setScale9Grid(this.__scale9Grid);
    }

    setScaleY(val) {
        this.__scaleY = val;
        if (this.__texture && this.__settingHeight != null) {
            this.show.setScaleY(val * this.__textureScaleY * this.__settingHeight / this.__texture.height);
        } else {
            this.show.setScaleY(val * this.__textureScaleY);
        }
        if (this.__texture && this.__texture.offY) {
            this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
        }
        this.setScale9Grid(this.__scale9Grid);
    }

    release() {
        this.__texture = null;
        this.__textureScaleX = 1;
        this.__textureScaleY = 1;
        this.__scale9Grid = null;
        this.__colorFilter = null;
        this.__settingWidth = null;
        this.__settingHeight = null;
        super.release();
    }
}