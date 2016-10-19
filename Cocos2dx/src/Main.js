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

            //var richText = new flower.RichText();
            //flower.Stage.getInstance().addChild(richText);
            //
            //return;

            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();
            stage.backgroundColor = 0;

            var ui = new flower.UIParser();
            ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
            stage.addChild(ui);

            setTimeout(function(){
                var btn = new flower.Rect();
                btn.fillAlpha = 0.5;
                btn.fillColor = 0xff0000;
                btn.width = btn.height = 100;
                btn.x = btn.y = 500;
                stage.addChild(btn);
                btn.addListener(flower.TouchEvent.TOUCH_BEGIN,function(e){
                    flower.CoreTime.$playEnterFrame = !flower.CoreTime.$playEnterFrame;
                    setTimeout(function(){
                        flower.CoreTime.$playEnterFrame = !flower.CoreTime.$playEnterFrame;
                    },5000);
                });
            },5000);

        }
    }]);

    return Main;
}();///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////