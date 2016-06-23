class PlatformBitmap {

    show;
    __textureChange = false;
    __texture;
    __x = 0;
    __y = 0;
    __programmer;
    __programmerChange = false;
    __shaderFlagChange = false;
    __shaderFlag = 0;
    __scale9Grid;
    __colorFilter;
    __scaleX = 1;
    __scaleY = 1;
    __textureScaleX = 1;
    __textureScaleY = 1;

    constructor() {
        this.show = new cc.Sprite();
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        if (this.__texture) {
            this.__textureChange = true;
        }
        this.show.initWithTexture(texture.$nativeTexture);
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
        this.x = this.__x;
        this.y = this.__y;
        this.scaleX = this.__scaleX;
        this.scaleY = this.__scaleY;
        this._changeShader();
    }

    setScale9Grid(scale9Grid) {
        var hasScale9 = this.__scale9Grid;
        this.__scale9Grid = scale9Grid;
        this.__shaderFlag |= PlatformShaderType.SCALE_9_GRID;
        this.__shaderFlagChange = true;
        if (this.__scale9Grid) {
            if (hasScale9 == null) {
                if (!this.__programmer || this.__programmer == PlatformProgrammer.instance) {
                    this.__programmer = PlatformProgrammer.createProgrammer();
                    this.__programmerChange = true;
                }
            }
        } else {
            if (Platform.native) {
                this.show.setGLProgramState(PlatformProgrammer.getInstance().$nativeProgrammer);
            } else {
                this.show.setShaderProgram(PlatformProgrammer.getInstance().$nativeProgrammer);
            }
        }
        this._changeShader();
    }

    setColorFilter(colorFilter) {
        var hasMatrix = this.__colorFilter;
        this.__colorFilter = colorFilter;
        this.__shaderFlag |= PlatformShaderType.COLOR_FILTER;
        this.__shaderFlagChange = true;
        if (this.__colorFilter) {
            if (hasMatrix == null) {
                if (!this.__programmer || this.__programmer == PlatformProgrammer.instance) {
                    this.__programmer = PlatformProgrammer.createProgrammer();
                    this.__programmerChange = true;
                }
            }
        } else {
            if (Platform.native) {
                this.show.setGLProgramState(PlatformProgrammer.getInstance().$nativeProgrammer);
            } else {
                this.show.setShaderProgram(PlatformProgrammer.getInstance().$nativeProgrammer);
            }
        }
        this._changeShader();
    }

    _changeShader() {
        if ((this.__textureChange || this.__programmerChange) && this.__programmer) {
            if (Platform.native) {
                this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
            } else {
                this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
            }
            this.__textureChange = false;
            this.__programmerChange = false;
        }
        if (this.__shaderFlagChange && this.__programmer) {
            this.__programmer.shaderFlag = this.__shaderFlag;
            this.__shaderFlag &= ~PlatformShaderType.SCALE_9_GRID;
            this.__shaderFlagChange = false;
        }
        if (this.__texture) {
            if (this.__scale9Grid) {
                this._changeScale9Grid(this.__texture.width, this.__texture.height, this.__scale9Grid,
                    this.__texture.width * this.__scaleX, this.__texture.height * this.__scaleY);
            }
            if (this.__colorFilter) {
                var programmer = this.__programmer.$nativeProgrammer;
                if (Platform.native) {
                    programmer.setUniformFloat("colorFilterH", this.__colorFilter.h);
                    programmer.setUniformFloat("colorFilterS", this.__colorFilter.s);
                    programmer.setUniformFloat("colorFilterL", this.__colorFilter.l);
                } else {
                    programmer.setUniformLocationF32(this.__programmer.getUniformLocationForName("colorFilterH"), this.__colorFilter.h);
                    programmer.setUniformLocationF32(this.__programmer.getUniformLocationForName("colorFilterS"), this.__colorFilter.s);
                    programmer.setUniformLocationF32(this.__programmer.getUniformLocationForName("colorFilterL"), this.__colorFilter.l);
                }
            }
        }
    }

    _changeScale9Grid(width, height, scale9Grid, setWidth, setHeight) {
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
    }

    set x(val) {
        this.__x = val;
        this.show.setPositionX(this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX);
    }

    set y(val) {
        this.__y = val;
        this.show.setPositionY(-this.__y - (this.__texture ? this.__texture.offY : 0) * this.__scaleY);
    }

    set scaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val * this.__textureScaleX);
        if (this.__texture && this.__texture.offX) {
            this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
        }
        this._changeShader();
    }

    set scaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val * this.__textureScaleY);
        if (this.__texture && this.__texture.offY) {
            this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
        }
        this._changeShader();
    }

    set rotation(val) {
        this.show.setRotation(val);
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        this.__scaleX = 1;
        this.__scaleY = 1;
        this.__textureChange = false;
        this.__texture = null;
        this.__x = 0;
        this.__y = 0;
        this.__textureScaleX = 1;
        this.__textureScaleY = 1;
        this.__programmerChange = false;
        if (this.__programmer) {
            PlatformProgrammer.release(this.__programmer);
            this.show.setGLProgramState(PlatformProgrammer.getInstance());
        }
        this.__scale9Grid = null;
        this.__colorFilter = null;
        this.__programmer = null;
        this.__shaderFlagChange = false;
        this.__shaderFlag = 0;
    }
}