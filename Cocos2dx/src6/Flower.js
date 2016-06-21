var exports = {};
(function(){
//////////////////////////File:flower/Flower.js///////////////////////////
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
                    completeFunc(Platform.stage, Platform.stage2);
                });
                loader.load();
            });
            loader.load();
        });
        loader.load();
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

function trace() {
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
        str += arguments[i] + "\t\t";
    }
    console.log(str);
}

exports.start = start;
exports.getLanguage = getLanaguge;
exports.trace = trace;
//////////////////////////End File:flower/Flower.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/Platform.js///////////////////////////
class Platform {
    static type = "cocos2dx";
    static native;

    static stage;
    static width;
    static height;

    static start(engine, root) {
        Platform.native = cc.sys.isNative;
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
        Platform.stage2 = root.show;
        Platform.stage = new scene();
        Platform.stage.update = Platform._run;
        cc.director.runScene(Platform.stage);
        Platform.width = cc.director.getWinSize().width;
        Platform.height = cc.director.getWinSize().height;
        root.show.setPositionY(Platform.height);
        //debugRoot.setPositionY(Platform.height);
        Platform.stage.addChild(root.show);
        //Platform.stage.addChild(debugRoot);
        //System.$mesureTxt.retain();
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
            item[0](item[1], item[2], item[3], item[4]);
        }
    }

    static pools = {};

    static create(name) {
        var pools = Platform.pools;
        if (name == "Sprite") {
            if (pools.Sprite && pools.Sprite.length) {
                return pools.Sprite.pop();
            }
            return new PlatformSprite();
        }
        if (name == "Bitmap") {
            if (pools.Bitmap && pools.Bitmap.length) {
                return pools.Bitmap.pop();
            }
            return new PlatformBitmap();
        }
        if (name == "TextField") {
            if (pools.TextField && pools.TextField.length) {
                return pools.TextField.pop();
            }
            return new PlatformTextField();
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
}
//////////////////////////End File:flower/platform/cocos2dx/Platform.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////
class PlatformSprite {

    show;

    constructor() {
        this.show = new cc.Node();
        this.show.setAnchorPoint(0, 0);
        this.show.retain();
    }

    addChild(child) {
        this.show.addChild(child.show);
    }

    removeChild(child) {
        this.show.removeChild(child.show);
    }

    resetChildIndex(children) {
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$nativeShow.show.setLocalZOrder(i);
        }
    }

    set x(val) {
        this.show.setPositionX(val);
    }

    set y(val) {
        this.show.setPositionY(-val);
    }

    set scaleX(val) {
        this.show.setScaleX(val);
    }

    set scaleY(val) {
        this.show.setScaleY(val);
    }

    set rotation(val) {
        this.show.setRotation(val);
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////
class PlatformTextField {

    show;

    constructor() {
        this.show = new cc.LabelTTF("", "Times Roman", 12);
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        show.setString("");
        show.setFontSize(12);
        show.setFontFillColor({r: 0, g: 0, b: 0}, true);
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////
class PlatformBitmap {

    show;
    __textureChange = false;
    __texture;
    __x = 0;
    __y = 0;
    __programmer;
    __programmerChange = false;
    __shaderFlagChange = false;
    __shaderFlag = 0;
    __scale9Grid;
    __scaleX = 1;
    __scaleY = 1;
    __textureScaleX = 1;
    __textureScaleY = 1;

    constructor() {
        this.show = new cc.Sprite();
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        if (this.__texture) {
            this.__textureChange = true;
        }
        this.show.initWithTexture(texture.$nativeTexture);
        var source = texture.source;
        if (source) {
            this.show.setTextureRect(source, texture.sourceRotation, {
                width: source.width,
                height: source.height
            });
        }
        this.__textureScaleX = texture.scaleX;
        this.__textureScaleY = texture.scaleY;
        this.show.setAnchorPoint(0, 1);
        this.x = this.__x;
        this.y = this.__y;
        if (this.__textureScaleX != 1) {
            this.scaleX = this.__scaleX;
        }
        if (this.__textureScaleY != 1) {
            this.scaleY = this.__scaleY;
        }
        this._changeShader();
    }

    setScale9Grid(scale9Grid) {
        var hasScale9 = this.__scale9Grid;
        this.__scale9Grid = scale9Grid;
        this.__shaderFlag |= PlatformShaderType.SCALE_9_GRID;
        this.__shaderFlagChange = true;
        if (this.__scale9Grid) {
            if (hasScale9 == null) {
                if (!this.__programmer || this.__programmer == PlatformProgrammer.instance) {
                    this.__programmer = PlatformProgrammer.createProgrammer();
                    this.__programmerChange = true;
                }
            }
        } else {
            if (Platform.native) {
                this.show.setGLProgramState(PlatformProgrammer.getInstance().$nativeProgrammer);
            } else {
                this.show.setShaderProgram(PlatformProgrammer.getInstance().$nativeProgrammer);
            }
        }
        this._changeShader();
    }

    _changeShader() {
        if ((this.__textureChange || this.__programmerChange) && this.__programmer) {
            if (Platform.native) {
                this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
            } else {
                this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
            }
            this.__textureChange = false;
            this.__programmerChange = false;
        }
        if (this.__shaderFlagChange && this.__programmer) {
            this.__programmer.shaderFlag = this.__shaderFlag;
            this.__shaderFlag &= ~PlatformShaderType.SCALE_9_GRID;
            this.__shaderFlagChange = false;
        }
        if (this.__texture) {
            if (this.__scale9Grid) {
                this._changeScale9Grid(this.__texture.width, this.__texture.height, this.__scale9Grid,
                    this.__texture.width * this.__scaleX, this.__texture.height * this.__scaleY);
            }
        }
    }

    _changeScale9Grid(width, height, scale9Grid, setWidth, setHeight) {
        //flower.trace("setScal9Grid:", width, height, scale9Grid.x, scale9Grid.y, scale9Grid.width, scale9Grid.height, setWidth, setHeight);
        //width /= this.__textureScaleX;
        //height /= this.__textureScaleY;
        //scale9Grid.x /= this.__textureScaleX;
        //scale9Grid.y /= this.__textureScaleY;
        //scale9Grid.width /= this.__textureScaleX;
        //scale9Grid.height /= this.__textureScaleY;
        var scaleX = setWidth / width;
        var scaleY = setHeight / height;
        var left = scale9Grid.x / width;
        var top = scale9Grid.y / height;
        var right = (scale9Grid.x + scale9Grid.width) / width;
        var bottom = (scale9Grid.y + scale9Grid.height) / height;
        var tleft = left / scaleX;
        var ttop = top / scaleY;
        var tright = 1.0 - (1.0 - right) / scaleX;
        var tbottom = 1.0 - (1.0 - bottom) / scaleY;
        var scaleGapX = (right - left) / (tright - tleft);
        var scaleGapY = (bottom - top) / (tbottom - ttop);
        var programmer = this.__programmer.$nativeProgrammer;
        if (Platform.native) {
            programmer.setUniformFloat("left", left);
            programmer.setUniformFloat("top", top);
            programmer.setUniformFloat("tleft", tleft);
            programmer.setUniformFloat("ttop", ttop);
            programmer.setUniformFloat("tright", tright);
            programmer.setUniformFloat("tbottom", tbottom);
            programmer.setUniformFloat("scaleGapX", scaleGapX);
            programmer.setUniformFloat("scaleGapY", scaleGapY);
            programmer.setUniformFloat("scaleX", scaleX);
            programmer.setUniformFloat("scaleY", scaleY);
        } else {
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("left"), left);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("top"), top);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("tleft"), tleft);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("ttop"), ttop);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("tright"), tright);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("tbottom"), tbottom);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleGapX"), scaleGapX);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleGapY"), scaleGapY);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleX"), scaleX);
            programmer.setUniformLocationF32(programmer.getUniformLocationForName("scaleY"), scaleY);
        }
    }

    set x(val) {
        this.__x = val;
        this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
    }

    set y(val) {
        this.__y = val;
        this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
    }

    set scaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val * this.__textureScaleX);
        if(this.__texture.offX) {
            this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
        }
        this._changeShader();
    }

    set scaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val * this.__textureScaleY);
        if(this.__texture.offY) {
            this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
        }
        this._changeShader();
    }

    set rotation(val) {
        console.log("rot?" + val);
        this.show.setRotation(val);
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        this.__scaleX = 1;
        this.__scaleY = 1;
        this.__textureChange = false;
        this.__texture = null;
        this.__x = 0;
        this.__y = 0;
        this.__textureScaleX = 1;
        this.__textureScaleY = 1;
        this.__programmerChange = false;
        if (this.__programmer) {
            PlatformProgrammer.release(this.__programmer);
            this.show.setGLProgramState(PlatformProgrammer.getInstance());
        }
        this.__programmer = null;
        this.__shaderFlagChange = false;
        this.__shaderFlag = 0;
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////
class PlatformTexture {

    textrue;
    url;

    constructor() {

    }

    dispose() {
        cc.TextureCache.getInstance().removeTextureForKey(this.url);
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////
class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        if (url.slice(0, "http://".length) == "http://") {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onloadend = function () {
                if (xhr.status != 200) {
                    errorBack.call(thisObj);
                } else {
                    back.call(thisObj, xhr.responseText);
                }
                PlatformURLLoader.isLoading = false;
            };
            xhr.send();
        } else {
            var res = cc.loader.getRes(url);
            if (res) {
                if (res instanceof String) {

                } else {
                    res = JSON.stringify(res);
                }
                back.call(thisObj, res);
                PlatformURLLoader.isLoading = false;
            } else {
                cc.loader.load(url, function () {
                    //console.log("what?",arguments);
                }, function (error, data) {
                    if (error) {
                        errorBack.call(thisObj);
                    }
                    else {
                        if (data instanceof String) {

                        } else {
                            data = JSON.stringify(data);
                        }
                        back.call(thisObj, data);
                    }
                    PlatformURLLoader.isLoading = false;
                });
            }
        }
    }

    static loadTexture(url, back, errorBack, thisObj) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2002, url);
        }
        cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, img) {
            if (err) {
                errorBack.call(thisObj);
            }
            else {
                var texture;
                if (Platform.native) {
                    texture = img;
                } else {
                    texture = new cc.Texture2D();
                    texture.initWithElement(img);
                    texture.handleLoadedTexture();
                }
                back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
                //if (Platform.native) {
                //    back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
                //} else {
                //
                //    back.call(thisObj, new cc.Texture2D(texture), texture.width, texture.height);
                //}
            }
            PlatformURLLoader.isLoading = false;
        });
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformProgrammer.js///////////////////////////
class PlatformProgrammer {

