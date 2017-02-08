class Input extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
        this.$input = {
            0: null, //value
        }
        this.$IViewPort = {
            0: 0,    //contentStartX
            1: 0,    //contentStartY
            2: 0,    //contentEndX
            3: 0,    //contentEndY
            4: null, //scrollH
            5: null, //scrollV
            6: null, //viewer
        }
        this.input = true;
        this.addListener(flower.Event.STOP_INPUT, this.__onTextChange, this);
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

    __onTextChange(e) {
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].value = this.text;
            if (this.text != this.$input[0].value + "") {
                this.__valueChange();
            }
        }
    }

    __valueChange() {
        if (this.$input[0] != null) {
            this.text = this.$input[0] instanceof flower.Value ? this.$input[0].value : this.$input[0];
        }
    }

    __onValueChange(e) {
        this.__valueChange();
    }

    //$onFrameEnd() {
    //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
    //    //    this.$validateUIComponent();
    //    //}
    //    super.$onFrameEnd();
    //}


    $setHtmlText(text) {
        super.$setHtmlText.call(this, text);
        var p = this.$TextField;
        this.$IViewPort[2] = p[17];
        this.$IViewPort[3] = p[18];
    }

    dispose() {
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].removeListener(flower.Event.CHANGE, this.__onValueChange, this);
        }
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }

    $getX() {
        var p = this.$TextField;
        if (this.$IViewPort[6]) {
            return p[50];
        } else {
            return super.$getX.call(this);
        }
    }

    $setX(val) {
        val = +val || 0;
        var p = this.$TextField;
        if (this.$IViewPort[6]) {
            if (p[50] == val) {
                return;
            }
            p[50] = val;
            p[100] = true;
        } else {
            super.$setX.call(this, val);
        }
    }

    $getY() {
        var p = this.$TextField;
        if (this.$IViewPort[6]) {
            return p[51];
        } else {
            return super.$getY.call(this);
        }
    }

    $setY(val) {
        val = +val || 0;
        var p = this.$TextField;
        if (this.$IViewPort[6]) {
            if (p[51] == val) {
                return;
            }
            p[51] = val;
            p[100] = true;
        } else {
            super.$setY.call(this, val);
        }
    }

    set viewer(val) {
        if (this.$IViewPort[6] == val) {
            return;
        }
        this.$IViewPort[6] = val;
        var p = this.$TextField;
        p[100] = true;
    }

    set value(val) {
        if (this.$input[0] == val) {
            return;
        }
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].removeListener(flower.Event.CHANGE, this.__onValueChange, this);
        }
        this.$input[0] = val;
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].addListener(flower.Event.CHANGE, this.__onValueChange, this);
        }
        this.__valueChange();
    }

    get value() {
        return this.$input[0];
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
        var p = this.$TextField;
        p[51] = val;
        p[100] = true;
    }
}

UIComponent.register(Input);
Input.prototype.__UIComponent = true;
exports.Input = Input;

UIComponent.registerEvent(Input, 1140, "startInput", flower.Event.START_INPUT);
UIComponent.registerEvent(Input, 1141, "stopInput", flower.Event.STOP_INPUT);