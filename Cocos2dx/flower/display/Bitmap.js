class Bitmap extends DisplayObject {

    __texture;
    $Bitmap;

    constructor(texture) {
        super();
        this.$nativeShow = Platform.create("Bitmap");
        this.texture = texture;
        this.$Bitmap = {
            0: null,    //scale9Grid
            1: true    //touchSpace
        }
        Stage.bitmapCount++;
    }

    $setTexture(val) {
        if (val == this.__texture) {
            return false;
        }
        if (this.__texture) {
            this.__texture.$delCount();
            if (this.__texture.dispatcher) {
                this.__texture.dispatcher.removeListener(Event.COMPLETE, this.$updateTexture, this);
            }
        }
        this.__texture = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        if (val) {
            this.__texture.$useTexture();
            this.$nativeShow.setWidth(this.__texture.width);
            this.$nativeShow.setHeight(this.__texture.height);
            this.$nativeShow.setTexture(this.__texture);
        }
        else {
            this.$nativeShow.setTexture(Texture.$blank);
        }
        if (this.__texture && this.__texture.dispatcher) {
            this.__texture.dispatcher.addListener(Event.UPDATE, this.$updateTexture, this);
        }
        this.$invalidateContentBounds();
        return true;
    }

    $updateTexture(e) {
        var txt = this.texture;
        this.texture = null;
        this.texture = txt;
    }

    $setWidth(val) {
        if (super.$setWidth(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingWidth(p[3]);
        this.$invalidateContentBounds();
        return true;
    }

    $setHeight(val) {
        if (super.$setHeight(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingHeight(p[4]);
        this.$invalidateContentBounds();
        return true;
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        p[22] = flower.EnterFrame.frame;
        var bounds;
        if (this.$Bitmap[1]) {
            bounds = this.$getContentBounds();
        } else {
            bounds = Rectangle.$TempRectangle;
            if (this.__texture) {
                bounds.x = this.__texture.offX;
                bounds.y = this.__texture.offY;
                bounds.width = this.__texture.textureWidth;
                bounds.height = this.__texture.textureHeight;
            } else {
                bounds.x = 0;
                bounds.y = 0;
                var p = this.$DisplayObject;
                bounds.width = p[3] ? p[3] : 0;
                bounds.height = p[4] ? p[4] : 0;
            }
        }
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
            return this;
        }
        return null;
    }

    $measureContentBounds(rect) {
        if (this.__texture) {
            rect.width = this.__texture.width;
            rect.height = this.__texture.height;
        } else {
            rect.x = rect.y = rect.width = rect.height = 0;
        }
    }

    $setScale9Grid(val) {
        if (typeof val == "string" && val.split(",").length == 4) {
            var params = val.split(",");
            val = new Rectangle(+params[0], +params[1], +params[2], +params[3]);
        }
        if (!(val instanceof Rectangle)) {
            val = null;
        }
        var p = this.$Bitmap;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setScale9Grid(val);
        return true;
    }

    $setTouchSpace(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        var p = this.$Bitmap;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
    }

    get texture() {
        return this.__texture;
    }

    set texture(val) {
        this.$setTexture(val);
    }

    get scale9Grid() {
        var p = this.$Bitmap;
        return p[0];
    }

    set scale9Grid(val) {
        this.$setScale9Grid(val);
    }

    get touchSpace() {
        return this.$Bitmap[1];
    }

    set touchSpace(val) {
        this.$setTouchSpace(val);
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Stage.bitmapCount--;
        this.texture = null;
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.Bitmap = Bitmap;