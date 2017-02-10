var TestNewTexture = (function (_super) {

    __extends(TestNewTexture, _super);

    function TestNewTexture() {
        _super.call(this);

        flower.start(this.init.bind(this),null,null,{TIP:true});
    }

    TestNewTexture.prototype.init = function () {
        flower.Stage.getInstance().addChild(this);

        var sp = new NativeSprite("castle_ruins_0_0.png", "res/castle_ruins.plist");
        sp.setPosition(300,-300)
        this.$nativeShow.show.addChild(sp);

        //var sp = new NativeSprite("castle_ruins_0_0.png", "res/castle_ruins.plist");
        //sp.setPosition(500,-500)
        //this.$nativeShow.show.addChild(sp);

        setTimeout(function(){
            sp.dispose();
        },3000)
    }

    return TestNewTexture;
})(flower.Sprite);