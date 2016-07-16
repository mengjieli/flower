"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        flower.start(this.ready.bind(this));
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {
            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);

            //var ui = new flower.UIParser();
            //ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            //flower.Stage.getInstance().addChild(ui);

            var parser = new flower.UIParser();
            var ui = parser.parseUI("\n        <f:Group xmlns:f=\"flower\">\n            <f:Image source=\"res/bg.jpg\"/>\n            <f:Button id=\"button\" x=\"100\" y=\"100\" width=\"80\" height=\"20\">\n                <f:RectUI percentWidth=\"100\" percentHeight=\"100\" fillColor.up=\"0x8888aa\" fillColor.down=\"0x666688\"/>\n                <f:Label text=\"按钮\"/>\n            </f:Button>\n        </f:Group>\n        ");
            flower.Stage.getInstance().addChild(ui);
            ui.button.click = function () {
                var shortcut = flower.Stage.getShortcut();
                var file;
                file = new flower.File("res/a.txt");
                file.saveText("abcdefg\nsss朵朵", function (flag) {
                    console.log(flag);
                });
                file = new flower.File("res/a.png");
                file.savePNG(shortcut.colors, shortcut.width, shortcut.height, function (flag) {
                    trace(flag);
                });
            };
        }
    }]);

    return Main;
}();