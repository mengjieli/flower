/**
 * 富文本编辑器
 *
 *
 * tags: [
 *    "name": "font", //标签类型
 *    "attributes":[
 *      {"name":"fontSize","value":"12"}
 *    ],
 *    "text":"这是第一行", //文字内容
 *    "htmlText":"<font fontSize="12">这是第一行</font>",
 *    "lines" : [
 *      {
 *              "text":"这是第一行", //这一行的内容
 *              "htmlText":"<font color='#ff0000'>这是第一行</font>", //这一行的 htmlText 内容
 *              "width":100,  //这一行的宽度
 *              "height":12,  //这一行的高度
 *              "x":0, //起点在全文中的位置 x
 *              "y":0, //起点在全文中的位置 y
 *              "displays": [
 *                  {
 *                       "type": 0 , //显示对象类型  0.文字  1.图片
 *                      "text":"这是第一行", //显示内容
 *                      "htmlText":"<font color='#ff0000'>这是第一行</font>", //显示的 htmlText 内容
 *                      "width":100, //显示对象宽
 *                      "height":12, //显示对象的高度
 *                      "x":0, //起点在这一行中的位置 x
 *                      "y":0,  //起点在这一行中的位置 y
 *                      "color":0, //文字颜色
 *                      "size":12, //文字大小
 *                  }
 *             ]
 *      }
 *  ]
 * ]
 *
 *
 *
 * "lines" : [
 *      {
 *              "text":"这是第一行", //这一行的内容
 *              "htmlText":"<font color='#ff0000'>这是第一行</font>", //这一行的 htmlText 内容
 *              "width":100,  //这一行的宽度
 *              "height":12,  //这一行的高度
 *              "x":0, //起点在全文中的位置 x
 *              "y":0, //起点在全文中的位置 y
 *              "displays": [
 *                  {
 *                       "type": 0 , //显示对象类型  0.文字  1.图片
 *                      "text":"这是第一行", //显示内容
 *                      "htmlText":"<font color='#ff0000'>这是第一行</font>", //显示的 htmlText 内容
 *                      "width":100, //显示对象宽
 *                      "height":12, //显示对象的高度
 *                      "x":0, //起点在这一行中的位置 x
 *                      "y":0,  //起点在这一行中的位置 y
 *                      "color":0, //文字颜色
 *                      "size":12, //文字大小
 *                  }
 *             ]
 *      }
 *  ]
 */
class RichText extends Group {

    constructor() {
        super();
        this.$RichText = {
            0: "", //text
            1: "", //htmlText
            2: false,  //isInputting
            3: [], //lines
            4: 0,  //posY
            5: "", //lastHtmlText
            8: "", //lastInputText
            10: 0,  //fontColor
            11: 12, //fontSize
            12: false, //wordWrap 是否自动换行
            29: new flower.Sprite(),
            30: "", //229 firstChar
            31: false, // is 229
            33: this.__getDefaultFocus(),//focus
            34: 0, //0.不需要刷新  1.表示某一行改变  2.表示显示内容上下移动  3.全部刷新
            35: 0, //0.无 1.改变的行数 2.旧的显示位置y 3.无
            36: 0, //input time
            37: null, //input line
            38: null, //input display
            39: null, //input displayLine
            40: null, //input htmlIndex
        };
        this.addChild(this.$RichText[29]);
        this.addChild(this.$RichText[33]);
        this.focusEnabled = true;
        this.width = this.height = 100;
        this.addListener(flower.Event.FOCUS_IN, this.$startInput, this);
        this.addListener(flower.Event.FOCUS_OUT, this.$stopInput, this);
        this.__input = flower.Stage.getInstance().$input;
    }

