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
            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();
            //var ui = new flower.UIParser();
            //ui.parseUIAsync("res/JSONTextArea.xml");
            //stage.addChild(ui);
            var label = new flower.TextField("添加文字");
            label.fontColor = 0xff0000;
            stage.addChild(label);
            label.addListener(flower.TouchEvent.TOUCH_BEGIN,function(){
                var loader = new flower.URLLoader("res/txt.txt");
                loader.addListener(flower.Event.COMPLETE, function (e) {
                    var txt = new flower.TextField();
                    txt.fontColor = 0xff0000;
                    txt.text = e.data;
                    txt.width = 500;
                    txt.wordWrap = true;
                    txt.x = 100;
                    txt.y = 50;
                    txt.selectable = false;
                    stage.addChild(txt);
                    txt.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
                        txt.startDrag();
                    });
                });
                loader.load();
            })

        }
    }]);

    return Main;
}();