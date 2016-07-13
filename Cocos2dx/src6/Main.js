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

        var ui = new flower.UIParser();
        ui.parseUIAsync("res/gameEditor/EditorMain.xml");
        flower.Stage.getInstance().addChild(ui);
    }
}
