class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        trace("ready");
        //var stage = flower.Stage.getInstance();
        ////stage.scaleX = 3;
        //var txt = new flower.TextField("测试文字啊啊啦啦啦");
        //txt.width = 50;
        //txt.x = 100;
        //txt.y = 200;
        ////txt.scaleX = 5;
        ////txt.scaleY = 5;
        //txt.rotation = 30;
        //stage.addChild(txt);
        //
        //
        //txt.addListener(flower.TouchEvent.TOUCH_BEGIN, function (e) {
        //    console.log(e);
        //});
        //
        //
        //txt.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
        //    console.log(e);
        //});
        //txt.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
        //    console.log(e);
        //});
        //
        //
        ///*var loader=  new flower.URLLoader("res/closeDown.png");
        // loader.addListener(flower.Event.COMPLETE,function(e){
        // var image = new flower.Image(e.data);
        // stage.addChild(image);
        // });
        // loader.load();*/
        //var image = new flower.Image("res/closeDown.png");
        //stage.addChild(image);
        //image.addListener(flower.MouseEvent.MOUSE_OVER, function (e) {
        //    console.log(e);
        //});
        //image.addListener(flower.MouseEvent.MOUSE_OUT, function (e) {
        //    console.log(e);
        //});
        ////image.scaleX = 3;
        //image.rotation = 30;
        //
        //var mask = new flower.Mask();
        //stage.addChild(mask);
        //mask.shape.drawRect(20,20,200,300);
        //image = new flower.Image("res/bg.jpg");
        ///*var shape = new flower.Shape();
        //shape.fillColor = 0xff0000;
        //shape.drawRect(0, 0, 200, 100);*/
        //mask.addChild(image);
        //mask.x = 200;
        //mask.y = 200;

        //var shape = new flower.Shape();
        //shape.fillColor = 0x00ff00;
        //shape.drawRect(0,0,100,20);
        //flower.Stage.getInstance().addChild(shape);
        //shape.x = shape.y = 100;
        //shape.addListener(flower.TouchEvent.TOUCH_BEGIN,function(e){
        //    console.log("click");
        //    shape.clear();
        //    shape.fillColor = 0xff0000;
        //    shape.drawRect(-50,-50,100,20);
        //});
        //
        //var input = new flower.TextInput();
        //input.x = input.y = 20;
        //flower.Stage.getInstance().addChild(input);

        var preloading = new PreLoading();
        preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        var stage = flower.Stage.getInstance();
        stage.backgroundColor = 0x555555;
        var ui = new flower.UIParser();
        ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        stage.addChild(ui);
    }
}
