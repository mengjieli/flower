class Main {
    constructor() {
        flower.start(this.ready.bind(this), 2, "cn");
    }

    ready() {
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

        var load = new flower.URLLoaderList(["Close.json", "Image.png", "res/qq.png", "res/color.png"]);
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

    onLoadComplete(e) {
        var list = e.data;
        //flower.trace("纹理列表", list);
        //flower.trace(e.data[0].desc);

        var container = new flower.Sprite();
        //container.width = 150;
        //container.height = 200;
        flower.Stage.getInstance().addChild(container);
        container.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);

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
        //return;

        var bm = new flower.Bitmap();
        bm.x = bm.y = 100;
        //bm.width = bm.height = 200;
        bm.scaleX = bm.scaleY = 4;
        bm.texture = e.data[1];
        bm.rotation = 30;
        bm.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_MOVE, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_END, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        //bm.addListener(flower.MouseEvent.MOUSE_MOVE, function (e) {
        //                 flower.trace(e.currentTarget.name,e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        //}, this);
        bm.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
            bm.scale9Grid = new flower.Rectangle(30, 25, 40, 50);
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
            bm.scale9Grid = null;
            flower.trace(e.currentTarget.name, e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addChild(bm);

        flower.trace(container.width, container.height);

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


        var txt = new flower.TextInput();
        txt.x = 0;
        txt.y = 0;
        txt.text = "你好啊，笨蛋12321321";
        txt.fontColor = 0x00ff00;
        container.addChild(txt);
    }
}