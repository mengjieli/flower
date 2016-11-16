var fs = require("fs");
var path = require("path");

class Platform {
    static type = "remote";
    static startSync = true;
    static native = true;

    static stage;
    static width;
    static height;
    static server;

    static start(engine, root, background, readyBack) {
        flower.system.platform = Platform.type;
        flower.system.native = Platform.native;
        setTimeout(Platform._run, 0);
        //server =
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
        setTimeout(Platform._run, 0);
    }

    static pools = {};

    static create(name) {
        var pools = Platform.pools;
        if (name == "Sprite") {
            return new PlatformSprite();
        }
        if (name == "Bitmap") {
            return new PlatformBitmap();
        }
        if (name == "TextField") {
            return new PlatformTextField();
        }
        if (name == "TextInput") {
            return new PlatformTextInput();
        }
        if (name == "TextArea") {
            return new PlatformTextArea();
        }
        if (name == "Shape") {
            return new PlatformShape();
        }
        if (name == "Mask") {
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