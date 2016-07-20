class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        trace("ready");
        var stage = flower.Stage.getInstance();
        var txt = new flower.TextField("测试文字啊啊啊");
        stage.addChild(txt);

        //var preloading = new PreLoading();
        //preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    //loadThemeComplete(e) {
    //    e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    //    var stage = flower.Stage.getInstance();
    //    stage.backgroundColor = 0x555555;
    //    var ui = new flower.UIParser();
    //    ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
    //    stage.addChild(ui);
    //}
}
