class PlatformTextInput extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    __changeBack = null;
    __changeBackThis = null;


    constructor() {
        super();
        var input = document.createElement("input");
        input.style.position = "absolute";
        input.style.left = "0px";
        input.style.top = "0px";
        input.style["font-style"] = "normal";
        input.style["transform-origin"] = "left top";
        this.show = input;
    }

    setFontColor(color) {
        if (Platform.native) {
            this.show.setTextColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF, a: 255});
        } else {
            this.show.setTextColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF, a: 255});
        }
    }

    setSize(width, height) {
        var txt = this.show;
        txt.style.width = width + "px";
        txt.style.width = height + "px";
    }

    setChangeBack(changeBack, thisObj) {
        this.__changeBack = changeBack;
        this.__changeBackThis = thisObj;
    }

    onTextFieldAttachWithIME(sender) {
        console.log("start input");
    }

    onTextFieldDetachWithIME(sender) {
        console.log("stop input");
    }

    onTextFieldInsertText(sender, text, len) {
        //console.log(text + " : " + len);
        if (this.__changeBack) {
            this.__changeBack.call(this.__changeBackThis);
        }
    }

    onTextFieldDeleteBackward() {

    }

    getNativeText() {
        return this.show.value;
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var $mesureTxt = PlatformTextField.$mesureTxt;
        $mesureTxt.style.fontSize = size + "px";
        var txt = this.show;
        txt.style.fontSize = size + "px";
        txt.value = "";
        var txtText = "";
        var start = 0;
        if (text == "") {
            txt.value = "";
        }
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.innerHTML = str;
                var lineWidth = $mesureTxt.offsetWidth;
                var findEnd = i;
                var changeLine = false;
                //如果这一行的文字宽大于设定宽
                while (!autoSize && width && lineWidth > width) {
                    changeLine = true;
                    findEnd--;
                    $mesureTxt.innerHTML = text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                    lineWidth = $mesureTxt.offsetWidth;
                }
                if (wordWrap && changeLine) {
                    i = findEnd;
                    txt.value = (txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.value = (txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.offsetHeight > height) {
                    txt.value = (txtText);
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
        txt.value = flower.StringDo.replaceString(txt.value, "\n", "</br>");
        txt.value = flower.StringDo.replaceString(txt.value, "\r", "</br>");
        $mesureTxt.innerHTML = txt.value;
        return {
            width: $mesureTxt.offsetWidth,
            height: $mesureTxt.offsetHeight
        };
    }

    setFilters(filters) {

    }

    startInput() {
        this.show.focus();
        //this.show.attachWithIME();
    }

    stopInput() {
        //this.show.detachWithIME();
    }

    release() {
        this.__changeBack = null;
        this.__changeBackThis = null;
        var show = this.show;
        show.innerHTML = ("");
        show.style.fontSize = "12px";
        this.setFontColor(0);
        super.release();
    }
}

//PlatformTextInput.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
//PlatformTextInput.$mesureTxt.retain();