class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        trace("ready");
        var preloading = new PreLoading();
        preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        var stage = flower.Stage.getInstance();
        stage.backgroundColor = 0;

        var ui = new flower.UIParser();
        ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        //ui.parseUIAsync("modules/dungeonEditor/Main.xml");
        stage.addChild(ui);
    }
}
