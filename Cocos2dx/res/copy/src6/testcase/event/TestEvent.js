class TestEvent extends TestBase {
    constructor() {
        super();
        this.addCase(
            new TestCase("EventDispatcher.addListener", "game", function () {
                var dispatcher = new flower.EventDispatcher();
                dispatcher.addListener("game", function (e) {
                    this.getResult(e.type);
                }, this);
                setTimeout(function () {
                    dispatcher.dispatchWith("game");
                }, 1000);
            })
        );

        this.addCase(
            new TestCase("EventDispatcher.removeListener1", false, function () {
                var dispatcher = new flower.EventDispatcher();
                var endListener = function () {
                    dispatcher.removeListener("go", goListener, this);
                    this.getResult(dispatcher.hasListener("go"));
                };
                dispatcher.addListener("end", endListener, this);
                var goListener = function () {
                    this.getResult(true);
                };
                dispatcher.addListener("go", goListener, this);
                dispatcher.dispatchWith("end");
            })
        );

        this.addCase(
            new TestCase("EventDispatcher.removeListener2", true, function () {
                var dispatcher = new flower.EventDispatcher();
                var endListener = function () {
                    dispatcher.removeListener("end", endListener, this);
                };
                dispatcher.addListener("end", endListener, this);
                var endListener2 = function () {
                    this.getResult(true);
                };
                dispatcher.addListener("end", endListener2, this);
                dispatcher.dispatchWith("end");
            })
        );

        this.addCase(
            new TestCase("EventDispatcher.removeListener2", true, function () {
                var dispatcher = new flower.EventDispatcher();
                var endListener = function () {
                    dispatcher.removeListener("end", endListener2, this);
                    this.getResult(true);
                };
                dispatcher.addListener("end", endListener, this);
                var endListener2 = function () {
                    this.getResult(false);
                };
                dispatcher.addListener("end", endListener2, this);
                dispatcher.dispatchWith("end");
            })
        );
    }
}