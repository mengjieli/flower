"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        flower.start(this.ready.bind(this), 2, "cn");
    }

    _createClass(Main, [{
        key: "ready",
        value: function ready() {
            var socket = new flower.VBWebSocket();
            socket.connect("192.168.1.7", 9900);
            socket.addListener(flower.Event.CONNECT, this.onConnect, this);

            return;
            new Test();
            flower.Stage.getInstance().backgroundColor = 0xf6f6f6;
            var theme = new flower.Theme("res/theme/theme.json");
            theme.load();
            theme.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            //Alert.show("测试啊");
            var ui = new flower.UIParser();
            ui.parseUIAsync("res/test/TestTree.xml");
            flower.Stage.getInstance().addChild(ui);
        }
    }, {
        key: "onConnect",
        value: function onConnect(e) {
            console.log(e.type);
        }
    }]);

    return Main;
}();