class PlatformTextField extends PlatformDisplayObject {

    static sizes = [0,0,0,0,0,0,0,0,0,22,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,6,6,9,9,2,3,3,6,6,3,3,3,3,6,6,6,6,6,6,6,6,6,6,3,3,6,6,6,5,11,8,8,8,8,7,6,8,8,3,4,8,7,10,8,8,6,8,8,6,7,8,8,11,8,8,7,3,3,3,5,6,3,5,6,5,6,5,3,6,6,3,3,6,3,9,6,6,6,6,3,4,3,6,6,8,6,6,5,5,2,5,6,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,6,6,6,6,2,6,3,9,3,6,6,0,9,3,4,6,3,3,3,6,5,3,3,3,3,6,9,9,9,5,8,8,8,8,8,8,10,8,7,7,7,7,3,3,3,3,8,8,8,8,8,8,8,6,8,8,8,8,8,8,6,6,5,5,5,5,5,5,8,5,5,5,5,5,3,3,3,3,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,8,5,8,5,8,5,8,5,8,5,8,5,8,5,8,7,8,6,7,5,7,5,7,5,7,5,7,5,8,6,8,6,8,6,8,6,8,6,8,6,3,3,3,3,3,3,3,3,3,3,8,6,4,3,8,6,6,7,3,7,3,7,4,7,4,7,3,8,6,8,6,8,6,6,8,6,8,6,8,6,8,6,10,8,8,3,8,3,8,3,6,4,6,4,6,4,6,4,7,3,7,5,7,3,8,6,8,6,8,6,8,6,8,6,8,6,11,8,8,6,8,7,5,7,5,7,5,3,7,8,6,7,8,6,8,8,6,9,10,6,7,7,7,7,6,6,6,8,7,10,4,4,7,7,4,7,12,8,7,9,8,7,12,10,8,7,7,6,6,7,6,4,8,4,7,9,6,9,8,7,8,7,6,6,6,6,6,7,7,5,5,7,2,4,5,3,15,13,11,12,10,6,13,12,9,8,5,3,3,8,6,8,6,8,6,8,6,8,6,8,6,5,8,5,8,5,10,8,9,7,8,6,8,6,8,6,8,6,6,6,3,15,13,11,8,6,12,6,8,6,8,5,10,8,8,6,8,5,8,5,7,5,7,5,3,3,3,3,8,6,8,6,8,3,8,3,8,6,8,6,6,4,7,3,6,6,8,6,8,11,9,7,7,6,8,5,7,5,8,6,8,6,8,6,8,6,8,6,6,10,6,3,11,11,8,8,6,6,7,6,6,6,6,8,10,8,8,6,6,2,10,7,9,4,9,7,6,7,7,7,6,6,7,7,5,5,9,5,5,7,7,4,7,7,7,6,7,7,7,7,4,4,4,6,5,3,7,11,11,11,7,7,7,7,9,9,9,4,4,5,4,4,4,4,6,6,6,5,5,5,6,4,4,7,7,7,6,9,6,5,6,8,6,6,5,5,5,5,9,6,7,7,7,5,7,5,7,5,5,12,11,14,9,8,10,11,8,8,7,6,7,7,4,4,2,2,2,3,3,5,3,2,4,3,3,3,3,3,3,3,4,4,4,4,3,3,2,7,3,3,2,4,3,3,4,4,3,3,5,5,5,5,3,3,3,3,3,3,2,4,4,2,3,4,3,4,4,4,4,4,4,4,4,5,5,2,2,2,2,3,3,5,5,4,2,3,3,3,3,4,4,5,4,3,4,4,4,4,4,3,4,3,3,4,4,4,5,5,5,4,4,3,3,1,4,3,4,4,2,3,4,5,5,5,5,2,2,3,4,3,3,3,3,4,4,6,4,4,4,5,4,4,4,7,6,6,7,6,3,4,6,4,6,5,4,7,4,3,4,3,4,2,4,5,5,4,5,5,5,6,4,0,4,4,5,5,4,4,6,4,2,5,5,5,9,5,5,5,5,5,5,4,4,3,4,4,4,4,4,5,4,4,4,4,5,3,7,5,3,3,8,6,13,13,2,6,6,6,3,13,13,13,13,13,3,4,9,3,11,13,7,13,10,13,12,10,3,10,8,7,8,8,8,9,9,4,9,9,11,9,8,9,9,7,13,7,8,9,10,9,10,9,4,9,7,5,6,3,6,7,6,6,6,5,6,6,6,3,6,6,6,6,6,6,6,6,5,6,5,6,8,6,8,8,3,6,6,6,8,6,6,7,7,10,7,7,8,6,9,7,7,6,6,6,6,6,7,9,12,9,8,7,7,6];

    static $mesureTxt;

    show;

    constructor(id) {
        super(id);

        var msg = new flower.VByteArray();
        msg.writeUInt(6);
        msg.writeUInt(this.id);
        msg.writeUTF("TextField");
        Platform.sendToClient(msg);
    }

    setFontColor(color) {
        var msg = new flower.VByteArray();
        msg.writeUInt(32);
        msg.writeUInt(this.id);
        msg.writeUTF(color);
        Platform.sendToClient(msg);
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var msg = new flower.VByteArray();
        msg.writeUInt(30);
        msg.writeUInt(this.id);
        msg.writeUInt(size);
        msg.writeUTF(text);
        Platform.sendToClient(msg);
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