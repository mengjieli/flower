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
            trace("ready");
            var stage = flower.Stage.getInstance();
            var txt = new flower.TextField("测试文字啊啊啊");
            stage.addChild(txt);

            //var preloading = new PreLoading();
            //preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }

        //loadThemeComplete(e) {
        //    e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        //    var stage = flower.Stage.getInstance();
        //    stage.backgroundColor = 0x555555;
        //    var ui = new flower.UIParser();
        //    ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        //    stage.addChild(ui);
        //}

    }]);

    return Main;
}();