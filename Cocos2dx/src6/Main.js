class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        var preloading = new PreLoading();
        preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);

        //var ui = new flower.UIParser();
        //ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        //flower.Stage.getInstance().addChild(ui);

        var parser = new flower.UIParser();
        var ui = parser.parseUI(`
        <f:Group xmlns:f="flower">
            <f:Image source="res/bg.jpg"/>
            <f:Button id="button" x="100" y="100" width="80" height="20">
                <f:RectUI percentWidth="100" percentHeight="100" fillColor.up="0x8888aa" fillColor.down="0x666688"/>
                <f:Label text="按钮"/>
            </f:Button>
        </f:Group>
        `);
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
            (renderTexture.getSprite()).setAnchorPoint(cc.p(0.5, 0.5));
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
}
