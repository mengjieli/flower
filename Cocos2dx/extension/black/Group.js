class Group extends flower.Sprite {

    $UIComponent;
    _data;

    constructor(data) {
        super();
        if (data != null) {
            this._data = data;
        }
        this.$IViewPort = {
            0: 0,    //contentStartX
            1: 0,    //contentStartY
            2: 0,    //contentEndX
            3: 0,    //contentEndY
            4: null, //scrollH
            5: null, //scrollV
        }
        this.$initUIComponent();
    }

    setData(val) {
        if (val && typeof val == "string") {
            val = flower.DataManager.getInstance().createData(val);
        }
        if (this._data == val) {
            return false;
        }
        this._data = val;
        if (this.$UIComponent) {
            flower.Binding.changeData(this);
        }
        return true;
    }

    get data() {
        return this._data;
    }

    set data(val) {
        this.setData(val);
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
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
        this.$validateChildrenUIComponent();
        this.$IViewPort[0] = this.$childrenBounds.x;
        this.$IViewPort[1] = this.$childrenBounds.y;
        this.$IViewPort[2] = this.$childrenBounds.x + this.$childrenBounds.width;
        this.$IViewPort[3] = this.$childrenBounds.y + this.$childrenBounds.height;
    }

    $validateChildrenUIComponent() {
        var children = this.__children;
        if (children) {
            var child;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child.__UIComponent && child.$UIComponent[15]) {
                    child.$validateUIComponent();
                }
            }
        }
    }

    $resetLayout() {
        if (this.$hasFlags(this.layout && 0x2000)) {
            this.$removeFlags(0x2000);
            this.layout.updateList(this.width, this.height);
        }
    }

    $onFrameEnd() {
        if (!this.parent.__UIComponent) {
            var flag = false;
            var count = 6;
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
                flag = true;
                count--;
            }
            if (!flag) {
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
            }
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
                flag = true;
                count--;
            }
        } else {
            //super.$onFrameEnd();
            var children = this.__children;
            /**
             * 子对象序列改变
             */
            if (this.$hasFlags(0x0100)) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.resetChildIndex(children);
                this.$removeFlags(0x0100);
            }
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i].visible) {
                    children[i].$onFrameEnd();
                }
            }
            //super.$onFrameEnd();
            var p = this.$DisplayObject;
            if (this.$hasFlags(0x0002)) {
                this.$nativeShow.setAlpha(this.$getConcatAlpha());
            }
            this.$resetLayout();
        }
        flower.DebugInfo.frameInfo.display++;
        flower.DebugInfo.frameInfo.sprite++;
    }

    $getContentWidth() {
        return this.$IViewPort[2] - this.$IViewPort[0];
    }

    $getContentHeight() {
        return this.$IViewPort[3] - this.$IViewPort[1];
    }

    get contentWidth() {
        return this.$getContentWidth();
    }

    get contentHeight() {
        return this.$getContentHeight();
    }

    get scrollH() {
        return this.$IViewPort[4] == null ? this.$IViewPort[0] : this.$IViewPort[4];
    }

    set scrollH(val) {
        if (val != null) {
            val = +val;
        }
        if (this.$IViewPort[4] == val) {
            return;
        }
        this.$IViewPort[4] = val;
    }

    get scrollV() {
        return this.$IViewPort[5] == null ? this.$IViewPort[1] : this.$IViewPort[5];
    }

    set scrollV(val) {
        if (val != null) {
            val = +val;
        }
        if (this.$IViewPort[5] == val) {
            return;
        }
        this.$IViewPort[5] = val;
    }

    dispose() {
        flower.Binding.removeChangeObject(this);
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}
UIComponent.register(Group, true);
Group.prototype.__UIComponent = true;
exports.Group = Group;