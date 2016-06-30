class Texture {

    __source;
    __offX = 0;
    __offY = 0;
    __sourceRotation = false;
    __width;
    __height;
    __settingWidth;
    __settingHeight;
    __url;
    __nativeURL;
    __use = false;
    $nativeTexture;
    $count;
    $parentTexture;

    /**
     * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
     * @native
     */
    __dispatcher = UPDATE_RESOURCE ? new EventDispatcher() : null;

    constructor(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
        this.$nativeTexture = nativeTexture;
        this.__url = url;
        this.__nativeURL = nativeURL;
        this.$count = 0;
        this.__width = w;
        this.__height = h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
    }

    $update(nativeTexture, w, h, settingWidth, settingHeight) {
        this.$nativeTexture = nativeTexture;
        this.__width = w;
        this.__height = h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
        if (this.dispatcher) {
            this.dispatcher.dispatchWidth(Event.UPDATE);
        }
    }

    createSubTexture(startX, startY, width, height, offX = 0, offY = 0, rotation = false) {
        var sub = new Texture(this.$nativeTexture, this.__url, this.__nativeURL, width, height, width * this.scaleX, height * this.scaleY);
        sub.$parentTexture = this.$parentTexture || this;
        var rect = flower.Rectangle.create();
        rect.x = startX;
        rect.y = startY;
        rect.width = width;
        rect.height = height;
        sub.__source = rect;
        sub.__sourceRotation = rotation;
        sub.__offX = offX;
        sub.__offY = offY;
        return sub;
    }

    $useTexture() {
        if (this.$parentTexture) {
            this.$parentTexture.$useTexture();
        } else {
            if (!this.$nativeTexture) {
                $error(1006, this.__nativeURL);
            }
            this.__use = true;
            this.$addCount();
        }
    }

    $addCount() {
        if (this._parentTexture) {
            this._parentTexture.$addCount();
        } else {
            this.$count++;
        }
    }

    $delCount() {
        if (this._parentTexture) {
            this._parentTexture.$delCount();
        } else {
            this.$count--;
            if (this.$count < 0) {
                this.$count = 0;
            }
        }
    }

    getCount() {
        if (this._parentTexture) {
            this._parentTexture.getCount();
        } else {
            return this.$count;
        }
    }

    get url() {
        return this.__url;
    }

    get nativeURL() {
        return this.__nativeURL;
    }

    get width() {
        return this.__settingWidth || this.__width;
    }

    get height() {
        return this.__settingHeight || this.__height;
    }

    get source() {
        return this.__source;
    }

    get offX() {
        return this.__offX;
    }

    get offY() {
        return this.__offY;
    }

    get sourceRotation() {
        return this.__sourceRotation;
    }

    get scaleX() {
        return this.width / this.__width;
    }

    get scaleY() {
        return this.height / this.__height;
    }

    /**
     * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
     * @native
     */
    get dispatcher() {
        return this.__dispatcher;
    }

    dispose() {
        if (this.$count != 0 || !this.__use) {
            return false;
        }
        this.$nativeTexture.dispose();
        this.$nativeTexture = null;
        if (TIP) {
            $tip(1005, this.__nativeURL);
        }
        return true;
    }

    /**
     * 空白图片
     */
    static $blank;
}