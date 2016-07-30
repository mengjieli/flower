class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        trace("ready");

        //var rect = new flower.Rect();
        //rect.width = 100;
        //rect.height = 100;
        //rect.fillColor = 0x88aa88;
        //rect.lineWidth = 1;
        //rect.lineColor = 0xff0000;
        //flower.Stage.getInstance().addChild(rect);
        //
        //return;
        var preloading = new PreLoading();
        preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        var stage = flower.Stage.getInstance();
        stage.backgroundColor = 0x005500;
        var ui = new flower.UIParser();
        ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        stage.addChild(ui);
    }
}