    $nativeProgrammer;
    _scale9Grid;

    constructor(vsh = "", fsh = "res/shaders/Bitmap.fsh") {
        if(vsh == "") {
            if(Platform.native) {
                vsh = "res/shaders/Bitmap.vsh";
            } else {
                vsh = "res/shaders/BitmapWeb.vsh";
            }
        }
        var shader;// = Programmer.shader;
        shader = new cc.GLProgram(vsh, fsh);
        shader.retain();
        if(!Platform.native) {
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        }
        shader.link();
        shader.updateUniforms();
        if (Platform.native) {
            this.$nativeProgrammer = cc.GLProgramState.getOrCreateWithGLProgram(shader);
        } else {
            this.$nativeProgrammer = shader;
        }
    }

    set shaderFlag(type) {
        if (Platform.native) {
            this.$nativeProgrammer.setUniformInt("scale9", type & PlatformShaderType.SCALE_9_GRID);
        } else {
            this.$nativeProgrammer.setUniformLocationI32(this.$nativeProgrammer.getUniformLocationForName("scale9"), type & PlatformShaderType.SCALE_9_GRID);
        }
    }

    static programmers = [];

    static createProgrammer() {
        if (PlatformProgrammer.programmers.length) {
            return PlatformProgrammer.programmers.pop();
        }
        return new PlatformProgrammer();
    }

