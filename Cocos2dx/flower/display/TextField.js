class TextField extends flower.DisplayObject {

    __input;
    __shape;
    __children;
    __childrenBounds;


    constructor(text) {
        super();

        this.__changeText = TextField.changeText;
        this.__changeRealText = TextField.changeRealText;

        this.$Sprite = {
            0: new flower.Rectangle() //childrenBounds
        }
        this.$initContainer();
        DebugInfo.displayInfo.text++;

        this.$TextField = {
            0: "", //text
            1: "", //htmlText formatHtmlText
            2: [], //lines
            3: 0,  //inputLength
            4: new flower.Sprite(), //textContainer
            5: null,//this.__getDefaultFocus(), //focus
            6: "", //setHtmlText
            7: 0, //chars
            9: 0.5, //shineGap
            10: 12,//fontSize
            11: 0, //fontColor
            12: 4, //leading
            13: false,  //wordWrap
            14: null,//new flower.Sprite(), //backgroundContainer
            15: 0, //textContainerMaskWidth
            16: 0, //textContainerMaskHeight
            17: 0, //contentWidth
            18: 0, //contentHeight
            21: "left", //algin
            22: false, //input
            23: true, //selectable
            24: true, //multiline
            25: false, //enterend
            26: true, //inputtingChange
            29: 2, //lineStart
            30: 0, //caretIndex
            31: 0, //caretHtmlIndex
            32: null,//caretLine
            32: null,//caretDisplayLine
            33: null,//caretDisplay
            34: 0, //caretDisplayIndex
            50: 0, //posX
            51: 0, //posY
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
            307: 0, //line charIndex
            308: [], //keys
            311: null,
            312: null,
            313: null,
            350: 0,
            351: 0,
            330: 0,//touchDown charIndex
            400: false, //是否在选中状态
            401: [], //selectedHtmlText 被选中的段落
            402: "", //选中之前的 htmlText 备份
            1000: 0x526da5, //文字选中后的背景色
            1001: 0xffffff //被选文字的颜色
        };
        this.$TextField[4].x = this.$TextField[29];
        this.addChild(this.$TextField[4]);
        //this.addChild(this.$TextField[5]);
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouch, this);
        this.addListener(flower.Event.FOCUS_OUT, this.__stopInput, this);
        this.focusEnabled = true;
        this.__input = flower.Stage.getInstance().$input;
        flower.EnterFrame.add(this.$update, this);

        if (text && text != "") {
            this.text = text;
        }
    }

    __createBackgroundContainer() {
        var p = this.$TextField;
        if (p[14] == null) {
            p[14] = new flower.Sprite();
            var index = this.getChildIndex(p[4]);
            this.addChildAt(p[14], (index - 1) < 0 ? 0 : index - 1);
            if (p[21] == "right") {
                p[14].x = -p[29];
            } else if (p[21] == "center") {
                p[14].x = 0;
            } else {
                p[14].x = p[29];
            }
        }
    }

    __crateFocus() {
        var p = this.$TextField;
        if (!p[5]) {
            var index = this.getChildIndex(p[4]);
            p[5] = this.__getDefaultFocus();
            this.addChildAt(p[5], index + 1);
        }
    }

    __onTouch(e) {
        var p = this.$TextField;
        if (!p[23]) {
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                this.__cancelSelect();
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
                p[330] = p[301];
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                var charIndex = p[330];
                var info = this.__getClickPos();
                this.__cancelSelect();
                var htmlTextIndex1 = this.__getHtmlTextIndexByCharIndex(charIndex);
                var htmlTextIndex2 = this.__getHtmlTextIndexByCharIndex(info.charIndex);
                this.__selecteText(htmlTextIndex1 < htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2, p[1].slice(htmlTextIndex1 < htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2, htmlTextIndex1 > htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2));
                p[301] = info.charIndex;
                this.$moveCaretIndex();
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
        var p = this.$TextField;
        if (p[300]) {
            return;
        }
        if (this.input) {
            if (!p[5]) {
                this.__crateFocus();
            }
            p[300] = true;
            p[301] = info.charIndex;
            p[302] = info.htmlTextIndex;
            p[307] = info.lineCharIndex;
            p[308].length = 0;
            this.__input.text = "";
            this.__input.$setNativeText("");
            this.__input.$startNativeInput();
            flower.EnterFrame.add(this.__update, this);
            this.__showFocus(info);
        }
        this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        this.dispatchWith(flower.Event.START_INPUT, null, true);
    }

    __stopInput() {
        this.$TextField[300] = false;
        this.__input.$stopNativeInput();
        this.removeListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.remove(this.__update, this);
        this.__hideFocus();
        this.dispatchWith(flower.Event.STOP_INPUT, null, true);
    }

    __hideFocus() {
        if (this.$TextField[5]) {
            this.$TextField[5].visible = false;
        }
    }

    __onKeyDown(e) {
        new flower.CallLater(this.__doKeyEvent, this, [e]);
        //if (e.keyCode == 16) {
        //    this.$TextField[308].push({keyCode: e.keyCode});
        //} else {
        //    this.__doKeyEvent(e);
        //}
    }

    //输入字符
    __inputText(text, under = false) {
        var p = this.$TextField;
        if (p[400]) {
            this.__deleteSelect();
            if (p[304]) {
                p[311] = p[301];
                p[312] = p[302];
                p[313] = p[1];
                p[323] = p[3];
            }
        }
        var htmlText = this.__changeText(text);
        if (under) {
            htmlText = "<u>" + htmlText + "</u>";
        }
        this.__inputHtmlText(htmlText);
    }

    //输入字符
    __inputHtmlText(text) {
        var p = this.$TextField;
        var chars = p[3];
        this.htmlText = p[1].slice(0, p[302]) + text + p[1].slice(p[302], p[1].length);
        p[301] += p[3] - chars;
        this.$moveCaretIndex();
    }

    /**
     * 从输入点开始删除一个字符
     * @param num
     */
    $deleteCaretChar() {
        var p = this.$TextField;
        var lines = p[2];
        var pos = p[301];
        if (pos == 0) {
            return;
        }
        var findLine;
        if (pos > p[3]) {
            pos = p[3];
        }
        for (var i = 0; i < lines.length; i++) {
            if (pos > lines[i].charIndex && pos <= lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                findLine = lines[i];
                break;
            }
        }
        if (!findLine) {
            return;
        }
        p[301]--;
        pos -= findLine.charIndex;
        if (pos == findLine.chars && findLine.index != lines.length - 1) {
            this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findLine.htmlText.length)
                + p[1].slice(findLine.htmlTextIndex + findLine.htmlText.length + findLine.endHtmlText.length, p[1].length);
            return;
        }
        var findSubline;
        for (var i = 0; i < findLine.sublines.length; i++) {
            if (pos > findLine.sublines[i].charIndex && pos <= findLine.sublines[i].charIndex + findLine.sublines[i].chars) {
                findSubline = findLine.sublines[i];
                break;
            }
        }
        if (!findSubline) {
            return;
        }
        pos -= findSubline.charIndex;
        var findDisplay;
        for (var i = 0; i < findSubline.displays.length; i++) {
            if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                findDisplay = findSubline.displays[i];
                break;
            }
        }
        pos -= findDisplay.charIndex;
        if (findDisplay.type == 0) {
            this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex)
                + findDisplay.htmlText.slice(0, findDisplay.textStart) + this.__changeText(findDisplay.text.slice(0, pos - 1))
                + this.__changeText(findDisplay.text.slice(pos, findDisplay.text.length)) + findDisplay.htmlText.slice(findDisplay.textEnd, findDisplay.htmlText.length)
                + p[1].slice(findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex + findDisplay.htmlText.length, p[1].length);
        } else {
            this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex)
                + p[1].slice(findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex + findDisplay.htmlText.length, p[1].length);
        }
        this.$moveCaretIndex();
    }

    /**
     * 把焦点移到其它行后，计算当前焦点的位置，当前                                                                                              位置插入的位置(htmlTextIndex)
     * @param index 与当前行相差多少
     */
    $moveCaretIndex(lineIndex = 0) {
        var p = this.$TextField;
        this.__moveCareIndex(lineIndex);
        var focus = p[5];
        if (focus) {
            if (p[21] == "right") {
                focus.x -= p[29];
            } else if (p[21] == "center") {

            } else {
                focus.x += p[29];
            }
            if (focus.x + p[50] < p[29]) {
                p[50] = p[29] - focus.x;
                p[100] = true;
            }
            if (focus.x + focus.width > this.width - p[29]) {
                p[50] = this.width - p[29] - (focus.x + focus.width);
                p[100] = true;
            }
            if (focus.y + p[51] < 0) {
                p[51] = -focus.y;
                p[100] = true;
            }
            if (focus.y + focus.height > this.height) {
                p[51] = this.height - (focus.y + focus.height);
                p[100] = true;
            }
            focus.x += p[50];
            focus.y += p[51];
        }
    }

    __moveCareIndex(lineIndex = 0) {
        var p = this.$TextField;
        var lines = p[2];
        var pos = p[301];
        var focus = p[5];
        if (focus) {
            focus.x = 0;
            focus.y = 0;
            focus.height = p[10] + p[12] * 0.5;
            if (p[21] == "center") {
                focus.x = (this.width) * .5;
            } else if (p[21] == "right") {
                focus.x = this.width;
            }
        }
        p[302] = 0;
        var findLine;
        for (var i = 0; i < lines.length; i++) {
            if (pos >= lines[i].charIndex && pos < lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                findLine = lines[i];
                break;
            }
        }
        if (!findLine) {
            return;
        }
        if (focus) {
            focus.x = findLine.x;
            focus.y = findLine.y;
            focus.height = findLine.height;
        }
        pos -= findLine.charIndex;
        p[302] = findLine.htmlTextIndex;
        var findSubline;
        for (var i = 0; i < findLine.sublines.length; i++) {
            if (pos >= findLine.sublines[i].charIndex && pos < findLine.sublines[i].charIndex + findLine.sublines[i].chars || i == findLine.sublines.length - 1) {
                findSubline = findLine.sublines[i];
                break;
            }
        }
        //如果有行的移动，重新计算所在行
        if (lineIndex) {
            pos = p[307];
            while (lineIndex) {
                if (lineIndex > 0) {
                    if (!findSubline || findSubline.index < findLine.sublines.length - 1) {
                        findSubline = findLine.sublines[findSubline.index + 1];
                    } else {
                        if (findLine.index < lines.length - 1) {
                            findLine = lines[findLine.index + 1];
                            if (findLine.sublines.length) {
                                findSubline = findLine.sublines[0];
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    lineIndex--;
                } else {
                    if (!findSubline || findSubline.index > 0) {
                        findSubline = findLine.sublines[findSubline.index - 1];
                    } else {
                        if (findLine.index > 0) {
                            findLine = lines[findLine.index - 1];
                            if (findLine.sublines.length) {
                                findSubline = findLine.sublines[0];
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    lineIndex++;
                }
            }
            if (focus) {
                focus.x = findLine.x;
                focus.y = findLine.y;
                focus.height = findLine.height;
            }
            p[302] = findLine.htmlTextIndex;
            p[301] = findLine.charIndex;
            if (!findSubline) {
                return;
            } else {
                if (focus) {
                    focus.x += findSubline.x;
                    focus.y += findSubline.y;
                    focus.height = findSubline.height;
                }
                p[302] += findSubline.htmlTextIndex;
                p[301] += pos < findSubline.chars ? pos : findSubline.chars;
            }
        } else {
            if (!findSubline) {
                return;
            } else {
                if (focus) {
                    focus.x += findSubline.x;
                    focus.y += findSubline.y;
                    focus.height = findSubline.height;
                }
                pos -= findSubline.charIndex;
                p[302] += findSubline.htmlTextIndex;
                p[307] = pos;
            }
        }
        if (pos == 0) {
            return;
        }
        var findDisplay;
        for (var i = 0; i < findSubline.displays.length; i++) {
            if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                findDisplay = findSubline.displays[i];
                break;
            }
        }
        if (!findDisplay) {
            return;
        }
        if (focus) {
            focus.x += findDisplay.x;
        }
        pos -= findDisplay.charIndex;
        p[302] += findDisplay.htmlTextIndex;
        if (findDisplay.type == 0) {
            var text = findDisplay.text;
            var size = findDisplay.font.size;
            if (focus) {
                focus.x += flower.$measureTextWidth(size, text.slice(0, pos));
            }
            p[302] += findDisplay.textStart + this.__changeText(text.slice(0, pos)).length;
        } else {
            if (pos) {
                if (focus) {
                    focus.x += findDisplay.width;
                }
                p[302] += findDisplay.htmlText.length;
            }
        }
    }

    __getHtmlTextIndexByCharIndex(pos) {
        var p = this.$TextField;
        var lines = p[2];
        var htmlTextIndex = 0;
        if (pos == 0) {
            return htmlTextIndex;
        }
        var findLine;
        for (var i = 0; i < lines.length; i++) {
            if (pos >= lines[i].charIndex && pos < lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                findLine = lines[i];
                break;
            }
        }
        if (!findLine) {
            return htmlTextIndex;
        }
        pos -= findLine.charIndex;
        htmlTextIndex = findLine.htmlTextIndex;
        var findSubline;
        for (var i = 0; i < findLine.sublines.length; i++) {
            if (pos >= findLine.sublines[i].charIndex && pos < findLine.sublines[i].charIndex + findLine.sublines[i].chars || i == findLine.sublines.length - 1) {
                findSubline = findLine.sublines[i];
                break;
            }
        }
        if (!findSubline) {
            return htmlTextIndex;
        } else {
            pos -= findSubline.charIndex;
            htmlTextIndex += findSubline.htmlTextIndex;
        }
        if (pos == 0) {
            return htmlTextIndex;
        }
        var findDisplay;
        for (var i = 0; i < findSubline.displays.length; i++) {
            if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                findDisplay = findSubline.displays[i];
                break;
            }
        }
        if (!findDisplay) {
            return htmlTextIndex;
        }
        pos -= findDisplay.charIndex;
        htmlTextIndex += findDisplay.htmlTextIndex;
        if (findDisplay.type == 0) {
            var text = findDisplay.text;
            var size = findDisplay.font.size;
            htmlTextIndex += findDisplay.textStart + this.__changeText(text.slice(0, pos)).length;
        } else {
            if (pos) {
                htmlTextIndex += findDisplay.htmlText.length;
            }
        }
        return htmlTextIndex;
    }

    __getCharIndexByHtmlTextIndex(index) {
        var p = this.$TextField;
        var lines = p[2];
        if (lines.length) {
            return 0;
        }
        for (var i = 0; i < lines.lengt; i++) {
            var line = lines[i];
            if (line.htmlTextIndex <= index && line.htmlTextIndex + line.htmlText.length + line.endHtmlText.length > index || i == lines.length - 1) {
                index -= line.htmlTextIndex;
                var sublines = line.sublines;
                if (sublines.length) {
                    return line.charIndex;
                }
                for (var s = 0; s < sublines.length; s++) {
                    var subline = sublines[s];
                    if (subline.htmlTextIndex <= index && subline.htmlTextIndex + subline.htmlText.length || s == sublines.length - 1) {
                        var displays = subline.displays;
                        if (displays.length) {
                            return line.charIndex + subline.charIndex;
                        }
                        index -= subline.htmlTextIndex;
                        for (var d = 0; d < displays.length; d++) {
                            var display = displays[d];
                            if (display.htmlTextIndex <= index && display.htmlTextIndex + display.htmlText.length || d == displays.length - 1) {
                                return line.charIndex + subline.charIndex + display.text.slice(0, this.__changeRealText(display.htmlText.slice(display.textStart, index)).length).length;
                            }
                        }
                    }
                }
            }
        }
        return 0;
    }

    /**
     * 增加选中的段落
     * @param htmlTextIndex
     * @param htmlText
     * @private
     */
    __selecteText(htmlTextIndex, htmlText) {
        if (htmlText.length == 0) {
            return;
        }
        var p = this.$TextField;
        if (!p[400]) {
            p[400] = true;
            p[402] = p[1];
        }
        p[401].push({index: htmlTextIndex, htmlText: htmlText});
        var list = p[401];
        var oldHtmlText = p[402];
        var newHtmlText = "";
        var last = 0;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            newHtmlText += oldHtmlText.slice(last, item.index) + "<s>" + item.htmlText + "</s>";
            last = item.index + item.htmlText.length;
            if (i == list.length - 1) {
                newHtmlText += oldHtmlText.slice(last, oldHtmlText.length);
            }
        }
        this.__setHtmlText(newHtmlText, false);
    }

    __cancelSelect() {
        var p = this.$TextField;
        if (p[400]) {
            p[400] = false;
            this.__setHtmlText(p[402], false);
            var list = p[401].concat();
            p[401].length = 0;
            return list;
        }
        return null;
    }

    __deleteSelect() {
        var p = this.$TextField;
        if (p[400]) {
            p[400] = false;
            //this.__setHtmlText(p[402], false);
            var list = p[401];
            var oldHtmlText = p[402];
            var newHtmlText = "";
            var last = 0;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                newHtmlText += oldHtmlText.slice(last, item.index) + this.__deleteHtmlTextContent(item.htmlText);
                last = item.index + item.htmlText.length;
                if (i == list.length - 1) {
                    newHtmlText += oldHtmlText.slice(last, oldHtmlText.length);
                }
            }
            list.length = 0;
            this.__setHtmlText(newHtmlText, false);
        }
    }

    __deleteHtmlTextContent(text) {
        var content = "";
        var last = -1;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            if (char == "<") {
                last = i;
            } else if (char == ">") {
                if (last != -1) {
                    var sign = "";
                    var index = last + 1;
                    if (text.charAt(index) == "/") {
                        index++;
                    }
                    while (index < text.length) {
                        var c = text.charAt(index);
                        if (c == " " || c == ">") {
                            break;
                        }
                        sign += c;
                        index++;
                    }
                    if (sign == "font" || sign == "u" || sign == "s") {
                        content += text.slice(last, i + 1);
                    }
                    last = -1;
                }
            }
        }
        return content;
    }

    __update(now, gap) {
        var p = this.$TextField;
        p[303] += gap;
        if (p[303] < p[9] * 1000 || math.floor(p[303] / (p[9] * 1000)) % 2 == 0) {
            p[5].visible = true;
        } else {
            p[5].visible = false;
        }
        while (p[308].length) {
            this.__doKeyEvent(p[308].shift());
        }
    }

    __doKeyEvent(e) {
        var p = this.$TextField;
        if (e.keyCode == 229 && this.input) {
            if (!p[304]) {
                p[304] = true;
                p[305] = "";
                p[311] = p[301];
                p[312] = p[302];
                p[313] = p[1];
                p[323] = p[3];
                p[350] = p[50];
                p[351] = p[51];
            }
            p[6] += "1";
            var str = this.__input.$getNativeText();
            if (p[305] == "") {
                p[305] = str.charAt(str.length - 1);
            }
            p[1] = p[313];
            p[3] = p[323];
            p[301] = p[311];
            p[302] = p[312];
            p[50] = p[350];
            p[51] = p[351];
            if (e.keyCode == 16 || str != p[306].slice(0, str.length) && str.charAt(str.length - 1) != p[305] && str.charAt(str.length - 2) != p[305] && str.charAt(str.length - 3) != p[305]) {
                this.__inputText(str);
                this.__input.$setNativeText("");
                this.$TextField[7] = false;
                p[304] = false;
                p[305] == "";
                p[306] = "";
            } else {
                this.__inputText(str, true);
                p[306] = str;
                p[305] = str.charAt(str.length - 1);
            }
        } else if (e.keyCode == 13 && this.input) {
            if (p[24]) {
                this.__inputText("\n");
            } else {
                if (p[25]) {
                    this.__stopInput();
                } else {
                }
            }
        } else if ((e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 38 || e.keyCode == 40) && this.input) {
            if (e.keyCode == 37) {
                if (p[301] == 0) {
                    return;
                }
                p[301]--;
                this.$moveCaretIndex();
            } else if (e.keyCode == 39) {
                if (p[301] == p[3]) {
                    return;
                }
                p[301]++;
                this.$moveCaretIndex();
            } else if (e.keyCode == 38) { //输入点上移一行
                this.$moveCaretIndex(-1);
            } else if (e.keyCode == 40) { //输入点下移一行
                this.$moveCaretIndex(1);
            } else if (e.keyCode == 8) {
                if (p[400]) {
                    this.__deleteSelect();
                } else {
                    if (p[301] == 0) {
                        return;
                    }
                    this.$deleteCaretChar();
                    this.$moveCaretIndex();
                }
            }
        } else if (e.keyCode == 91 || e.keyCode == 17) {

        } else if (this.input) {
            var str = this.__input.$getNativeText();
            if (str.length) {
                this.__inputText(str);
                this.__input.$setNativeText("");
            }
        }
    }

    __showFocus(info) {
        var p = this.$TextField;
        if (this.input) {
            p[5].visible = true;
        } else {
            p[5].visible = false;
        }
        p[5].x = info.focusX;
        if (p[21] == "right") {
            p[5].x -= p[29];
        } else if (p[21] == "center") {

        } else {
            p[5].x += p[29];
        }
        p[5].y = info.focusY;
        p[5].height = info.focusHeight;
        if (p[5].x + p[50] < p[29]) {
            p[50] = p[29] - p[5].x;
            p[100] = true;
        }
        if (p[5].x + p[5].width > this.width - p[29]) {
            p[50] = this.width - p[29] - (p[5].x + p[5].width);
            p[100] = true;
        }
        if (p[5].y + p[51] < 0) {
            p[51] = -p[5].y;
            p[100] = true;
        }
        if (p[5].y + p[5].height > this.height) {
            p[51] = this.height - (p[5].y + p[5].height);
            p[100] = true;
        }
        p[5].x += p[50];
        p[5].y += p[51];
    }

    __getClickPos() {
        var p = this.$TextField;
        var x = this.mouseX;
        var y = this.mouseY;
        if (p[21] == "right") {
            x += p[29];
        } else if (p[21] == "center") {

        } else {
            x -= p[29];
        }
        x -= p[50];
        y -= p[51];
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
            focusHeight: p[10] + p[12] * 0.5,
            lineCharIndex: 0
        };
        if (p[21] == "center") {
            res.focusX = this.width * .5;
        } else if (p[21] == "right") {
            res.focusX = this.width;
        } else {
            res.focusX = 0;
        }
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
            if (p[21] == "center") {
                res.focusX = (this.width - line.width) * .5;
            } else if (p[21] == "right") {
                res.focusX = this.width;
            }
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
            if (x < display.x + display.width || i == findSubline.displays.length - 1) {
                findDisplay = display;
                break;
            }
        }
        if (!findDisplay) {
            return res;
        }
        res.display = findDisplay;
        res.charIndex += findDisplay.charIndex;
        res.htmlTextIndex += findDisplay.htmlTextIndex;
        res.focusX += findDisplay.x;
        x -= findDisplay.x;
        if (findDisplay.type == 0) {
            res.htmlTextIndex += findDisplay.textStart;
            res.lineCharIndex = findDisplay.charIndex;
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
                    res.htmlTextIndex += this.__changeText(text.charAt(i - 1)).length;
                    res.focusX += charWidth;
                    res.lineCharIndex++;
                }
            }
        } else {
            if (x > findDisplay.width * 0.5) {
                res.charIndex += findDisplay.chars;
                res.htmlTextIndex += findDisplay.htmlText.length;
                res.focusX += findDisplay.width;
                res.lineCharIndex = findDisplay.charIndex + findDisplay.chars;
            } else {
                res.lineCharIndex = findDisplay.charIndex;
            }
        }
        return res;
    }

    $setHtmlText(text) {
        var p = this.$TextField;
        this.__resetCaches();
        this.__clearOldDisplay();
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
            underColor: p[11],
            select: false,
            gap: p[12],
            sizes: [],
            colors: [],
            unders: [],
            selects: [],
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
                        if (name == "font" || name == "u" || name == "s") {
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            if (name == "font") {
                                font.size = font.sizes.pop();
                                font.color = font.colors.pop();
                                font.gap = font.gaps.pop();
                            } else if (name == "u") {
                                font.under = font.unders.pop();
                            } else if (name == "s") {
                                font.select = font.selects.pop();
                            }
                        }
                    } else {
                        if (name == "font" || name == "u" || name == "s") {
                            nextHtmlText = text.slice(last, i + 1);
                            lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - nextHtmlText.length);
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            if (name == "font") {
                                font.sizes.push(font.size);
                                font.colors.push(font.color);
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
                            } else if (name == "u") {
                                font.unders.push(font.under);
                                font.under = true;
                                font.underColor = font.color;
                                for (var a = 0; a < attributes.length; a++) {
                                    if (attributes[a].name == "color") {
                                        if (attributes[a].value.charAt(0) == "#") {
                                            font.underColor = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                        }
                                    }
                                }
                            } else if (name == "s") {
                                font.selects.push(font.select);
                                font.select = true;
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
            var newLine = false;
            if (char == "\n" || char == "\r" || text.slice(i, i + "<br/>".length) == "<br/>") {
                if (p[24]) {
                    newLine = true;
                    decodeText = true;
                    if (oldFont.select) {
                        line.selectEnd = true;
                    }
                    if (char == "\n" || char == "\r") {
                        line.endHtmlText = char;
                        lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - 1);
                        lastText = lastText.slice(0, lastText.length - 1);
                    } else if (text.slice(i, i + "<br/>".length) == "<br/>") {
                        line.endHtmlText = "<br/>";
                        lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - 1);
                        last = -1;
                    }
                } else {
                    text = text.slice(0, i);
                    len = text.length;
                }
            }
            if (i == len - 1) {
                decodeText = true;
            }
            if (decodeText) {
                this.__decodeText(line, oldFont, this.__changeRealText(lastText), lastHtmlText, lastTextStart);
                lastHtmlText = "";
                lastText = "";
                lastTextStart = -1;
                if (single) {
                    if (addSingle.name == "img") {
                        this.__decodeImage(line, addSingle.attributes, addSingle.htmlText, oldFont);
                    } else if (addSingle.name == "ui") {
                        this.__decodeUI(line, addSingle.attributes, addSingle.htmlText, oldFont);
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
        var oldText = p[0];
        p[0] = "";
        p[1] = "";
        p[3] = 0;
        var maxWidth = 0;
        var maxHeight = 0;
        for (var i = 0; i < lines.length; i++) {
            p[1] += lines[i].htmlText + lines[i].endHtmlText;
            p[3] += lines[i].chars;
            maxWidth = lines[i].width > maxWidth ? lines[i].width : maxWidth;
            maxHeight += lines[i].height;
            p[0] += lines[i].text + (i < lines.length - 1 ? "\n" : "");
        }
        maxWidth += p[29] * 2;
        p[17] = maxWidth;
        p[18] = maxHeight;
        p[100] = true;
        this.$invalidateContentBounds();
        for (var i = 0; i < lines.length; i++) {
            for (var s = 0; s < lines[i].sublines.length; s++) {
                var subline = lines[i].sublines[s];
                if (p[21] == "center") {
                    subline.x = (this.width - subline.width) * .5;
                } else if (p[21] == "right") {
                    subline.x = (this.width - subline.width);
                }
            }
        }
        this.$moveCaretIndex();
        if (oldText != p[0]) {
            this.dispatchWith(flower.Event.CHANGE, null, true);
        }
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
        var p = this.$TextField;
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
        textStart = textStart == -1 ? 0 : textStart;
        var p = this.$TextField;
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var nextText = "";
        var nextHtmlText = "";
        var nextTextStart = 0;
        while (text.length) {
            nextText = "";
            nextHtmlText = "";
            nextTextStart = 0;
            var subline = line.sublines[line.sublines.length - 1];
            var width = flower.$measureTextWidth(font.size, text);
            if (p[13] && this.$DisplayObject[3] != null) {
                if (subline.width + width + p[29] * 2 > this.width) {
                    var min = 0;
                    var minValue = 0;
                    var max = text.length;
                    var maxValue = width;
                    var widths = {};
                    widths[text.length] = width;
                    while (true) {
                        var mid = ~~((min + max) / 2);
                        var midValue = widths[mid];
                        if (mid == min || mid == max) {
                            if (subline.width + midValue + p[29] * 2 > this.width && mid) {
                                mid--;
                            }
                            if (mid == 0) {
                                this.__addSubLine(line, font);
                                subline = line.sublines[line.sublines.length - 1];
                            } else {
                                nextText = text.slice(mid, text.length);
                                nextHtmlText = htmlText.slice(textStart + mid, htmlText.length);
                                nextTextStart = 0;
                                text = text.slice(0, mid);
                                htmlText = htmlText.slice(0, textStart + mid);
                            }
                            break;
                        }
                        if (widths[mid] == null) {
                            midValue = widths[mid] = flower.$measureTextWidth(font.size, text.slice(0, mid));
                        }
                        if (subline.width + midValue + p[29] * 2 > this.width) {
                            max = mid;
                            maxValue = midValue;
                        } else {
                            min = mid;
                            minValue = midValue;
                        }
                    }

                    //for (var t = text.length; t >= 0; t--) {
                    //    width = flower.$measureTextWidth(font.size, text.slice(0, t));
                    //    if (subline.width + width + p[29] * 2 <= this.width) {
                    //        if (t == 0) {
                    //            this.__addSubLine(line, font);
                    //            subline = line.sublines[line.sublines.length - 1];
                    //            t = text.length + 1;
                    //        } else {
                    //            nextText = text.slice(t, text.length);
                    //            nextHtmlText = htmlText.slice(textStart + t, htmlText.length);
                    //            nextTextStart = 0;
                    //            text = text.slice(0, t);
                    //            htmlText = htmlText.slice(0, textStart + t);
                    //            break;
                    //        }
                    //    }
                    //}
                }
            }
            var item = {
                type: 0,
                display: null,
                font: font,
                text: text,
                htmlText: htmlText,
                htmlTextIndex: subline.htmlText.length,
                textStart: textStart,
                textEnd: textStart + this.__changeText(text).length,
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

            text = nextText;
            htmlText = nextHtmlText;
            textStart = nextTextStart;
            if (text.length) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
    }

    __decodeImage(line, attributes, htmlText, font) {
        var p = this.$TextField;
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
        if (p[13] && this.$DisplayObject[3] != null) {
            if (subline.width + image.width + p[29] * 2 > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = image.width;
        cache.height = image.height;
        var item = {
            type: 1,
            display: image,
            font: font,
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

    __decodeUI(line, attributes, htmlText, font) {
        var p = this.$TextField;
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
        if (p[13] && this.$DisplayObject[3] != null) {
            if (subline.width + ui.width + p[29] * 2 > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = ui.width;
        cache.height = ui.height;
        var item = {
            type: 1,
            display: ui,
            font: font,
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
        var caches = this.$TextField[101];
        for (var key in caches) {
            var list = caches[key];
            for (var i = 0; i < list.length; i++) {
                list[i].use = false;
            }
        }
    }

    __clearCaches() {
        var caches = this.$TextField[101];
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
            index: this.$TextField[2].length,
            text: "",
            htmlText: "",
            endHtmlText: "",
            selectEnd: false,
            htmlTextIndex: 0,
            width: 4,
            height: font.size + font.gap,
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
        }
        return line;
    }

    __addSubLine(line, font) {
        var subline = {
            index: line.sublines.length,
            text: "",
            htmlText: "",
            htmlTextIndex: line.htmlText.length,
            width: 4,
            gap: font.gap,
            height: font.size + font.gap,
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
        if (subline.y + subline.height > line.height) {
            line.height = subline.y + subline.height;
        }
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
        val = +val & ~0;
        var p = this.$TextField;
        if (val == p[10]) {
            return;
        }
        p[10] = val;
        this.$setHtmlText(p[1]);
    }

    __setFontColor(val) {
        val = ~~val;
        var p = this.$TextField;
        if (val == p[11]) {
            return;
        }
        p[11] = val;
        this.$setHtmlText(p[1]);
    }

    __setHtmlText(val) {
        var p = this.$TextField;
        if (p[6] == val) {
            return;
        }
        p[6] = val;
        this.$setHtmlText(val);
    }

    __setText(val) {
        val += "";
        var val = this.__changeText(val);
        this.__setHtmlText(val);
    }

    __setWordWrap(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        var p = this.$TextField;
        if (p[13] == val) {
            return;
        }
        p[13] = val;
        this.$setHtmlText(p[1]);
    }

    $onFrameEnd() {
        var p = this.$TextField;
        if (p[100]) {
            p[100] = false;
            var lines = p[2];
            var x = p[50];
            var y = p[51];
            var container = p[4];
            var bgcontainer = p[14];
            container.removeAll();
            if (bgcontainer) {
                bgcontainer.removeAll();
            }
            var height = this.height;
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                //if (!setHeight || line.y <= y + height && line.y + line.height < y + height) {
                for (var s = 0; s < line.sublines.length; s++) {
                    var subline = line.sublines[s];
                    //if (!setHeight || subline.y <= y + height && subline.y + subline.height < y + height) {
                    var displays = subline.displays;
                    for (var d = 0; d < displays.length; d++) {
                        var item = displays[d];
                        var display = item.display;
                        if (item.type == 0) {
                            if (!display) {
                                display = new $TextField(item.text);
                                display.fontSize = item.font.size;
                                display.fontColor = item.font.select ? p[1001] : item.font.color;
                                item.display = display;
                            }
                        }
                        if (item.font.under && item.width) {
                            if (!item.underDisplay) {
                                item.underDisplay = new flower.Rect();
                                item.underDisplay.fillColor = item.font.select ? p[1001] : item.font.underColor;
                                item.underDisplay.width = item.width;
                                item.underDisplay.height = 1;
                            }
                            item.underDisplay.x = x + line.x + subline.x + item.x;
                            item.underDisplay.y = y + line.y + subline.y + subline.height;
                            container.addChild(item.underDisplay);
                        }
                        if (item.font.select && item.width) {
                            if (!item.selectDisplay) {
                                item.selectDisplay = new flower.Rect();
                                item.selectDisplay.fillColor = p[1000];
                                item.selectDisplay.width = item.width;
                                item.selectDisplay.height = subline.height;
                            }
                            item.selectDisplay.x = x + line.x + subline.x + item.x;
                            item.selectDisplay.y = y + line.y + subline.y;
                            if (!bgcontainer) {
                                this.__createBackgroundContainer();
                                bgcontainer = p[14];
                            }
                            bgcontainer.addChild(item.selectDisplay);
                        }
                        container.addChild(item.display);
                        display.x = x + line.x + subline.x + item.x;
                        display.y = y + line.y + subline.y + subline.height - item.height - (subline.gap * 0.5);
                    }
                    //}
                }
                if (line.selectEnd) {
                    var rect = new flower.Rect();
                    rect.fillColor = p[1000];
                    rect.width = this.width - line.x - line.width;
                    rect.height = line.height;
                    rect.x = x + line.x + line.width;
                    rect.y = y + line.y;
                }
                //}
            }
            this.__clearCaches();
        }
        if (p[15] != this.width || p[16] != this.height) {
            p[15] = this.width;
            p[16] = this.height;
            this.__shape.clear();
            this.__shape.drawRect(p[29], 0, this.width - p[29] * 2, this.height + 2);
            this.$moveCaretIndex();
        }

        //Sprite
        var children = this.__children;
        /**
         * 子对象序列改变
         */
        if (this.$hasFlags(0x0100)) {
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return;
            }
            this.$nativeShow.resetChildIndex(children);
            this.$removeFlags(0x0100);
        }
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i].visible) {
                children[i].$onFrameEnd();
            }
        }
        //super.$onFrameEnd();
        DebugInfo.frameInfo.display++;
        DebugInfo.frameInfo.text++;
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
    }

    $update() {
        var p = this.$TextField;
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

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Mask");
        this.__shape = this.$createShape();
        this.$nativeShow.setShape(this.__shape.$nativeShow, this.__shape);
    }

    $createShape() {
        return new Shape();
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$addFlagsDown(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$removeFlagsDown(flags);
        }
    }

    addChild(child) {
        this.addChildAt(child, this.__children.length);
        return child;
    }

    addChildAt(child, index) {
        var children = this.__children;
        if (index < 0 || index > children.length) {
            return child;
        }
        if (child.parent == this) {
            this.setChildIndex(child, index);
        } else {
            if (child.parent) {
                child.parent.$removeChild(child);
            }
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return null;
            }
            this.$nativeShow.addChild(child.$nativeShow);
            children.splice(index, 0, child);
            child.$setStage(this.stage);
            child.$setParent(this);
            if (child.parent == this) {
                child.$dispatchAddedToStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
            }
        }
        return child;
    }

    $setStage(stage) {
        super.$setStage(stage);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setStage(this.stage);
        }
    }

    $dispatchAddedToStageEvent() {
        super.$dispatchAddedToStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchAddedToStageEvent();
        }
    }

    $dispatchRemovedFromStageEvent() {
        super.$dispatchRemovedFromStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchRemovedFromStageEvent();
        }
    }

    $removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                child.$setStage(null);
                child.$setParent(null);
                child.$dispatchRemovedFromStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChildAt(index) {
        var children = this.__children;
        if (index < 0 || index >= children.length) {
            return;
        }
        return this.removeChild(children[index]);
    }

    setChildIndex(child, index) {
        var childIndex = this.getChildIndex(child);
        if (childIndex == index || childIndex < 0) {
            return null;
        }
        var children = this.__children;
        children.splice(childIndex, 1);
        children.splice(index, 0, child);
        this.$addFlags(0x0100);
        return child;
    }

    getChildIndex(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (child == children[i]) {
                return i;
            }
        }
        return -1;
    }

    getChildAt(index) {
        index = index & ~0;
        if (index < 0 || index > this.__children.length - 1) {
            $error(1007, "getChildAt", index, this.__children.length);
            return null;
        }
        return this.__children[index];
    }

    removeAll() {
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    }

    $changeAllFilters() {
        super.$changeAllFilters();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setParentFilters(this.$getAllFilters());
        }
    }

    /**
     * 测量子对象的区域
     * @param rect
     */
    $measureContentBounds(rect) {
        rect.x = 0;
        rect.y = 0;
        rect.width = this.$TextField[17];
        rect.height = this.$TextField[18];
        var childrenBounds = this.$Sprite[0];
        childrenBounds.x = rect.x;
        childrenBounds.y = rect.y;
        childrenBounds.width = rect.width;
        childrenBounds.height = rect.height;
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        p[22] = flower.EnterFrame.frame;
        var bounds = this.__shape.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
            var target;
            var childs = this.__children;
            var len = childs.length;
            for (var i = len - 1; i >= 0; i--) {
                if (childs[i].touchEnabled && (multiply == false || (multiply == true && childs[i].multiplyTouchEnabled == true))) {
                    target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                    if (target) {
                        break;
                    }
                }
            }
            return this;
        }
        return null;
    }

    $releaseContainer() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Platform.release("Mask", this.$nativeShow);
        this.$nativeShow = null;
    }

    dispose() {
        this.__resetCaches();
        this.__clearCaches();
        flower.EnterFrame.remove(this.$update, this);

        //Sprite
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        DebugInfo.displayInfo.text--;
        var children = this.__children;
        while (children.length) {
            var child = children[children.length - 1];
            child.dispose();
        }
        super.dispose();
        this.$releaseContainer();
    }

    get fontSize() {
        return this.$TextField[10];
    }

    set fontSize(val) {
        this.__setFontSize(val);
    }

    get fontColor() {
        return this.$TextField[11];
    }

    set fontColor(val) {
        this.__setFontColor(val);
    }

    get htmlText() {
        return this.$TextField[1];
    }

    set htmlText(val) {
        this.__setHtmlText(val);
    }

    get text() {
        return this.$TextField[0];
    }

    set text(val) {
        this.__setText(val);
    }

    get wordWrap() {
        return this.$TextField[13];
    }

    set wordWrap(val) {
        this.__setWordWrap(val);
    }

    get displays() {
        return this.$TextField[102];
    }

    set algin(val) {
        var p = this.$TextField;
        if (p[21] == val) {
            return;
        }
        p[21] = val;
        if (p[4]) {
            if (p[21] == "right") {
                p[4].x = -p[29];
            } else if (p[21] == "center") {
                p[4].x = 0;
            } else {
                p[4].x = p[29];
            }
        }
        if (p[14]) {
            if (p[21] == "right") {
                p[14].x = -p[29];
            } else if (p[21] == "center") {
                p[14].x = 0;
            } else {
                p[14].x = p[29];
            }
        }
        this.$setHtmlText(p[1]);
    }

    get algin() {
        return this.$TextField[21];
    }

    set leading(val) {
        val = +val & ~0;
        var p = this.$TextField;
        if (p[12] == val) {
            return;
        }
        p[12] = val;
        this.$setHtmlText(p[1]);
    }

    get leading() {
        return this.$TextField[12];
    }

    set input(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$TextField[22]) {
            return;
        }
        this.$TextField[22] = val;
    }

    get input() {
        return this.$TextField[22];
    }

    set selectable(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$TextField[23]) {
            return;
        }
        this.$TextField[23] = val;
    }

    get selectable() {
        return this.$TextField[23];
    }

    set multiline(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$TextField[24]) {
            return;
        }
        this.$TextField[24] = val;
    }

    get multiline() {
        return this.$TextField[24];
    }

    set enterStop(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$TextField[25]) {
            return;
        }
        this.$TextField[25] = val;
    }

    get enterStop() {
        return this.$TextField[25];
    }

    static changeText(val) {
        for (var i = 0; i < val.length; i++) {
            var char = val.charAt(i);
            if (char == " ") {
                val = val.slice(0, i) + "&nbsp;" + val.slice(i + 1, val.length);
                i += 5
            } else if (char == "<") {
                val = val.slice(0, i) + "&lt;" + val.slice(i + 1, val.length);
                i += 3
            } else if (char == ">") {
                val = val.slice(0, i) + "&gt;" + val.slice(i + 1, val.length);
                i += 3
            } else if (char == "&") {
                val = val.slice(0, i) + "&amp;" + val.slice(i + 1, val.length);
                i += 4
            } else if (char == "\n" || char == "\r") {
                //val = val.slice(0, i) + "<br/>" + val.slice(i + 1, val.length);
                //i += 4
            }
        }
        return val;
    }

    static changeRealText(val) {
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
}

exports.TextField = TextField;