    __getDefaultFocus() {
        var rect = new flower.Rect();
        rect.fillColor = 0;
        rect.width = 0.5;
        rect.height = 12;
        rect.visible = false;
        return rect;
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

    $startInput() {
        if (this.$RichText[2]) {
            return;
        }
        this.$RichText[2] = true;
        this.__input.text = "";
        this.__input.$startNativeInput();
        this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.add(this.__update, this);
        this.__showFocus();
        this.__measureInputPos();
    }

    __measureInputPos() {
        var p = this.$RichText;
        var focus = p[33];
        var lines = p[3];
        var x = this.lastTouchX;
        var y = this.lastTouchY;
        var find = false;
        var inputLine;
        var inputDLine;
        var inputDisplay;
        var inputIndex;
        var inputX;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (y >= line.y && y < line.y + line.height) {
                y -= line.y;
                var displayLines = line.displayLines;
                for (var dl = 0; dl < displayLines.length; dl++) {
                    var dline = displayLines[dl];
                    if (y >= dline.y && y <= dline.y + dline.height) {
                        var displays = dline.displays;
                        for (var d = 0; d < displays.length; d++) {
                            var display = displays[d];
                            if (x > display.x && x <= display.x + display.width) {
                                focus.x = display.x + line.x + dline.x;
                                focus.y = line.y + dline.y;
                                focus.height = dline.height
                                find = true;
                                inputLine = line;
                                inputDLine = dline;
                                inputDisplay = display;
                                inputX = x - display.x - dline.x;
                                break;
                            } else if (d == displays.length - 1) {
                                focus.x = display.x + line.x + dline.x;
                                focus.y = line.y + dline.y;
                                focus.height = dline.height;
                                find = true;
                                inputLine = line;
                                inputDLine = dline;
                                inputDisplay = display;
                                inputX = x - display.x - dline.x;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        if (!find) {
            var line = lines[lines.length - 1];
            var dline = line.displayLines[line.displayLines.length - 1];
            var display = dline.displays[dline.displays.length - 1];
            focus.x = display.x + line.x + dline.x;
            focus.y = line.y + dline.y;
            focus.height = dline.height;
            inputLine = line;
            inputDLine = dline;
            inputDisplay = display;
            inputX = x - display.x - dline.x;
        }
        if (inputDisplay.type != 0) {
            if (inputX < inputDisplay.width / 2) {
                var fontDisplay = inputDisplay.font;
                var fontBefore = null;
                var displayBefore = null;
                var index;
                for (var dl = 0; dl < line.displayLines.length; dl++) {
                    for (var d = 0; d < line.displayLines[dl].displays.length; d++) {
                        if (line.displayLines[dl].displays[d] != inputDisplay) {
                            displayBefore = line.displayLines[dl].displays[d];
                        } else {
                            index = d;
                            break;
                        }
                    }
                }
                if (displayBefore) {
                    fontBefore = displayBefore.font;
                } else {
                    var font = fontDisplay;
                    var item = {
                        "type": 0,
                        "text": "",
                        "htmlText": "",
                        "width": 0,
                        "height": font.size,
                        "x": focus.x,
                        "display": null,
                        "font": font
                    };
                    inputDLine.displays.splice(index, 0, item);
                    inputDisplay = item;
                    inputIndex = 0;
                }
            } else {
                focus.x += display.width;
            }
        } else {
            var text = display.text;
            var size = display.font.size;
            var lastWidth = 0;
            var find = false;
            inputIndex = 0;
            for (var i = 1; i <= text.length; i++) {
                var textWidth = flower.$measureTextWidth(size, text.slice(0, i));
                var charWidth = textWidth - lastWidth;
                if (inputX - lastWidth < charWidth / 2) {
                    focus.x += lastWidth;
                    find = true;
                    break;
                }
                inputIndex++;
                lastWidth = textWidth;
            }
            if (!find) {
                focus.x += lastWidth;
            }
        }
        p[37] = inputLine;
        p[38] = inputDLine;
        p[39] = inputDisplay;
        p[40] = inputIndex;
        var inputTextPos = 0;
        var inputHtmlTextPos = 0;
        var find = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var displayLines = line.displayLines;
            for (var dl = 0; dl < displayLines.length; dl++) {
                var dline = displayLines[dl];
                var displays = dline.displays;
                for (var d = 0; d < displays.length; d++) {
                    var display = displays[d];
                    if (inputDisplay == display) {
                        find = true;
                        break;
                    } else {
                        if (display.type == 0) {
                            inputTextPos += display.text.length;
                        } else {
                            inputTextPos += 0;
                        }
                        inputHtmlTextPos += display.htmlText.length;
                    }
                }
                if (find) {
                    break;
                }
            }
            if (find) {
                break;
            }
            inputHtmlTextPos += line.endHtmlText.length;
        }
        inputTextPos += inputIndex;
        inputHtmlTextPos += inputDisplay.textStart + inputIndex;
        p[41] = inputTextPos;
        p[42] = inputHtmlTextPos;
    }

    //输入字符
    __inputText(text) {
        text = this.__changeText(text);
        var p = this.$RichText;
        var txt = p[39];
        this.htmlText = p[1].slice(0, p[42]) + text + p[1].slice(p[42], p[1].length);
        p[41] += text.length;
        p[42] += text.length;

    }

    __showFocus() {
        var focus = this.$RichText[33];
        focus.visible = true;
        this.$RichText[36] = 0;
    }

    __hideFocus() {
        this.$RichText[33].visible = false;
    }

    $stopInput() {
        this.$RichText[2] = false;
        this.__input.$stopNativeInput();
        this.removeListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.remove(this.__update, this);
        this.__hideFocus();
    }

    __inputLine(line, htmlText) {

    }

    __update(now, gap) {
        var p = this.$RichText;
        p[36] += gap;
        if (p[36] < 500 || Math.floor(p[36] / 500) % 2 == 0) {
            p[33].visible = true;
        } else {
            p[33].visible = false;
        }
        var str = this.__input.$getNativeText();
        if (p[31]) {
            if (p[30] == "") {
                if (str.length) {
                    p[30] = str.charAt(0);
                }
            } else {
                if (!str.length || str.charAt(0) != p[30]) {
                    this.__inputText(str);
                    this.__input.$setNativeText("");
                    this.$RichText[7] = false;
                    p[31] = false;
                    p[30] == "";
                }
            }
        } else {
            if (str != "") {
                this.__inputText(str);
                this.__input.$setNativeText("");
            }
        }
    }

    __onKeyDown(e) {
        if (e.keyCode == 229) {
            if (!this.$RichText[31]) {
                this.$RichText[31] = true;
                this.$RichText[30] = "";
            }
        }
    }

    $setHtmlText(text, decodeHtml) {
        //var list = flower.StringDo.split(text, ["\r", "\n", "<br/>"]);
        var p = this.$RichText;
        if (p[5] == text) {
            return;
        }
        p[5] = text;
        var lines = p[3];
        lines.length = 0;
        var line = {
            "index": 0,
            "lineCount": 1,
            "text": "",
            "htmlText": "",
            "endHtmlText": "",
            "width": 0,
            "height": 0,
            "x": 0,
            "y": 0,
            "align": "left",
            "displayLines": [{
                "width": 0,
                "height": 0,
                "x": 0,
                "y": 0,
                "displays": []
            }],
            "displays": [],
            "posX": 0
        };
        var signs = [];
        var last = -1;
        var textContent = "";
        var textStart = 0;
        var lastTextStart = -1;
        var lastHtmlTextStart = 0;
        var nextHtmlTextStart = 0;
        var font = {
            color: p[10],
            size: p[11],
            colors: [p[10]],
            sizes: [p[11]],
            under: 0 //下划线
        };
        var lineHtml = "";
        var elementHtml = "";
        var signHtml = "";
        for (var i = 0, len = text.length; i < len; i++) {
            var char = text.charAt(i);
            var textChange = false;
            var addSingle = null;
            var oldFont = font;
            lineHtml += char;
            elementHtml += char;
            if (char == "<" && decodeHtml) {
                last = i;
            } else if (char == ">" && decodeHtml && last != -1) { //找到 <...>  结构
                //1. 分析标签名称
                var content = text.slice(last + 1, i);
                var name = null;
                var end = content.charAt(0) == "/" ? true : false;
                var single = content.charAt(content.length - 1) == "/" ? true : false;
                if (content.charAt(0) == "/") {
                    content = content.slice(1, content.length);
                }
                if (content.charAt(content.length - 1) == "/") {
                    content = content.slice(0, content.length - 1);
                }
                var clen = content.length;
                for (var c = 0; c < content.length; c++) {
                    if (content.charAt(c) == " ") {
                        name = content.slice(0, c);
                        break;
                    }
                }
                if (!name) {
                    name = content;
                }
                var attributes = [];
                //2. 分析属性
                if (!end) {
                    var c = name.length;
                    while (c < content.length) {
                        //跳过空格
                        while (content.charAt(c) == " ") {
                            c++;
                        }
                        //获取名称
                        var pos = c;
                        while ((content.charAt(c) != "=" && content.charAt(c) != " ") && c < clen) {
                            c++;
                        }
                        if (c == content.length) {
                            break;
                        }
                        var attributeName = content.slice(pos, c);
                        //跳过空格
                        while (content.charAt(c) == " ") {
                            c++;
                        }
                        if (content.charAt(c) != "=") {
                            break;
                        }
                        //跳过 =
                        c++;
                        //跳过空格
                        while (content.charAt(c) == " ") {
                            c++;
                        }
                        if (content.charAt(c) != "\"" && content.charAt(c) != "'") {
                            break;
                        }
                        var begin = content.charAt(c);
                        //跳过引号
                        c++;
                        pos = c;
                        //获取属性
                        while (content.charAt(c) != begin && c < clen) {
                            c++;
                        }
                        if (c == content.length) {
                            break;
                        }
                        var attributeValue = content.slice(pos, c);
                        c++;
                        attributes.push({
                            "name": attributeName,
                            "value": attributeValue
                        });
                    }
                }
                //如果是单独的标签，比如 <img url="http://192.168.0.1:10000/res/a.png"/>
                if (single) {
                    if (name == "img") {
                        textChange = true;
                        nextHtmlTextStart = i + 1;
                        addSingle = {
                            name: name,
                            attributes: attributes
                        };
                    }
                } else {
                    if (!end) {
                        signs.push({
                            name: name,
                            attributes: attributes,
                            font: font
                        });
                        font = flower.ObjectDo.clone(font);
                        if (name == "font") {
                            textChange = true;
                            nextHtmlTextStart = last;
                            for (var a = 0; a < attributes.length; a++) {
                                if (attributes[a].name == "size") {
                                    if (parseInt(attributes[a].value)) {
                                        font.size = parseInt(attributes[a].value);
                                        font.sizes.push(font.size);
                                    }
                                } else if (attributes[a].name == "color") {
                                    if (attributes[a].value.charAt(0) == "#") {
                                        font.color = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                        font.colors.push(font.color);
                                    }
                                }
                            }
                        }
                    } else {
                        if (signs.length && name == signs[signs.length - 1].name) {
                            if (name == "font") {
                                textChange = true;
                                nextHtmlTextStart = i + 1;
                                oldFont = font;
                            }
                            font = signs.pop().font;
                        }
                    }
                }
                if (textChange && !end) {
                    signHtml = text.slice(last, i + 1);
                }
                if (lastTextStart == -1) {
                    lastTextStart = textStart;
                }
                textContent += text.slice(textStart, last);
                textStart = i + 1;
                last = -1;
            }
            var newLine = false;
            if (char == "\r" || char == "\n" || text.slice(i, i + 5) == "<br/>") {
                newLine = true;
                if (lastTextStart == -1) {
                    lastTextStart = textStart;
                }
                textContent += text.slice(textStart, i);
                if (text.slice(i, i + 5) == "<br/>") {
                    textStart = i + 5;
                    i += 4;
                    elementHtml += "br/>";
                    signHtml = "<br/>";
                    line.endHtmlText = "<br/>";
                } else {
                    textStart = i + 1;
                    signHtml = char;
                    line.endHtmlText = char;
                }
                lineHtml = lineHtml.slice(0, lineHtml.length - 1);
                nextHtmlTextStart = i + 1;
            }
            if (i == text.length - 1) {
                if (lastTextStart == -1) {
                    lastTextStart = textStart;
                }
                textContent += text.slice(textStart, last != -1 ? last : text.length);
            }
            //如果需要截断文字
            if (textChange || newLine || i == text.length - 1) {
                var deviceText = "";
                if (textChange && !end || newLine) {
                    deviceText = signHtml;
                    elementHtml = elementHtml.slice(0, elementHtml.length - deviceText.length);
                    if (newLine) {
                        deviceText = "";
                    }
                }
                if (elementHtml.length) {
                    //分析之前的文字
                    this.$decodeTextDisplay(line, textContent, oldFont, elementHtml, lastTextStart - lastHtmlTextStart);
                }
                lastTextStart = -1;
                lastHtmlTextStart = nextHtmlTextStart;
                elementHtml = deviceText;
                textContent = "";
                if (i == text.length - 1 || newLine) {
                    lines.push(line);
                }
                if (newLine || i == text.length - 1) {
                    this.$decodeTextDisplay(line, "", oldFont, "", 0);
                    line.htmlText = lineHtml;
                    lineHtml = "";
                }
                if (newLine) {
                    line = {
                        "index": line.index + line.lineCount,
                        "lineCount": 1,
                        "text": "",
                        "htmlText": "",
                        "endHtmlText": "",
                        "x": 0,
                        "y": line.y + line.height,
                        "width": 0,
                        "height": 0,
                        "align": "left",
                        "displayLines": [{
                            "width": 0,
                            "height": 0,
                            "x": 0,
                            "y": 0,
                            "displays": []
                        }],
                        "posX": 0
                    };
                }
            }
            if (addSingle) {
                if (addSingle.name == "img") {
                    this.$addImage(line, addSingle.attributes, oldFont, elementHtml);
                    elementHtml = "";
                }
                lastHtmlTextStart = nextHtmlTextStart;
                lastTextStart = -1;
            }
        }
        p[34] = 3;
        var text = "";
        var htmlText = "";
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var displayLines = line.displayLines;
            for (var dl = 0; dl < displayLines.length; dl++) {
                var dline = displayLines[dl];
                var displays = dline.displays;
                for (var d = 0; d < displays.length; d++) {
                    var display = displays[d];
                    text += display.text;
                    htmlText += display.htmlText;
                }
            }
            htmlText += line.endHtmlText;
        }
        p[0] = text;
        p[1] = htmlText;
    }

    $decodeTextDisplay(line, text, font, htmlText, htmlStart) {
        var p = this.$RichText;
        var item;
        //var txt;
        var displayLine = line.displayLines[line.displayLines.length - 1];
        if (p[12]) {
        } else {
            item = {
                "type": 0,
                "text": text,
                "htmlText": htmlText,
                "textStart": htmlStart,
                "width": flower.$measureTextWidth(font.size, text),
                "height": font.size,
                "x": line.posX,
                "display": null,
                "font": font
            };
            displayLine.displays.push(item);
            displayLine.width = displayLine.width > item.x + item.width ? displayLine.width : item.x + item.width;
            displayLine.height = displayLine.height > item.height ? displayLine.height : item.height;
            line.width = line.width > displayLine.width ? line.width : displayLine.width;
            line.height = line.height > displayLine.y + displayLine.height ? line.height : displayLine.y + displayLine.height;
            line.posX += item.width;
            line.text += item.text;
        }
    }

    $addImage(line, attributes, font, htmlText) {
        var p = this.$RichText;
        var item;
        var bitmap;
        var displayLine = line.displayLines[line.displayLines.length - 1];
        bitmap = new flower.Bitmap();
        var url = "";
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].name == "src") {
                url = attributes[i].value;
            } else if (attributes[i].name == "width") {
                bitmap.width = parseInt(attributes[i].value);
            } else if (attributes[i].name == "height") {
                bitmap.height = parseInt(attributes[i].value);
            }
        }
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.$loadImageComplete, this);
        item = {
            "type": 1,
            "text": "",
            "htmlText": htmlText,
            "width": 0,
            "height": 0,
            "x": line.posX,
            "display": bitmap,
            "loader": loader,
            "font": font
        }
        displayLine.displays.push(item);
        displayLine.width = displayLine.width > item.x + item.width ? displayLine.width : item.x + item.width;
        displayLine.height = displayLine.height > item.height ? displayLine.height : item.height;
        line.width = line.width > displayLine.width ? line.width : displayLine.width;
        line.height = line.height > displayLine.y + displayLine.height ? line.height : displayLine.y + displayLine.height;
        line.posX += item.width;
        this.text += item.text;
    }

