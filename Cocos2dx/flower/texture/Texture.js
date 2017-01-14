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
    __sourceWidth;
    __sourceHeight;
    __splits;
    $nativeTexture;
    $count;
    $parentTexture;

    /**
     * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
     * @native
     */
    __dispatcher = UPDATE_RESOURCE ? new EventDispatcher() : null;

    constructor(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight, sourceWidth, sourceHeight) {
        this.$nativeTexture = nativeTexture;
        this.__url = url;
        this.__nativeURL = nativeURL;
        this.$count = 0;
        this.__width = +w;
        this.__height = +h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
        this.__sourceWidth = sourceWidth;
        this.__sourceHeight = sourceHeight;
    }

    $update(nativeTexture, w, h, settingWidth, settingHeight) {
        this.$nativeTexture = nativeTexture;
        this.__width = w;
        this.__height = h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
        if (this.dispatcher) {
            this.dispatcher.dispatchWith(Event.UPDATE);
        }
    }

    createSubTexture(url, startX, startY, width, height, sourceWidth = 0, sourceHeight = 0, offX = 0, offY = 0, rotation = false) {
        var sub = new Texture(this.$nativeTexture, url, this.__nativeURL, width, height, width * this.scaleX, height * this.scaleY, sourceWidth || this.width, sourceHeight || this.height);
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
        if (this.$parentTexture) {
            this.$parentTexture.$addCount();
        } else {
            this.$count++;
        }
    }

    $delCount() {
        if (this.$parentTexture) {
            this.$parentTexture.$delCount();
        } else {
            this.$count--;
            if (this.$count < 0) {
                this.$count = 0;
            }
        }
    }

    $setSplitInfo(data) {
        var content = data;
        var xml = XMLElement.parse(content);
        xml = xml.list[0];
        var reslist;
        var attributes;
        for (var i = 0; i < xml.list.length; i++) {
            if (xml.list[i].name == "key") {
                if (xml.list[i].value == "frames") {
                    reslist = xml.list[i + 1];
                }
                else if (xml.list[i].value == "metadata") {
                    attributes = xml.list[i + 1];
                }
                i++;
            }
        }
        this.__splits = [];
        var frameFrame;
        var frame;
        var maxw = 0;
        var maxh = 0;
        for (i = 0; i < reslist.list.length; i++) {
            if (reslist.list[i].name == "key") {
                frame = new PlistFrame(reslist.list[i].value);
                frame.decode(reslist.list[i + 1]);
                var name = frame.name;
                var posx = ~~name.split("_")[0];
                var posy = ~~name.split(".")[0].split("_")[1];
                var item = {
                    x: posx,
                    y: posy,
                    textureX: frame._x,
                    textureY: frame._y,
                    textureWidth: frame._width,
                    textureHeight: frame._height,
                    offX: frame._moveX,
                    offY: frame._moveY,
                    sourceWidth: frame._sourceWidth,
                    sourceHeight: frame._sourceHeight,
                    rotation: frame._rotation
                }
                maxw = posx + item.sourceWidth > maxw ? posx + item.sourceWidth : maxw;
                maxh = posy + item.sourceHeight > maxh ? posy + item.sourceHeight : maxh;
                i++;
            }
        }
        this.__sourceWidth = maxw;
        this.__sourceHeight = maxh;
        trace("原本大小：", maxw, maxh, "现在大小:", this.width, this.height)

    }

    getCount() {
        if (this.$parentTexture) {
            this.$parentTexture.getCount();
        } else {
            return this.$count;
        }
    }

    get $use() {
        return this.__use;
    }

    set $use(val) {
        this.__use = val;
    }

    get url() {
        return this.__url;
    }

    get nativeURL() {
        return this.__nativeURL;
    }

    get width() {
        return this.__sourceWidth || this.__width;
    }

    get height() {
        return this.__sourceHeight || this.__height;
    }

    get width() {
        return this.__sourceWidth || this.__width;
    }

    get height() {
        return this.__sourceHeight || this.__height;
    }

    get textureWidth() {
        return this.__settingWidth || this.__width;
    }

    get textureHeight() {
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
        return this.textureWidth / this.__width;
    }

    get scaleY() {
        return this.textureHeight / this.__height;
    }

    get count() {
        return this.$count;
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

exports.Texture = Texture;