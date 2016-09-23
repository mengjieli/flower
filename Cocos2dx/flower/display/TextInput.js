class TextInput extends DisplayObject {

    $TextField;

    constructor(text = "") {
        super();
        this.$TextField = {
            0: "", //text
            1: 12, //fontSize
            2: 0x000000, //fontColor
            3: true, //editEnabled
            4: false, //inputing
            5: false, //autoSize
            6: false, //multiline
            7: false, //wordWrap
        };
        this.$initNativeShow();
        this.addListener(Event.FOCUS_IN, this.$onFocusIn, this);
        this.addListener(Event.FOCUS_OUT, this.$onFocusOut, this);
        this.addListener(KeyboardEvent.KEY_DOWN, this.$keyDown, this);
        if (text != "") {
            this.text = text;
        }
        this.width = 100;
        this.height = 21;
        this.focusEnabled = true;
        this.$nativeShow.setChangeBack(this.$onTextChange, this);
    }

    $initNativeShow(textArea = false) {
        if (textArea) {
            this.$TextField[6] = true;
            this.$TextField[7] = true;
            this.$nativeShow = Platform.create("TextArea");
        } else {
            this.$nativeShow = Platform.create("TextInput");
        }
    }

    $onTextChange() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.text = this.$nativeShow.getNativeText();
    }

    $checkSettingSize(rect) {

    }

    $setText(val) {
        val = "" + val;
        var p = this.$TextField;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $measureText(rect) {
        if (this.$hasFlags(0x0800)) {
            var d = this.$DisplayObject;
            var p = this.$TextField;
            //text, width, height, size, wordWrap, multiline, autoSize
            var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], p[7], p[6], p[5]);
            rect.x = 0;
            rect.y = 0;
            rect.width = this.width;//size.width;
            rect.height = this.height;
            this.$removeFlags(0x0800);
        }
    }

    $measureContentBounds(rect) {
        this.$measureText(rect);
    }

    $setFontColor(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = +val || 0;
        var p = this.$TextField;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        this.$nativeShow.setFontColor(val);
        return true;
    }

    $setAutoSize(val) {
        var p = this.$TextField;
        if (p[5] == val) {
            return false;
        }
        p[5] = val;
    }

    $setWidth(val) {
        var flag = super.$setWidth(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        this.$nativeShow.setSize(this.width, this.height);
    }

    $setHeight(val) {
        var flag = super.$setHeight(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        this.$nativeShow.setSize(this.width, this.height);
    }

    $setFontSize(val) {
        var p = this.$TextField;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setEditEnabled(val) {
        if (val == "false") {
            val = false;
        }
        var p = this.$TextField;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        return true;
    }

    $setMultiline(val) {
        if (val == "false") {
            val = false;
        }
        var p = this.$TextField;
        if (p[6] == val) {
            return false;
        }
        p[6] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setWordWrap(val) {
        if (val == "false") {
            val = false;
        }
        var p = this.$TextField;
        if (p[7] == val) {
            return false;
        }
        p[7] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $onFocusIn(e) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        var p = this.$TextField;
        if (p[3]) {
            this.$nativeShow.startInput();
            p[4] = true;
            this.dispatchWith(Event.START_INPUT);
        }
    }

    $onFocusOut() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$inputEnd();
    }

    $inputEnd() {
        var p = this.$TextField;
        if (p[4]) {
            this.$nativeShow.stopInput();
        }
        this.text = this.$nativeShow.getNativeText();
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        this.dispatchWith(Event.STOP_INPUT);
    }

    $keyDown(e) {
        var p = this.$TextField;
        p[0] = this.$nativeShow.getNativeText();
        if (e.keyCode == 13 && !p[6]) {
            this.$inputEnd();
        }
    }

    get text() {
        return this.$TextField[0];
    }

    set text(val) {
        this.$setText(val);
    }

    get fontColor() {
        return this.$TextField[2];
    }

    set fontColor(val) {
        this.$setFontColor(val);
    }

    get fontSize() {
        return this.$TextField[1];
    }

    set fontSize(val) {
        this.$setFontSize(val);
    }

    get editEnabled() {
        return this.$TextField[3];
    }

    set editEnabled(val) {
        this.$setEditEnabled(val);
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x0800)) {
            var width = this.width;
        }
        super.$onFrameEnd();
    }

    inputOver() {
        this.$inputEnd();
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        super.dispose();
        Platform.release("TextInput", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.TextInput = TextInput;