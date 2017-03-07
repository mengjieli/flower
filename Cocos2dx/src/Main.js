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

        flower.start(this.ready.bind(this), {DEBUG: true, TIP: true});
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {
            var dp = new flower.EventDispatcher();
            var first = true;
            var func1 = function (e) {
                console.log("1");
                console.log(dp.hasListener("cd"));
                dp.removeListener("cd", func2);
                console.log(dp.hasListener("cd"));
                if(first) {
                    first = false;
                    dp.dispatchWith("ab");
                }
            }
            var func2 = function (e) {
                console.log("2");
            }
            dp.addListener("ab", func1);
            dp.addListener("cd", func2);
            dp.dispatchWith("ab");

            return;
            flower.URLLoader.urlHead = "http://localhost:12000/";

            var parser = new flower.UIParser();
            parser.parseUIAsync("res/Test.xml");
            return;
            var p = flower.DataManager.createData("Progress");
            p.max = 100;
            p.current = 5;
            console.log(p.value)
            //
            //return;
            var cfg = {
                "name": "Max",
                "members": {
                    "a": {
                        "type": "bool",
                        "check": false
                    },
                    "b": {
                        "type": "number",
                        "init": 1
                    },
                    "list": {
                        "type": "Array",
                        "typeValue": "Point"
                    },
                    "max": {
                        "type": "number",
                        "bind": "{for(list,$s=Math.max(($s||$i.x),$i.x))}"
                    },
                    "b2": {
                        "type": "number",
                        "bind": "{b*2}"
                    }
                }
            }
            flower.DataManager.addDefine(cfg);

            var d = flower.DataManager.createData("Max");
            d.list = [{x: 3, y: 1}, {x: 4, y: 2}, {x: 2, y: 3}];
            console.log(d.value)
            d.list[0].x++;
            d.list[0].x++;
            console.log(d.value)
            d.$a.addListener(flower.Event.CHANGE, function (e) {
                console.log("change");
            });
            d.a = true;
            d.a = true;
            d.a = true;

            return;
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
            label.addListener(flower.TouchEvent.TOUCH_BEGIN, function () {
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