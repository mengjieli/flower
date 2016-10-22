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
            4: 0,  //length
            7: [], //cacheTextFields
            8: "", //lastInputText
            10: 0,  //fontColor
            11: 12, //fontSize
            12: false, //wordWrap 是否自动换行
            30: "", //229 firstChar
            31: false, // is 229
            32: 0, //inputPos
            33: this.__getDefaultFocus(),//focus
        };
        this.addChild(this.__getDefaultFocus());
        this.focusEnabled = true;
        this.width = this.height = 100;
        this.addListener(flower.Event.FOCUS_IN, this.$startInput, this);
        this.addListener(flower.Event.FOCUS_OUT, this.$stopInput, this);
        this.__input = flower.Stage.getInstance().$input;
    }

    __getDefaultFocus() {
        var rect = new flower.Rect();
        rect.fillColor = 0;
        rect.width = 2;
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
        this.$RichText[2] = true;
        this.__input.text = "";
        this.__input.$startNativeInput();
        this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
        flower.EnterFrame.add(this.__update, this);
        this.__showFocus();
    }

    __showFocus() {
        var focus = this.$RichText[33];
        focus.visible = true;
        focus.x = focus.y = 50;
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

    __update() {
        var p = this.$RichText;
        var str = this.__input.$getNativeText();
        if (p[31]) {
            if (p[30] == "") {
                if (str.length) {
                    p[30] = str.charAt(0);
                }
            } else {
                if (!str.length || str.charAt(0) != p[30]) {
                    this.text += str;
                    this.__input.$setNativeText("");
                    this.$RichText[7] = false;
                    p[31] = false;
                    p[30] == "";
                }
            }
        } else {
            if (str != "") {
                this.text += str;
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
        var lines = p[3];
        lines.length = 0;
        var index = 0;
        var lineY = 0;
        var x = 0;
        var line = {
            "index": index,
            "text": "",
            "htmlText": "",
            "width": 0,
            "height": 0,
            "x": 0,
            "y": lineY,
            "align": "left",
            "displays": []
        };
        var signs = [];
        var last = -1;
        var lineStart = 0;
        var signName;
        var signBegin;
        for (var i = 0, len = text.length; i < len; i++) {
            if (decodeHtml) {
                var char = text.charAt(i);
                if (char == "<") {
                    last = -1;
                } else if (char == ">") {
                    if (last != -1) { //找到 <...>  结构
                        var content = text.slice(last + 1, i);
                        last = -1;
                    }
                }
            }
        }


        //    "text":"这是第一行", //这一行的内容
        //*              "htmlText":"<font color='#ff0000'>这是第一行</font>", //这一行的 htmlText 内容
        //*              "width":100,  //这一行的宽度
        //*              "height":12,  //这一行的高度
        //*              "x":0, //起点在全文中的位置 x
        //*              "y":0, //起点在全文中的位置 y
        //*              "displays": [
        //    *                  {
        //        *                       "type": 0 , //显示对象类型  0.文字  1.图片
        //        *                      "text":"这是第一行", //显示内容
        //        *                      "htmlText":"<font color='#ff0000'>这是第一行</font>", //显示的 htmlText 内容
        //        *                      "width":100, //显示对象宽
        //        *                      "height":12, //显示对象的高度
        //        *                      "x":0, //起点在这一行中的位置 x
        //        *                      "y":0,  //起点在这一行中的位置 y
        //        *                      "color":0, //文字颜色
        //        *                      "size":12, //文字大小
        //        *                  }
        //    *             ]
    }

    set text(val) {
        var p = this.$RichText;
        p[0] = val;
        this.$setHtmlText(val, false);
    }

    get text() {
        return this.$RichText[0];
    }

    set htmlText(val) {
        this.$setHtmlText(text, true);
    }

    get htmlText() {
        return this.$RichText[1];
    }

    get isInputting() {
        return this.$RichText[2];
    }
}

exports.RichText = RichText;