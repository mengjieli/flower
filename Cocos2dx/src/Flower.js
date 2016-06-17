"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _exports = {};
(function () {
    //////////////////////////File:flower/Flower.js///////////////////////////
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
    function start(language) {
        language = language || "";
        Platform.start();
    }

    function getLanaguge() {
        return language;
    }

    function $error(errorCode) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        console.log(getLanguage(errorCode, args));
    }

    function $tip(errorCode) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

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

    _exports.start = start;
    _exports.getLanguage = getLanaguge;
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
        }, {
            key: "create",
            value: function create(name) {
                var pools = Platform.pools;
                if (name == "Sprite") {
                    if (pools.Sprite && pools.Sprite.length) {
                        return pools.Sprite.pop();
                    }
                    return new PlatformSprite();
                }
                if (name == "TextField") {
                    if (pools.TextField && pools.TextField.length) {
                        return pools.TextField.pop();
                    }
                    return new PlatformTextField();
                }
                return null;
            }
        }, {
            key: "release",
            value: function release(name, object) {
                var pools = Platform.pools;
                if (!pools[name]) {
                    pools[name] = [];
                }
                pools[name].push(object);
            }
        }]);

        return Platform;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/Platform.js///////////////////////////

    //////////////////////////File:flower/language/Language.js///////////////////////////


    Platform.type = "cocos2dx";
    Platform.pools = {};
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
    locale_strings[1003] = "重复创建纹理:{0}";
    locale_strings[1004] = "创建纹理:{0}";
    locale_strings[1005] = "释放纹理:{0}";

    //////////////////////////End File:flower/language/zh_CN.js///////////////////////////

    //////////////////////////File:flower/event/EventDispatcher.js///////////////////////////

    var EventDispatcher = function () {
        function EventDispatcher(target) {
            _classCallCheck(this, EventDispatcher);

            this.__hasDispose = false;

            this.__EventDispatcher = {
                0: target || this,
                1: {}
            };
        }

        _createClass(EventDispatcher, [{
            key: "dispose",
            value: function dispose() {
                this.__EventDispatcher = null;
                this.__hasDispose = true;
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
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                }
                var values = this.__EventDispatcher;
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
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                }
                var values = this.__EventDispatcher;
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
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                    return;
                }
                var values = this.__EventDispatcher;
                var events = values[1];
                events = {};
            }
        }, {
            key: "hasListener",
            value: function hasListener(type) {
                if (DEBUG) {
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                }
                var events = this.__EventDispatcher[1];
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
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                }
                var list = this.__EventDispatcher[1][event.type];
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
                    if (this.__hasDispose) {
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

    //////////////////////////File:flower/geom/Matrix.js///////////////////////////

    var Matrix = function () {
        function Matrix() {
            _classCallCheck(this, Matrix);

            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            this._storeList = [];
        }

        _createClass(Matrix, [{
            key: "identity",
            value: function identity() {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            }
        }, {
            key: "setTo",
            value: function setTo(a, b, c, d, tx, ty) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }
        }, {
            key: "translate",
            value: function translate(x, y) {
                this.tx += x;
                this.ty += y;
            }
        }, {
            key: "rotate",
            value: function rotate(angle) {
                flower.Matrix.sin = Math.sin(angle);
                flower.Matrix.cos = Math.cos(angle);
                this.setTo(this.a * flower.Matrix.cos - this.c * flower.Matrix.sin, this.a * flower.Matrix.sin + this.c * flower.Matrix.cos, this.b * flower.Matrix.cos - this.d * flower.Matrix.sin, this.b * flower.Matrix.sin + this.d * flower.Matrix.cos, this.tx * flower.Matrix.cos - this.ty * flower.Matrix.sin, this.tx * flower.Matrix.sin + this.ty * flower.Matrix.cos);
            }
        }, {
            key: "scale",
            value: function scale(scaleX, scaleY) {
                this.a = scaleX;
                this.d = scaleY;
                this.tx *= this.a;
                this.ty *= this.d;
            }
        }, {
            key: "prependMatrix",
            value: function prependMatrix(prep) {
                this.setTo(this.a * prep.a + this.c * prep.b, this.b * prep.a + this.d * prep.b, this.a * prep.c + this.c * prep.d, this.b * prep.c + this.d * prep.d, this.tx + this.a * prep.tx + this.c * prep.ty, this.ty + this.b * prep.tx + this.d * prep.ty);
            }
        }, {
            key: "prependTranslation",
            value: function prependTranslation(tx, ty) {
                this.tx += this.a * tx + this.c * ty;
                this.ty += this.b * tx + this.d * ty;
            }
        }, {
            key: "prependScale",
            value: function prependScale(sx, sy) {
                this.setTo(this.a * sx, this.b * sx, this.c * sy, this.d * sy, this.tx, this.ty);
            }
        }, {
            key: "prependRotation",
            value: function prependRotation(angle) {
                var sin = Math.sin(angle);
                var cos = Math.cos(angle);
                this.setTo(this.a * cos + this.c * sin, this.b * cos + this.d * sin, this.c * cos - this.a * sin, this.d * cos - this.b * sin, this.tx, this.ty);
            }
        }, {
            key: "prependSkew",
            value: function prependSkew(skewX, skewY) {
                var sinX = Math.sin(skewX);
                var cosX = Math.cos(skewX);
                var sinY = Math.sin(skewY);
                var cosY = Math.cos(skewY);
                this.setTo(this.a * cosY + this.c * sinY, this.b * cosY + this.d * sinY, this.c * cosX - this.a * sinX, this.d * cosX - this.b * sinX, this.tx, this.ty);
            }
        }, {
            key: "save",
            value: function save() {
                var matrix = flower.Matrix.create();
                matrix.a = this.a;
                matrix.b = this.b;
                matrix.c = this.c;
                matrix.d = this.d;
                matrix.tx = this.tx;
                matrix.ty = this.ty;
                this._storeList.push(matrix);
            }
        }, {
            key: "restore",
            value: function restore() {
                var matrix = this._storeList.pop();
                this.setTo(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                flower.Matrix.release(matrix);
            }
        }, {
            key: "deformation",
            get: function get() {
                if (this.a != 1 || this.b != 0 || this.c != 0 || this.d != 1) return true;
                return false;
            }
        }], [{
            key: "release",
            value: function release(matrix) {
                if (!matrix) {
                    return;
                }
                matrix._storeList.length = 0;
                flower.Matrix.matrixPool.push(matrix);
            }
        }, {
            key: "create",
            value: function create() {
                var matrix = flower.Matrix.matrixPool.pop();
                if (!matrix) {
                    matrix = new flower.Matrix();
                }
                return matrix;
            }
        }]);

        return Matrix;
    }();

    Matrix.$matrix = new Matrix();
    Matrix.matrixPool = [];


    _exports.Matrix = Matrix;
    //////////////////////////End File:flower/geom/Matrix.js///////////////////////////

    //////////////////////////File:flower/geom/Point.js///////////////////////////

    var Point = function () {
        function Point(x, y) {
            _classCallCheck(this, Point);

            this.x = +x || 0;
            this.y = +y || 0;
        }

        _createClass(Point, [{
            key: "setTo",
            value: function setTo(x, y) {
                this.x = x;
                this.y = y;
                return this;
            }
        }, {
            key: "length",
            get: function get() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
        }], [{
            key: "distance",
            value: function distance(p1, p2) {
                return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
            }
        }, {
            key: "release",
            value: function release(point) {
                if (!point) {
                    return;
                }
                Point.pointPool.push(point);
            }
        }, {
            key: "create",
            value: function create(x, y) {
                var point = Point.pointPool.pop();
                if (!point) {
                    point = new Point(x, y);
                } else {
                    point.x = +x || 0;
                    point.y = +y || 0;
                }
                return point;
            }
        }]);

        return Point;
    }();

    Point.$TempPoint = new Point();
    Point.pointPool = [];


    _exports.Point = Point;
    //////////////////////////End File:flower/geom/Point.js///////////////////////////

    //////////////////////////File:flower/geom/Rectangle.js///////////////////////////

    var Rectangle = function () {
        function Rectangle(x, y, width, height) {
            _classCallCheck(this, Rectangle);

            this.x = +x || 0;
            this.y = +y || 0;
            this.width = +width || 0;
            this.height = +height || 0;
        }

        _createClass(Rectangle, [{
            key: "copyFrom",
            value: function copyFrom(sourceRect) {
                this.x = sourceRect.x;
                this.y = sourceRect.y;
                this.width = sourceRect.width;
                this.height = sourceRect.height;
                return this;
            }
        }, {
            key: "setTo",
            value: function setTo(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                return this;
            }
        }, {
            key: "contains",
            value: function contains(x, y) {
                return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
            }
        }, {
            key: "intersection",
            value: function intersection(toIntersect) {
                return this.clone().$intersectInPlace(toIntersect);
            }
        }, {
            key: "$intersectInPlace",
            value: function $intersectInPlace(clipRect) {
                var x0 = this.x;
                var y0 = this.y;
                var x1 = clipRect.x;
                var y1 = clipRect.y;
                var l = Math.max(x0, x1);
                var r = Math.min(x0 + this.width, x1 + clipRect.width);
                if (l <= r) {
                    var t = Math.max(y0, y1);
                    var b = Math.min(y0 + this.height, y1 + clipRect.height);
                    if (t <= b) {
                        this.setTo(l, t, r - l, b - t);
                        return this;
                    }
                }
                this.setEmpty();
                return this;
            }
        }, {
            key: "intersects",
            value: function intersects(toIntersect) {
                return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right) && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
            }
        }, {
            key: "isEmpty",
            value: function isEmpty() {
                return this.width <= 0 || this.height <= 0;
            }
        }, {
            key: "setEmpty",
            value: function setEmpty() {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
            }
        }, {
            key: "clone",
            value: function clone() {
                return new flower.Rectangle(this.x, this.y, this.width, this.height);
            }
        }, {
            key: "_getBaseWidth",
            value: function _getBaseWidth(angle) {
                var u = Math.abs(Math.cos(angle));
                var v = Math.abs(Math.sin(angle));
                return u * this.width + v * this.height;
            }
        }, {
            key: "_getBaseHeight",
            value: function _getBaseHeight(angle) {
                var u = Math.abs(Math.cos(angle));
                var v = Math.abs(Math.sin(angle));
                return v * this.width + u * this.height;
            }
        }, {
            key: "right",
            get: function get() {
                return this.x + this.width;
            },
            set: function set(value) {
                this.width = value - this.x;
            }
        }, {
            key: "bottom",
            get: function get() {
                return this.y + this.height;
            },
            set: function set(value) {
                this.height = value - this.y;
            }
        }, {
            key: "left",
            get: function get() {
                return this.x;
            },
            set: function set(value) {
                this.width += this.x - value;
                this.x = value;
            }
        }, {
            key: "top",
            get: function get() {
                return this.y;
            },
            set: function set(value) {
                this.height += this.y - value;
                this.y = value;
            }
        }], [{
            key: "release",
            value: function release(rect) {
                if (!rect) {
                    return;
                }
                flower.Rectangle.rectanglePool.push(rect);
            }
        }, {
            key: "create",
            value: function create(x, y, width, height) {
                var rect = flower.Rectangle.rectanglePool.pop();
                if (!rect) {
                    rect = new flower.Rectangle(x, y, width, height);
                } else {
                    rect.x = +x || 0;
                    rect.y = +y || 0;
                    rect.width = +width || 0;
                    rect.height = +height || 0;
                }
                return rect;
            }
        }]);

        return Rectangle;
    }();

    Rectangle.rectanglePool = [];


    _exports.Rectangle = Rectangle;
    //////////////////////////End File:flower/geom/Rectangle.js///////////////////////////

    //////////////////////////File:flower/geom/Size.js///////////////////////////

    var Size = function () {
        function Size(width, height) {
            _classCallCheck(this, Size);

            this.width = +width || 0;
            this.height = +height || 0;
        }

        _createClass(Size, [{
            key: "setTo",
            value: function setTo(width, height) {
                this.width = width;
                this.height = height;
                return this;
            }
        }, {
            key: "area",
            get: function get() {
                return this.width * this.height;
            }
        }], [{
            key: "release",
            value: function release(size) {
                if (!size) {
                    return;
                }
                flower.Size.sizePool.push(size);
            }
        }, {
            key: "create",
            value: function create(width, height) {
                var size = flower.Size.sizePool.pop();
                if (!size) {
                    size = new flower.Size(width, height);
                } else {
                    size.width = +width || 0;
                    size.height = +height || 0;
                }
                return size;
            }
        }]);

        return Size;
    }();

    Size.$TempSize = new Size();
    Size.sizePool = [];


    _exports.Size = Size;
    //////////////////////////End File:flower/geom/Size.js///////////////////////////

    //////////////////////////File:flower/display/BlendMode.js///////////////////////////

    var BlendMode = function BlendMode() {
        _classCallCheck(this, BlendMode);
    };

    BlendMode.NORMAL = "normal";


    function numberToBlendMode(val) {
        return BlendMode.NORMAL;
    }

    function blendModeToNumber(val) {
        if (val == BlendMode.NORMAL) {
            return 0;
        }
        return 0;
    }
    //////////////////////////End File:flower/display/BlendMode.js///////////////////////////

    //////////////////////////File:flower/display/DisplayObject.js///////////////////////////

    var DisplayObject = function (_EventDispatcher) {
        _inherits(DisplayObject, _EventDispatcher);

        /**
         * 舞台类
         */


        /**
         * 脏标识
         * 0x0001 size 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
         * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
         * 0x0100 重排子对象顺序
         */

        function DisplayObject() {
            _classCallCheck(this, DisplayObject);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObject).call(this));

            _this.__DisplayObject = {
                0: 1, //scaleX
                1: 1, //scaleY
                2: 0, //rotation
                3: null, //settingWidth
                4: null, //settingHeight
                5: "", //name
                6: new Size() //size 自身尺寸
            };
            _this.__flags = 0;
            return _this;
        }

        /**
         * 是否有此标识位
         * @param flags
         * @returns {boolean}
         */


        /**
         * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
         */


        /**
         * 父对象
         */


        _createClass(DisplayObject, [{
            key: "$hasFlags",
            value: function $hasFlags(flags) {
                return this.__flags & flags == flags ? true : false;
            }
        }, {
            key: "$addFlags",
            value: function $addFlags(flags) {
                this.__flags |= flags;
            }
        }, {
            key: "$addFlagsUp",
            value: function $addFlagsUp(flags) {
                if (this.$hasFlags(flags)) {
                    return;
                }
                this.$addFlags(flags);
                if (this.__parent) {
                    this.__parent.$addFlags(flags);
                }
            }
        }, {
            key: "$addFlagsDown",
            value: function $addFlagsDown(flags) {
                if (this.$hasFlags(flags)) {
                    return;
                }
                this.$addFlags(flags);
            }
        }, {
            key: "$removeFlags",
            value: function $removeFlags(flags) {
                this.__flags &= ~flags;
            }
        }, {
            key: "$removeFlagsUp",
            value: function $removeFlagsUp(flags) {
                if (!this.$hasFlags(flags)) {
                    return;
                }
                this.$removeFlags(flags);
                if (this.__parent) {
                    this.__parent.$removeFlags(flags);
                }
            }
        }, {
            key: "$removeFlagsDown",
            value: function $removeFlagsDown(flags) {
                if (!this.$hasFlags(flags)) {
                    return;
                }
                this.$removeFlags(flags);
            }
        }, {
            key: "$setX",
            value: function $setX(val) {
                val = +val || 0;
                if (val == this.__x) {
                    return;
                }
                this.__x = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$setY",
            value: function $setY(val) {
                val = +val || 0;
                if (val == this.__y) {
                    return;
                }
                this.__y = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$setScaleX",
            value: function $setScaleX(val) {
                val = +val || 0;
                var p = this.$DisplayObject;
                if (p[0] == val) {
                    return;
                }
                p[0] = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$setScaleY",
            value: function $setScaleY(val) {
                val = +val || 0;
                var p = this.$DisplayObject;
                if (p[1] == val) {
                    return;
                }
                p[1] = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$setRotation",
            value: function $setRotation(val) {
                val = +val || 0;
                var p = this.$DisplayObject;
                if (p[2] == val) {
                    return;
                }
                p[2] = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                val = +val || 0;
                val = val < 0 ? 0 : val;
                var p = this.$DisplayObject;
                if (p[3] == val) {
                    return;
                }
                p[3] = val;
                this.invalidSize();
            }
        }, {
            key: "$getWidth",
            value: function $getWidth() {
                var p = this.$DisplayObject;
                return p[2] != null ? p[2] : this.$getSize().height;
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                val = +val || 0;
                val = val < 0 ? 0 : val;
                var p = this.$DisplayObject;
                if (p[4] == val) {
                    return;
                }
                p[4] = val;
                this.invalidSize();
            }
        }, {
            key: "$getHeight",
            value: function $getHeight() {
                var p = this.$DisplayObject;
                return p[3] != null ? p[3] : this.$getSize().width;
            }
        }, {
            key: "$getSize",
            value: function $getSize() {
                var size = this.$DisplayObject[6];
                if (this.$hasFlags(0x0001)) {
                    this.calculateSize();
                    this.$removeFlags(0x0001);
                }
                return size;
            }
        }, {
            key: "$setParent",
            value: function $setParent(parent, stage) {
                this.__parent = parent;
                this.__stage = stage;
                if (this.__parent) {
                    this.dispatchWidth(Event.ADDED);
                } else {
                    this.dispatchWidth(Event.REMOVED);
                }
            }
        }, {
            key: "$dispatchAddedToStageEvent",
            value: function $dispatchAddedToStageEvent() {
                if (this.__stage) {
                    this.dispatchWidth(Event.ADDED_TO_STAGE);
                }
            }
        }, {
            key: "$dispatchRemovedFromStageEvent",
            value: function $dispatchRemovedFromStageEvent() {
                if (!this.__stage) {
                    this.dispatchWidth(Event.REMOVED_FROM_STAGE);
                }
            }
        }, {
            key: "dispatch",
            value: function dispatch(e) {
                if (e.bubbles && this.__parent) {
                    this.__parent.dispatch(e);
                }
            }
        }, {
            key: "calculateSize",


            /**
             * 计算尺寸
             * 子类实现
             * @param size
             */
            value: function calculateSize(size) {}

            /**
             * 本身尺寸失效
             */

        }, {
            key: "invalidSize",
            value: function invalidSize() {
                this.$addFlagsUp(0x0001);
            }
        }, {
            key: "$invalidPositionScale",
            value: function $invalidPositionScale() {
                if (this.__parent) {
                    this.__parent.$addFlagsUp(0x0001);
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {}
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                _get(Object.getPrototypeOf(DisplayObject.prototype), "dispose", this).call(this);
            }
        }, {
            key: "x",
            get: function get() {
                return this.__x;
            },
            set: function set(val) {
                this.$setX(val);
            }
        }, {
            key: "y",
            get: function get() {
                return this.__y;
            },
            set: function set(val) {
                this.$setY(val);
            }
        }, {
            key: "scaleX",
            get: function get() {
                var p = this.$DisplayObject;
                return p[0];
            },
            set: function set(val) {
                this.$setScaleX(val);
            }
        }, {
            key: "scaleY",
            get: function get() {
                var p = this.$DisplayObject;
                return p[1];
            },
            set: function set(val) {
                this.$setScaleY(val);
            }
        }, {
            key: "rotation",
            get: function get() {
                var p = this.$DisplayObject;
                return p[2];
            },
            set: function set(val) {
                this.$setRotation(val);
            }
        }, {
            key: "width",
            get: function get() {
                return this.$getWidth();
            },
            set: function set(val) {
                this.$setWidth(val);
            }
        }, {
            key: "height",
            get: function get() {
                return this.$getHeight();
            },
            set: function set(val) {
                this.$setHeight(val);
            }
        }, {
            key: "parent",
            get: function get() {
                return this.__parent;
            }
        }]);

        return DisplayObject;
    }(EventDispatcher);
    //////////////////////////End File:flower/display/DisplayObject.js///////////////////////////

    //////////////////////////File:flower/display/Sprite.js///////////////////////////


    var Sprite = function (_DisplayObject) {
        _inherits(Sprite, _DisplayObject);

        function Sprite() {
            _classCallCheck(this, Sprite);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Sprite).call(this));

            _this2.__children = [];
            _this2.$nativeShow = Platform.create("Sprite");
            return _this2;
        }

        _createClass(Sprite, [{
            key: "$addFlagsDown",
            value: function $addFlagsDown(flags) {
                if (this.$hasFlags(flags)) {
                    return;
                }
                this.$addFlag(flags);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$addFlagsDown(flags);
                }
            }
        }, {
            key: "$removeFlagsDown",
            value: function $removeFlagsDown(flags) {
                if (!this.$hasFlags(flags)) {
                    return;
                }
                this.$removeFlags(flags);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$removeFlagsDown(flags);
                }
            }
        }, {
            key: "addChild",
            value: function addChild(child) {
                this.addChildAt(child, this.__children.length);
            }
        }, {
            key: "addChildAt",
            value: function addChildAt(child, index) {
                var children = this.__children;
                if (index < 0 || index > children.length) {
                    return;
                }
                if (child.parent == this) {
                    this.setChildIndex(child, index);
                } else {
                    if (child.parent) {
                        child.parent.$removeChild(child);
                    }
                    children.splice(index, 0, child);
                    child.$setParent(this, this.stage);
                    if (child.parent == this) {
                        child.$dispatchAddedToStageEvent();
                        this.invalidSize();
                        this.$addFlags(0x0100);
                    }
                }
            }
        }, {
            key: "$removeChild",
            value: function $removeChild(child) {
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i] == child) {
                        children.splice(i, 1);
                        this.invalidSize();
                        this.$addFlags(0x0100);
                        break;
                    }
                }
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i] == child) {
                        children.splice(i, 1);
                        child.$setParent(null, null);
                        child.$dispatchRemovedFromStageEvent();
                        this.invalidSize();
                        this.$addFlags(0x0100);
                        break;
                    }
                }
            }
        }, {
            key: "removeChildAt",
            value: function removeChildAt(index) {
                var children = this.__children;
                if (index < 0 || index >= children.length) {
                    return;
                }
                this.removeChild(children[index]);
            }
        }, {
            key: "setChildIndex",
            value: function setChildIndex(child, index) {
                var childIndex = this.getChildIndex(child);
                if (childIndex == index) {
                    return;
                }
                var children = this.__children;
                children.splice(childIndex, 1);
                children.splice(index, 0, child);
                this.$addFlags(0x0100);
            }
        }, {
            key: "getChildIndex",
            value: function getChildIndex(child) {
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    if (child == children[i]) {
                        return i;
                    }
                }
                return -1;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    this.$nativeShow.resetChildIndex(this.__children);
                    this.$removeFlags(0x0100);
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                var children = this.__children;
                while (children.length) {
                    var child = children[children.length - 1];
                    child.dispose();
                }
                _get(Object.getPrototypeOf(Sprite.prototype), "dispose", this).call(this);
                this.$nativeShow.release();
                Platform.release(this.$nativeShow);
            }
        }, {
            key: "numChildren",
            get: function get() {
                return this.__children.length;
            }
        }]);

        return Sprite;
    }(DisplayObject);
    //////////////////////////End File:flower/display/Sprite.js///////////////////////////

    //////////////////////////File:flower/texture/Texture.js///////////////////////////


    var Texture = function () {
        function Texture(nativeTexture, url, nativeURL, w, h) {
            _classCallCheck(this, Texture);

            this.__offX = 0;
            this.__offY = 0;
            this.__sourceRotation = false;

            this.__nativeTexture = nativeTexture;
            this.__url = url;
            this.__nativeURL = nativeURL;
            this.$count = 0;
            this.__width = w;
            this.__height = h;
        }

        _createClass(Texture, [{
            key: "createSubTexture",
            value: function createSubTexture(startX, startY, width, height) {
                var offX = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
                var offY = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
                var rotation = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

                var sub = new flower.Texture2D(this.__nativeTexture, this.__url, this.__nativeURL, width, height);
                sub.$parentTexture = this.$parentTexture || this;
                var rect = flower.Rectangle.create();
                rect.x = startX;
                rect.y = startY;
                rect.width = width;
                rect.height = height;
                sub.__source = rect;
                sub.__sourceRotation = rotation;
                sub.__offX = offX;
                sub.__offY = offY;
                return sub;
            }
        }, {
            key: "$addCount",
            value: function $addCount() {
                if (this._parentTexture) {
                    this._parentTexture.$addCount();
                } else {
                    this.$count++;
                }
            }
        }, {
            key: "$delCount",
            value: function $delCount() {
                if (this._parentTexture) {
                    this._parentTexture.$delCount();
                } else {
                    this.$count--;
                    if (this.$count < 0) {
                        this.$count = 0;
                    }
                }
            }
        }, {
            key: "getCount",
            value: function getCount() {
                if (this._parentTexture) {
                    this._parentTexture.getCount();
                } else {
                    return this.$count;
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.$count != 0) {
                    return;
                }
                this.__nativeTexture.dispose();
                this.__nativeTexture = null;
                if (TIP) {
                    tip(1005, this.url);
                }
            }

            /**
             * 空白图片
             */

        }, {
            key: "url",
            get: function get() {
                return this.__url;
            }
        }, {
            key: "nativeURL",
            get: function get() {
                return this.__nativeURL;
            }
        }, {
            key: "width",
            get: function get() {
                return this.__width;
            }
        }, {
            key: "height",
            get: function get() {
                return this.__height;
            }
        }, {
            key: "source",
            get: function get() {
                return this.__source;
            }
        }, {
            key: "offX",
            get: function get() {
                return this.__offX;
            }
        }, {
            key: "offY",
            get: function get() {
                return this.__offY;
            }
        }, {
            key: "sourceRotation",
            get: function get() {
                return this.__sourceRotation;
            }
        }, {
            key: "$nativeTexture",
            get: function get() {
                return this.__nativeTexture;
            }
        }]);

        return Texture;
    }();
    //////////////////////////End File:flower/texture/Texture.js///////////////////////////

    //////////////////////////File:flower/res/ResItem.js///////////////////////////


    var ResItem = function () {
        /**
         * 使用时的路径
         */

        function ResItem() {
            _classCallCheck(this, ResItem);

            this.__loadList = [];
        }

        /**
         * 实际的加载地址有哪些
         */


        _createClass(ResItem, [{
            key: "addInfo",
            value: function addInfo(url, settingWidth, settingHeight, scale, language) {
                var info = new ResItemInfo();
                info.url = url;
                info.settingWidth = settingWidth;
                info.settingHeight = settingHeight;
                info.scale = scale;
                info.language = language;
                this.__loadList.push(info);
            }
        }]);

        return ResItem;
    }();
    //////////////////////////End File:flower/res/ResItem.js///////////////////////////

    //////////////////////////File:flower/res/ResItemInfo.js///////////////////////////


    var ResItemInfo = function ResItemInfo() {
        _classCallCheck(this, ResItemInfo);
    };
    //////////////////////////End File:flower/res/ResItemInfo.js///////////////////////////
})();
var flower = _exports;