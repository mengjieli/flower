var fs = require("fs");
var path = require("path");

class Platform {
    static type = "cocos2dx";
    static native = cc.sys.isNative;

    static stage;
    static width;
    static height;

    static start(engine, root, background, nativeStage = null, touchShow = null) {
        flower.system.platform = Platform.type;
        flower.system.native = Platform.native;
        RETINA = cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX ? true : false;
        var scene = cc.Scene.extend({
            ctor: function () {
                this._super();
                this.scheduleUpdate();
                //注册鼠标事件
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch) {
                        engine.$addTouchEvent("begin", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                        return true;
                    }.bind(this),
                    onTouchMoved: function (touch) {
                        engine.$addTouchEvent("move", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                        return true;
                    }.bind(this),
                    onTouchEnded: function (touch) {
                        engine.$addTouchEvent("end", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                        return true;
                    }.bind(this)
                }, this);
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: function (e) {
                        engine.$addMouseMoveEvent(math.floor(e.getLocation().x), Platform.height - math.floor(e.getLocation().y));
                    }.bind(this)
                }, this);
            },
            update: function (dt) {
                trace("dt", dt);
            }
        });
        Platform.stage2 = root.show;
        Platform.stage = nativeStage || new scene();
        Platform.stage.update = Platform._run;
        if (nativeStage == null) {
            cc.director.runScene(Platform.stage);
        } else {
            //注册鼠标事件
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch) {
                    if (engine.$getMouseTarget(math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y), true) == engine) {
                        return false;
                    }
                    engine.$addTouchEvent("begin", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                    return true;
                },
                onTouchMoved: function (touch) {
                    engine.$addTouchEvent("move", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                    return true;
                },
                onTouchEnded: function (touch) {
                    engine.$addTouchEvent("end", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                    return true;
                }
            }, touchShow || nativeStage);
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (e) {
                    engine.$addMouseMoveEvent(math.floor(e.getLocation().x), Platform.height - math.floor(e.getLocation().y));
                }
            }, cc.director.getRunningScene());
        }
        Platform.width = cc.director.getWinSize().width;
        Platform.height = cc.director.getWinSize().height;
        engine.$resize(Platform.width, Platform.height);
        //background.show.setPositionY(Platform.height);
        //Platform.stage.addChild(background.show);
        root.show.setPositionY(Platform.height);
        Platform.stage.addChild(root.show);
        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    engine.$onKeyDown(key);
                },
                onKeyReleased: function (key, event) {
                    engine.$onKeyUp(key);
                }
            }, Platform.stage);
        } else {
            trace("KEYBOARD Not supported");
        }
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
            item[0].apply(null, item.slice(1, item.length));
        }
    }

    static pools = {};

    static create(name) {
        var pools = Platform.pools;
        if (name == "Sprite") {
            if (pools.Sprite && pools.Sprite.length) {
                return pools.Sprite.pop();
            }
            DebugInfo.nativeDisplayInfo.sprite++;
            return new PlatformSprite();
        }
        if (name == "Bitmap") {
            if (pools.Bitmap && pools.Bitmap.length) {
                return pools.Bitmap.pop();
            }
            DebugInfo.nativeDisplayInfo.bitmap++;
            return new PlatformBitmap();
        }
        if (name == "TextField") {
            if (pools.TextField && pools.TextField.length) {
                return pools.TextField.pop();
            }
            DebugInfo.nativeDisplayInfo.text++;
            return new PlatformTextField();
        }
        if (name == "TextInput") {
            if (pools.TextInput && pools.TextInput.length) {
                return pools.TextInput.pop();
            }
            DebugInfo.nativeDisplayInfo.text++;
            return new PlatformTextInput();
        }
        if (name == "Shape") {
            if (pools.Shape && pools.Shape.length) {
                return pools.Shape.pop();
            }
            DebugInfo.nativeDisplayInfo.shape++;
            return new PlatformShape();
        }
        if (name == "Mask") {
            if (pools.Mask && pools.Mask.length) {
                return pools.Mask.pop();
            }
            DebugInfo.nativeDisplayInfo.sprite++;
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


    static getShortcut() {
        var scene = cc.director.getRunningScene();
        var hasScale = cc.sys.os === cc.sys.OS_OSX && cc.sys.isNative ? true : false;
        var width = cc.director.getWinSize().width * (hasScale ? 2 : 1);
        var height = cc.director.getWinSize().height * (hasScale ? 2 : 1);
        var renderTexture = new cc.RenderTexture(width, height, 0, 0);
        renderTexture.begin();
        scene.visit();
        renderTexture.end();
        var w = width;
        var h = height;
        var pixels = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        var colors = [];
        var index;
        for (var y = 0; y < h; y++) {
            if (hasScale && y % 2 != 0) continue;
            for (var x = 0; x < w; x++) {
                if (hasScale && x % 2 != 0) continue;
                index = (x + (h - 1 - y) * w) * 4;
                colors.push(pixels[index]);
                colors.push(pixels[index + 1]);
                colors.push(pixels[index + 2]);
                colors.push(pixels[index + 3]);
            }
        }
        return {
            colors: colors,
            width: w * (hasScale ? 0.5 : 1),
            height: h * (hasScale ? 0.5 : 1)
        };
    }
}