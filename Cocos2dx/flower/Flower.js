var DEBUG = true;
var TIP = true;
var $language = "zh_CN";
/**
 * 用户使用的语言
 * @type {null}
 */
var language = "";

/**
 * 启动引擎
 * @param language 使用的语言版本
 */
function start(completeFunc, native, language) {
    Platform.native = native;
    language = language || "";
    var stage = new Stage();
    Platform._runBack = CoreTime.$run;
    Platform.start(stage, stage.$nativeShow);

    //completeFunc();
    var loader = new URLLoader("res/blank.png");
    loader.addListener(Event.COMPLETE, function (e) {
        Texture.$blank = e.data;
        completeFunc(Platform.stage,Platform.stage2);
    });
    loader.load();
}

function getLanaguge() {
    return language;
}

function $error(errorCode, ...args) {
    console.log(getLanguage(errorCode, args));
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

exports.start = start;
exports.getLanguage = getLanaguge;