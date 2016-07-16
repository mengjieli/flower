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
                //console.log("click1");
                //var texture = new cc.RenderTexture(200, 100, cc.Texture2D.PIXEL_FORMAT_BGRA8888);
                //var scene = cc.director.getRunningScene();
                //texture.begin();
                //scene.visit();
                //texture.end();
                //console.log("click6");
                //for (var key in texture) {
                //    console.log(key,texture[key]);
                //}
                //
                ////var sprite = new cc.Sprite();
                ////sprite.initWithTexture(texture);
                //texture.setPosition(100, 100);
                //scene.addChild(texture);
                ////texture.saveToFile("a.png");
                //console.log("click");

                var scene = cc.director.getRunningScene();
                var width = scene.width;
                var height = scene.height;
                var renderTexture = new cc.RenderTexture(width, height, 0, 0);
                renderTexture.getSprite().setAnchorPoint(cc.p(0.5, 0.5));
                renderTexture.setPosition(cc.p(220, -300));
                //renderTexture.setAnchorPoint(cc.p(0.5, 0.5));
                renderTexture.begin();
                scene.visit();
                renderTexture.end();
                var w = width;
                var h = height;
                var pixels = new Uint8Array(w * h * 4);
                gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                var colors = [];
                var index;
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        index = (x + (h - 1 - y) * w) * 4;
                        colors.push(pixels[index]);
                        colors.push(pixels[index + 1]);
                        colors.push(pixels[index + 2]);
                        colors.push(pixels[index + 3]);
                    }
                }
                //trace(flower.ObjectDo.toString(pixels))

                var file;
                //file = new flower.File("res/a.txt");
                //file.saveText("abcdefg\nsss朵朵", function (flag) {
                //    console.log(flag);
                //});
                file = new flower.File("res/a.png");
                file.savePNG(colors, w, h, function (flag) {
                    console.log(flag);
                });

                flower.Stage.getInstance().$nativeShow.show.addChild(renderTexture);
                //return  renderTexture.saveToFile(picName,0);
            };
        }
    }]);

    return Main;
}();