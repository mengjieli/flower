class Main {
    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        new Test();

        flower.Stage.getInstance().backgroundColor = 0xf6f6f6;
        var theme = new flower.Theme("res/theme/theme.json");
        theme.load();
        theme.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        //Alert.show("测试啊");
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