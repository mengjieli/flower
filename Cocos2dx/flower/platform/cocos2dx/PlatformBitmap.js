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
    __scaleX = 1;
    __scaleY = 1;

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
        this.show.setAnchorPoint(0, 1);
        this.x = this.__x;
        this.y = this.__y;
        this._changeShader();
    }

    setScale9Grid(scale9Grid) {
        var hasScale9 = this.__scale9Grid;
        this.__scale9Grid = scale9Grid;
        this.__shaderFlag &= PlatformShaderType.SCALE_9_GRID;
        this.__shaderFlagChange = true;
        if (this.__scale9Grid) {
            if (hasScale9 == null) {
                if (!this.__programmer || this.__programmer == PlatformProgrammer.instance) {
                    this.__programmer = PlatformProgrammer.createProgrammer();
                    this.__programmerChange = true;
                }
            }
        } else {
            this.show.setGLProgramState(PlatformProgrammer.getInstance());
        }
        this._changeShader();
    }

    _changeShader() {
        if ((this.__textureChange || this.__programmerChange) && this.__programmer) {
            this.show.setGLProgramState(this.__programmer);
            this.__textureChange = false;
            this.__programmerChange = false;
        }
        if (this.__shaderFlagChange && this.__programmer) {
            this.__programmer.shaderFlag = this.__shaderFlag;
        }
        if (this.__texture) {
            if (this.__scale9Grid) {
                this._changeScale9Grid(this.__texture.width, this.__texture.height, this.__scale9Grid,
                    this.__texture.width * this.__scaleX, this.__texture.height * this.__scaleY);
            }
        }
    }

    _changeScale9Grid(width, height, scale9Grid, setWidth, setHeight) {
        var scaleX = setWidth / width;
        var scaleY = setHeight / height;
        var left = scale9Grid.x / width;
        var top = scale9Grid.y / height;
        var right = (scale9Grid.x + scale9Grid.width) / width;
        var bottom = (scale9Grid.y + scale9Grid.height) / height;
        var tleft = left / scaleX;
        var ttop = top / scaleY;
        var tright = 1.0 - (1.0 - right) / scaleX;
        var tbottom = 1.0 - (1.0 - top) / scaleY;
        var scaleGapX = (right - left) / (tright - tleft);
        var scaleGapY = (bottom - top) / (tbottom - ttop);
        var programmer = this.__programmer;
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
        this.__scaleX = 1;
        this.show.setScaleX(val);
        this._changeShader();
    }

    set scaleY(val) {
        this.__scaleY = 1;
        this.show.setScaleY(val);
        this._changeShader();
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
        this.__scaleX = 1;
        this.__scaleY = 1;
        this.__textureChange = false;
        this.__texture = null;
        this.__x = 0;
        this.__y = 0;
        this.__programmerChange = false;
        if (this.__programmer) {
            PlatformProgrammer.release(this.__programmer);
            this.show.setGLProgramState(PlatformProgrammer.getInstance());
        }
        this.__programmer = null;
        this.__shaderFlagChange = false;
        this.__shaderFlag = 0;
    }
}