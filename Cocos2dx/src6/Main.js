class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        trace("ready");

        /*var array = new flower.ArrayValue(["a", "b", "c"]);
         console.log(array.length, array[0],array[1],array[2]);
         array[1] = "mm";
         console.log(array.length, array[1]);*/

        var array = new flower.ArrayValue();
        var time = new Date().getTime();
        for (var i = 0; i < 1000; i++) {
            array[i] = "a" + i;
        }
        console.log(new Date().getTime() - time, array.length);
        time = new Date().getTime();
        for (var i = 0; i < 1000; i++) {
            var val = array[i];
        }
        console.log(new Date().getTime() - time, array.length);
        return;
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
