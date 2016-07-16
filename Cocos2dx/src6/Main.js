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

        //var ui = new flower.UIParser();
        //ui.parseUIAsync("modules/gameEditor/EditorMain.xml");
        //flower.Stage.getInstance().addChild(ui);

        var parser = new flower.UIParser();
        var ui = parser.parseUI(`
        <f:Group xmlns:f="flower">
            <f:Image source="res/bg.jpg"/>
            <f:Button id="button" x="100" y="100" width="80" height="20">
                <f:RectUI percentWidth="100" percentHeight="100" fillColor.up="0x8888aa" fillColor.down="0x666688"/>
                <f:Label text="按钮"/>
            </f:Button>
        </f:Group>
        `);
        flower.Stage.getInstance().addChild(ui);
        ui.button.click = function () {
            var shortcut = flower.Stage.getShortcut();
            var file;
            file = new flower.File("res/a.txt");
            file.saveText("abcdefg\nsss朵朵", function (flag) {
                console.log(flag);
            });
            file = new flower.File("res/a.png");
            file.savePNG(shortcut.colors, shortcut.width, shortcut.height, function (flag) {
                trace(flag);
            });
        };

    }
}
