class PlatformBitmap extends PlatformDisplayObject {

    __texture = null;
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
        this.setAlpha(this.__alpha);
        this.setX(this.__x);
        this.setY(this.__y);
        this.setScaleX(this.__scaleX);
        this.setScaleY(this.__scaleY);
        this.setScale9Grid(this.__scale9Grid);
        this.setFilters(this.__filters);
        if (this.__programmer) {
            if (Platform.native) {
                this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
            } else {
                this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
            }
        }
        //this.show.setBlendFunc(gl.ONE, gl.ONE);
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
            var texture = this.__texture;
            var source = texture.source;
            var copyx = scale9Grid.x;
            var copyy = scale9Grid.y;
            if (source) {
                scale9Grid.x -= texture.offX;
                scale9Grid.y -= texture.offY;
                trace("off??", texture.offX, texture.offY)
            }

            this.addProgrammerFlag(0x0001);
            var width = this.__texture.textureWidth;
            var height = this.__texture.textureHeight;
            var setWidth = this.__texture.textureWidth * this.__scaleX * (this.__settingWidth != null ? this.__settingWidth / this.__texture.width : 1);
            var setHeight = this.__texture.textureHeight * this.__scaleY * (this.__settingHeight != null ? this.__settingHeight / this.__texture.height : 1);

            //var scaleX = this.__scaleX * (this.__settingWidth != null ? this.__settingWidth / this.__texture.width : 1);
            //var scaleY = this.__scaleY * (this.__settingHeight != null ? this.__settingHeight / this.__texture.height : 1);
            var scaleX = this.__scaleX * this.__textureScaleX * (this.__settingWidth ? (this.__settingWidth - (this.__texture.width - this.__texture.textureWidth)) / this.__texture.textureWidth : 1);
            var scaleY = this.__scaleY * this.__textureScaleY * (this.__settingHeight ? (this.__settingHeight - (this.__texture.height - this.__texture.textureHeight)) / this.__texture.textureHeight : 1);
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
                if(source && this.__texture.sourceRotation) {
                    programmer.setUniformFloat("top", left);
                    programmer.setUniformFloat("left", top);
                    programmer.setUniformFloat("ttop", tleft);
                    programmer.setUniformFloat("tleft", ttop);
                    programmer.setUniformFloat("tbottom", tright);
                    programmer.setUniformFloat("tright", tbottom);
                    programmer.setUniformFloat("scaleGapY", scaleGapX);
                    programmer.setUniformFloat("scaleGapX", scaleGapY);
                    programmer.setUniformFloat("scaleY", scaleX);
                    programmer.setUniformFloat("scaleX", scaleY);
                    programmer.setUniformFloat("height", this.__width);
                    programmer.setUniformFloat("width", this.__height);
                } else {
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
                    programmer.setUniformFloat("width", this.__width);
                    programmer.setUniformFloat("height", this.__height);
                }
                if (source) {
                    programmer.setUniformInt("plist", 1);
                    programmer.setUniformInt("plistRot", this.__texture.sourceRotation ? 1 : 0);
                    programmer.setUniformFloat("plistStartX", source.x / this.__texture.$parentTexture.width);
                    programmer.setUniformFloat("plistEndX", (source.x + (this.__texture.sourceRotation ? source.height : source.width)) / (this.__texture.sourceRotation ? this.__texture.$parentTexture.height : this.__texture.$parentTexture.width));
                    programmer.setUniformFloat("plistStartY", source.y / this.__texture.$parentTexture.height);
                    programmer.setUniformFloat("plistEndY", (source.y + (this.__texture.sourceRotation ? source.width : source.height)) / (this.__texture.sourceRotation ? this.__texture.$parentTexture.width : this.__texture.$parentTexture.height));
                } else {
                    programmer.setUniformInt("plist", 0);
                }
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
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("width"), this.__width);
                programmer.setUniformLocationF32(programmer.getUniformLocationForName("height"), this.__height);
            }
            scale9Grid.x = copyx;
            scale9Grid.y = copyy;
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

    setSourceSize(val) {
        if (this.__texture) {
            this.setScaleX(this.__scaleX);
            this.setScaleY(this.__scaleY);
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
            this.show.setScaleX(val * this.__textureScaleX * (this.__settingWidth - (this.__texture.width - this.__texture.textureWidth)) / this.__texture.textureWidth);
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
            this.show.setScaleY(val * this.__textureScaleY * (this.__settingHeight - (this.__texture.height - this.__texture.textureHeight)) / this.__texture.textureHeight);
        } else {
            this.show.setScaleY(val * this.__textureScaleY);
        }
        if (this.__texture && this.__texture.offY) {
            this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
        }
        this.setScale9Grid(this.__scale9Grid);
    }

    release() {
        this.setScale9Grid(null);
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