    static releaseProgrammer(programmer) {
        PlatformProgrammer.programmers.push(programmer);
    }

    static instance;

    static getInstance() {
        if (PlatformProgrammer.instance == null) {
            PlatformProgrammer.instance = new PlatformProgrammer(Platform.native?"res/shaders/Bitmap.vsh":"res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
        }
        return PlatformProgrammer.instance;
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformProgrammer.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformShaderType.js///////////////////////////
class PlatformShaderType {
    static TEXTURE_CHANGE = 0x0001;
    static SCALE_9_GRID = 0x0002;
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformShaderType.js///////////////////////////



//////////////////////////File:flower/core/CoreTime.js///////////////////////////
class CoreTime {

    static currentTime = 0;
    static lastTimeGap;

    static $run(gap) {
        CoreTime.lastTimeGap = gap;
        CoreTime.currentTime += gap;
        EnterFrame.$update(CoreTime.currentTime, gap);
        Stage.$onFrameEnd();
        TextureManager.getInstance().$check();
    }

    static getTime() {
        return CoreTime.getTime();
    }
}
//////////////////////////End File:flower/core/CoreTime.js///////////////////////////



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
locale_strings[1003] = "重复创建纹理:{0}";
locale_strings[1004] = "创建纹理:{0}";
locale_strings[1005] = "释放纹理:{0}";
locale_strings[2001] = "[loadText] {0}";
locale_strings[2002] = "[loadTexture] {0}";

//////////////////////////End File:flower/language/zh_CN.js///////////////////////////



//////////////////////////File:flower/event/EventDispatcher.js///////////////////////////
class EventDispatcher {

    __EventDispatcher;
    __hasDispose = false;

    constructor(target) {
        this.__EventDispatcher = {
            0: target || this,
            1: {}
        }
    }

    dispose() {
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
        list.push({"listener": listener, "thisObject": thisObject, "once": once, "del": false});
    }

    removeListener(type, listener, thisObject) {
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

    removeAllListener() {
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

    hasListener(type) {
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

    dispatch(event) {
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

    dispatchWidth(type, data = null) {
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

    __x;
    __y;

    __DisplayObject;

    /**
     * 脏标识
     * 0x0001 size 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0100 重排子对象顺序
     */
    __flags;

    /**
     * 父对象
     */
    __parent;

    /**
     * 舞台类
     */
    __stage;

    __alpha = 1;
    __concatAlpha = 1;

    /**
     * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
     */
    $nativeShow;

    constructor() {
        super();
        this.__DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: null, //settingWidth
            4: null, //settingHeight
            5: "", //name
            6: new Size() //size 自身尺寸
        }
        this.__flags = 0;
    }

    /**
     * 是否有此标识位
     * @param flags
     * @returns {boolean}
     */
    $hasFlags(flags) {
        return this.__flags & flags == flags ? true : false;
    }

    $addFlags(flags) {
        this.__flags |= flags;
    }

    $addFlagsUp(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        if (this.__parent) {
            this.__parent.$addFlags(flags);
        }
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
    }

    $removeFlags(flags) {
        this.__flags &= ~flags;
    }

    $removeFlagsUp(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        if (this.__parent) {
            this.__parent.$removeFlags(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
    }

    $setX(val) {
        val = +val || 0;
        if (val == this.__x) {
            return;
        }
        this.__x = val;
        this.$nativeShow.x = val;
        this.$invalidPositionScale();
    }

    $setY(val) {
        val = +val || 0;
        if (val == this.__y) {
            return;
        }
        this.__y = val;
        this.$nativeShow.y = val;
        this.$invalidPositionScale();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.__DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$nativeShow.scaleX = val;
        this.$invalidPositionScale();
    }

    $getScaleX() {
        var p = this.__DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
        return p[0];
    }

    $setScaleY(val) {
        val = +val || 0;
        var p = this.__DisplayObject;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$nativeShow.scaleY = val;
        this.$invalidPositionScale();
    }

    $getScaleY() {
        var p = this.__DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
        return p[1];
    }

    $setRotation(val) {
        val = +val || 0;
        var p = this.__DisplayObject;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        this.$nativeShow.rotation = val;
        this.$invalidPositionScale();
    }

    $setAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        if (val == this.__alpha) {
            return;
        }
        this.__alpha = val;
        this.$addFlagsDown(0x0002);
    }

    $getConcatAlpha() {
        if (this.$hasFlags(0x0002)) {
            this.__concatAlpha = this.__alpha;
            if (this.__parent) {
                this.__concatAlpha *= this.__parent.$getConcatAlpha();
            }
            this.$removeFlags(0x0002);
        }
        return this.__concatAlpha;
    }

    $setWidth(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.__DisplayObject;
        if (p[3] == val) {
            return;
        }
        p[3] = val;
        this.invalidSize();
    }

    $getWidth() {
        var p = this.__DisplayObject;
        return p[3] != null ? p[3] : this.$getSize().height;
    }

    $setHeight(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.__DisplayObject;
        if (p[4] == val) {
            return;
        }
        p[4] = val;
        this.invalidSize();
    }

    $getHeight() {
        var p = this.__DisplayObject;
        return p[4] != null ? p[4] : this.$getSize().width;
    }

    $getSize() {
        var size = this.__DisplayObject[6];
        if (this.$hasFlags(0x0001)) {
            this.calculateSize(size);
            this.__checkSettingSize(size);
            this.$removeFlags(0x0001);
        }
        return size;
    }

    __checkSettingSize(size) {
        var p = this.__DisplayObject;
        /**
         * 尺寸失效， 并且约定过 宽 或者 高
         */
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            if (p[3] != null) {
                if (size.width == 0) {
                    if (p[3] == 0) {
                        this.scaleX = 0;
                    } else {
                        this.scaleX = Infinity;
                    }
                } else {
                    this.scaleX = p[3] / size.width;
                }
            }
            if (p[4]) {
                if (size.height == 0) {
                    if (p[4] == 0) {
                        this.scaleY = 0;
                    } else {
                        this.scaleY = Infinity;
                    }
                } else {
                    this.scaleY = p[4] / size.height;
                }
            }
        }
    }

    $setParent(parent, stage) {
        this.__parent = parent;
        this.__stage = stage;
        this.$addFlagsDown(0x0002);
        if (this.__parent) {
            this.dispatchWidth(Event.ADDED);
        } else {
            this.dispatchWidth(Event.REMOVED);
        }
    }

    $dispatchAddedToStageEvent() {
        if (this.__stage) {
            this.dispatchWidth(Event.ADDED_TO_STAGE);
        }
    }

    $dispatchRemovedFromStageEvent() {
        if (!this.__stage) {
            this.dispatchWidth(Event.REMOVED_FROM_STAGE);
        }
    }

    dispatch(e) {
        if (e.bubbles && this.__parent) {
            this.__parent.dispatch(e);
        }
    }

    get x() {
        return this.__x;
    }

    set x(val) {
        this.$setX(val);
    }

    get y() {
        return this.__y;
    }

    set y(val) {
        this.$setY(val);
    }

    get scaleX() {
        var p = this.__DisplayObject;
        return p[0];
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        var p = this.__DisplayObject;
        return p[1];
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    get rotation() {
        var p = this.__DisplayObject;
        return p[2];
    }

    set rotation(val) {
        this.$setRotation(val);
    }

    get alpha() {
        return this.__alpha;
    }

    set alpha(val) {
        this.$setAlpha(val);
    }

    get width() {
        return this.$getWidth();
    }

    set width(val) {
        this.$setWidth(val);
    }

    get height() {
        return this.$getHeight();
    }

    set height(val) {
        this.$setHeight(val);
    }

    get parent() {
        return this.__parent;
    }

    /**
     * 计算尺寸
     * 子类实现
     * @param size
     */
    calculateSize(size) {

    }

    /**
     * 本身尺寸失效
     */
    invalidSize() {
        this.$addFlagsUp(0x0001);
    }

    $invalidPositionScale() {
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $onFrameEnd() {
        var p = this.__DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.alpha = this.$getConcatAlpha();
        }
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.dispose();
    }
}
//////////////////////////End File:flower/display/DisplayObject.js///////////////////////////



//////////////////////////File:flower/display/Sprite.js///////////////////////////
class Sprite extends DisplayObject {

    __children;

    constructor() {
        super();
        this.__children = [];
        this.$nativeShow = Platform.create("Sprite");
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$addFlagsDown(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$removeFlagsDown(flags);
        }
    }

    addChild(child) {
        this.addChildAt(child, this.__children.length);
    }

    addChildAt(child, index) {
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
            this.$nativeShow.addChild(child.$nativeShow);
            children.splice(index, 0, child);
            child.$setParent(this, this.stage);
            if (child.parent == this) {
                child.$dispatchAddedToStageEvent();
                this.invalidSize();
                this.$addFlags(0x0100);
            }
        }
    }

    $removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                this.invalidSize();
                this.$addFlags(0x0100);
                break;
            }
        }
    }

    removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                this.$nativeShow.removeChild(child);
                children.splice(i, 1);
                child.$setParent(null, null);
                child.$dispatchRemovedFromStageEvent();
                this.invalidSize();
                this.$addFlags(0x0100);
                break;
            }
        }
    }

    removeChildAt(index) {
        var children = this.__children;
        if (index < 0 || index >= children.length) {
            return;
        }
        this.removeChild(children[index]);
    }

    setChildIndex(child, index) {
        var childIndex = this.getChildIndex(child);
        if (childIndex == index) {
            return;
        }
        var children = this.__children;
        children.splice(childIndex, 1);
        children.splice(index, 0, child);
        this.$addFlags(0x0100);
    }

    getChildIndex(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (child == children[i]) {
                return i;
            }
        }
        return -1;
    }

    $onFrameEnd() {
        var children = this.__children;
        /**
         * 子对象序列改变
         */
        if (this.$hasFlags(0x0100)) {
            this.$nativeShow.resetChildIndex(children);
            this.$removeFlags(0x0100);
        }
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$onFrameEnd();
        }
        super.$onFrameEnd();
    }

