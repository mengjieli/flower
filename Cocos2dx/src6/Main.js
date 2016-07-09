class Main {
    constructor() {
        flower.start(this.ready.bind(this), 2, "cn");
    }

    ready() {
        var loader = new flower.URLLoader("http://192.168.1.145:11001/project.manifest");
        //loader.method = flower.URLLoaderMethod.HEAD;
        loader.load();
        loader.addListener(flower.Event.COMPLETE, function (e) {
            flower.trace(flower.ObjectDo.toString(e.data));
        })
        return;
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
        flower.Stage.getInstance().addChild(ui);
    }
}