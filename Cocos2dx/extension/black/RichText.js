class RichText extends Group {

    __input;

    constructor() {
        super();

        this.$RichText = {
            0: "", //text
            1: "", //htmlText formatHtmlText
            2: [], //lines
            3: 0,  //inputLength
            4: new flower.Sprite(), //textContainer
            5: this.__getDefaultFocus(), //focus
            6: "", //setHtmlText
            7: 0, //chars
            8: 0, //posY
            9: 0.5, //shineGap
            10: 12,//fontSize
            11: 0, //fontColor
            12: 1, //linegap
            13: false,  //wordWrap
            30: 0, //caretIndex
            31: 0, //caretHtmlIndex
            32: null,//caretLine
            32: null,//caretDisplayLine
            33: null,//caretDisplay
            34: 0, //caretDisplayIndex
            100: false,//updateFlag
            101: {}, //DisplayCaches
            102: {}, //ids
            200: 0, //lastTouchTime
            201: false, //doubleClick
            300: false, //isInputing
            301: 0, //charIndex
            302: 0, //htmlTextIndex
            303: 0, //inputTime
            304: false,//is 229
            305: "", //229 firstChar
            306: "", //last input text
            311: null,
            312: null,
            313: null
        };
        this.addChild(this.$RichText[4]);
        this.addChild(this.$RichText[5]);
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.Event.FOCUS_OUT, this.__stopInput, this);
        this.focusEnabled = true;
        this.__input = flower.Stage.getInstance().$input;
        flower.EnterFrame.add(this.$update, this);
    }

    __onTouch(e) {
        var p = this.$RichText;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                var doubleClick = false;
                var tribleClick = false;
                if (!p[201]) {
                    if (flower.CoreTime.currentTime - p[200] < 200) {
                        doubleClick = true;
                    }
                } else {
                    if (flower.CoreTime.currentTime - p[200] < 200) {
                        doubleClick = true;
                        tribleClick = true;
                    }
                }
                p[200] = flower.CoreTime.currentTime;
                p[201] = doubleClick;
                if (tribleClick) { //三击
                    this.__tribleClick();
                } else if (doubleClick) { //双击
                    this.__doubleClick();
                } else { //单击
                    this.__click();
                }
                break;
        }
    }

    /**
     * 连续三次点击
     * @private
     */
    __tribleClick() {
        console.log("三击")
    }

    /**
     * 连续两次点击
     * @private
     */
    __doubleClick() {
        console.log("双击")
    }

    /**
     * 点击
     * @private
     */
    __click() {
        this.__startInput(this.__getClickPos());
    }

    __startInput(info) {
        var p = this.$RichText;
        if (p[300]) {
            return;
        }
        //console.log("开始输入:", p[1].slice(0, info.htmlTextIndex), "\n", p[1].slice(info.htmlTextIndex, p[1].length));
        p[300] = true;
        p[301] = info.charIndex;
        p[302] = info.htmlTextIndex;
        this.__input.text = "";
        this.__input.$startNativeInput();
        this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.add(this.__update, this);
        this.__showFocus(info);
    }

    __stopInput() {
        this.$RichText[300] = false;
        this.__input.$stopNativeInput();
        this.removeListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.remove(this.__update, this);
        this.__hideFocus();
    }

    __hideFocus() {
        this.$RichText[5].visible = false;
    }

    __onKeyDown(e) {
        var p = this.$RichText;
        console.log(e.keyCode);
        if (e.keyCode == 229) {
            if (!p[304]) {
                p[304] = true;
                p[305] = "";
                p[311] = p[301];
                p[312] = p[302];
                p[313] = p[1];
            }
            var str = this.__input.$getNativeText();
            if (p[305] == "") {
                if (str.length) {
                    p[305] = str.charAt(0);
                }
            }
            p[1] = p[313];
            p[301] = p[311];
            p[302] = p[312];
            if (flower.StringDo.replaceString(p[306], "'", "") == str || str.charAt(0) != p[305]) {
                this.__inputText(str);
                this.__input.$setNativeText("");
                this.$RichText[7] = false;
                p[304] = false;
                p[305] == "";
                p[306] = "";
            } else {
                this.__inputText(str);
                p[306] = str;
            }
        } else if (e.keyCode == 13) {
            this.__inputText("\n");
        } else if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 38 || e.keyCode == 40) {
            if (e.keyCode == 37) {
                if (p[301] == 0) {
                    return;
                }
                p[301]--;
            } else if (e.keyCode == 39) {
                if (p[301] == p[3]) {
                    return;
                }
                p[301]++;
            } else if (e.keyCode == 38) { //输入点上移一行

            } else if (e.keyCode == 40) { //输入点下移一行

            } else if (e.keyCode == 8) {
                if (p[301] == 0) {
                    return;
                }
                this.$deleteCaretChar();
            }
            this.$moveCaretIndex();
        } else {
            var str = this.__input.$getNativeText();
            if (str.length) {
                this.__inputText(str);
                this.__input.$setNativeText("");
            }
        }
    }

    //输入字符
    __inputText(text) {
        //console.log("输入文字:", text);
        var p = this.$RichText;
        this.$setHtmlText(p[1].slice(0, p[302]) + this.__changeText(text) + p[1].slice(p[302], p[1].length), true);
        p[301] += text.length;
        p[302] += this.__changeText(text).length;
        //console.log("输入完后:", p[1].slice(0, p[302]), "\n", p[1].slice(p[302], p[1].length));
    }

    //输入字符
    __inputHtmlText(text) {
        var p = this.$RichText;
        this.$setHtmlText(p[1].slice(0, p[302]) + text + p[1].slice(p[302], p[1].length), true);
        p[301] += this.__getHtmlInputLength(text);
        p[302] += text.length;
    }

    /**
     * 从输入点开始删除一个字符
     * @param num
     */
    $deleteCaretChar() {
        var p = this.$RichText;
        var htmlIndex = p[302];
        p[301]--;
        this.$moveCaretIndex();
        this.htmlText = p[1].slice(0, p[302]) + p[1].slice(htmlIndex, p[1].length);
    }

    $moveCaretIndex() {
    }

    __update(now, gap) {
        var p = this.$RichText;
        p[303] += gap;
        if (p[303] < p[9] * 1000 || Math.floor(p[303] / (p[9] * 1000)) % 2 == 0) {
            p[5].visible = true;
        } else {
            p[5].visible = false;
        }
    }

    __showFocus(info) {
        var p = this.$RichText;
        p[5].visible = true;
        p[5].x = info.focusX;
        p[5].y = info.focusY;
        p[5].height = info.focusHeight;
    }

    __getClickPos() {
        var p = this.$RichText;
        var x = this.lastTouchX;
        var y = this.lastTouchY + p[8];
        var lines = p[2];
        var findLine;
        var res = {
            line: null,
            subline: null,
            display: null,
            charIndex: 0,
            htmlTextIndex: 0,
            focusX: 0,
            focusY: 0,
            focusHeight: p[10]
        };
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.y <= y && line.y + line.height > y || i == lines.length - 1) {
                findLine = line;
                break;
            }
        }
        if (!findLine) {
            return res;
        }
        res.line = findLine;
        res.charIndex = line.charIndex;
        res.htmlTextIndex = line.htmlTextIndex;
        res.focusX = line.x;
        res.focusY = line.y;
        res.focusHeight = line.height;
        x -= line.x;
        y -= line.y;
        var findSubline;
        for (var i = 0; i < findLine.sublines.length; i++) {
            var subline = findLine.sublines[i];
            if (subline.y <= y && subline.y + subline.height > y || i == findLine.sublines.length - 1) {
                findSubline = subline;
                break;
            }
        }
        if (!findSubline) {
            return res;
        }
        res.subline = findSubline;
        res.charIndex += findSubline.charIndex;
        res.htmlTextIndex += findSubline.htmlTextIndex;
        res.focusX += findSubline.x;
        res.focusY += findSubline.y;
        res.focusHeight = findSubline.height;
        x -= subline.x;
        y -= subline.y;
        var findDisplay;
        for (var i = 0; i < findSubline.displays.length; i++) {
            var display = findSubline.displays[i];
            if (x >= display.x && x < display.x + display.width || i == findSubline.displays.length - 1) {
                findDisplay = display;
                break;
            }
        }
        if (!findDisplay) {
            return;
        }
        res.display = findDisplay;
        res.charIndex += findDisplay.charIndex;
        res.htmlTextIndex += findDisplay.htmlTextIndex;
        res.focusX += findDisplay.x;
        x -= findDisplay.x;
        if (findDisplay.type == 0) {
            res.htmlTextIndex += findDisplay.textStart;
            var text = findDisplay.text;
            var size = findDisplay.font.size;
            var width = 0;
            for (var i = 1; i <= text.length; i++) {
                var textWidth = flower.$measureTextWidth(size, text.slice(0, i));
                var charWidth = textWidth - width;
                width = textWidth;
                if (x <= charWidth * 0.5) {
                    break;
                } else {
                    x -= charWidth;
                    res.charIndex++;
                    res.htmlTextIndex++;
                    res.focusX += charWidth;
                }
            }
        } else {
            if (x > findDisplay.width * 0.5) {
                res.charIndex += findDisplay.chars;
                res.htmlTextIndex += findDisplay.htmlText.length;
                res.focusX += findDisplay.width;
            }
        }
        return res;
    }

    $setHtmlText(text) {
        this.__resetCaches();
        this.__clearOldDisplay();
        var p = this.$RichText;
        var ids = p[102];
        for (var key in ids) {
            delete  ids[key];
            delete this[key];
        }
        var container = p[4];
        var lines = p[2];
        lines.length = 0;
        var font = {
            size: p[10],
            color: p[11],
            under: false, //下划线
            gap: p[12],
            sizes: [],
            colors: [],
            unders: [],
            gaps: []
        };
        var line = this.__getNewLine(null, font);
        lines.push(line);
        var last = -1; //上一个 <
        var lastText = "";
        var lastHtmlText = "";
        var lastTextStart = -1;
        for (var i = 0, len = text.length; i < len; i++) {
            var char = text.charAt(i);
            var decodeText = false;
            var addSingle = null;
            var oldFont = font;
            var nextHtmlText = "";
            var single = false;
            lastHtmlText += char;
            if (char == "<") {
                last = i;
            } else if (char == ">") {
                //分析<...>标签里的内容
                var sign = text.slice(last + 1, i);
                var end = false;
                if (sign.charAt(sign.length - 1) == "/") {
                    sign = sign.slice(0, sign.length - 1);
                    single = true;
                }
                var s = 0;
                if (sign.charAt(0) == "/") {
                    end = true;
                    s++;
                }
                var name = "";
                //获取标签名称
                for (; s < sign.length; s++) {
                    char = sign.charAt(s);
                    if (char == " ") {
                        break;
                    } else {
                        name += char;
                    }
                }
                //分析属性
                var attributes = [];
                while (s < sign.length) {
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    //获取属性名称
                    var pos = s;
                    while (sign.charAt(s) != "=" && sign.charAt(s) != " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    var attributeName = sign.slice(pos, s);
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    if (sign.charAt(s) == "=") {
                        s++;
                    } else {
                        break;
                    }
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    //获取引号
                    var begin = sign.charAt(s);
                    if (begin == "\"" || begin == "'") {
                        s++;
                    } else {
                        break;
                    }
                    //获取内容
                    var pos = s;
                    while (sign.charAt(s) != begin && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    var attributeContent = sign.slice(pos, s);
                    s++; //跳过引号
                    attributes.push({
                        name: attributeName,
                        value: attributeContent
                    });
                }
                if (single) { //如果是单个内容，比如<img.../>
                    addSingle = {
                        name: name,
                        attributes: attributes,
                    }
                    if (name == "img") {
                        decodeText = true;
                        addSingle.htmlText = text.slice(last, i + 1);
                        lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                    } else {
                        var isfxml = false;
                        for (var a = 0; a < attributes.length; a++) {
                            if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                isfxml = true;
                                break;
                            }
                        }
                        if (isfxml) {
                            decodeText = true;
                            addSingle.name = "ui";
                            addSingle.htmlText = text.slice(last, i + 1);
                            lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                        }
                    }
                } else {
                    if (end) {
                        if (name == "font") {
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            font.size = font.sizes.pop();
                            font.color = font.colors.pop();
                            font.under = font.unders.pop();
                            font.gap = font.gaps.pop();
                        }
                    } else {
                        if (name == "font") {
                            nextHtmlText = text.slice(last, i + 1);
                            lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - nextHtmlText.length);
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            font.sizes.push(font.size);
                            font.colors.push(font.color);
                            font.unders.push(font.under);
                            font.gaps.push(font.gap);
                            for (var a = 0; a < attributes.length; a++) {
                                if (attributes[a].name == "size") {
                                    if (parseInt(attributes[a].value)) {
                                        font.size = parseInt(attributes[a].value);
                                    }
                                } else if (attributes[a].name == "color") {
                                    if (attributes[a].value.charAt(0) == "#") {
                                        font.color = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                    }
                                }
                            }
                        } else {
                            var isfxml = false;
                            for (var a = 0; a < attributes.length; a++) {
                                if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                    isfxml = true;
                                    break;
                                }
                            }
                            if (isfxml) {
                                single = true;
                                addSingle = {
                                    name: "ui",
                                    attributes: attributes,
                                }
                                i = this.__findFXML(text, last);
                                addSingle.htmlText = text.slice(last, i + 1);
                                decodeText = true;
                                lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                            }
                        }
                    }
                }
                last = -1;
            } else {
                if (last == -1) {
                    lastText += char;
                    if (lastTextStart == -1) {
                        lastTextStart = lastHtmlText.length - 1;
                    }
                }
            }
            if (i == len - 1) {
                decodeText = true;
            }
            var newLine = false;
            if (char == "\n" || char == "\r" || text.slice(i, i + "<br/>".length) == "<br/>") {
                newLine = true;
                decodeText = true;
                if (char == "\n" || char == "\r") {
                    line.endHtmlText = char;
                } else if (text.slice(i, i + "<br/>".length) == "<br/>") {
                    line.endHtmlText = "<br/>";
                    lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - 1);
                }
            }
            if (decodeText) {
                this.__decodeText(line, oldFont, lastText, lastHtmlText, lastTextStart);
                lastHtmlText = "";
                lastText = "";
                lastTextStart = -1;
                if (single) {
                    if (addSingle.name == "img") {
                        this.__decodeImage(line, addSingle.attributes, addSingle.htmlText);
                    } else if (addSingle.name == "ui") {
                        this.__decodeUI(line, addSingle.attributes, addSingle.htmlText);
                    }
                }
                if (newLine) {
                    line.chars++;
                    line = this.__getNewLine(line, font);
                    lines.push(line);
                }
            }
            if (newLine && text.slice(i, i + "<br/>".length) == "<br/>") {
                i += "<br/>".length - 1;
            }
            lastHtmlText += nextHtmlText;
        }
        p[1] = "";
        p[3] = 0;
        for (var i = 0; i < lines.length; i++) {
            p[1] += lines[i].htmlText + lines[i].endHtmlText;
            p[3] += lines[i].chars;
        }
        p[100] = true;
    }

    __findFXML(text, start) {
        var name = "";
        var len = text.length;
        for (var i = start + 1; i < len; i++) {
            if (text.charAt(i) == " " || text.charAt(i) == ">" || text.charAt(i) == "/") {
                name = text.slice(start + 1, i);
                break;
            }
        }
        var flag = 1;
        var num1 = name.length + 1;
        var num2 = name.length + 2;
        var sign1 = "<" + name;
        var sign2 = "</" + name;
        for (var i = start + 1 + name.length; i < len; i++) {
            if (text.slice(i, i + num1) == sign1) {
                flag++;
            }
            if (text.slice(i, i + num2) == sign2) {
                flag--;
                if (flag == 0) {
                    for (; i < len; i++) {
                        if (text.charAt(i) == ">") {
                            break;
                        }
                    }
                    return i;
                }
            }
        }
        return start;
    }

    __clearOldDisplay() {
        var p = this.$RichText;
        var lines = p[2];
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l];
            for (var s = 0; s < line.sublines.length; s++) {
                var subline = line.sublines[s];
                var displays = subline.displays;
                for (var d = 0; d < displays.length; d++) {
                    var item = displays[d];
                    if (item.type == 0 && item.display) {
                        item.display.dispose();
                    }
                }
            }
        }
    }

    __decodeText(line, font, text, htmlText, textStart) {
        var p = this.$RichText;
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var width = flower.$measureTextWidth(font.size, text);
        if (p[13]) {
            var max = this.width;
        } else {
            var item = {
                type: 0,
                display: null,
                font: font,
                text: text,
                htmlText: htmlText,
                htmlTextIndex: subline.htmlText.length,
                textStart: textStart,
                width: width,
                height: font.size,
                x: subline.positionX,
                charIndex: subline.chars,
                chars: text.length,
                subline: subline
            };
            subline.chars += item.chars;
            line.chars += item.chars;
            if (item.height + subline.gap > subline.height) {
                var oldHeight = subline.height;
                subline.height = item.height + subline.gap;
                line.height += subline.height - oldHeight;
                line.positionY += subline.height - oldHeight;
            }
            subline.width += item.width;
            if (subline.width > line.width) {
                line.width = subline.width;
            }
            subline.text += item.text;
            line.text += item.text;
            subline.htmlText += item.htmlText;
            line.htmlText += item.htmlText;
            subline.positionX += item.width;
            subline.displays.push(item);
        }
    }

    __decodeImage(line, attributes, htmlText) {
        var p = this.$RichText;
        var ids = p[102];
        var id = "";
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].name == "id") {
                id = attributes[i].value;
            }
        }
        var caches = p[101];
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var image;
        var cache;
        if (!caches[htmlText]) {
            caches[htmlText] = [];
        }
        if (caches[htmlText].length) {
            for (var i = 0; i < caches[htmlText].length; i++) {
                if (caches[htmlText][i].use == false) {
                    image = caches[htmlText][i].display;
                    caches[htmlText][i].use = true;
                    cache = caches[htmlText][i];
                }
            }
        }
        if (!image) {
            var url = "";
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].name == "src") {
                    url = attributes[i].value;
                }
            }
            image = new flower.Bitmap();
            if (url != "") {
                var loader = new flower.URLLoader(url);
                loader.load();
                loader.addListener(flower.Event.COMPLETE, function (e) {
                    if (image.isDispose) {
                        return;
                    }
                    image.texture = e.data;
                    cache.width = image.width;
                    cache.height = image.height;
                    this.$setHtmlText(p[1]);
                }, this);
            }
            cache = {
                use: true,
                display: image,
                loader: loader
            };
            caches[htmlText].push(cache);
        }
        if (id != "") {
            ids[id] = image;
            if (!this[id]) {
                this[id] = image;
            }
        }
        if (p[13]) {
            if (subline.width + image.width > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = image.width;
        cache.height = image.height;
        var item = {
            type: 1,
            display: image,
            text: "",
            htmlText: htmlText,
            htmlTextIndex: subline.htmlText.length,
            textStart: 0,
            width: image.width,
            height: image.height,
            x: subline.positionX,
            charIndex: subline.chars,
            chars: 1,
            subline: subline
        };
        subline.chars += item.chars;
        line.chars += item.chars;
        if (item.height + subline.gap > subline.height) {
            var oldHeight = subline.height;
            subline.height = item.height + subline.gap;
            line.height += subline.height - oldHeight;
            line.positionY += subline.height - oldHeight;
        }
        subline.width += item.width;
        if (subline.width > line.width) {
            line.width = subline.width;
        }
        subline.text += item.text;
        line.text += item.text;
        subline.htmlText += item.htmlText;
        line.htmlText += item.htmlText;
        subline.positionX += item.width;
        subline.displays.push(item);
    }

    __decodeUI(line, attributes, htmlText) {
        var p = this.$RichText;
        var ids = p[102];
        var id = "";
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].name == "id") {
                id = attributes[i].value;
            }
        }
        var caches = p[101];
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var ui;
        var cache;
        if (!caches[htmlText]) {
            caches[htmlText] = [];
        }
        if (caches[htmlText].length) {
            for (var i = 0; i < caches[htmlText].length; i++) {
                if (caches[htmlText][i].use == false) {
                    ui = caches[htmlText][i].display;
                    caches[htmlText][i].use = true;
                    cache = caches[htmlText];
                    break;
                }
            }
        }
        if (!ui) {
            ui = new flower.UIParser();
            ui.percentWidth = null;
            ui.percentHeight = null;
            ui.parseUI(htmlText);
            cache = {
                use: true,
                display: ui
            };
            caches[htmlText].push(cache);
        }
        if (id != "") {
            ids[id] = ui;
            if (!this[id]) {
                this[id] = ui;
            }
        }
        if (p[13]) {
            if (subline.width + ui.width > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = ui.width;
        cache.height = ui.height;
        var item = {
            type: 1,
            display: ui,
            text: "",
            htmlText: htmlText,
            htmlTextIndex: subline.htmlText.length,
            textStart: 0,
            width: ui.width,
            height: ui.height,
            x: subline.positionX,
            charIndex: subline.chars,
            chars: 1,
            subline: subline
        };
        subline.chars += item.chars;
        line.chars += item.chars;
        if (item.height + subline.gap > subline.height) {
            var oldHeight = subline.height;
            subline.height = item.height + subline.gap;
            line.height += subline.height - oldHeight;
            line.positionY += subline.height - oldHeight;
        }
        subline.width += item.width;
        if (subline.width > line.width) {
            line.width = subline.width;
        }
        subline.text += item.text;
        line.text += item.text;
        subline.htmlText += item.htmlText;
        line.htmlText += item.htmlText;
        subline.positionX += item.width;
        subline.displays.push(item);
    }

    __resetCaches() {
        var caches = this.$RichText[101];
        for (var key in caches) {
            var list = caches[key];
            for (var i = 0; i < list.length; i++) {
                list[i].use = false;
            }
        }
    }

    __clearCaches() {
        var caches = this.$RichText[101];
        for (var key in caches) {
            var list = caches[key];
            while (list.length) {
                if (list[list.length - 1].use == false) {
                    var item = list.pop();
                    item.display.dispose();
                } else {
                    break;
                }
            }
        }
        var keys = flower.ObjectDo.keys(caches);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (caches[key].length == 0) {
                delete caches[key];
            }
        }
    }

    __getNewLine(lastLine, font) {
        var line;
        line = {
            index: 0,
            text: "",
            htmlText: "",
            endHtmlText: "",
            htmlTextIndex: 0,
            width: 0,
            height: font.size,
            x: 0,
            y: 0,
            charIndex: 0,
            chars: 0,
            sublines: [],
            positionY: 0,
        };
        if (lastLine) {
            line.y = lastLine.y + lastLine.height;
            line.htmlTextIndex = lastLine.htmlTextIndex + lastLine.htmlText.length + lastLine.endHtmlText.length;
            line.charIndex = lastLine.charIndex + lastLine.chars;
            line.height = font.size + font.gap;
        }
        return line;
    }

    __addSubLine(line, font) {
        var subline = {
            index: line.sublines.length,
            text: "",
            htmlText: "",
            htmlTextIndex: line.htmlText.length,
            width: 0,
            gap: (line.index == 0 && line.sublines.length == 0 ? 0 : font.gap),
            height: font.size + (line.index == 0 && line.sublines.length == 0 ? 0 : font.gap),
            x: 0,
            y: line.positionY,
            charIndex: line.chars,
            chars: 0,
            displays: [],
            line: line,
            positionX: 0
        };
        line.sublines.push(subline);
        line.positionY += subline.height;
    }

    __getDefaultFocus() {
        var rect = new flower.Rect();
        rect.fillColor = 0;
        rect.width = 2;
        rect.height = 12;
        rect.visible = false;
        return rect;
    }

    __setFontSize(val) {
        val = +val || 0;
        var p = this.$RichText;
        if (val == p[10]) {
            return;
        }
        p[10] = val;
    }

    __setFontColor(val) {
        val = +val || 0;
        var p = this.$RichText;
        if (val == p[11]) {
            return;
        }
        p[11] = val;
    }

    __setHtmlText(val) {
        var p = this.$RichText;
        if (p[6] == val) {
            return;
        }
        this.$setHtmlText(val);
    }

    __setText(val) {
        var val = this.__changeText(val);
        this.__setHtmlText(val);
    }

    __setWordWrap(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        var p = this.$RichText;
        if (p[13] == val) {
            return;
        }
        p[13] = val;
        this.$setHtmlText(p[1]);
    }

    __changeText(val) {
        for (var i = 0; i < val.length; i++) {
            var char = val.charAt(i);
            if (char == " ") {
                val = val.slice(0, i) + "&nbsp;" + val.slice(i + 1, val.length);
            } else if (char == "<") {
                val = val.slice(0, i) + "&lt;" + val.slice(i + 1, val.length);
            } else if (char == ">") {
                val = val.slice(0, i) + "&gt;" + val.slice(i + 1, val.length);
            } else if (char == "&") {
                val = val.slice(0, i) + "&amp;" + val.slice(i + 1, val.length);
            }
        }
        return val;
    }

    __changeRealText(val) {
        for (var i = 0; i < val.length; i++) {
            if (val.slice(i, i + 5) == "&amp;") {
                val = val.slice(0, i) + "&" + val.slice(i + 5, val.length);
            } else if (val.slice(i, i + 6) == "&nbsp;") {
                val = val.slice(0, i) + " " + val.slice(i + 6, val.length);
            } else if (val.slice(i, i + 4) == "&lt;") {
                val = val.slice(0, i) + "<" + val.slice(i + 4, val.length);
            } else if (val.slice(i, i + 4) == "&gt;") {
                val = val.slice(0, i) + ">" + val.slice(i + 4, val.length);
            } else if (val.slice(i, i + 5) == "<br/>") {
                val = val.slice(0, i) + "\n" + val.slice(i + 5, val.length);
            }
        }
        return val;
    }

    $onFrameEnd() {
        var p = this.$RichText;
        if (p[100]) {
            p[100] = false;
            var lines = p[2];
            var y = p[8];
            var container = p[4];
            container.removeAll();
            var height = this.height;
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                if (line.y <= y + height && line.y + line.height < y + height) {
                    for (var s = 0; s < line.sublines.length; s++) {
                        var subline = line.sublines[s];
                        if (subline.y <= y + height && subline.y + subline.height < y + height) {
                            var displays = subline.displays;
                            for (var d = 0; d < displays.length; d++) {
                                var item = displays[d];
                                var display = item.display;
                                if (item.type == 0) {
                                    if (!display) {
                                        display = new flower.TextField(item.text);
                                        display.fontSize = item.font.size;
                                        display.fontColor = item.font.color;
                                        item.display = display;
                                    }
                                }
                                container.addChild(item.display);
                                display.x = item.x;
                                display.y = line.y + subline.y + subline.height - item.height;
                            }
                        }
                    }
                }
            }
            this.__clearCaches();
        }
        super.$onFrameEnd();
    }

    $update() {
        var p = this.$RichText;
        var caches = p[101];
        var flag = false;
        for (var key in caches) {
            var list = caches[key];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.width != item.display.width || item.height != item.display.height) {
                    flag = true;
                    item.width = item.display.width;
                    item.height = item.display.height;
                }
            }
        }
        if (flag) {
            this.$setHtmlText(p[1]);
        }
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

    dispose() {
        this.__resetCaches();
        this.__clearCaches();
        flower.EnterFrame.remove(this.$update, this);
        super.dispose();
    }

    get fontSize() {
        return this.$RichText[10];
    }

    set fontSize(val) {
        this.__setFontSize(val);
    }

    get fontColor() {
        return this.$RichText[11];
    }

    set fontColor(val) {
        this.__setFontColor(val);
    }

    get htmlText() {
        return this.$RichText[1];
    }

    set htmlText(val) {
        this.__setHtmlText(val);
    }

    get text() {
        return this.$RichText[0];
    }

    set text(val) {
        this.__setText(val);
    }

    get wordWrap() {
        return this.$RichText[13];
    }

    set wordWrap(val) {
        this.__setWordWrap(val);
    }

    get displays() {
        return this.$RichText[102];
    }
}

exports.RichText = RichText;