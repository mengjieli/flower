class Main {
    constructor() {
        flower.start(this.ready.bind(this), 2, "cn");
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
        ui.parseUIAsync("res/test/ScrollerList.xml");
        flower.Stage.getInstance().addChild(ui);
    }
}