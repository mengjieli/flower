"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _exports = {};
(function () {
    //////////////////////////File:flower/Flower.js///////////////////////////
    var DEBUG = true;
    var $language = "zh_CN";

    function start() {
        console.log("Start!");
        Platform.start();
    }

    function $error(errorCode) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        console.log(getLanguage(errorCode, args));
    }

    _exports.start = start;

    //////////////////////////End File:flower/Flower.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/Platform.js///////////////////////////

    var Platform = function () {
        function Platform() {
            _classCallCheck(this, Platform);
        }

        _createClass(Platform, null, [{
            key: "start",
            value: function start(engine, root) {
                console.log("hello baby!");
                return;
                var scene = cc.Scene.extend({
                    ctor: function ctor() {
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
                    },
                    update: function update(dt) {
                        trace("dt", dt);
                    },
                    onTouchesBegan: function onTouchesBegan(touch) {
                        engine.onMouseDown(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                        return true;
                    },
                    onTouchesMoved: function onTouchesMoved(touch) {
                        engine.onMouseMove(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                        return true;
                    },
                    onTouchesEnded: function onTouchesEnded(touch) {
                        engine.onMouseUp(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                        return true;
                    }
                });
                Platform.stage = new scene();
                Platform.stage.update = Platform._run;
                cc.director.runScene(Platform.stage);
                Platform.width = cc.Director.getInstance().getWinSize().width;
                Platform.height = cc.Director.getInstance().getWinSize().height;
                root.setPositionY(Platform.height);
                //debugRoot.setPositionY(Platform.height);
                Platform.stage.addChild(root);
                //Platform.stage.addChild(debugRoot);
                //System.$mesureTxt.retain();
            }
        }]);

        return Platform;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/Platform.js///////////////////////////

    //////////////////////////File:flower/language/Language.js///////////////////////////


    Platform.type = "cocos2dx";
    var $locale_strings = {};

    /**
     * @private
     * 全局多语言翻译函数
     * @param code 要查询的字符串代码
     * @param args 替换字符串中{0}标志的参数列表
     * @returns 返回拼接后的字符串
     */
    function getLanguage(code, args) {
        var text = $locale_strings[$language][code];
        if (!text) {
            return "{" + code + "}";
        }
        var length = args.length;
        for (var i = 0; i < length; i++) {
            text = text.replace("{" + i + "}", args[i]);
        }
        return text;
    }
    //////////////////////////End File:flower/language/Language.js///////////////////////////

    //////////////////////////File:flower/language/zh_CN.js///////////////////////////
    var $locale_strings = $locale_strings || {};
    $locale_strings["zh_CN"] = $locale_strings["zh_CN"] || {};

    var locale_strings = $locale_strings["zh_CN"];

    //core  1000-1999
    locale_strings[1001] = "对象已经回收。";
    locale_strings[1002] = "对象已释放。";
    //////////////////////////End File:flower/language/zh_CN.js///////////////////////////
})();
var flower = _exports;