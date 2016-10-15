class RichText extends Group {

    constructor() {
        super();
        this.$RichText = {
            0: "", //text
            1: "", //htmlText
            2: 0,  //lines
            3: 0,  //positionX
            4: 0,  //positionY
            5: [], //cacheTextFields
            8: "", //lastInputText
            9: new flower.Shape(),//focus
            10: 0,  //fontColor
            11: 12, //fontSize
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
        this.addListener(flower.KeyboardEvent.KEY_DOWN,this.__onKeyDown,this);
        flower.EnterFrame.add(this.__update, this);
    }

    $stopInput() {
        this.__input.$stopNativeInput();
        this.removeListener(flower.KeyboardEvent.KEY_DOWN,this.__onKeyDown,this);
        flower.EnterFrame.remove(this.__update, this);
    }

    __update() {
        trace(this.__input.$getNativeText());
    }

    __onKeyDown(e) {
        trace(e.keyCode);
    }

    set text(val) {

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