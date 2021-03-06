var DEBUG = false;
var TIP = false;
var $language = "zh_CN";
var NATIVE = true;
/**
 * 用户使用的语言
 * @type {null}
 */
var LANGUAGE = "";
var SCALE = null;
var CACHE = true;
var UPDATE_RESOURCE = true;
var RETINA = false;
var programmers = {};
var config = {};
var params = {};
var hasStart = false;
var startBacks = [];

/**
 * 启动引擎
 * @param language 使用的语言版本
 */
function start(completeFunc, params) {
    if (hasStart) {
        if (completeFunc) completeFunc();
        return;
    }
    params = params || {};
    if (params.TIP) {
        TIP = params.TIP;
        exports.sys.TIP = params.TIP;
    }
    if (params.DEBUG) {
        DEBUG = params.DEBUG;
        exports.sys.DEBUG = params.DEBUG;
    }
    hasStart = false;
    Platform._runBack = CoreTime.$run;
    if (Platform.startSync) {
        Platform.getReady(function () {
            var stage = new Stage();
            Platform.start(stage, stage.$nativeShow, stage.$background.$nativeShow, function () {
                start2(completeFunc, params.nativeStage, params.touchShow, stage, params);
            });
        });
    } else {
        var stage = new Stage();
        Platform.start(stage, stage.$nativeShow, stage.$background.$nativeShow, params.nativeStage, params.touchShow);
        start2(completeFunc, params.nativeStage, params.touchShow, stage, params);
    }
}

function start2(completeFunc, nativeStage, touchShow, stage, params) {
    flower.sys.engineType = Platform.type;
    var loader = new URLLoader("res/flower.json");
    loader.addListener(Event.COMPLETE, function (e) {
        var cfg = e.data;
        for (var key in cfg) {
            config[key] = cfg[key];
        }
        if (params.linkUser && cfg.remote) {
            cfg.remote.linkUser = params.linkUser;
        }
        stage.backgroundColor = cfg.backgroundColor || 0;
        SCALE = config.scale || 1;
        LANGUAGE = config.language || "";
        function startLoad() {
            loader = new URLLoader("res/blank.png");
            loader.addListener(Event.COMPLETE, function (e) {
                Texture.$blank = e.data;
                Texture.$blank.$addCount();
                loader = new URLLoader("res/shaders/Bitmap.fsh");
                loader.addListener(Event.COMPLETE, function (e) {
                    programmers[loader.url] = e.data;
                    loader = new URLLoader(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh");
                    loader.addListener(Event.COMPLETE, function (e) {
                        programmers[loader.url] = e.data;
                        loader = new URLLoader("res/shaders/Source.fsh");
                        loader.addListener(Event.COMPLETE, function (e) {
                            programmers[loader.url] = e.data;
                            if (completeFunc)completeFunc();
                            while (startBacks.length) {
                                startBacks.shift()();
                            }
                        });
                        loader.load();
                    });
                    loader.load();
                });
                loader.load();
            });
            loader.load();
        }

        if (config.remote && flower.RemoteServer) {
            flower.RemoteServer.start(startLoad);
        } else {
            startLoad();
        }
    });
    loader.load();
}

function addStartBack(func) {
    startBacks.push(func);
}

function $getLanguage() {
    return language;
}

function $error(errorCode, ...args) {
    var msg;
    if (typeof errorCode == "string") {
        msg = errorCode;
    } else {
        msg = getLanguage.apply(null, [errorCode].concat(args));
    }
    console.log(msg);
    throw msg;
}

function $warn(errorCode, ...args) {
    var msg;
    if (typeof errorCode == "string") {
        msg = errorCode;
    } else {
        msg = getLanguage.apply(null, [errorCode].concat(args));
    }
    console.log("[警告] " + msg);
}

function $tip(errorCode, ...args) {
    console.log(getLanguage(errorCode, args));
}

function isNaN(value) {
    value = +value;
    return value !== value;
}

/**
 * @private
 * 格式化旋转角度的值
 */
function clampRotation(value) {
    value %= 360;
    if (value > 180) {
        value -= 360;
    } else if (value < -180) {
        value += 360;
    }
    return value;
}

function trace() {
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
        str += arguments[i] + "\t\t";
    }
    console.log(str);
}

function breakPoint(name) {
    trace("breakPoint:", name);
}

function dispose() {
    flower.EnterFrame.$dispose();
    flower.CallLater.$dispose();
    flower.DelayCall.$dispose();
    flower.Stage.$dispose();
    TextureManager.getInstance().$dispose();
    hasStart = false;
}


exports.start = start;
exports.getLanguage = $getLanguage;
exports.trace = trace;
exports.breakPoint = breakPoint;
exports.sys = {
    config: config,
    DEBUG: DEBUG,
    TIP: TIP,
    $tip: $tip,
    $warn: $warn,
    $error: $error,
    getLanguage: getLanguage,
}
exports.params = params;
exports.system = {};
exports.dispose = dispose;
exports.addStartBack = addStartBack;
$root.trace = trace;