    get numChildren() {
        return this.__children.length;
    }

    dispose() {
        var children = this.__children;
        while (children.length) {
            var child = children[children.length - 1];
            child.dispose();
        }
        super.dispose();
        Platform.release("Sprite", this.$nativeShow);
    }
}

exports.Sprite = Sprite;
//////////////////////////End File:flower/display/Sprite.js///////////////////////////



//////////////////////////File:flower/display/Bitmap.js///////////////////////////
class Bitmap extends DisplayObject {

    __texture;
    __scale9Grid;

    constructor(texture) {
        super();
        this.$nativeShow = Platform.create("Bitmap");
        this.texture = texture;
    }

    $setTexture(val) {
        if (val == this.__texture) {
            return false;
        }
        if (this.__texture) {
            this.__texture.$delCount();
        }
        this.__texture = val;
        if (val) {
            this.__texture.$addCount();
            this.$nativeShow.setTexture(this.__texture);
        }
        else {
            this.$nativeShow.setTexture(Texture.$blank);
        }
        this.invalidSize();
        return true;
    }

    calculateSize(size) {
        if (this.__texture) {
            size.width = this.__texture.width;
            size.height = this.__texture.height;
        } else {
            size.width = 0;
            size.height = 0;
        }
    }

    $setScale9Grid(val) {
        if (this.__scale9Grid == val) {
            return false;
        }
        this.__scale9Grid = val;
        this.$nativeShow.setScale9Grid(val);
        return true;
    }

