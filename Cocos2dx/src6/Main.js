class Main {
    constructor() {
        flower.start(this.ready.bind(this), 2, "cn");
    }

    ready() {
        new Test();

        var container = new flower.Sprite();
        flower.Stage.getInstance().addChild(container);
        container.x = container.y = 50;

        //var image = new flower.Image("res/qq.png");
        //container.addChild(image);
        //image.x = image.y = 0;
        //
        //
        //var image = new flower.Image("res/qq.png");
        //container.addChild(image);
        //image.x = image.y = 100;
        //
        //
        //image = new flower.Image();
        //image.source = "castle/dikuai_04.png#PLIST#res/castlebuilding1.plist";
        //image.x = image.y = 150;
        //container.addChild(image);

        var define = {
            "name": "Size",
            "members": {
                "width": {"type": "int", "init": 100},
                "height": {"type": "int", "init": 2}
            }
        }
        var dm = flower.DataManager.getInstance();
        dm.addDefine(define);
        define = {
            "name": "Sizes",
            "extends": "Size",
            "members": {
                "length": {"type": "uint"}
            }
        }
        dm.addDefine(define);
        var size = dm.createData("Sizes");
        this.data = size;
        flower.trace(size.width.value, size.height.value, size.length.value);

        //new flower.Binding(this, null, "text", "{this.data.width*this.data.height}");
        //size.width.value = 120;

        //var clazz = `
        //<f:Group width="100" height="200" xmlns:f="flower">
        //    <f:RectUI percentWidth="100" percentHeight="100"/>
        //</f:Group>
        //`;
        var clazz = `
        <f:Group xmlns:f="flower">
            <f:TabBar dataProvider="{viewStack}">
                <f:itemRenderer>
                    <f:ItemRenderer width="100" height="20">
                        <f:Label text="{this.data.text}" color.up="0xff0000" color.selectedUp="0x00ff00" fontColor="0x00ff00"/>
                    </f:ItemRenderer>
                </f:itemRenderer>
            </f:TabBar>
            <f:ViewStack x="50" y="50" id="viewStack">
                <f:Group>
                    <f:RectUI width="100" height="100"/>
                    <f:Label text="面板111111" fontColor="0xffffff"/>
                </f:Group>
                <f:Label text="面板2222" fontColor="0xffffff" fontSize="14"/>
                <f:Group id="g3">
                    <f:Button onClick="this.parent.removeChild(this);">
                        <f:Image source="res/font@100x100@cn@2.png"/>
                        <f:Label text="面板3" fontColor="0xffffff"/>
                    </f:Button>
                </f:Group>
            </f:ViewStack>
        </f:Group>
        `;

        var ui = new flower.UIParser();
        ui.parseUI(clazz);
        container.addChild(ui);

        (new flower.UIParser()).parseUIAsync("res/debug/Debug.xml");

        //ui.addListener(flower.TouchEvent.TOUCH_BEGIN, function () {
        //    ui.currentState = ui.currentState == "up" ? "down" : "up";
        //});

        //container.addListener(flower.TouchEvent.TOUCH_BEGIN, function () {
        //    //var image = new flower.Image("res/qq.png");
        //    //container.addChild(image);
        //    //image.x = image.y = 50;
        //    var res = new flower.ResItem("res/qq.png", flower.ResType.IMAGE);
        //    res.addInfo("res/qq2.png",null, null, null, null, null, true);
        //    (new flower.URLLoader(res)).load();
        //});
        //
        //
        //var load = new flower.URLLoader("res/castlebuilding1.plist");
        //load.load();
        //load.addListener(flower.Event.COMPLETE, function (e) {
        //    console.log("load plist complete");
        //    var plist = e.data;
        //    var texture = plist.getFrameTexture("castle/dikuai_04.png");
        //    var bm = new flower.Bitmap(texture);
        //    container.addChild(bm);
        //    bm.x = bm.y = 150;
        //});


        //var res = new flower.ResItem("Close.json", flower.ResType.JSON);
        //res.addURL("res/actions/display/Close@en.json");
        //res.addURL("res/actions/display/Dispose@cn.json");
        //flower.Res.addRes(res);
        //
        //res = new flower.ResItem("Image.png", flower.ResType.IMAGE);
        //res.addURL("res/font.png");
        //res.addURL("res/font@100x100@cn@2.png");
        //res.addURL("res/font@100x100@en.png");
        //flower.Res.addRes(res);
        //
        //var load = new flower.URLLoaderList(["Close.json", "Image.png", "res/qq.png", "res/color.png",
        //    "res/castlebg.png","res/castle.png","res/castle1.png","res/castle2.png","res/castle3.png"
        //    ,"res/castle4.png","res/castle5.png","res/castle6.png","res/castle7.png","res/castle8.png",
        //    "res/castle9.png","res/castle10.png"]);
        //load.addListener(flower.Event.COMPLETE, this.onLoadComplete, this);
        //load.load();

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

    set text(val) {
        flower.trace("set text :", val);
    }

    onLoadComplete(e) {
        var list = e.data;
        //flower.trace("纹理列表", list);
        //flower.trace(e.data[0].desc);

        var container = new flower.Group();
        container.width = 300;
        container.height = 400;
        //container.x = 100;
        //container.width = 150;
        //container.height = 200;
        flower.Stage.getInstance().addChild(container);
        container.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            container.dispose();

            //this.onLoadComplete({data: list});
            setTimeout(function () {
                this.onLoadComplete({data: list});
            }.bind(this), 5000);
        }, this);
        //container.shape.drawRect(0, 0, 350, 500);
        //container.scaleX = container.scaleY = 0.5;

        //var group = new flower.Group();
        //var dg = new flower.DataGroup();


        var h = 0;
        var s = 0;
        var l = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var blurX = 0;
        var blurY = 0;
        var color = 0;
        container.filters = [new flower.ColorFilter(h, s, l), new flower.StrokeFilter(1, color)];
        setInterval(function () {
            h += 5;
            r += 1;
            g += 2;
            b += 3;
            blurX += 0.1;
            blurY += 0.1;
            color = r << 16 | g << 8 | b;
            //flower.trace(h,s,l);
            if (h > 2700) {
                container.filters = null;
            } else {
                container.filters = [new flower.BlurFilter(blurX, blurY), new flower.ColorFilter(h, s, l), new flower.StrokeFilter(1, color)];
            }
        }, 50);

        //var bg = new flower.Image();
        //bg.texture = e.data[5];
        //bg.x = bg.y = 50;
        //container.addChild(bg);
        //
        //var bg2 = new flower.Image();
        //bg2.texture = e.data[4];
        //bg2.x = bg2.y = 100;
        //container.addChild(bg2);

        //for(var i = 1; i < 11; i++) {
        //    var castle = new flower.Image();
        //    castle.texture = e.data[5+i];
        //    castle.x = castle.y = 150;
        //    container.addChild(castle);
        //}

        var bm = new flower.Image();
        bm.x = bm.y = 100;
        //bm.width = bm.height = 400;
        bm.scaleX = bm.scaleY = 2;
        bm.texture = e.data[1];
        bm.left = 50;
        bm.right = 100;
        bm.top = 120;
        bm.bottom = 130;
        bm.rotation = 30;
        bm.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_MOVE, function (e) {
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_END, function (e) {
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        //bm.addListener(flower.MouseEvent.MOUSE_MOVE, function (e) {
        //                 flower.trace(e.currentTarget.name,e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        //}, this);
        bm.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
            bm.scale9Grid = new flower.Rectangle(30, 25, 40, 50);
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
            bm.scale9Grid = null;
            //flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addChild(bm);

        var bounds = bm.$getBounds();
        var matrix = bm.$getMatrix();
        flower.trace(bounds);
        //bounds.left = 0;
        //bounds.right = 100;
        var reverseMatrix = bm.$getReverseMatrix();
        reverseMatrix.$transformRectangle(bounds);
        flower.trace(bounds);

        var point = new flower.Point(0, 0);
        flower.trace(point);
        matrix.transformPoint(point.x, point.y, point);
        flower.trace(point);
        reverseMatrix.transformPoint(point.x, point.y, point);
        flower.trace(point);

        flower.trace("new point");
        point.setTo(100, 0);
        flower.trace(point);
        matrix.transformPoint(point.x, point.y, point);
        flower.trace(point);
        reverseMatrix.transformPoint(point.x, point.y, point);
        flower.trace(point);

        flower.trace("new point");
        point.setTo(0, 100);
        flower.trace(point);
        matrix.transformPoint(point.x, point.y, point);
        flower.trace(point);
        reverseMatrix.transformPoint(point.x, point.y, point);
        flower.trace(point);

        flower.trace(container.width, container.height);
        //bm.width = bm.height = null;
        //flower.trace(container.width, container.height);
        //return;

        //setTimeout(function () {
        //    bm.texture = list[2];
        //    flower.trace(bm.scaleX, bm.scaleY);
        //    flower.trace(container.width, container.height);
        //}, 5000);

        var qq = new flower.Bitmap();
        qq.x = -20;
        qq.y = 250;
        qq.scaleX = qq.scaleY = 0.25;
        qq.texture = e.data[3];
        container.addChild(qq);
        qq.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_MOVE, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_END, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        flower.trace(container.width, container.height);

        var label = new flower.TextField("什么情况啊，我根本不知道!!!");
        label.fontColor = 0xffff00;
        label.y = 30;
        label.width = 100;
        label.multiLine = false;
        label.fontSize = 30;
        container.addChild(label);


        var txt = new flower.TextInput();
        txt.x = 0;
        txt.y = 0;
        //txt.fontSize = 30;
        //txt.text = "你好啊，笨蛋12321321";
        txt.fontColor = 0x00ff00;
        txt.width = 100;
        txt.height = 50;
        container.addChild(txt);

        //for(var key in txt.$nativeShow.show) {
        //    flower.trace(key);
        //}

        var shape = new flower.Shape();
        shape.fillColor = 0x0000ff;
        shape.lineWidth = 1;
        shape.lineColor = 0xff0000;
        shape.x = 50;
        shape.y = 100;
        shape.drawRect(0, 0, 150, 50);
        container.addChild(shape);
        shape.addListener(flower.TouchEvent.TOUCH_END, function () {
            flower.Tween.to(shape, 2, {rotation: 1000, center: true}, null, {
                rotation: 0
            });
        }, this);

        //var rect = new cc.DrawNode();
        //var vertices = [{x:0,y:0}, {x:100,y:10},{x:100,y:100}, {x:0,y:100} ];
        //rect.drawPoly(vertices, null, 5, {r:255,g:0,b:0,a:255});
        //rect.setPosition(100,-100);
        //container.$nativeShow.show.addChild(rect);
    }
}