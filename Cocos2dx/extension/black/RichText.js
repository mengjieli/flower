class RichText extends Group {

    constructor() {
        super();
        this.$RichText = {
            0: "", //text
            1: "", //htmlText
            2: 0,  //lines
            4: 0,  //length
            5: 0,  //positionX
            6: 0,  //positionY
            7: [], //cacheTextFields
            8: "", //lastInputText
            10: 0,  //fontColor
            11: 12, //fontSize
            30: "", //229 firstChar
            31: false, // is 229
            32: 0, //inputPos
            33: new flower.Shape(),//focus
        };
        this.focusEnabled = true;
        this.width = this.height = 100;
        this.addListener(flower.Event.FOCUS_IN, this.$startInput, this);
        this.addListener(flower.Event.FOCUS_OUT, this.$stopInput, this)
        this.__input = flower.Stage.getInstance().$input;
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, flower.Point.$TempPoint);
        touchX = Math.floor(point.x);
        touchY = Math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        if (touchX >= 0 && touchX < this.width && touchY >= 0 && touchY < this.height) {
            return this;
        }
        return null;
    }

    $startInput() {
        this.__input.text = "";
        this.__input.$startNativeInput();
        this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.add(this.__update, this);
    }

    $stopInput() {
        this.__input.$stopNativeInput();
        this.removeListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.remove(this.__update, this);
    }

    __update() {
        var p = this.$RichText;
        var str = this.__input.$getNativeText();
        if (p[31]) {
            if (p[30] == "") {
                if (str.length) {
                    p[30] = str.charAt(0);
                }
            } else {
                if (!str.length || str.charAt(0) != p[30]) {
                    this.text += str;
                    this.__input.text = "";
                    this.$RichText[7] = false;
                }
            }
        } else {
            this.text += str;
            this.__input.text = "";
        }
    }

    __onKeyDown(e) {
        if (e.keyCode == 229) {
            if(!this.$RichText[31]) {
                this.$RichText[31] = true;
                this.$RichText[30] = "";
            }
        }
    }

    set text(val) {
        this.$RichText[0] += val;
        trace(this.$RichText[0]);
    }

    get text() {
        return this.$RichText[0];
    }

    set htmlText(val) {

    }

    get htmlText() {
        return this.$RichText[1];
    }
}

exports.RichText = RichText;