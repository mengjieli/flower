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
        return;
        var panel = new Tab();
        panel.x = 270;
        panel.y = 10;
        flower.Stage.getInstance().addChild(panel);

        flower.Stage.getInstance().addChild(new editer.PluginBase());
        return;
        var ui = new flower.UIParser();
        ui.parseUIAsync("res/test/TestTree.xml");
        ui.addListener(flower.Event.COMPLETE, this.loadUIComplete, this);
        flower.Stage.getInstance().addChild(ui);
    }

    loadUIComplete(e) {
        var ui = e.data;
        var dir = new flower.Direction("res");
        ui.dataProvider = dir.list;
    }
}
