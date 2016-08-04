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

            //var px1 = 50;
            //var py1 = 0;
            //var px2 = -50;
            //var py2 = 50 * Math.sqrt(3);
            //
            //var r = this.getR(px1, py1, px2, py2);
            //console.log(r);
            //return;

            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "getR",
        value: function getR(px1, py1, px2, py2) {
            var cos = (px1 * px2 + py1 * py2) / (Math.sqrt(px1 * px1 + py1 * py1) * Math.sqrt(px2 * px2 + py2 * py2));
            var sin = (px1 * py2 - py1 * px2) / (Math.sqrt(px1 * px1 + py1 * py1) * Math.sqrt(px2 * px2 + py2 * py2));
            console.log(sin, cos);
            var r = Math.acos(cos);
            r = r * 180 / Math.PI;
            return r;
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();
            stage.backgroundColor = 0x005500;
            var ui = new flower.UIParser();
            ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
            stage.addChild(ui);
        }
    }]);

    return Main;
}();