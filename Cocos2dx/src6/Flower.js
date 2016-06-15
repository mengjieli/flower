var exports = {};
(function(){
//////////////////////////File:flower/Flower.js///////////////////////////
var DEBUG = true;
var $language = "zh_CN";

function start() {
    Platform.start();
}

function $error(errorCode, ...args) {
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

//////////////////////////End File:flower/Flower.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/Platform.js///////////////////////////
class Platform {
    static type = "cocos2dx";

    static stage;
    static width;
    static height;

    static start(engine, root) {
        return;
        var scene = cc.Scene.extend({
            ctor: function () {
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
            update: function (dt) {
                trace("dt", dt);
            },
            onTouchesBegan: function (touch) {
                engine.onMouseDown(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesMoved: function (touch) {
                engine.onMouseMove(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesEnded: function (touch) {
                engine.onMouseUp(touch.getID(), Math.floor(touch.getLocation().x), Platform.height - Math.floor(touch.getLocation().y));
                return true;
            },
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
}
//////////////////////////End File:flower/platform/cocos2dx/Platform.js///////////////////////////



//////////////////////////File:flower/language/Language.js///////////////////////////
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



//////////////////////////File:flower/core/Action.js///////////////////////////
class Action {

    /**
     * 行为名称
     * @type {string}
     */
    name = "";

    constructor() {

    }

    /**
     * 执行行为
     */
    execute() {

    }
}
//////////////////////////End File:flower/core/Action.js///////////////////////////



//////////////////////////File:flower/core/Feature.js///////////////////////////
class Feature {

    items = [];

    constructor() {

    }

    /**
     * 获取某个特征
     * @param name
     * @returns {*}
     */
    getItemByName(name) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].name == name) {
                return items[i];
            }
        }
        return null;
    }

    /**
     * 添加特征描述，如果之前已有此名称的特征，会覆盖之前的特征值，不会插入新的特征描述
     * @param name 特征名称,比如 x
     * @param value 特征值，比如 100
     */
    addItem(name, value) {
        var item = this.getItemByName(name);
        if(item) {
            item.value = value;
            return;
        }
        this.items.push({
            "name": name,
            "value": value
        })
    }

    /**
     * 移除特征，根据名字匹配
     * @param name
     * @returns {*}
     */
    removeItemByName(name) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].name == name) {
                return items.splice(i, 1)[0];
            }
        }
        return null;
    }

    /**
     * 检测对象特征是否符合
     * @param object
     */
    checkObject(object) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (object[item.name] != item.value) {
                return false;
            }
        }
        return true;
    }
}
//////////////////////////End File:flower/core/Feature.js///////////////////////////



//////////////////////////File:flower/core/ObjectBase.js///////////////////////////
class ObjectBase {

    /**
     * 行为队列
     * @type {Array}
     */
    actions = [];

    constructor() {
    }

    /**
     * 执行特定的行为
     * @param name 行为名称
     * @param args 行为参数
     */
    executeAction(name, ...args) {
        var action;
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                action = actions[i];
                break;
            }
        }
        if (action) {
            action.execute.apply(action, args);
        }
    }

    getAction(name) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                return actions[i];
            }
        }
        return null;
    }

    /**
     * 添加行为，如果之前已有相同名称的行为，会被顶替
     * @param action
     */
    addAction(action) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                actions.splice(i, 1);
                break;
            }
        }
        this.actions.push(action);
    }

    /**
     * 移除行为
     * @param name 要移除的行为名称
     * @returns {*}
     */
    removeAction(name) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (action.name == name) {
                return actions.splice(i, 1)[0];
            }
        }
        return null;
    }
}
//////////////////////////End File:flower/core/ObjectBase.js///////////////////////////



//////////////////////////File:flower/event/EventDispatcher.js///////////////////////////
class EventDispatcher {

    $EventDispatcher;
    _hasDispose = false;

    constructor(target) {
        this.$EventDispatcher = {
            0: target || this,
            1: {}
        }
    }

