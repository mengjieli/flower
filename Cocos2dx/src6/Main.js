class Main {

    socket;

    constructor() {
        flower.start(this.ready.bind(this));
    }

    ready() {
        flower.URLLoader.urlHead = "http://localhost:12000/";
        //new BallGame();
        //
        new ChineseChess();

        //var index = 0;
        //var stage = flower.Stage.getInstance();
        //
        //var shape = new flower.Shape();
        //shape.lineWidth = 1;
        //stage.addChild(shape);
        //
        //var shape2 = new flower.Shape();
        //shape2.lineWidth = 1;
        //stage.addChild(shape2);
        //
        //var segment = new math2d.Segment();
        //
        //stage.addListener(flower.TouchEvent.TOUCH_END, function (e) {
        //    if (index > 2) {
        //        index = 0;
        //        shape.clear();
        //        shape2.clear();
        //    }
        //    if (index == 0) {
        //        segment.point1.x = e.stageX;
        //        segment.point1.y = e.stageY;
        //        index++;
        //    } else if (index == 1) {
        //        segment.point2.x = e.stageX;
        //        segment.point2.y = e.stageY;
        //        shape.drawLine(segment.point1.x, segment.point1.y, segment.point2.x, segment.point2.y);
        //        index++;
        //    } else if (index == 2) {
        //        var point1 = new math2d.Point(e.stageX, e.stageY);
        //        var point2 = math2d.getSegmentFootPoint(point1, segment);
        //        shape2.drawLine(point1.x, point1.y, point2.x, point2.y);
        //        index++;
        //
        //    }
        //});

        //var preloading = new PreLoading();
        //preloading.addListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
    }

    loadThemeComplete(e) {
        e.currentTarget.removeListener(flower.Event.COMPLETE, this.loadThemeComplete, this);
        var stage = flower.Stage.getInstance();
        var ui = new flower.UIParser();
        ui.parseUIAsync("res/JSONTextArea.xml");
        stage.addChild(ui);
    }
}