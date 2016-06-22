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
            new Test();

            var res = new flower.ResItem("Close.json", flower.ResType.JSON);
            res.addURL("res/actions/display/Close@en.json");
            res.addURL("res/actions/display/Dispose@cn.json");
            flower.Res.addRes(res);

            res = new flower.ResItem("Image.png", flower.ResType.IMAGE);
            res.addURL("res/font.png");
            res.addURL("res/font@100x100@cn@2.png");
            res.addURL("res/font@100x100@en.png");
            flower.Res.addRes(res);

            var load = new flower.URLLoaderList(["Close.json", "Image.png"]);
            load.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
            load.load();

            //var load = new flower.URLLoader("Close.json");
            //load.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
            //load.load();

            ////var load = new flower.URLLoader("res/castle1.png");
            //var load = new flower.URLLoader(flower.Res.getRes("res/font.png"));
            ////load.scale = 1.49;
            ////load.language = "cn";
            //load.addListener(flower.Event.COMPLETE, this.loadImageComplete, this);
            //load.load();
        }
    }, {
        key: "onLoadComplete",
        value: function onLoadComplete(e) {
            console.log(e.data[0]);

            var container = flower.Stage.getInstance();
            var bm = new flower.Bitmap(e.data[1]);
            bm.x = bm.y = 50;
            bm.scaleX = bm.scaleY = 2;
            container.addChild(bm);
        }
    }]);

    return Main;
}();