    set texture(val) {
        this.$setTexture(val);
    }

    set scale9Grid(val) {
        this.$setScale9Grid(val);
    }

    dispose() {
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
    }
}

exports.Bitmap = Bitmap;
//////////////////////////End File:flower/display/Bitmap.js///////////////////////////



//////////////////////////File:flower/display/Stage.js///////////////////////////
class Stage extends Sprite {
    constructor() {
        super();
        this.__stage = this;
        Stage.stages.push(this);
    }

    get stageWidth() {
        return Platform.width;
    }

    get stageHeight() {
        return Platform.height;
    }

    static stages = [];

    static getInstance() {
        return Stage.stages[0];
    }

    static $onFrameEnd() {
        for (var i = 0; i < Stage.stages.length; i++) {
            Stage.stages[i].$onFrameEnd();
        }
    }
}

exports.Stage = Stage;
//////////////////////////End File:flower/display/Stage.js///////////////////////////



//////////////////////////File:flower/texture/Texture.js///////////////////////////
class Texture {

    __source;
    __offX = 0;
    __offY = 0;
    __sourceRotation = false;
    __width;
    __height;
    __settingWidth;
    __settingHeight;
    __url;
    __nativeURL;
    $nativeTexture;
    $count;
    $parentTexture;

    constructor(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
        this.$nativeTexture = nativeTexture;
        this.__url = url;
        this.__nativeURL = nativeURL;
        this.$count = 0;
        this.__width = w;
        this.__height = h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
    }

    createSubTexture(startX, startY, width, height, offX = 0, offY = 0, rotation = false) {
        var sub = new Texture(this.$nativeTexture, this.__url, this.__nativeURL, width, height, width * this.scaleX, height * this.scaleY);
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

    $addCount() {
        if (this._parentTexture) {
            this._parentTexture.$addCount();
        } else {
            this.$count++;
        }
    }

    $delCount() {
        if (this._parentTexture) {
            this._parentTexture.$delCount();
        } else {
            this.$count--;
            if (this.$count < 0) {
                this.$count = 0;
            }
        }
    }

    getCount() {
        if (this._parentTexture) {
            this._parentTexture.getCount();
        } else {
            return this.$count;
        }
    }

    get url() {
        return this.__url;
    }

    get nativeURL() {
        return this.__nativeURL;
    }

    get width() {
        return this.__settingWidth || this.__width;
    }

    get height() {
        return this.__settingHeight || this.__height;
    }

    get source() {
        return this.__source;
    }

    get offX() {
        return this.__offX;
    }

    get offY() {
        return this.__offY;
    }

    get sourceRotation() {
        return this.__sourceRotation;
    }

    get scaleX() {
        return this.width / this.__width;
    }

    get scaleY() {
        return this.height / this.__height;
    }

    dispose() {
        if (this.$count != 0) {
            return;
        }
        this.$nativeTexture.dispose();
        this.$nativeTexture = null;
        if (TIP) {
            $tip(1005, this.__nativeURL);
        }
    }

    /**
     * 空白图片
     */
    static $blank;
}
//////////////////////////End File:flower/texture/Texture.js///////////////////////////



//////////////////////////File:flower/texture/TextureManager.js///////////////////////////
class TextureManager {

    list = [];

    /**
     * 创建纹理
     * @param nativeTexture
     * @param url
     * @param nativeURL
     * @param w
     * @param h
     * @param settingWidth
     * @param settingHeight
     * @returns {*}
     */
    $createTexture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].url == url) {
                if (DEBUG) {
                    $error(1003, url);
                }
                return this.list[i];
            }
        }
        if (TIP) {
            $tip(1004, nativeURL);
        }
        var texture = new Texture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight);
        this.list.push(texture);
        return texture;
    }

    $getTextureByNativeURL(url) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].nativeURL == url) {
                return this.list[i];
            }
        }
        return null;
    }

    $check() {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].$count == 0) {
                this.list.splice(i, 1)[0].dispose();
                return;
            }
        }
    }


    static instance;

    static getInstance() {
        if (TextureManager.instance == null) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }
}
//////////////////////////End File:flower/texture/TextureManager.js///////////////////////////



//////////////////////////File:flower/net/URLLoader.js///////////////////////////
class URLLoader extends EventDispatcher {

    _createRes = false;
    _res;
    _isLoading = false;
    _data;
    _linkLoader;
    _links;
    _type;
    _selfDispose = false;
    _language;
    _scale;
    _loadInfo;

    constructor(res) {
        super();
        if (typeof(res) == "string") {
            this._createRes = true;
            res = ResItem.create(res);
        }
        this._res = res;
        this._type = this._res.type;
        this._language = LANGUAGE;
        this._scale = SCALE ? SCALE : null;
    }

    get url() {
        return this._res ? this._res.url : "";
    }

    get loadURL() {
        return this._loadInfo ? this._loadInfo.url : "";
    }

    get type() {
        return this._res ? this._res.type : "";
    }

    set language(val) {
        this._language = val;
    }

    set scale(val) {
        this._scale = val * (SCALE ? SCALE : 1);
    }

    $addLink(loader) {
        if (!this._links) {
            this._links = [];
        }
        this._links.push(loader);
    }

