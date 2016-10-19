class TextField extends DisplayObject {

    $TextField;

    constructor(text = "") {
        super();
        this.$nativeShow = Platform.create("TextField");
        this.$TextField = {
            0: "", //text
            1: 12, //fontSize
            2: 0x000000, //fontColor
            3: true, //wordWrap
            4: true, //multiline
            5: true //autoSize
        };
        if (text != "") {
            this.text = text;
        }
    }

    $checkSettingSize(rect) {

    }

    $setText(val) {
        val = "" + val;
        var p = this.$TextField;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $measureText(rect) {
        if (this.$hasFlags(0x0800)) {
            this.$removeFlags(0x0800);
            var d = this.$DisplayObject;
            var p = this.$TextField;
            //text, width, height, size, wordWrap, multiline, autoSize
            var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], p[3], p[4], p[5]);
            rect.x = 0;
            rect.y = 0;
            rect.width = size.width;
            rect.height = size.height;
        }
    }

    $measureContentBounds(rect) {
        this.$measureText(rect);
    }

    $setFontSize(val) {
        var p = this.$TextField;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setMultiLine(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        var p = this.$TextField;
        if (p[4] == val) {
            return false;
        }
        p[4] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setFontColor(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = +val || 0;
        var p = this.$TextField;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        this.$nativeShow.setFontColor(val);
        return true;
    }

    $setWordWrap(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = !!val;
        var p = this.$TextField;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setAutoSize(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = !!val;
        var p = this.$TextField;
        if (p[5] == val) {
            return false;
        }
        p[5] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setWidth(val) {
        var flag = super.$setWidth(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
    }

    $setHeight(val) {
        var flag = super.$setHeight(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
    }

    get text() {
        var p = this.$TextField;
        return p[0];
    }

    set text(val) {
        this.$setText(val);
    }

    get fontColor() {
        var p = this.$TextField;
        return p[2];
    }

    set fontColor(val) {
        this.$setFontColor(val);
    }

    get fontSize() {
        var p = this.$TextField;
        return p[1];
    }

    set fontSize(val) {
        this.$setFontSize(val);
    }

    get autoSize() {
        var p = this.$TextField;
        return p[5];
    }

    set autoSize(val) {
        this.$setAutoSize(val);
    }

    set wordWrap(val) {
        this.$setWordWrap(val);
    }

    get wordWrap() {
        var p = this.$TextField;
        return p[3];
    }

    get multiLine() {
        var p = this.$TextField;
        return p[4];
    }

    set multiLine(val) {
        this.$setMultiLine(val);
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x0800)) {
            this.$getContentBounds();
        }
        //super.$onFrameEnd();
        Stage.displayCount++;
        Stage.textCount++;
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        super.dispose();
        Platform.release("TextField", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.TextField = TextField;