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

        var panel = new Tab();
        panel.x = 100;
        panel.y = 100;
        flower.Stage.getInstance().addChild(panel);

        //var ui = new flower.UIParser();
        //ui.parseUIAsync("res/test/TestTree.xml");
        //ui.addListener(flower.Event.COMPLETE, this.loadUIComplete, this);
        //flower.Stage.getInstance().addChild(ui);
    }

    //loadUIComplete(e) {
    //    var ui = e.data;
    //    var dir = new flower.Direction("res");
    //    ui.dataProvider = dir.list;
    //}
}