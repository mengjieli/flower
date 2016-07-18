class PlatformTextField extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    constructor() {
        super();
        this.show = new cc.LabelTTF("", "Times Roman", (RETINA ? 2.0 : 1) * 12);
        this.show.setAnchorPoint(0, 1);
        this.setFontColor(0);
        this.show.retain();
        this.setScaleX(1);
        this.setScaleY(1);
    }

    setFontColor(color) {
        if (Platform.native) {
            this.show.setFontFillColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF}, true);
        } else {
            this.show.color = {r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF};
        }
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var $mesureTxt = PlatformTextField.$mesureTxt;
        $mesureTxt.setFontSize(size);
        this.show.setFontSize((RETINA ? 2.0 : 1) * size);
        var txt = this.show;
        txt.text = "";
        var txtText = "";
        var start = 0;
        if(text == "") {
            txt.setString("");
        }
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.setString(str);
                var lineWidth = $mesureTxt.getContentSize().width;
                var findEnd = i;
                var changeLine = false;
                //如果这一行的文字宽大于设定宽
                while (!autoSize && width && lineWidth > width) {
                    changeLine = true;
                    findEnd--;
                    $mesureTxt.setString(text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    lineWidth = $mesureTxt.getContentSize().width;
                }
                if (wordWrap && changeLine) {
                    i = findEnd;
                    txt.setString(txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.setString(txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.getContentSize().height * (RETINA ? (1 / 2.0) : 1) > height) {
                    txt.setString(txtText);
                    break;
                } else {
                    txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                    if (wordWrap && changeLine) {
                        txtText += "\n";
                    }
                }
                start = i;
                if (multiline == false) {
                    break;
                }
            }
        }
        $mesureTxt.setString(txt.getString());
        return $mesureTxt.getContentSize();
    }

    setFilters(filters) {

    }

    setScaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val * (RETINA ? (1 / 2.0) : 1));
    }

    setScaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val * (RETINA ? (1 / 2.0) : 1));
    }

    release() {
        var show = this.show;
        show.setString("");
        show.setFontSize((RETINA ? 2.0 : 1) * 12);
        this.setFontColor(0);
        super.release();
    }
}

PlatformTextField.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
PlatformTextField.$mesureTxt.retain();