    load(res) {
        if (this._isLoading) {
            dispatchWidth(Event.ERROR, "URLLoader is loading, url:" + this.url);
            return;
        }
        this._loadInfo = this._res.getLoadInfo(this._language, this._scale);
        this._isLoading = true;
        for (var i = 0; i < URLLoader.list.length; i++) {
            if (URLLoader.list[i].loadURL == this.loadURL) {
                this._linkLoader = URLLoader.list[i];
                break;
            }
        }
        if (this._linkLoader) {
            this._linkLoader.$addLink(this);
            return;
        }
        URLLoader.list.push(this);
        if (this.type == ResType.IMAGE) {
            this.loadTexture();
        } else {
            this.loadText();
        }
    }

    loadTexture() {
        var texture = TextureManager.getInstance().$getTextureByNativeURL(this._loadInfo.url);
        if (texture) {
            texture.$addCount();
            this._data = texture;
            new CallLater(this.loadComplete, this);
        }
        else {
            PlatformURLLoader.loadTexture(this._loadInfo.url, this.loadTextureComplete, this.loadError, this);
        }
    }

    loadTextureComplete(nativeTexture, width, height) {
        var texture = TextureManager.getInstance().$createTexture(nativeTexture, this.url, this._loadInfo.url, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
        this._data = texture;
        texture.$addCount();
        new CallLater(this.loadComplete, this);
    }

    setTextureByLink(texture) {
        texture.$addCount();
        this._data = texture;
        this.loadComplete();
    }

    loadText() {
        PlatformURLLoader.loadText(this._loadInfo.url, this.loadTextComplete, this.loadError, this);
    }

    loadTextComplete(content) {
        if (this._type == ResType.TEXT) {
            this._data = content;
        }
        else if (this._type == ResType.JSON) {
            this._data = JSON.parse(content);
        }
        new CallLater(this.loadComplete, this);
    }

    setTextByLink(content) {
        if (this._type == ResType.TEXT) {
            this._data = content;
        }
        else if (this._type == ResType.JSON) {
            this._data = JSON.parse(content);
        }
        this.loadComplete();
    }

    setJsonByLink(content) {
        this._data = content;
        this.loadComplete();
    }

    loadComplete() {
        if (this._links) {
            for (var i = 0; i < this._links.length; i++) {
                if (this._type == ResType.Image) {
                    this._links[i].setTextureByLink(this._data);
                }
                else if (this._type == ResType.TEXT) {
                    this._links[i].setTextByLink(this._data);
                }
                else if (this._type == ResType.JSON) {
                    this._links[i].setJsonByLink(this._data);
                }
            }
        }
        this._links = null;
        this._isLoading = false;
        if (!this._res || !this._data) {
            this._selfDispose = true;
            this.dispose();
            this._selfDispose = false;
            return;
        }
        for (var i = 0; i < URLLoader.list.length; i++) {
            if (URLLoader.list[i] == this) {
                URLLoader.list.splice(i, 1);
                break;
            }
        }
        this.dispatchWidth(Event.COMPLETE, this._data);
        this._selfDispose = true;
        this.dispose();
        this._selfDispose = false;
    }

    loadError() {
        if (this.hasListener(IOErrorEvent.ERROR)) {
            this.dispatch(new IOErrorEvent(IOErrorEvent.ERROR, "[加载纹理失败] " + this._res.localURL));
        }
        else {
            DebugInfo.debug("[加载纹理失败] " + this._res.localURL, DebugInfo.ERROR);
        }
    }

    dispose() {
        if (!this._selfDispose) {
            super.dispose();
            return;
        }
        if (this._data && this._type == ResType.Image) {
            this._data.$delCount();
            this._data = null;
        }
        if (this._createRes) {
            ResItem.release(this._res);
        }
        this._res = null;
        this._data = null;
        super.dispose();
        for (var i = 0; i < URLLoader.list.length; i++) {
            if (URLLoader.list[i] == this) {
                URLLoader.list.splice(i, 1);
                break;
            }
        }
    }

    static list = [];

    static clear() {
        while (URLLoader.list.length) {
            var loader = URLLoader.list.pop();
            loader.dispose();
        }
    }
}

exports.URLLoader = URLLoader;
//////////////////////////End File:flower/net/URLLoader.js///////////////////////////



//////////////////////////File:flower/res/Res.js///////////////////////////
class Res {

    static __resItems = [];

    /**
     * 查询存储的 ResItem，通过 url 查找匹配的项
     * @param url
     */
    static getRes(url) {
        var list = Res.__resItems;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].url == url) {
                return list[i];
            }
        }
        return null;
    }

    static addRes(res) {
        var list = Res.__resItems;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].url == res.url) {
                list.splice(i, 1);
                break;
            }
        }
        list.push(res);
    }
}

exports.Res = Res;
//////////////////////////End File:flower/res/Res.js///////////////////////////



//////////////////////////File:flower/res/ResItem.js///////////////////////////
class ResItem {
    /**
     * 使用时的路径
     */
    __url;

    /**
     * 实际的加载地址有哪些
     */
    __loadList = [];

    /**
     * 资源类型
     */
    __type;

    constructor(url, type) {
        this.__url = url;
        this.__type = type;
    }