    dispose() {
        this.$EventDispatcher = null;
        this._hasDispose = true;
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    once(type, listener, thisObject, priority = 0) {
        this.__addListener(type, listener, thisObject, priority, true);
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    addListener(type, listener, thisObject, priority = 0) {
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
    __addListener(type, listener, thisObject, priority, once) {
        if (DEBUG) {
            if (this._hasDispose) {
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
        list.push({"listener": listener, "thisObject": thisObject, "once": once, "del": false});
    }

    removeListener(type, listener, thisObject) {
        if (DEBUG) {
            if (this._hasDispose) {
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

    removeAllListener() {
        if (DEBUG) {
            if (this._hasDispose) {
                $error(1002);
            }
            return;
        }
        var values = this.$EventDispatcher;
        var events = values[1];
        events = {};
    }

    hasListener(type) {
        if (DEBUG) {
            if (this._hasDispose) {
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

    dispatch(event) {
        if (DEBUG) {
            if (this._hasDispose) {
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

    dispatchWidth(type, data = null) {
        if (DEBUG) {
            if (this._hasDispose) {
                $error(1002);
            }
        }
        var e = flower.Event.create(type, data);
        e.$target = this;
        this.dispatch(e);
        flower.Event.release(e);
    }
}

exports.EventDispatcher = EventDispatcher;
//////////////////////////End File:flower/event/EventDispatcher.js///////////////////////////



//////////////////////////File:flower/event/Event.js///////////////////////////
class Event {

    $type;
    $bubbles;
    $cycle = false;
    $target = null;
    $currentTarget = null;
    data;
    _isPropagationStopped = false;

    constructor(type, bubbles = false) {
        this.$type = type;
        this.$bubbles = bubbles;
    }

    stopPropagation() {
        this._isPropagationStopped = true;
    }

    get isPropagationStopped() {
        return this._isPropagationStopped;
    }

    get type() {
        return this.$type;
    }

    get bubbles() {
        return this.$bubbles;
    }

    get target() {
        return this.$target;
    }

    get currentTarget() {
        return this.$currentTarget;
    }

    static READY = "ready";
    static COMPLETE = "complete";
    static ADDED = "added";
    static REMOVED = "removed";
    static ADDED_TO_STAGE = "added_to_stage";
    static REMOVED_FROM_STAGE = "removed_from_stage";
    static CONNECT = "connect";
    static CLOSE = "close";
    static CHANGE = "change";
    static ERROR = "error";
    static UPDATE = "update";

    static _eventPool = [];

    static create(type, data = null) {
        var e;
        if (!flower.Event._eventPool.length) {
            e = new flower.Event(type);
        }
        else {
            e = flower.Event._eventPool.pop();
            e.$cycle = false;
        }
        e.$type = type;
        e.$bubbles = false;
        e.data = data;
        return e;
    }

    static release(e) {
        if (e.$cycle) {
            return;
        }
        e.$cycle = true;
        e.data = null;
        flower.Event._eventPool.push(e);
    }
}

exports.Event = Event;
//////////////////////////End File:flower/event/Event.js///////////////////////////



//////////////////////////File:flower/geom/Matrix.js///////////////////////////
class Matrix {
    static sin;
    static cos;
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    tx = 0;
    ty = 0;
    _storeList = [];

    constructor() {
    }

    identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }

    setTo(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    translate(x, y) {
        this.tx += x;
        this.ty += y;
    }

    rotate(angle) {
        flower.Matrix.sin = Math.sin(angle);
        flower.Matrix.cos = Math.cos(angle);
        this.setTo(this.a * flower.Matrix.cos - this.c * flower.Matrix.sin, this.a * flower.Matrix.sin + this.c * flower.Matrix.cos, this.b * flower.Matrix.cos - this.d * flower.Matrix.sin, this.b * flower.Matrix.sin + this.d * flower.Matrix.cos, this.tx * flower.Matrix.cos - this.ty * flower.Matrix.sin, this.tx * flower.Matrix.sin + this.ty * flower.Matrix.cos);
    }

    scale(scaleX, scaleY) {
        this.a = scaleX;
        this.d = scaleY;
        this.tx *= this.a;
        this.ty *= this.d;
    }

    prependMatrix(prep) {
        this.setTo(this.a * prep.a + this.c * prep.b, this.b * prep.a + this.d * prep.b, this.a * prep.c + this.c * prep.d, this.b * prep.c + this.d * prep.d, this.tx + this.a * prep.tx + this.c * prep.ty, this.ty + this.b * prep.tx + this.d * prep.ty);
    }

    prependTranslation(tx, ty) {
        this.tx += this.a * tx + this.c * ty;
        this.ty += this.b * tx + this.d * ty;
    }

    prependScale(sx, sy) {
        this.setTo(this.a * sx, this.b * sx, this.c * sy, this.d * sy, this.tx, this.ty);
    }

    prependRotation(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        this.setTo(this.a * cos + this.c * sin, this.b * cos + this.d * sin, this.c * cos - this.a * sin, this.d * cos - this.b * sin, this.tx, this.ty);
    }

    prependSkew(skewX, skewY) {
        var sinX = Math.sin(skewX);
        var cosX = Math.cos(skewX);
        var sinY = Math.sin(skewY);
        var cosY = Math.cos(skewY);
        this.setTo(this.a * cosY + this.c * sinY, this.b * cosY + this.d * sinY, this.c * cosX - this.a * sinX, this.d * cosX - this.b * sinX, this.tx, this.ty);
    }

    get deformation() {
        if (this.a != 1 || this.b != 0 || this.c != 0 || this.d != 1)
            return true;
        return false;
    }

    save() {
        var matrix = flower.Matrix.create();
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;
        this._storeList.push(matrix);
    }

    restore() {
        var matrix = this._storeList.pop();
        this.setTo(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        flower.Matrix.release(matrix);
    }

    static $matrix = new Matrix();
    static matrixPool = [];

    static release(matrix) {
        if (!matrix) {
            return;
        }
        matrix._storeList.length = 0;
        flower.Matrix.matrixPool.push(matrix);
    }

    static create() {
        var matrix = flower.Matrix.matrixPool.pop();
        if (!matrix) {
            matrix = new flower.Matrix();
        }
        return matrix;
    }

}

exports.Matrix = Matrix;
//////////////////////////End File:flower/geom/Matrix.js///////////////////////////



//////////////////////////File:flower/geom/Point.js///////////////////////////
class Point {

    x;
    y;

    constructor(x, y) {
        this.x = +x || 0;
        this.y = +y || 0;
    }

    setTo(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }

    static $TempPoint = new Point();
    static pointPool = [];

    static release(point) {
        if (!point) {
            return;
        }
        Point.pointPool.push(point);
    }

    static create(x, y) {
        var point = Point.pointPool.pop();
        if (!point) {
            point = new Point(x, y);
        }
        else {
            point.x = +x || 0;
            point.y = +y || 0;
        }
        return point;
    }
}

exports.Point = Point;
//////////////////////////End File:flower/geom/Point.js///////////////////////////



//////////////////////////File:flower/geom/Rectangle.js///////////////////////////
class Rectangle {
    x;
    y;
    width;
    height;

    constructor(x, y, width, height) {
        this.x = +x || 0;
        this.y = +y || 0;
        this.width = +width || 0;
        this.height = +height || 0;
    }

    get right() {
        return this.x + this.width;
    }

    set right(value) {
        this.width = value - this.x;
    }

    get bottom() {
        return this.y + this.height;
    }

    set bottom(value) {
        this.height = value - this.y;
    }

    get left() {
        return this.x;
    }

    set left(value) {
        this.width += this.x - value;
        this.x = value;
    }

    get top() {
        return this.y;
    }

    set top(value) {
        this.height += this.y - value;
        this.y = value;
    }

    copyFrom(sourceRect) {
        this.x = sourceRect.x;
        this.y = sourceRect.y;
        this.width = sourceRect.width;
        this.height = sourceRect.height;
        return this;
    }

    setTo(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    contains(x, y) {
        return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
    }

    intersection(toIntersect) {
        return this.clone().$intersectInPlace(toIntersect);
    }

    $intersectInPlace(clipRect) {
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

    intersects(toIntersect) {
        return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right) && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
    }

    isEmpty() {
        return this.width <= 0 || this.height <= 0;
    }

    setEmpty() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    clone() {
        return new flower.Rectangle(this.x, this.y, this.width, this.height);
    }

    _getBaseWidth(angle) {
        var u = Math.abs(Math.cos(angle));
        var v = Math.abs(Math.sin(angle));
        return u * this.width + v * this.height;
    }

    _getBaseHeight(angle) {
        var u = Math.abs(Math.cos(angle));
        var v = Math.abs(Math.sin(angle));
        return v * this.width + u * this.height;
    }

    static rectanglePool = [];

    static release(rect) {
        if (!rect) {
            return;
        }
        flower.Rectangle.rectanglePool.push(rect);
    }

    static create(x, y, width, height) {
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
}

exports.Rectangle = Rectangle;
//////////////////////////End File:flower/geom/Rectangle.js///////////////////////////



//////////////////////////File:flower/geom/Size.js///////////////////////////
class Size {

    width;
    height;

    constructor(width, height) {
        this.width = +width || 0;
        this.height = +height || 0;
    }

    setTo(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    get area() {
        return this.width * this.height;
    }

    static $TempSize = new Size();
    static sizePool = [];

    static release(size) {
        if (!size) {
            return;
        }
        flower.Size.sizePool.push(size);
    }

    static create(width, height) {
        var size = flower.Size.sizePool.pop();
        if (!size) {
            size = new flower.Size(width, height);
        }
        else {
            size.width = +width || 0;
            size.height = +height || 0;
        }
        return size;
    }
}

exports.Size = Size;
//////////////////////////End File:flower/geom/Size.js///////////////////////////



//////////////////////////File:flower/display/BlendMode.js///////////////////////////
class BlendMode {
    static NORMAL = "normal";
}

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
class DisplayObject extends EventDispatcher {
    constructor() {
        super();
    }
}
//////////////////////////End File:flower/display/DisplayObject.js///////////////////////////



//////////////////////////File:flower/display/Sprite.js///////////////////////////
class Sprite extends DisplayObject {

    _childs;

    constructor() {
        super();
        this._childs = [];
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlag(flags);
        var childs = this._childs;
        for (var i = 0; i < childs.length; i++) {
            childs[i].$addFlagsDown(flags);
        }
    }
}
//////////////////////////End File:flower/display/Sprite.js///////////////////////////



})();
var flower = exports;
