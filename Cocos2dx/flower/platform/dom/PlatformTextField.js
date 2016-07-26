class PlatformTextField extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    constructor() {
        super();
        var em = document.createElement("div");
        em.style.position = "absolute";
        em.style.left = "0px";
        em.style.top = "0px";
        em.style["font-style"] = "normal";
        em.style["transform-origin"] = "left top";
        this.show = em;
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
        $mesureTxt.style.fontSize = size + "px";
        var txt = this.show;
        txt.style.fontSize = size + "px";
        txt.text = "";
        var txtText = "";
        var start = 0;
        if (text == "") {
            txt.innerHTML = "";
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
                    txt.innerHTML = (txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.innerHTML = (txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.getContentSize().height * (RETINA ? (1 / 2.0) : 1) > height) {
                    txt.innerHTML = (txtText);
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
        txt.innerHTML = flower.StringDo.replaceString(txt.innerHTML,"\n","</br>");
        txt.innerHTML = flower.StringDo.replaceString(txt.innerHTML,"\r","</br>");
        $mesureTxt.innerHTML = txt.innerHTML;
        txt.style.width = $mesureTxt.offsetWidth + "px";
        return {
            width: $mesureTxt.offsetWidth,
            height: $mesureTxt.offsetHeight
        };
    }

    setFilters(filters) {

    }

    release() {
        var show = this.show;
        show.innerHTML = ("");
        show.style.fontSize = "12px";
        this.setFontColor(0);
        super.release();
    }
}

var measureTxt = document.createElement("span");
measureTxt.style.visibility = "hidden";
measureTxt.style.whiteSpace = "nowrap";
document.body.appendChild(measureTxt);
//measureTxt.style.width = "0px";
PlatformTextField.$mesureTxt = measureTxt;
//PlatformTextField.$mesureTxt.retain();