    addURL(url) {
        var info = ResItemInfo.create();
        var array = url.split("/");
        var last = array.pop();
        var nameArray = last.split(".");
        var name = "";
        var end = "";
        if (nameArray.length == 1) {
            name = nameArray[0];
        } else {
            end = nameArray[nameArray.length - 1];
            name = last.slice(0, last.length - end.length - 1);
        }
        nameArray = name.split("@");
        var settingWidth;
        var settingHeight;
        var scale;
        var language;
        for (var i = 1; i < nameArray.length; i++) {
            var content = nameArray[i];
            var code = content.charCodeAt(0);
            if (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0) || code == ".".charCodeAt(0)) {
                var nums = content.split("x");
                if (nums.length == 1) {
                    scale = parseFloat(content);
                } else if (nums.length == 2) {
                    settingWidth = parseInt(nums[0]);
                    settingHeight = parseInt(nums[1]);
                }
            } else {
                language = content;
            }
        }
        info.url = url;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale || 1;
        info.language = language;
        this.__loadList.push(info);
    }

    addInfo(url, settingWidth, settingHeight, scale, language) {
        var info = ResItemInfo.create();
        info.url = url;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale || 1;
        info.language = language;
        this.__loadList.push(info);
    }

    getLoadInfo(language, scale) {
        var loadList = this.__loadList;
        if (loadList.length == 1) {
            return loadList[0];
        }
        var info;
        for (var i = 0; i < loadList.length; i++) {
            if (language && language != loadList[i].language) {
                continue;
            }
            if (!info) {
                info = loadList[i];
            } else if (scale != null) {
                if (loadList[i].scale != null && Math.abs(loadList[i].scale - scale) < Math.abs(info.scale - scale)) {
                    info = loadList[i];
                }
            }
        }
        if (!info) {
            info = loadList[0];
        }
        return info;
    }

    get type() {
        return this.__type;
    }

    get url() {
        return this.__url;
    }

    static $pools = [];

    static create(url) {
        var array = url.split("/");
        var last = array.pop();
        var nameArray = last.split(".");
        var name = "";
        var end = "";
        if (nameArray.length == 1) {
            name = nameArray[0];
        } else {
            end = nameArray[nameArray.length - 1];
            name = last.slice(0, last.length - end.length - 1);
        }
        nameArray = name.split("@");
        var settingWidth;
        var settingHeight;
        var scale;
        var language;
        for (var i = 1; i < nameArray.length; i++) {
            var content = nameArray[i];
            var code = content.charCodeAt(0);
            if (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0) || code == ".".charCodeAt(0)) {
                var nums = content.split("x");
                if (nums.length == 1) {
                    scale = parseFloat(content);
                } else if (nums.length == 2) {
                    settingWidth = parseInt(nums[0]);
                    settingHeight = parseInt(nums[1]);
                }
            } else {
                language = content;
            }
        }
        var useURL = "";
        for (var i = 0; i < array.length; i++) {
            useURL += array[i] + "/";
        }
        useURL += nameArray[0] + (end != "" ? "." + end : "");
        var res;
        if (ResItem.$pools.length) {
            res = ResItem.$pools.pop();
            res.__url = useURL;
            res.__type = ResType.getType(end);
            res.__loadList.length = 0;
        } else {
            res = new ResItem(useURL, ResType.getType(end));
        }
        res.addInfo(url, settingWidth, settingHeight, scale, language);
        return res;
    }

    static release(item) {
        while (item.__loadList.length) {
            ResItemInfo.release(item.__loadList.pop());
        }
        ResItem.$pools.push(item);
    }
}

exports.ResItem = ResItem;
//////////////////////////End File:flower/res/ResItem.js///////////////////////////



//////////////////////////File:flower/res/ResItemInfo.js///////////////////////////
class ResItemInfo {

    /**
     * 实际的加载地址
     */
    url;

    /**
     * 预设的宽
     */
    settingWidth;

    /**
     * 预设的高
     */
    settingHeight;

    /**
     * 支持的缩放倍数
     */
    scale;

    /**
     * 支持的语言
     */
    language;

    static $pools = [];

    static create() {
        if (ResItemInfo.$pools.length) {
            return ResItemInfo.$pools.pop();
        } else {
            return new ResItemInfo();
        }
    }

    static release(info) {
        ResItemInfo.$pools.push(info);
    }
}

exports.ResItemInfo = ResItemInfo;
//////////////////////////End File:flower/res/ResItemInfo.js///////////////////////////



//////////////////////////File:flower/res/ResType.js///////////////////////////
class ResType {
    static TEXT = 1;
    static JSON = 2;
    static IMAGE = 3;

    static getURLType(url) {
        if (url.split(".").length == 1) {
            return ResType.TEXT;
        }
        var end = url.split(".")[url.split(".").length - 1];
        return ResType.getType(end);
    }

    static getType(end) {
        if (end == "json") {
            return ResType.JSON;
        }
        if (end == "png" || end == "jpg") {
            return ResType.IMAGE;
        }
        return ResType.TEXT;
    }
}

exports.ResType = ResType;
//////////////////////////End File:flower/res/ResType.js///////////////////////////



//////////////////////////File:flower/utils/EnterFrame.js///////////////////////////
class EnterFrame {
    static enterFrames = [];
    static waitAdd = [];

    static add(call, owner) {
        for (var i = 0; i < flower.EnterFrame.enterFrames.length; i++) {
            if (flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner) {
                return;
            }
        }
        for (i = 0; i < flower.EnterFrame.waitAdd.length; i++) {
            if (flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner) {
                return;
            }
        }
        flower.EnterFrame.waitAdd.push({"call": call, "owner": owner});
    }

    static del(call, owner) {
        for (var i = 0; i < flower.EnterFrame.enterFrames.length; i++) {
            if (flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner) {
                flower.EnterFrame.enterFrames.splice(i, 1);
                return;
            }
        }
        for (i = 0; i < flower.EnterFrame.waitAdd.length; i++) {
            if (flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner) {
                flower.EnterFrame.waitAdd.splice(i, 1);
                return;
            }
        }
    }

    static frame = 0;
    static updateFactor = 1;

    static $update(now, gap) {
        flower.EnterFrame.frame++;
        flower.CallLater.$run();
        if (flower.EnterFrame.waitAdd.length) {
            flower.EnterFrame.enterFrames = flower.EnterFrame.enterFrames.concat(flower.EnterFrame.waitAdd);
            flower.EnterFrame.waitAdd = [];
        }
        var copy = flower.EnterFrame.enterFrames;
        for (var i = 0; i < copy.length; i++) {
            copy[i].call.apply(copy[i].owner, [now, gap]);
        }
    }
}

