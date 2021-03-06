class Platform {
    static type = "cocos2dx";
    static native = false;

    static stage;
    static width;
    static height;
    static mouseX;
    static mouseY;
    static engine;
    static touchDown = false;

    static start(engine, root, background) {
        flower.system.platform = Platform.type;
        flower.system.native = Platform.native;
        var paramString = window.location.search;
        while (paramString.charAt(0) == "?") {
            paramString = paramString.slice(1, paramString.length);
        }
        Platform.engine = engine;
        var params = {};
        var array = paramString.split("&");
        for (var i = 0; i < array.length; i++) {
            var paramArray = array[i].split("=");
            var key = paramArray[0];
            if (paramArray.length > 1) {
                params[key] = array[i].slice(key.length + 1, array[i].length);
            } else {
                params[key] = null;
            }
        }
        for (var key in params) {
            flower.params[key] = params[key];
        }
        RETINA = false;
        Platform.native = false;//cc.sys.isNative;
        var div = document.getElementById("FlowerMain");
        var mask = document.createElement("div");
        mask.style.position = "absolute";
        mask.style.left = "0px";
        mask.style.top = "0px";
        mask.style.width = document.documentElement.clientWidth + "px";
        mask.style.height = document.documentElement.clientHeight + "px";
        document.body.appendChild(mask);
        document.body.onkeydown = function (e) {
            if(e.keyCode == 9) {
                e.preventDefault();
            }
            setTimeout(function () {
                engine.$onKeyDown(e.which);
            }, 0);
        }
        document.body.onkeyup = function (e) {
            setTimeout(function () {
                engine.$onKeyUp(e.which);
            }, 0);
        }
        div.appendChild(engine.$background.$nativeShow.show);
        div.appendChild(root.show);
        requestAnimationFrame.call(window, Platform._run);
        var touchDown = false;
        mask.onmousedown = function (e) {
            if (e.button == 2) return;
            touchDown = true;
            Platform.touchDown = true;
            engine.$addTouchEvent("begin", 0, math.floor(e.clientX), math.floor(e.clientY));
        }
        mask.onmouseup = function (e) {
            if (e.button == 2) return;
            touchDown = false;
            Platform.touchDown = false;
            engine.$addTouchEvent("end", 0, math.floor(e.clientX), math.floor(e.clientY));
        }
        mask.onmousemove = function (e) {
            if (e.button == 2) return;
            if (e.buttons == 0 && touchDown) {
                touchDown = false;
                Platform.touchDown = false;
                engine.$addTouchEvent("end", 0, math.floor(e.clientX), math.floor(e.clientY));
            }
            Platform.mouseX = math.floor(e.clientX);
            Platform.mouseY = math.floor(e.clientY);
            engine.$addMouseMoveEvent(math.floor(e.clientX), math.floor(e.clientY));
            if (touchDown) {
                engine.$addTouchEvent("move", 0, math.floor(e.clientX), math.floor(e.clientY));
            }
        }
        document.body.oncontextmenu = function (e) {
            engine.$addRightClickEvent(math.floor(e.clientX), math.floor(e.clientY));
            return false;
        }
        Platform.width = document.documentElement.clientWidth;
        Platform.height = document.documentElement.clientHeight;
        engine.$resize(Platform.width, Platform.height);
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
        Platform.engine.$addMouseMoveEvent(Platform.mouseX, Platform.mouseY);
        if (Platform.touchDown) {
            Platform.engine.$addTouchEvent("move", 0, Platform.mouseX, Platform.mouseY);
        }
        requestAnimationFrame.call(window, Platform._run);
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
        return;
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