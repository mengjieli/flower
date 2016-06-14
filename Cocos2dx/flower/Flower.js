var DEBUG = true;
var $language = "zh_CN";

function start() {
    Platform.start();
}

function $error(errorCode, ...args) {
    console.log(getLanguage(errorCode, args));
}

exports.start = start;