exports.EnterFrame = EnterFrame;
//////////////////////////End File:flower/utils/EnterFrame.js///////////////////////////



//////////////////////////File:flower/utils/CallLater.js///////////////////////////
class CallLater {
    _func;
    _thisObj;
    _data;

    constructor(func, thisObj, args = null) {
        this._func = func;
        this._thisObj = thisObj;
        this._data = args || [];
        flower.CallLater._next.push(this);
    }

    $call() {
        this._func.apply(this._thisObj, this._data);
        this._func = null;
        this._thisObj = null;
        this._data = null;
    }

    static add(func, thisObj, args = null) {
        for (var i = 0, len = flower.CallLater._next.length; i < len; i++) {
            if (flower.CallLater._next[i]._func == func && flower.CallLater._next[i]._thisObj == thisObj) {
                flower.CallLater._next[i]._data = args || [];
                return;
            }
        }
        new flower.CallLater(func, thisObj, args);
    }

    static _next = [];
    static _list = [];

    static $run() {
        if (!flower.CallLater._next.length) {
            return;
        }
        flower.CallLater._list = flower.CallLater._next;
        flower.CallLater._next = [];
        var list = flower.CallLater._list;
        while (list.length) {
            list.pop().$call();
        }
    }

}

exports.CallLater = CallLater;
//////////////////////////End File:flower/utils/CallLater.js///////////////////////////



//////////////////////////File:flower/utils/ObjectDo.js///////////////////////////
class ObjectDo {

    static toString(obj, maxDepth = 4, before = "", depth = 0) {
        before = before || "";
        depth = depth || 0;
        maxDepth = maxDepth || 4;
        var str = "";
        if (typeof(obj) == "string") {
            str += "\"" + obj + "\"";
        }
        else if (typeof(obj) == "number") {
            str += obj;
        }
        else if (obj instanceof Array) {
            if (depth > maxDepth) {
                return "...";
            }
            str = "[\n";
            for (var i = 0; i < obj.length; i++) {
                str += before + "\t" + flower.ObjectDo.toString(obj[i], maxDepth, before + "\t", depth + 1) + (i < obj.length - 1 ? ",\n" : "\n");
            }
            str += before + "]";
        }
        else if (obj instanceof Object) {
            if (depth > maxDepth) {
                return "...";
            }
            str = "{\n";
            for (var key in obj) {
                str += before + "\t" + key + "\t: " + flower.ObjectDo.toString(obj[key], maxDepth, before + "\t", depth + 1);
                str += ",\n";
            }
            if (str.slice(str.length - 2, str.length) == ",\n") {
                str = str.slice(0, str.length - 2) + "\n";
            }
            str += before + "}";
        }
        else {
            str += obj;
        }
        return str;
    }

    static keys(obj) {
        var list = [];
        for (var key in obj) {
            list.push(key);
        }
        return list;
    }

    static clone(obj) {
        var res = "";
        if (typeof(obj) == "string" || typeof(obj) == "number") {
            res = obj;
        }
        else if (obj instanceof Array) {
            res = obj.concat();
        }
        else if (obj instanceof Object) {
            res = {};
            for (var key in obj) {
                res[key] = ObjectDo.clone(obj[key]);
            }
        }
        else {
            if (obj.hasOwnProperty("clone")) {
                res = obj.clone();
            } else {
                res = obj;
            }
        }
        return res;
    }
}

exports.ObjectDo = ObjectDo;
//////////////////////////End File:flower/utils/ObjectDo.js///////////////////////////



//////////////////////////File:flower/utils/StringDo.js///////////////////////////
class StringDo {
    static changeStringToInner(content) {
        var len = content.length;
        for (var i = 0; i < len; i++) {
            if (content.charAt(i) == "\t") {
                content = content.slice(0, i) + "\\t" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\n") {
                content = content.slice(0, i) + "\\n" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\r") {
                content = content.slice(0, i) + "\\r" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\"") {
                content = content.slice(0, i) + "\\\"" + content.slice(i + 1, len);
                i++;
                len++;
            }
        }
        return content;
    }

    static findString(content, findString, begin) {
        begin = begin || 0;
        for (var i = begin; i < content.length; i++) {
            if (content.slice(i, i + findString.length) == findString) {
                return i;
            }
        }
        return -1;
    }

    static jumpStrings(content, start, jumps) {
        var pos = start;
        while (true) {
            var find = false;
            for (var i = 0; i < jumps.length; i++) {
                if (jumps[i] == content.slice(pos, pos + jumps[i].length)) {
                    find = true;
                    pos += jumps[i].length;
                    break;
                }
            }
            if (find == false) {
                break;
            }
        }
        return pos;
    }

    static findCharNotABC(content, start) {
        start = +start;
        for (var i = start; i < content.length; i++) {
            if (!StringDo.isCharABC(content.charAt(i))) {
                return i;
            }
        }
        return content.length;
    }

    static replaceString(str, findStr, tstr) {
        for (var i = 0; i < str.length; i++) {
            if (StringDo.hasStringAt(str, [findStr], i)) {
                str = str.slice(0, i) + tstr + str.slice(i + findStr.length, str.length);
                i--;
            }
        }
        return str;
    }

    static hasStringAt(str, hstrs, pos) {
        for (var i = 0; i < hstrs.length; i++) {
            var hstr = hstrs[i];
            if (str.length - pos >= hstr.length && str.slice(pos, pos + hstr.length) == hstr) {
                return true;
            }
        }
        return false;
    }
}

exports.StringDo = StringDo;
//////////////////////////End File:flower/utils/StringDo.js///////////////////////////



})();
var flower = exports;
