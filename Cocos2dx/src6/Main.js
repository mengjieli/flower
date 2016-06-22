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

        var load = new flower.URLLoaderList(["Close.json", "Image.png", "res/qq.png"]);
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
        console.log(e.data[0]);

        var container = flower.Stage.getInstance();
        container.width = 150;
        container.height = 200;

        var bm = new flower.Bitmap();
        bm.x = bm.y = 100;
        bm.scaleX = bm.scaleY = 2;
        bm.texture = e.data[1];
        bm.rotation = 30;
        bm.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_MOVE, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_END, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        bm.addListener(flower.MouseEvent.MOUSE_MOVE, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        container.addChild(bm);

        console.log(container.width, container.height);

        setTimeout(function () {
            bm.texture = list[2];
            flower.trace(bm.scaleX, bm.scaleY);
            console.log(container.width, container.height);
        }, 1500);

        var qq = new flower.Bitmap();
        qq.x = qq.y = 300;
        qq.texture = e.data[2];
        container.addChild(qq);
        qq.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_MOVE, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_END, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        qq.addListener(flower.TouchEvent.TOUCH_RELEASE, function (e) {
            console.log(e.type, e.touchX, e.touchY, e.stageX, e.stageY);
        }, this);
        console.log(container.width, container.height);
    }
}