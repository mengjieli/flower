class PlatformTextArea extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    __changeBack = null;
    __changeBackThis = null;


    constructor() {
        super();
        var input = document.createElement("textarea");
        input.style.position = "absolute";
        input.style.left = "0px";
        input.style.top = "0px";
        input.style["background"] = "none";
        input.style["border"] = "none";
        input.style["font-style"] = "normal";
        input.style["transform-origin"] = "left top";
        this.show = input;
    }

    setFontColor(color) {
        this.show.style.color = '#' + this.toColor16(color >> 16) + this.toColor16(color >> 8 & 0xFF) + this.toColor16(color & 0xFF);
    }

    setSize(width, height) {
        var txt = this.show;
        txt.style.width = width + "px";
        txt.style.height = height + "px";
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

    changeText(text, width, height, size, wordWrap, multiline, autoSize, deleteMore = false) {
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
        var txtHeight = 0;
        var txtWidth = 0;
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.innerHTML = str;
                var lineWidth = $mesureTxt.offsetWidth;
                var findEnd = i;
                var changeLine = false;
                txtWidth = lineWidth > txtWidth ? lineWidth : txtWidth;
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
                txtHeight += size + 3;
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txtHeight > height && deleteMore) {
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
        //txt.value = flower.StringDo.replaceString(txt.value, "\n", "</br>");
        //txt.value = flower.StringDo.replaceString(txt.value, "\r", "</br>");
        return {
            width: txtWidth,
            height: txtHeight
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

    toColor16(color) {
        var abc;
        var num = math.floor(color / 16);
        abc = num + "";
        if (num == 15) {
            abc = "f";
        }
        if (num == 14) {
            abc = "e";
        }
        if (num == 13) {
            abc = "d";
        }
        if (num == 12) {
            abc = "c";
        }
        if (num == 11) {
            abc = "b";
        }
        if (num == 10) {
            abc = "a";
        }
        var str = abc + "";
        num = color % 16;
        abc = num + "";
        if (num == 15) {
            abc = "f";
        }
        if (num == 14) {
            abc = "e";
        }
        if (num == 13) {
            abc = "d";
        }
        if (num == 12) {
            abc = "c";
        }
        if (num == 11) {
            abc = "b";
        }
        if (num == 10) {
            abc = "a";
        }
        str += abc;
        return str;
    }
}