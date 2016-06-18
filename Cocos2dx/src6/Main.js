class Main {
    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready(stage, stage2) {
        new Test();

        var load = new flower.URLLoader("res/actions/display/Close.json");
        load.addListener(flower.Event.COMPLETE, this.loadJsonComplete, this);
        load.load();

        var load = new flower.URLLoader("res/actions/rpg/RolerMove.js");
        load.addListener(flower.Event.COMPLETE, this.loadJsComplete, this);
        load.load();

        var load = new flower.URLLoader("res/qq.png");
        load.addListener(flower.Event.COMPLETE, this.loadImageComplete, this);
        load.load();

        this.stage = stage;
        this.stage2 = stage2;
    }

    loadJsonComplete(e) {
        //console.log(e.data);
    }

    loadJsComplete(e) {
        console.log(e.data);
    }

    loadImageComplete(e) {
        //console.log(e.data);
        var container = new flower.Sprite();
        flower.Stage.getInstance().addChild(container);
        container.x = 50;
        container.y = 100;
        //container.scaleX = 0.5;
        //container.scaleY = 0.25;

        var bitmap = new flower.Bitmap(e.data);
        container.addChild(bitmap);
        //bitmap.x = 100;
        //bitmap.y = 150;
        //bitmap.scaleX = 2;
        //bitmap.scaleY = 4;
        bitmap.rotation = 0;
        //setInterval(function () {
        //    container.rotation++;
        //    bitmap.rotation--;
        //}, 30);
        //this.stage.setPosition(200, 200);

        //var sp = new cc.Sprite("res/qq.png");
        //this.stage2.addChild(sp);
        //sp.initWithTexture(e.data.$nativeTexture);
        //sp.setPosition(100, 100);
    }
}