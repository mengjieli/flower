class TextField extends DisplayObject {

    $TextField;

    constructor() {
        super();
        this.$nativeShow = Platform.create("TextField");
        this.$TextField = {
            0: "", //text
            1: 12, //fontSize
            2: 0x000000, //fontColor
            3: false, //wordWrap
            4: true, //multiline
            5: true //autoSize
        }
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
            var d = this.$DisplayObject;
            var p = this.$TextField;
            //text, width, height, size, wordWrap, multiline, autoSize
            var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], p[3], p[4], p[5]);
            rect.x = 0;
            rect.y = 0;
            rect.width = size.width;
            rect.height = size.height;
            this.$removeFlags(0x0800);
        }
    }

    $measureContentBounds(rect) {
        this.$measureText(rect);
    }

    $setFontColor(val) {
        val = +val || 0;
        var p = this.$TextField;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        this.$nativeShow.setFontColor(val);
        return true;
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

    $onFrameEnd() {
        if (this.$hasFlags(0x0800)) {
            var width = this.width;
        }
        super.$onFrameEnd();
    }

    dispose() {
        super.dispose();
        Platform.release("TextField", this.$nativeShow);
    }
}

exports.TextField = TextField;