class PlatformTextField extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    constructor() {
        super();

    }

    setFontColor(color) {
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {

        return {
            width: 0,
            height: 0
        };
    }

    setFilters(filters) {

    }

    release() {

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

    static measureTextWidth(size, text) {
        text = flower.StringDo.replaceString(text, " ", "&nbsp;");
        text = flower.StringDo.replaceString(text, "<", "&lt;");
        text = flower.StringDo.replaceString(text, ">", "&gt;");
        var $mesureTxt = PlatformTextField.$mesureTxt;
        $mesureTxt.style.fontSize = size + "px";
        $mesureTxt.innerHTML = text;
        return $mesureTxt.offsetWidth;
    }
}

//var measureTxt = document.createElement("span");
//measureTxt.style.visibility = "hidden";
//measureTxt.style.whiteSpace = "nowrap";
//document.body.appendChild(measureTxt);
////measureTxt.style.width = "0px";
//PlatformTextField.$mesureTxt = measureTxt;
//PlatformTextField.$mesureTxt.retain();

flower.$measureTextWidth = PlatformTextField.measureTextWidth;