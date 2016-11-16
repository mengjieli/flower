class PlatformTextInput extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    __changeBack = null;
    __changeBackThis = null;


    constructor() {
        super();
    }

    setFontColor(color) {
    }

    setSize(width, height) {
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
        return "";
    }

    setNativeText(val) {
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {

        return {
            width: 0,
            height: 0
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

//PlatformTextInput.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
//PlatformTextInput.$mesureTxt.retain();