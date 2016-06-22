var DEBUG = true;
var TIP = true;
var $language = "zh_CN";
/**
 * 用户使用的语言
 * @type {null}
 */
var LANGUAGE = "";
var SCALE = null;

/**
 * 启动引擎
 * @param language 使用的语言版本
 */
function start(completeFunc, scale, language) {
    SCALE = scale;
    LANGUAGE = language || "";
    var stage = new Stage();
    Platform._runBack = CoreTime.$run;
    Platform.start(stage, stage.$nativeShow);

    //completeFunc();
    var loader = new URLLoader("res/blank.png");
    loader.addListener(Event.COMPLETE, function (e) {
        Texture.$blank = e.data;
        loader = new URLLoader("res/shaders/Bitmap.fsh");
        loader.addListener(Event.COMPLETE, function (e) {
            loader = new URLLoader(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh");
            loader.addListener(Event.COMPLETE, function (e) {
                loader = new URLLoader("res/shaders/Source.fsh");
                loader.addListener(Event.COMPLETE, function (e) {
                    completeFunc();
                });
                loader.load();
            });
            loader.load();
        });
        loader.load();
    });
    loader.load();
}

function $getLanguage() {
    return language;
}

function $error(errorCode, ...args) {
    var msg;
    if (errorCode instanceof String) {
        msg = errorCode;
    } else {
        msg = getLanguage(errorCode, args);
    }
    console.log(msg);
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

exports.start = start;
exports.getLanguage = $getLanguage;
exports.trace = trace;