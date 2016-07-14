class MaskUI extends flower.Mask {

    constructor(data) {
        super();
        if (data != null) {
            this._data = data;
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
        if(this.$UIComponent) {
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

    $createShape() {
        var shape = new RectUI();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
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
            this.x = +p[0];
        }
        else if (p[0] == null && p[1] != null && p[2] != null) {
            this.width = (p[1] - p[2]) * 2;
            this.x = +2 * p[2] - p[1];
        } else if (p[0] != null && p[1] != null) {
            this.width = parent.width - p[1] - p[0];
            this.x = +p[0];
        } else {
            if (p[0] != null) {
                this.x = p[0];
            }
            if (p[1] != null) {
                this.x = parent.width - p[1] - this.width;
            }
            if (p[2] != null) {
                this.x = (parent.width - this.width) * 0.5 + p[2];
            }
            if (p[6]) {
                this.width = parent.width * p[6] / 100;
            }
        }
        if (p[3] != null && p[4] == null && p [5] != null) {
            this.height = (p[5] - p[3]) * 2;
            this.y = +p[3];
        } else if (p[3] == null && p[4] != null && p[5] != null) {
            this.height = (p[4] - p[5]) * 2;
            this.y = 2 * p[5] - p[4];
        } else if (p[3] != null && p[4] != null) {
            this.height = parent.height - p[4] - p[3];
            this.y = +p[3];
        } else {
            if (p[3] != null) {
                this.y = p[3];
            }
            if (p[4] != null) {
                this.y = parent.height - p[4] - this.height;
            }
            if (p[5] != null) {
                this.y = (parent.height - this.height) * 0.5 + p[5];
            }
            if (p[7]) {
                this.height = parent.height * p[7] / 100;
            }
        }
        this.$validateChildrenUIComponent();
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

    $validateChildrenUIComponent() {
        if (this.shape.__UIComponent) {
            this.shape.$validateUIComponent(this);
        }
        var children = this.__children;
        if (children) {
            var child;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child.__UIComponent) {
                    child.$validateUIComponent();
                }
            }
        }
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (!this.parent.__UIComponent) {
            var flag = false;
            var count = 6;
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
                flag = true;
                count--;
            }
            if (!flag) {
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
            }
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
                flag = true;
                count--;
            }
        } else {
            super.$onFrameEnd();
            this.shape.$onFrameEnd();
            this.$resetLayout();
        }
    }

    dispose() {
        flower.Binding.removeChangeObject(this);
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}
UIComponent.register(MaskUI, true);
MaskUI.prototype.__UIComponent = true;
exports.MaskUI = MaskUI;