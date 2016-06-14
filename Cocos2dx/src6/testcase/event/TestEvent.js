class TestEvent extends TestBase {
    constructor() {
        super();
        this.addCase(
            new TestCase("EventDispatcher.addListener", "game", function () {
                var dispatcher = new flower.EventDispatcher();
                dispatcher.addListener("game", function (e) {
                    this.getResult(e.type);
                }, this);
                setTimeout(function(){
                    dispatcher.dispatchWidth("game");
                },1000);
            })
        );
    }
}