var fs = require("fs");
var path = require("path");
var webSocket = require('websocket').server;
var http = require('http');
var net = require('net');

class Platform {
    static type = "remote";
    static startSync = true;
    static native = true;

    static engine;
    static stage;
    static width;
    static height;
    static server;
    static IPV4;
    static server;
    static __init = false;

    static start(engine, root, background, readyBack) {
        Platform.engine = engine;
        Platform.getIPV4();
        flower.system.platform = Platform.type;
        flower.system.native = Platform.native;
        setTimeout(Platform._run, 0);

        var server = new flower.SocketServer(PlatformClient);
        Platform.server = server;
        server.start(16788);
    }

    static init(width, height) {
        if (Platform.__init) {
            return;
        }
        Platform.__init = true;
        Platform.width = width;
        Platform.height = height;
        Platform.engine.$resize(Platform.width, Platform.height);
        console.log("size", width, height);
    }

    static sendToClient(msg) {
        var clients = Platform.server.clients;
        for (var i = 0; i < clients.length; i++) {
            clients[i].send(msg);
        }
    }

    static getIPV4() {
        var os = require('os');
        var IPv4 = "localhost", hostName;
        hostName = os.hostname();
        var network = os.networkInterfaces();
        var netKey;
        for (var key in network) {
            if (key.slice(0, "en".length) == "en") {
                netKey = key;
            }
        }
        try {
            for (var i = 0; i < os.networkInterfaces()[netKey].length; i++) {
                if (os.networkInterfaces()[netKey][i].family == 'IPv4') {
                    IPv4 = os.networkInterfaces()[netKey][i].address;
                }
            }
        } catch (e) {

        }
        Platform.IPv4 = IPv4;
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