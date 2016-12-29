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
            var stage = flower.Stage.getInstance();
            var sp = new flower.Sprite();
            stage.addChild(sp);
            //sp.scaleX = 1.5;
            //sp.scaleY = 1.5;

            var rect = new flower.Rect();
            rect.width = 300;
            rect.height = 150;
            rect.x = rect.y = 200;
            sp.addChild(rect);
            //rect.scaleX = rect.scaleY = 1.5;
            //
            var image2 = new flower.Image("res/font.png");
            image2.x = image2.y = 200;
            image2.alpha = 0.3;
            sp.addChild(image2);
            image2.scale9Grid = "170,75,114,49";
            image2.width = 600;
            image2.height = 300;
            //image2.scaleX = image2.scaleY = 2;
            //image2.rotation = 30;
            //return;
            //
            //var image2 = new flower.Image("res/font.png");
            //image2.x = image2.y = 200;
            //image2.alpha = 0.3;
            //image2.scale9Grid = "170,75,114,49";
            //image2.width = 300;
            //image2.height = 150;
            //sp.addChild(image2);
            //image2.scaleX = image2.scaleY = 1.5;

            var image = new flower.Image("font.png#PLIST#res/pkg.plist");
            image.x = image.y = 200;
            image.scale9Grid = "170,75,114,49";
            image.width = 600;
            image.height = 300;
            sp.addChild(image);
            //image.rotation = 30;
            //image.scaleX = image.scaleY = 1.5;
            image.addListener(flower.MouseEvent.MOUSE_OVER,function(e){
                trace("over");
                image.alpha = 0.5;
            })
            image.addListener(flower.MouseEvent.MOUSE_OUT,function(e){
                image.alpha = 1;
                trace("out");
            })
            image.addListener(flower.Event.COMPLETE,function(){
                trace("加载完成",image.width,image.height,image.scaleX,image.scaleY)
            })
            //image.touchSpace = false;
            //image.scaleX = 2;
            //flower.Tween.to(image,2,{rotation:360})


            return;
            flower.URLLoader.urlHead = "http://localhost:12000/";

            var preloading = new PreLoading();
            preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        }
    }, {
        key: "loadThemeComplete",
        value: function loadThemeComplete(e) {
            e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
            var stage = flower.Stage.getInstance();

            var ui = new flower.UIParser();
            ui.parseUIAsync("res/JSONTextArea.xml");
            stage.addChild(ui);
        }
    }]);

    return Main;
}();