    $loadImageComplete(e) {
        var p = this.$RichText;
        var lines = p[3];
        var flag = false;
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l];
            var displayLines = line.displayLines;
            for (var dl = 0; dl < displayLines.length; dl++) {
                var displayLine = displayLines[dl];
                var displays = displayLine.displays;
                line.posX = 0;
                for (var d = 0; d < displays.length; d++) {
                    if (item.type == 1 && item.loader == e.currentTarget) {
                        var bitmap = item.display;
                        bitmap.texture = e.data;
                        item.width = bitmap.width + 2;
                        item.height = bitmap.height;
                        displayLine.height = displayLine.height > item.height ? displayLine.height : item.height;
                        line.height = line.height > displayLine.y + displayLine.height ? line.height : displayLine.y + displayLine.height;
                        line.posX += item.width;
                        flag = true;
                        p[34] = 3;
                    } else {
                        item.x = line.posX;
                    }
                    line.posX = item.x + item.width;
                    displayLine.width = displayLine.width > item.x + item.width ? displayLine.width : item.x + item.width;
                    line.width = line.width > displayLine.width ? line.width : displayLine.width;
                }
            }
            if (l) {
                line.y = lines[l - 1].y + lines[l - 1].height;
            }
        }
        p[34] = 3;
    }

    $onFrameEnd() {
        var p = this.$RichText;
        if (p[34]) {
            var y = p[4];
            var lines = p[3];
            var container = p[29];
            var flag = false;
            if (p[34] == 3) {
                container.removeAll();
                for (var l = 0; l < lines.length; l++) {
                    var line = lines[l];
                    var displayLines = line.displayLines;
                    for (var dl = 0; dl < displayLines.length; dl++) {
                        var displayLine = displayLines[dl];
                        var displays = displayLine.displays;
                        if (line.y >= y) {
                            //开始显示
                            for (var d = 0; d < displays.length; d++) {
                                var item = displays[d];
                                if (item.type == 0 && !item.display) {
                                    var txt = new flower.TextField(item.text);
                                    txt.fontSize = item.font.size;
                                    txt.fontColor = item.font.color;
                                    item.display = txt;
                                }
                                container.addChild(item.display);
                                item.display.x = item.x + (item.type == 1 ? 1 : 0);
                                item.display.y = line.y + displayLine.y + displayLine.height - item.height;
                            }
                        }
                        if (line.y + displayLine.y + displayLine.height > y + this.height) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
            }
            p[34] = 0;
        }
        super.$onFrameEnd();
    }

    setText(val) {
        var p = this.$RichText;
        p[0] = val;
        val = this.__changeText(val);
        this.$setHtmlText(val, false);
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

    set text(val) {
        this.setText(val);
    }

    get text() {
        return this.$RichText[0];
    }

    set htmlText(val) {
        this.$setHtmlText(val, true);
    }

    get htmlText() {
        return this.$RichText[1];
    }

    get isInputting() {
        return this.$RichText[2];
    }

    set fontSize(val) {
        this.$RichText[11] = +val || 0;
    }

    get fontSize() {
        return this.$RichText[11];
    }

    set fontColor(val) {
        this.$RichText[10] = +val || 0;
    }

    get fontColor() {
        return this.$RichText[10];
    }
}

exports.RichText = RichText;