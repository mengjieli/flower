class Image extends flower.Bitmap {

    $UIComponent;
    __source;
    __loader;

    constructor(source = null) {
        super();
        this.$initUIComponent();
        this.source = source;
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        //console.log("验证 ui 属性");
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
        //if (this instanceof flower.Panel) {
        //    console.log("验证 ui 属性",flower.EnterFrame.frame);
        //}
        if (p[0] != null && p[1] == null && p [2] != null) {
            this.width = (p[2] - p[0]) * 2;
            this.x = p[0];
        } else if (p[0] == null && p[1] != null && p[2] != null) {
            this.width = (p[1] - p[2]) * 2;
            this.x = 2 * p[2] - p[1];
        } else if (p[0] != null && p[1] != null) {
            this.width = parent.width - p[1] - p[0];
            this.x = p[0];
        } else {
            if (p[0] != null) {
                this.x = p[0];
            }
            if (p[1] != null) {
                this.x = parent.width - p[1] - this.width * this.scaleX;
            }
            if (p[2] != null) {
                this.x = (parent.width - this.width * this.scaleX) * 0.5 + p[2];
            }
            if (p[6]) {
                this.width = parent.width * p[6] / 100;
            }
        }
        if (p[3] != null && p[4] == null && p [5] != null) {
            this.height = (p[5] - p[3]) * 2;
            this.y = p[3];
        } else if (p[3] == null && p[4] != null && p[5] != null) {
            this.height = (p[4] - p[5]) * 2;
            this.y = 2 * p[5] - p[4];
        } else if (p[3] != null && p[4] != null) {
            this.height = parent.height - p[4] - p[3];
            this.y = p[3];
        } else {
            if (p[3] != null) {
                this.y = p[3];
            }
            if (p[4] != null) {
                this.y = parent.height - p[4] - this.height * this.scaleY;
            }
            if (p[5] != null) {
                this.y = (parent.height - this.height * this.scaleY) * 0.5 + p[5];
            }
            if (p[7]) {
                this.height = parent.height * p[7] / 100;
            }
        }
    }

    $setSource(val) {
        if (this.__source == val) {
            return;
        }
        this.__source = val;
        if (val == "" || val == null) {
            this.texture = null;
        } else if (val instanceof flower.Texture) {
            this.texture = val;
        } else {
            if (this.__loader) {
                this.__loader.$useImage();
                this.__loader.dispose();
            }
            if (typeof val == "string" && val.slice(0, 2) == "./" && this.$filePath) {
                val = flower.Path.joinPath(this.$filePath, val);
            }
            this.__loader = new flower.URLLoader(val);
            this.__loader.load();
            this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
            this.__loader.addListener(flower.Event.ERROR, this.__onLoadError, this);
        }
    }

    __onLoadError(e) {
        this.__loader = null;
    }

    __onLoadComplete(e) {
        this.__loader = null;
        this.texture = e.data;
        this.dispatchWith(flower.Event.COMPLETE);
    }

    //$onFrameEnd() {
    //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
    //    //    this.$validateUIComponent();
    //    //}
    //    super.$onFrameEnd();
    //}

    dispose() {
        if (this.__loader) {
            this.__loader.$useImage();
            this.__loader.dispose();
        }
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }

    get source() {
        return this.__source;
    }

    set source(val) {
        this.$setSource(val);
    }

    get isLoading() {
        return this.__loader?true:false;
    }
}

UIComponent.register(Image);
Image.prototype.__UIComponent = true;
exports.Image = Image;

UIComponent.registerEvent(Image, 1300, "loadComplete", flower.Event.COMPLETE);