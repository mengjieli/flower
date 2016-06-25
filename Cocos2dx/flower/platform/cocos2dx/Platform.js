class Platform {
    static type = "cocos2dx";
    static native;

    static stage;
    static width;
    static height;

    static start(engine, root) {
        Platform.native = cc.sys.isNative;
        var scene = cc.Scene.extend({
            ctor: function () {
                this._super();
                this.scheduleUpdate();
                //注册鼠标事件
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchesBegan.bind(this),
                    onTouchMoved: this.onTouchesMoved.bind(this),
                    onTouchEnded: this.onTouchesEnded.bind(this)
                }, this);
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: this.onMouseMove.bind(this)
                }, this);
            },
            update: function (dt) {
                trace("dt", dt);
            },
            onMouseMove: function (e) {
                engine.$addMouseMoveEvent(Math.floor(e.getLocation().x), Platform.height - Math.floor(e.getLocation().y));
            },
            onTouchesBegan: function (touch) {
                engine.$addTouchEvent("begin",touch.getID()||0, Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesMoved: function (touch) {
                engine.$addTouchEvent("move",touch.getID()||0, Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesEnded: function (touch) {
                engine.$addTouchEvent("end",touch.getID()||0, Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
        });
        Platform.stage2 = root.show;
        Platform.stage = new scene();
        Platform.stage.update = Platform._run;
        cc.director.runScene(Platform.stage);
        Platform.width = cc.director.getWinSize().width;
        Platform.height = cc.director.getWinSize().height;
        root.show.setPositionY(Platform.height);
        //debugRoot.setPositionY(Platform.height);
        Platform.stage.addChild(root.show);
        //Platform.stage.addChild(debugRoot);
        //System.$mesureTxt.retain();
    }


    static _runBack;
    static lastTime = (new Date()).getTime();
    static frame = 0;

    static _run() {
        Platform.frame++;
        var now = (new Date()).getTime();
        Platform._runBack(now - Platform.lastTime);
        Platform.lastTime = now;
        if (PlatformURLLoader.loadingList.length) {
            var item = PlatformURLLoader.loadingList.shift();
            item[0](item[1], item[2], item[3], item[4]);
        }
    }

    static pools = {};

    static create(name) {
        var pools = Platform.pools;
        if (name == "Sprite") {
            if (pools.Sprite && pools.Sprite.length) {
                return pools.Sprite.pop();
            }
            return new PlatformSprite();
        }
        if (name == "Bitmap") {
            if (pools.Bitmap && pools.Bitmap.length) {
                return pools.Bitmap.pop();
            }
            return new PlatformBitmap();
        }
        if (name == "TextField") {
            if (pools.TextField && pools.TextField.length) {
                return pools.TextField.pop();
            }
            return new PlatformTextField();
        }
        if (name == "TextInput") {
            if (pools.TextInput && pools.TextInput.length) {
                return pools.TextInput.pop();
            }
            return new PlatformTextInput();
        }
        if (name == "Shape") {
            if (pools.Shape && pools.Shape.length) {
                return pools.Shape.pop();
            }
            return new PlatformShape();
        }
        if (name == "Mask") {
            if (pools.Mask && pools.Mask.length) {
                return pools.Mask.pop();
            }
            return new PlatformMask();
        }
        return null;
    }

    static release(name, object) {
        object.release();
        var pools = Platform.pools;
        if (!pools[name]) {
            pools[name] = [];
        }
        pools[name].push(object);

    }
}