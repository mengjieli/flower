"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        flower.start(this.ready.bind(this));
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {
            flower.URLLoader.urlHead = "http://localhost:12000/";

            var fxml = ''
                + '<f:Scroller scrollable="false" x="50" y="50" width="200" height="150" scrollPolicyH="on" scrollPolicyV="on" xmlns:f="flower">'

                    +'<f:HScrollBar autoVisibility="false" percentWidth="100" height="10" bottom="0" >'
                        +'<f:Rect fillColor="0x888888" fillAlpha="0.5" percentWidth="100" percentHeight="100"/>'
                        +'<f:thumb>'
                            +'<f:Rect fillColor="0x555555"  fillAlpha="0.5" id="thumb" percentHeight="100"/>'
                        +'</f:thumb>'
                    +'</f:HScrollBar>'

                    +'<f:VScrollBar autoVisibility="false" percentHeight="100" width="10" right="0">'
                        + '<f:Rect fillColor="0x888888" fillAlpha="0.5" percentWidth="100" percentHeight="100"/>'
                        +'<f:thumb>'
                            + '<f:Rect fillColor="0x555555"  fillAlpha="0.5" id="thumb" percentWidth="100"/>'
                        +'</f:thumb>'
                    +'</f:VScrollBar>'

                    + '<f:Input text="测试2121io120210io2109ww902102w21212121"/>'

                + '</f:Scroller>';

            var parser = new flower.UIParser();
            parser.parseUI(fxml);
            flower.Stage.getInstance().addChild(parser);


            //var module = new flower.Module("modules/software/module.json");
            //module.load();
            //module.addListener(flower.Event.COMPLETE,function(){
            //
            //    var ui = new flower.UIParser();
            //    ui.parseUIAsync("res/Test2.xml",{list:new flower.ArrayValue(list)});
            //    flower.Stage.getInstance().addChild(ui);
            //});


            //var rect = new flower.Rect();
            //rect.fillColor = 0xaaaaaa;
            //rect.width = 400;
            //rect.height = 300;
            //flower.Stage.getInstance().addChild(rect);
            //
            //var input = new flower.TextInput();
            //var startInput = false;
            //rect.addListener(flower.TouchEvent.TOUCH_END, function () {
            //    if (startInput) {
            //        input.$stopNativeInput();
            //    } else {
            //        input.$startNativeInput();
            //    }
            //    startInput = !startInput;
            //});
            //rect.focusEnabeld = true;
            //flower.Stage.getInstance().addListener(flower.KeyboardEvent.KEY_DOWN, function (e) {
            //    trace(input.$getNativeText());
            //    trace(input.$getNativeText());
            //});
            ////flower.Stage.getInstance().addListener(flower.KeyboardEvent.KEY_DOWN, function (e) {
            ////    trace(input.$getNativeText());
            ////});
            //
            ////flower.Stage.getInstance().addChild(input);
            //input.x = 300;
            //input.y = 250;


            /*
             var rect = new flower.Rect();
             rect.x = 50;
             rect.y = 50;
             rect.width = 450;
             rect.height = 400;
             rect.fillColor = 0x888888;
             rect.fillAlpha = 1;
             flower.Stage.getInstance().addChild(rect);
             var richText = new flower.Input();
             richText.x = 50;
             richText.y = 50;
             //richText.multiline = true;
             //richText.width = 100;
             //richText.height = 16;
             //richText.selectable = false;
             //richText.input = true;
             //richText.wordWrap = true;
             //richText.leading = 20;
             //richText.fontColor = 0x00ff00;
             //richText.fontSize = 16;
             //richText.algin = "right";
             //richText.text = "e你在说什么呢小朋友啊就是";
             //richText.htmlText = "我说文字就<img id='img1' src='res/closeDown.png'/>    么";

             richText.htmlText = '<u>我<img id="img1" src="res/closeDown.png"/>时</u>间<font color="#0000ff" size="30">:<font color="#ff0000" size="25">20<br/><br/><font color="#00ffff"><font size="16">我</font></font></font>11</font>12<f:Group id="ui1" xmlns:f="flower"><f:Rect fillColor="0xff0000" width="100" height="100"/><f:Image source="res/closeDown.png"/><f:Label text="我去啊" fontSize="16" fontColor="0x00ff00" verticalCenter="0" horizontalCenter="0"/></f:Group>27';

             //richText.htmlText = "<u>1<s></u>2</s>";

             //console.log(richText.img1,richText.ui1);
             //setTimeout(function () {
             //    richText.htmlText = "123";
             //    setTimeout(function () {
             //        richText.htmlText = '我<img src="res/closeDown.png"/>时间<font color="#0000ff" size="30">:<font color="#ff0000" size="25">20<br/><br/><font color="#00ffff"><font size="16">我</font></font></font>11</font>1227555';
             //    }, 500);
             //}, 5000);
             flower.Stage.getInstance().addChild(richText);


             //console.log(flower.StringDo.split("aaawqqw\rb21oiop21\ncsa,las;<br/>dsasa;asl;", ["\r", "\n", "<br/>"]));

             return;//*/


            //var ui = new flower.UIParser();
            //ui.parseUIAsync("res/Test3.xml");
            //flower.Stage.getInstance().addChild(ui);
            //return;
        }
    }]);

    return Main;
}();///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////