"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _exports = {};
(function () {
    //////////////////////////File:flower/Flower.js///////////////////////////
    var DEBUG = true;
    var $language = "zh_CN";

    function start() {
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

    //////////////////////////File:flower/event/EventDispatcher.js///////////////////////////

    var EventDispatcher = function () {
        function EventDispatcher(target) {
            _classCallCheck(this, EventDispatcher);

            this.hasDispose = false;

            this.$EventDispatcher = {
                0: target || this,
                1: {}
            };
        }

        _createClass(EventDispatcher, [{
            key: "dispose",
            value: function dispose() {
                this.$EventDispatcher = null;
                this.hasDispose = true;
            }

            /**
             *
             * @param type
             * @param listener
             * @param thisObject
             * @param priority 监听事件的优先级，暂未实现
             */

        }, {
            key: "once",
            value: function once(type, listener, thisObject) {
                var priority = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

                this.__addListener(type, listener, thisObject, priority, true);
            }

            /**
             *
             * @param type
             * @param listener
             * @param thisObject
             * @param priority 监听事件的优先级，暂未实现
             */

        }, {
            key: "addListener",
            value: function addListener(type, listener, thisObject) {
                var priority = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

                this.__addListener(type, listener, thisObject, priority, false);
            }

            /**
             * 监听事件
             * @param type
             * @param listener
             * @param thisObject
             * @param priority 监听事件的优先级，暂未实现
             * @param once
             * @private
             */

        }, {
            key: "__addListener",
            value: function __addListener(type, listener, thisObject, priority, once) {
                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                }
                var values = this.$EventDispatcher;
                var events = values[1];
                var list = events[type];
                if (!list) {
                    list = values[1][type] = [];
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    if (item.listener == listener && item.thisObject == thisObject && item.del == false) {
                        return false;
                    }
                }
                list.push({ "listener": listener, "thisObject": thisObject, "once": once, "del": false });
            }
        }, {
            key: "removeListener",
            value: function removeListener(type, listener, thisObject) {
                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                }
                var values = this.$EventDispatcher;
                var events = values[1];
                var list = events[type];
                if (!list) {
                    return;
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false) {
                        list[i].listener = null;
                        list[i].thisObject = null;
                        list[i].del = true;
                        break;
                    }
                }
            }
        }, {
            key: "removeAllListener",
            value: function removeAllListener() {
                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                    return;
                }
                var values = this.$EventDispatcher;
                var events = values[1];
                events = {};
            }
        }, {
            key: "hasListener",
            value: function hasListener(type) {
                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                }
                var events = this.$EventDispatcher[1];
                var list = events[type];
                if (!list) {
                    return false;
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].del == false) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: "dispatch",
            value: function dispatch(event) {
                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                }
                var list = this.$EventDispatcher[1][event.type];
                if (!list) {
                    return;
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].del == false) {
                        var listener = list[i].listener;
                        var thisObj = list[i].thisObject;
                        if (event.$target == null) {
                            event.$target = this;
                        }
                        event.$currentTarget = this;
                        if (list[i].once) {
                            list[i].listener = null;
                            list[i].thisObject = null;
                            list[i].del = true;
                        }
                        listener.call(thisObj, event);
                    }
                }
                for (i = 0; i < list.length; i++) {
                    if (list[i].del == true) {
                        list.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: "dispatchWidth",
            value: function dispatchWidth(type) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                if (DEBUG) {
                    if (this.hasDispose) {
                        $error(1002);
                    }
                }
                var e = flower.Event.create(type, data);
                e.$target = this;
                this.dispatch(e);
                flower.Event.release(e);
            }
        }]);

        return EventDispatcher;
    }();

    _exports.EventDispatcher = EventDispatcher;
    //////////////////////////End File:flower/event/EventDispatcher.js///////////////////////////

    //////////////////////////File:flower/event/Event.js///////////////////////////

    var Event = function () {
        function Event(type) {
            var bubbles = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            _classCallCheck(this, Event);

            this.$cycle = false;
            this.$target = null;
            this.$currentTarget = null;
            this._isPropagationStopped = false;

            this.$type = type;
            this.$bubbles = bubbles;
        }

        _createClass(Event, [{
            key: "stopPropagation",
            value: function stopPropagation() {
                this._isPropagationStopped = true;
            }
        }, {
            key: "isPropagationStopped",
            get: function get() {
                return this._isPropagationStopped;
            }
        }, {
            key: "type",
            get: function get() {
                return this.$type;
            }
        }, {
            key: "bubbles",
            get: function get() {
                return this.$bubbles;
            }
        }, {
            key: "target",
            get: function get() {
                return this.$target;
            }
        }, {
            key: "currentTarget",
            get: function get() {
                return this.$currentTarget;
            }
        }], [{
            key: "create",
            value: function create(type) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var e;
                if (!flower.Event._eventPool.length) {
                    e = new flower.Event(type);
                } else {
                    e = flower.Event._eventPool.pop();
                    e.$cycle = false;
                }
                e.$type = type;
                e.$bubbles = false;
                e.data = data;
                return e;
            }
        }, {
            key: "release",
            value: function release(e) {
                if (e.$cycle) {
                    return;
                }
                e.$cycle = true;
                e.data = null;
                flower.Event._eventPool.push(e);
            }
        }]);

        return Event;
    }();

    Event.READY = "ready";
    Event.COMPLETE = "complete";
    Event.ADDED = "added";
    Event.REMOVED = "removed";
    Event.ADDED_TO_STAGE = "added_to_stage";
    Event.REMOVED_FROM_STAGE = "removed_from_stage";
    Event.CONNECT = "connect";
    Event.CLOSE = "close";
    Event.CHANGE = "change";
    Event.ERROR = "error";
    Event.UPDATE = "update";
    Event._eventPool = [];


    _exports.Event = Event;
    //////////////////////////End File:flower/event/Event.js///////////////////////////
})();
var flower = _exports;