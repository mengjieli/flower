
var LocalWebSocket = WebSocket;
var $root = eval("this");
var root = root || eval("this");
var __define = $root.__define || function (o, p, g, s) {
        Object.defineProperty(o, p, {configurable: true, enumerable: true, get: g, set: s});
    };

function __extends(d, b) {
    if (b == null) {
        console.log("bug !!", arguments.callee.caller);
    }
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
}
var flower = {};
(function(math){
//////////////////////////File:flower/Flower.js///////////////////////////
var DEBUG = true;
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

/**
 * 启动引擎
 * @param language 使用的语言版本
 */
function start(completeFunc) {
    var stage = new Stage();
    Platform._runBack = CoreTime.$run;
    Platform.start(stage, stage.$nativeShow, stage.$background.$nativeShow);

    var loader = new URLLoader("res/flower.json");
    loader.addListener(Event.COMPLETE, function (e) {
        var cfg = e.data;
        for (var key in cfg) {
            config[key] = cfg[key];
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

        if (config.remote) {
            flower.RemoteServer.start(startLoad);
        } else {
            startLoad();
        }
    });
    loader.load();
}

function $getLanguage() {
    return language;
}

function $error(errorCode, ...args) {
    var msg;
    if (typeof errorCode == "string") {
        msg = errorCode;
    } else {
        msg = getLanguage(errorCode, args);
    }
    console.log(msg);
    throw msg;
}

function $warn(errorCode, ...args) {
    var msg;
    if (typeof errorCode == "string") {
        msg = errorCode;
    } else {
        msg = getLanguage(errorCode, args);
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

flower.start = start;
flower.getLanguage = $getLanguage;
flower.trace = trace;
flower.breakPoint = breakPoint;
flower.sys = {
    config: config,
    DEBUG: DEBUG,
    TIP: TIP,
    $tip: $tip,
    $warn: $warn,
    $error: $error,
    getLanguage: getLanguage
}
flower.params = params;

$root.trace = trace;
//////////////////////////End File:flower/Flower.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/Platform.js///////////////////////////
class Platform {
    static type = "cocos2dx";
    static native;

    static stage;
    static width;
    static height;

    static start(engine, root, background) {
        RETINA = cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX ? true : false;
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
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: this.onMouseMove.bind(this)
                }, this);
            },
            update: function (dt) {
                trace("dt", dt);
            },
            onMouseMove: function (e) {
                engine.$addMouseMoveEvent(math.floor(e.getLocation().x), Platform.height - math.floor(e.getLocation().y));
            },
            onTouchesBegan: function (touch) {
                engine.$addTouchEvent("begin", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesMoved: function (touch) {
                engine.$addTouchEvent("move", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                return true;
            },
            onTouchesEnded: function (touch) {
                engine.$addTouchEvent("end", touch.getID() || 0, math.floor(touch.getLocation().x), Platform.height - math.floor(touch.getLocation().y));
                return true;
            },
        });
        Platform.stage2 = root.show;
        Platform.stage = new scene();
        Platform.stage.update = Platform._run;
        cc.director.runScene(Platform.stage);
        Platform.width = cc.director.getWinSize().width;
        Platform.height = cc.director.getWinSize().height;
        engine.$resize(Platform.width, Platform.height);
        background.show.setPositionY(Platform.height);
        Platform.stage.addChild(background.show);
        root.show.setPositionY(Platform.height);
        Platform.stage.addChild(root.show);
        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    engine.$onKeyDown(key);
                },
                onKeyReleased: function (key, event) {
                    engine.$onKeyUp(key);
                }
            }, Platform.stage);
        } else {
            trace("KEYBOARD Not supported");
        }
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
        if (name == "TextInput") {
            if (pools.TextInput && pools.TextInput.length) {
                return pools.TextInput.pop();
            }
            return new PlatformTextInput();
        }
        if (name == "Shape") {
            if (pools.Shape && pools.Shape.length) {
                return pools.Shape.pop();
            }
            return new PlatformShape();
        }
        if (name == "Mask") {
            if (pools.Mask && pools.Mask.length) {
                return pools.Mask.pop();
            }
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
//////////////////////////End File:flower/platform/cocos2dx/Platform.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformDisplayObject.js///////////////////////////
class PlatformDisplayObject {

    show;
    __x = 0;
    __y = 0;
    __scaleX = 1;
    __scaleY = 1;
    __rotation = 0;
    __width = 0;
    __height = 0;
    __programmer = null;
    __filters = null;

    /**
     * 0x0001 scale9Grid
     * 0x0002 filters
     * @type {number}
     * @private
     */
    __programmerFlag = 0;

    constructor() {
    }

    setX(val) {
        this.__x = val;
        this.show.setPositionX(val);
    }

    setY(val) {
        this.__y = val;
        this.show.setPositionY(-val);
    }

    setVisible(val) {
        this.show.setVisible(val);
    }

    setWidth(val) {
        this.__width = val;
        var programmer = this.__programmer;
        if (programmer) {
            var nativeProgrammer = programmer.$nativeProgrammer;
            if (Platform.native) {
                nativeProgrammer.setUniformFloat("width", this.__width);
            } else {
                programmer.use();
                nativeProgrammer.setUniformLocationF32(nativeProgrammer.getUniformLocationForName("width"), this.__width);
            }
        }
    }

    setHeight(val) {
        this.__height = val;
        var programmer = this.__programmer;
        if (programmer) {
            var nativeProgrammer = programmer.$nativeProgrammer;
            if (Platform.native) {
                nativeProgrammer.setUniformFloat("height", this.__height);
            } else {
                programmer.use();
                nativeProgrammer.setUniformLocationF32(nativeProgrammer.getUniformLocationForName("height"), this.__height);
            }
        }
    }

    setScaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val);
    }

    setScaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val);
    }

    setRotation(val) {
        this.__rotation = val;
        this.show.setRotation(val);
    }

    setAlpha(val) {
        this.show.setOpacity(val * 255);
    }

    addProgrammerFlag(flag) {
        this.__programmerFlag |= flag;
        this.programmerFlagChange(this.__programmerFlag);
    }

    removeProgrammerFlag(flag) {
        this.__programmerFlag &= ~flag;
        this.programmerFlagChange(this.__programmerFlag);
    }

    programmerFlagChange(flag) {
        if (flag) {
            if (!this.__programmer) {
                this.__programmer = PlatformProgram.create();
                var programmer = this.__programmer.$nativeProgrammer;
                if (Platform.native) {
                    this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
                    programmer.setUniformFloat("width", this.__width);
                    programmer.setUniformFloat("height", this.__height);
                } else {
                    this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
                    programmer.use();
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("width"), this.__width);
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("height"), this.__height);
                }
            }
        } else {
            if (this.__programmer) {
                PlatformProgram.release(this.__programmer);
                this.__programmer = null;
                if (Platform.native) {
                    this.show.setGLProgramState(PlatformProgram.getInstance().$nativeProgrammer);
                } else {
                    this.show.setShaderProgram(PlatformProgram.getInstance().$nativeProgrammer);
                }
            }
        }
    }

    setFilters(filters) {
        this.__filters = filters;
        var types1 = [0, 0, 0, 0];
        var types2 = [0, 0, 0, 0];
        var bigFilters = [];
        if (filters) {
            filters.sort(function (filterA, filterB) {
                return filterA.type > filterB.type ? 1 : -1;
            });
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].type >= 100) {
                    bigFilters.push(filters[i]);
                    filters.splice(i, 1);
                    i--;
                }
            }
        }
        if (filters && filters.length) {
            this.addProgrammerFlag(0x0002);
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (!Platform.native) {
                this.__programmer.use();
            }
            var paramsIndex = 0;
            for (var i = 0; i < filters.length; i++) {
                if (i < 4) {
                    types1[i] = filters[i].type;
                } else {
                    types2[i - 4] = filters[i].type;
                }
                var params = filters[i].params;
                if (params.length <= 4) {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params));
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params));
                    }
                    paramsIndex++;
                } else {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(4, params.length)));
                        paramsIndex++;
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(4, params.length)));
                        paramsIndex++;
                    }
                }
            }
        } else {
            this.removeProgrammerFlag(0x0002);
        }
        if (this.__programmer) {
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (Platform.native) {
                nativeProgrammer.setUniformVec4("filters1", cc.math.vec4.apply(null, types1));
                nativeProgrammer.setUniformVec4("filters2", cc.math.vec4.apply(null, types2));
            } else {
                this.__programmer.use();
                nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filters1")].concat(types1));
                nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filters2")].concat(types2));
            }
        }
        if (bigFilters && bigFilters.length) {
            this.setBigFilters(bigFilters);
        }
    }

    setBigFilters(filters) {
        var types1 = [0, 0, 0, 0];
        if (filters && filters.length) {
            this.addProgrammerFlag(0x0002);
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (!Platform.native) {
                this.__programmer.use();
            }
            var paramsIndex = 100;
            for (var i = 0; i < filters.length; i++) {
                if (i < 4) {
                    types1[i] = filters[i].type;
                }
                var params = filters[i].params;
                if (params.length <= 4) {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params));
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params));
                    }
                    paramsIndex++;
                } else {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(4, params.length)));
                        paramsIndex++;
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(4, params.length)));
                        paramsIndex++;
                    }
                }
            }
        } else {
            this.removeProgrammerFlag(0x0002);
        }
        if (this.__programmer) {
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (Platform.native) {
                nativeProgrammer.setUniformVec4("filters100", cc.math.vec4.apply(null, types1));
            } else {
                this.__programmer.use();
                nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filters100")].concat(types1));
            }
        }
    }

    release() {
        this.setScaleX(1);
        this.setScaleY(1);
        this.setRotation(0);
        this.setFilters([]);
        this.setAlpha(1);
        this.setX(0);
        this.setY(0);
        this.setVisible(true);
        this.__x = 0;
        this.__y = 0;
        this.__scaleX = 1;
        this.__scaleY = 1;
        this.__rotation = 0;
        this.__width = 0;
        this.__height = 0;
        this.__programmer = null;
        this.__programmerFlag = 0;
        if (this.__programmer) {
            PlatformProgram.release(this.__programmer);
            if (Platform.native) {
                this.show.setGLProgramState(PlatformProgram.getInstance());
            } else {
                this.show.setShaderProgram(PlatformProgram.getInstance());
            }
        }
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformDisplayObject.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////
class PlatformSprite extends PlatformDisplayObject {

    constructor() {
        super();
        this.initShow();
    }

    initShow() {
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

    setFilters(filters) {

    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////
class PlatformTextField extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    constructor() {
        super();
        this.show = new cc.LabelTTF("", "Times Roman", (RETINA ? 2.0 : 1) * 12);
        this.show.setAnchorPoint(0, 1);
        this.setFontColor(0);
        this.show.retain();
        this.setScaleX(1);
        this.setScaleY(1);
    }

    setFontColor(color) {
        if (Platform.native) {
            this.show.setFontFillColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF}, true);
        } else {
            this.show.color = {r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF};
        }
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var $mesureTxt = PlatformTextField.$mesureTxt;
        $mesureTxt.setFontSize(size);
        this.show.setFontSize((RETINA ? 2.0 : 1) * size);
        var txt = this.show;
        txt.text = "";
        var txtText = "";
        var start = 0;
        if(text == "") {
            txt.setString("");
        }
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.setString(str);
                var lineWidth = $mesureTxt.getContentSize().width;
                var findEnd = i;
                var changeLine = false;
                //如果这一行的文字宽大于设定宽
                while (!autoSize && width && lineWidth > width) {
                    changeLine = true;
                    findEnd--;
                    $mesureTxt.setString(text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    lineWidth = $mesureTxt.getContentSize().width;
                }
                if (wordWrap && changeLine) {
                    i = findEnd;
                    txt.setString(txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.setString(txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.getContentSize().height * (RETINA ? (1 / 2.0) : 1) > height) {
                    txt.setString(txtText);
                    break;
                } else {
                    txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                    if (wordWrap && changeLine) {
                        txtText += "\n";
                    }
                }
                start = i;
                if (multiline == false) {
                    break;
                }
            }
        }
        $mesureTxt.setString(txt.getString());
        return $mesureTxt.getContentSize();
    }

    setFilters(filters) {

    }

    setScaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val * (RETINA ? (1 / 2.0) : 1));
    }

    setScaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val * (RETINA ? (1 / 2.0) : 1));
    }

    release() {
        var show = this.show;
        show.setString("");
        show.setFontSize((RETINA ? 2.0 : 1) * 12);
        this.setFontColor(0);
        super.release();
    }
}

PlatformTextField.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
PlatformTextField.$mesureTxt.retain();
//////////////////////////End File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformTextInput.js///////////////////////////
class PlatformTextInput extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    __changeBack = null;
    __changeBackThis = null;


    constructor() {
        super();
        this.show = new cc.TextFieldTTF();
        if (Platform.native) {
            this.show.setSystemFontSize((RETINA ? 2.0 : 1) * 12);
        } else {
            this.show.setFontSize((RETINA ? 2.0 : 1) * 12);
        }
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
        this.setFontColor(0);
        this.setScaleX(1);
        this.setScaleY(1);
        //if (Platform.native) {
        //} else {
        //    this.show.setDelegate(this);
        //}
    }

    setSize(width,height) {

    }

    setFontColor(color) {
        if (Platform.native) {
            this.show.setTextColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF, a: 255});
        } else {
            this.show.setTextColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF, a: 255});
        }
    }

    setChangeBack(changeBack, thisObj) {
        this.__changeBack = changeBack;
        this.__changeBackThis = thisObj;
    }

    onTextFieldAttachWithIME(sender) {
        console.log("start input");
    }

    onTextFieldDetachWithIME(sender) {
        console.log("stop input");
    }

    onTextFieldInsertText(sender, text, len) {
        //console.log(text + " : " + len);
        if (this.__changeBack) {
            this.__changeBack.call(this.__changeBackThis);
        }
    }

    onTextFieldDeleteBackward() {

    }

    getNativeText() {
        return this.show.getString();
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var $mesureTxt = PlatformTextField.$mesureTxt;
        $mesureTxt.setFontSize(size);
        if (Platform.native) {
            this.show.setSystemFontSize((RETINA ? 2.0 : 1) * size);
        } else {
            this.show.setFontSize((RETINA ? 2.0 : 1) * size);
        }
        var txt = this.show;
        txt.text = "";
        var txtText = "";
        var start = 0;
        if(text == "") {
            txt.setString("");
        }
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.setString(str);
                var lineWidth = $mesureTxt.getContentSize().width;
                var findEnd = i;
                var changeLine = false;
                //如果这一行的文字宽大于设定宽
                while (!autoSize && width && lineWidth > width) {
                    changeLine = true;
                    findEnd--;
                    $mesureTxt.setString(text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    lineWidth = $mesureTxt.getContentSize().width;
                }
                if (wordWrap && changeLine) {
                    i = findEnd;
                    txt.setString(txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.setString(txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.getContentSize().height * (RETINA ? (1 / 2.0) : 1) > height) {
                    txt.setString(txtText);
                    break;
                } else {
                    txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                    if (wordWrap && changeLine) {
                        txtText += "\n";
                    }
                }
                start = i;
                if (multiline == false) {
                    break;
                }
            }
        }
        $mesureTxt.setString(txt.getString());
        return $mesureTxt.getContentSize();
    }

    setFilters(filters) {

    }

    startInput() {
        this.show.attachWithIME();
    }

    stopInput() {
        this.show.detachWithIME();
    }

    setScaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val * (RETINA ? (1 / 2.0) : 1));
    }

    setScaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val * (RETINA ? (1 / 2.0) : 1));
    }

    release() {
        this.__changeBack = null;
        this.__changeBackThis = null;
        var show = this.show;
        show.setString("");
        if (Platform.native) {
            this.show.setSystemFontSize((RETINA ? 2.0 : 1) * 12);
        } else {
            this.show.setFontSize((RETINA ? 2.0 : 1) * 12);
        }
        this.setFontColor(0);
        super.release();
    }
}

PlatformTextInput.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
PlatformTextInput.$mesureTxt.retain();
//////////////////////////End File:flower/platform/cocos2dx/PlatformTextInput.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////
class PlatformBitmap extends PlatformDisplayObject {

    __texture = null;
    __textureScaleX = 1;
    __textureScaleY = 1;
    __scale9Grid;
    __settingWidth;
    __settingHeight;

    constructor() {
        super();
        this.show = new cc.Sprite();
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    setTexture(texture) {
        this.__texture = texture;
        this.show.initWithTexture(texture.$nativeTexture.textrue);
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
        this.setX(this.__x);
        this.setY(this.__y);
        this.setScaleX(this.__scaleX);
        this.setScaleY(this.__scaleY);
        this.setScale9Grid(this.__scale9Grid);
        this.setFilters(this.__filters);
        if (this.__programmer) {
            if (Platform.native) {
                this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
            } else {
                this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
            }
        }
    }


    setFilters(filters) {
        if (!this.__texture) {
            this.__filters = filters;
            return;
        }
        super.setFilters(filters);
    }

    setSettingWidth(width) {
        this.__settingWidth = width;
        this.setScaleX(this.__scaleX);
    }

    setSettingHeight(height) {
        this.__settingHeight = height;
        this.setScaleY(this.__scaleY);
    }

    setScale9Grid(scale9Grid) {
        this.__scale9Grid = scale9Grid;
        if (!this.__texture) {
            return;
        }
        if (scale9Grid) {
            this.addProgrammerFlag(0x0001);
            var width = this.__texture.width;
            var height = this.__texture.height;
            var setWidth = this.__texture.width * this.__scaleX * (this.__settingWidth != null ? this.__settingWidth / this.__texture.width : 1);
            var setHeight = this.__texture.height * this.__scaleY * (this.__settingHeight != null ? this.__settingHeight / this.__texture.height : 1);

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
                programmer.setUniformInt("scale9", 1);
            } else {
                programmer.use();
                programmer.setUniformLocationI32(programmer.getUniformLocationForName("scale9"), 1);
            }
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
        } else {
            this.removeProgrammerFlag(0x0001);
            if (this.__programmer) {
                var programmer = this.__programmer.$nativeProgrammer;
                if (Platform.native) {
                    programmer.setUniformInt("scale9", 0);
                    programmer.setUniformFloat("width", this.__width);
                    programmer.setUniformFloat("height", this.__height);
                } else {
                    this.__programmer.use();
                    programmer.setUniformLocationI32(programmer.getUniformLocationForName("scale9"), 0);
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("width"), this.__width);
                    programmer.setUniformLocationF32(programmer.getUniformLocationForName("height"), this.__height);
                }
            }
        }
    }

    setX(val) {
        this.__x = val;
        this.show.setPositionX(this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX);
    }

    setY(val) {
        this.__y = val;
        this.show.setPositionY(-this.__y - (this.__texture ? this.__texture.offY : 0) * this.__scaleY);
    }

    setScaleX(val) {
        this.__scaleX = val;
        if (this.__texture && this.__settingWidth != null) {
            this.show.setScaleX(val * this.__textureScaleX * this.__settingWidth / this.__texture.width);
        } else {
            this.show.setScaleX(val * this.__textureScaleX);
        }
        if (this.__texture && this.__texture.offX) {
            this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
        }
        this.setScale9Grid(this.__scale9Grid);
    }

    setScaleY(val) {
        this.__scaleY = val;
        if (this.__texture && this.__settingHeight != null) {
            this.show.setScaleY(val * this.__textureScaleY * this.__settingHeight / this.__texture.height);
        } else {
            this.show.setScaleY(val * this.__textureScaleY);
        }
        if (this.__texture && this.__texture.offY) {
            this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
        }
        this.setScale9Grid(this.__scale9Grid);
    }

    release() {
        this.setScale9Grid(null);
        this.__texture = null;
        this.__textureScaleX = 1;
        this.__textureScaleY = 1;
        this.__scale9Grid = null;
        this.__colorFilter = null;
        this.__settingWidth = null;
        this.__settingHeight = null;
        super.release();
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformShape.js///////////////////////////
class PlatformShape extends PlatformDisplayObject {
    constructor() {
        super();
        this.show = new cc.DrawNode();
        this.show.retain();
    }

    draw(points, fillColor, fillAlpha, lineWidth, lineColor, lineAlpha) {
        var shape = this.show;
        for (var i = 0; i < points.length; i++) {
            points[i].y = -points[i].y;
        }
        shape.drawPoly(points, {
            r: fillColor >> 16,
            g: fillColor >> 8 & 0xFF,
            b: fillColor & 0xFF,
            a: fillAlpha * 255
        }, lineWidth, {
            r: lineColor >> 16,
            g: lineColor >> 8 & 0xFF,
            b: lineColor & 0xFF,
            a: lineAlpha * 255
        });
        for (var i = 0; i < points.length; i++) {
            points[i].y = -points[i].y;
        }
    }

    clear() {
        this.show.clear();
    }

    setAlpha(val) {
    }


    setFilters(filters) {

    }

    release() {
        this.clear();
        super.release();
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformShape.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformMask.js///////////////////////////
class PlatformMask extends PlatformSprite {

    constructor() {
        super();
    }

    initShow() {
        this.show = new cc.ClippingNode();
        this.show.setAnchorPoint(0, 0);
        this.show.retain();
    }

    setShape(shape) {
        this.show.setStencil(shape.show);
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformMask.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////
class PlatformTexture {

    textrue;
    url;

    constructor(url, texture) {
        this.url = url;
        this.textrue = texture;
    }

    dispose() {
        if (Platform.native) {
            cc.TextureCache.getInstance().removeTextureForKey(this.url);
        } else {
            this.textrue.releaseData();
        }
        this.textrue = null;
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////
class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        if (url.slice(0, "http://".length) == "http://") {
            var pstr = "?";
            for (var key in params) {
                pstr += key + "=" + params[key] + "&";
            }
            if (pstr.charAt(pstr.length - 1) == "&") {
                pstr = pstr.slice(0, pstr.length - 1);
            }
            if (pstr != "?") {
                url += pstr;
            }
            var xhr = cc.loader.getXMLHttpRequest();
            if (method == null || method == "") {
                method = "GET";
            }
            if (method == "GET") {
                xhr.open("GET", url, true);
            } else if (method == "POST") {
                xhr.open("POST", url, true);
                if (!contentType) {
                    contentType = "application/x-www-form-urlencoded";
                }
                xhr.setRequestHeader("Content-Type", contentType);
            } else if (method == "HEAD") {
                xhr.open("HEAD", url, true);
                xhr.open("HEAD", url, true);
            }
            xhr.onloadend = function () {
                if (xhr.status != 200) {
                    errorBack.call(thisObj);
                } else {
                    if (method == "HEAD") {
                        back.call(thisObj, xhr.getAllResponseHeaders());
                    } else {
                        back.call(thisObj, xhr.responseText);
                    }
                }
                PlatformURLLoader.isLoading = false;
            };
            xhr.send();
        } else {
            var res;
            var end = url.split(".")[url.split(".").length - 1];
            if (end != "plist" && end != "xml" && end != "json") {
                res = cc.loader.getRes(url);
            }
            if (res) {
                back.call(thisObj, res);
                PlatformURLLoader.isLoading = false;
            } else {
                cc.loader.loadTxt(url, function (error, data) {
                    if (error) {
                        errorBack.call(thisObj);
                    }
                    else {
                        if (!CACHE) {
                            cc.loader.release(url);
                        }
                        if (data instanceof Array) {
                            data = JSON.stringify(data[0]);
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
                if (!CACHE) {
                    cc.loader.release(url);
                }
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
                //    back.call(thisObj, new cc.Texture2D(texture), texture.width, texture.height);
                //}
            }
            PlatformURLLoader.isLoading = false;
        });
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformProgram.js///////////////////////////
class PlatformProgram {

    $nativeProgrammer;
    _scale9Grid;
    __uniforms = {};

    constructor(vsh = "", fsh = "res/shaders/Bitmap.fsh") {
        if (vsh == "") {
            if (Platform.native) {
                vsh = "res/shaders/Bitmap.vsh";
            } else {
                vsh = "res/shaders/BitmapWeb.vsh";
            }
        }
        var shader;// = Programmer.shader;
        shader = new cc.GLProgram();
        shader.initWithString(programmers[vsh],programmers[fsh]);
        shader.retain();
        if (!Platform.native) {
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
        console.log("new programmer");
    }

    use() {
        if (!Platform.native) {
            this.$nativeProgrammer.use();
        }
    }

    getUniformLocationForName(name) {
        var uniforms = this.__uniforms;
        if (uniforms[name]) {
            return uniforms[name];
        }
        uniforms[name] = this.$nativeProgrammer.getUniformLocationForName(name);
        return uniforms[name];
    }

    static programmers = [];

    static create() {
        if (PlatformProgram.programmers.length) {
            return PlatformProgram.programmers.pop();
        }
        return new PlatformProgram();
    }

    static release(programmer) {
        PlatformProgram.programmers.push(programmer);
    }

    static instance;

    static getInstance() {
        if (PlatformProgram.instance == null) {
            PlatformProgram.instance = new PlatformProgram(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
        }
        return PlatformProgram.instance;
    }
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformProgram.js///////////////////////////



//////////////////////////File:flower/platform/cocos2dx/PlatformWebSocket.js///////////////////////////
class PlatformWebSocket {

    webSocket;

    bindWebSocket(ip, port, thisObj, onConnect, onReceiveMessage, onError, onClose) {
        var websocket = new LocalWebSocket("ws://" + ip + ":" + port);
        this.webSocket = websocket;
        var openFunc = function () {
            onConnect.call(thisObj);
        };
        websocket.onopen = openFunc;
        var receiveFunc = function (event) {
            if (!cc.sys.isNative && event.data instanceof Blob) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var list = [];
                    var data = new Uint8Array(this.result);
                    for (var i = 0; i < data.length; i++) {
                        list.push(data[i]);
                    }
                    onReceiveMessage.call(thisObj, "buffer", list);
                }
                reader.readAsArrayBuffer(event.data);
            } else if (cc.sys.isNative && event.data instanceof ArrayBuffer) {
                var list = [];
                var data = new Uint8Array(event.data);
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
                onReceiveMessage.call(thisObj, "buffer", list);
            } else {
                onReceiveMessage.call(thisObj, "string", event.data);
            }
        };
        websocket.onmessage = receiveFunc;
        var errorFunc = function () {
            onError.call(thisObj);
        };
        websocket.onerror = errorFunc;
        var closeFunc = function () {
            onClose.call(thisObj);
        };
        websocket.onclose = closeFunc;
        PlatformWebSocket.webSockets.push({
            "webSocket": websocket
        });
        return websocket;
    }

    sendWebSocketUTF(data) {
        this.webSocket.send(data);
    }

    sendWebSocketBytes(data) {
        this.webSocket.send(new Uint8Array(data));
    }

    releaseWebSocket() {
        var item = null;
        var list = PlatformWebSocket.webSockets;
        var webSocket = this.webSocket;
        for (var i = 0; i < list.length; i++) {
            if (websocket == list[i].webSocket) {
                websocket.close();
                websocket.onopen = null;
                websocket.onmessage = null;
                websocket.onerror = null;
                websocket.onclose = null;
                this.webSocket = null;
                list.splice(i, 1);
                break;
            }
        }
    }

    static webSockets = [];
}
//////////////////////////End File:flower/platform/cocos2dx/PlatformWebSocket.js///////////////////////////



//////////////////////////File:flower/debug/DebugInfo.js///////////////////////////
/**
 * 调试信息
 */
class DebugInfo {

    /**
     * 平台对象纪录
     * @type {{}}
     */
    platformObjects;
    /**
     *
     * @type {{}}
     */
    objects = {};

    /**
     * 所有纹理纹理信息
     * @type {Array}
     */
    textures = [];

    constructor() {

    }

    addTexture(texture) {
        this.textures.push(texture);
    }

    delTexture(texture) {
        for (var i = 0; i < this.textures.length; i++) {
            if (this.textures[i] == texture) {
                this.textures.splice(i, 1);
                break;
            }
        }
    }

    static instance = new DebugInfo();

    static getInstance() {
        return DebugInfo.instance;
    }
}

flower.DebugInfo = DebugInfo;
//////////////////////////End File:flower/debug/DebugInfo.js///////////////////////////



//////////////////////////File:flower/debug/TextureInfo.js///////////////////////////
class TextureInfo {

    __texture;

    constructor(texture) {
        this.__texture = texture;
    }

    get url() {
        return this.__texture.url;
    }

    get nativeURL() {
        return this.__texture.nativeURL;
    }

    get count() {
        return this.__texture.count;
    }
}

flower.TextureInfo = TextureInfo;
//////////////////////////End File:flower/debug/TextureInfo.js///////////////////////////



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
        return CoreTime.currentTime;
    }
}

flower.CoreTime = CoreTime;
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
function getLanguage(code, ...args) {
    var text = $locale_strings[$language][code];
    if (!text) {
        return "{" + code + "}";
    }
    var length = args.length;
    for (var i = 0; i < length; i++) {
        text = StringDo.replaceString(text,"{" + i + "}", args[i]);
    }
    return text;
}

flower.sys.getLanguage = getLanguage;
//////////////////////////End File:flower/language/Language.js///////////////////////////



//////////////////////////File:flower/language/zh_CN.js///////////////////////////
var $locale_strings = $locale_strings || {};
$locale_strings["zh_CN"] = $locale_strings["zh_CN"] || {};

var locale_strings = $locale_strings["zh_CN"];
var docsWebSite = "github.com/mengjieli/flower/blob/UI/";

//core 1000-3000
locale_strings[1001] = "对象已经回收。";
locale_strings[1002] = "对象已释放，对象名称:{0}";
locale_strings[1003] = "重复创建纹理:{0}";
locale_strings[1004] = "创建纹理:{0}";
locale_strings[1005] = "释放纹理:{0}";
locale_strings[1006] = "纹理已释放:{0} ，关于纹理释放可访问 http://" + docsWebSite + "docs/class/texture.md?dispose";
locale_strings[1007] = "{0} 超出索引: {1}，索引范围为 0 ~ {2}";
locale_strings[1008] = "错误的参数类型：{0} ，请参考 http://" + docsWebSite + "docs/class/{1}.md?f{2}";
locale_strings[1020] = "开始标签和结尾标签不一致，开始标签：{0} ，结尾标签：{1}";
locale_strings[1030] = "目标显示对象不在同一个显示列表中";
locale_strings[2001] = "[loadText] {0}";
locale_strings[2002] = "[loadTexture] {0}";
locale_strings[2003] = "[加载失败] {0}";
locale_strings[2004] = "[加载Plist失败] {0}";

flower.sys.$locale_strings = $locale_strings;
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

    get isDispose() {
        return this.__hasDispose;
    }

    dispose() {
        this.__EventDispatcher = null;
        this.__hasDispose = true;
    }

    $release() {
        this.__EventDispatcher = {
            0: this,
            1: {}
        }
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
        if (this.__hasDispose) {
            return;
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
        if (this.__hasDispose) {
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
        if (!this.__EventDispatcher) {
            return;
        }
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

    dispatchWith(type, data = null, bubbles = false) {
        if (DEBUG) {
            if (this.__hasDispose) {
                $error(1002);
            }
        }
        var e = flower.Event.create(type, data, bubbles);
        e.$target = this;
        this.dispatch(e);
        flower.Event.release(e);
    }
}

flower.EventDispatcher = EventDispatcher;
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
    static FOCUS_IN = "focus_in";
    static FOCUS_OUT = "focus_out";
    static CONFIRM = "confirm";
    static CANCEL = "cancel";
    static START_INPUT = "start_input";
    static STOP_INPUT = "stop_input";
    static DISTORT = "distort";
    static CREATION_COMPLETE = "creation_complete";
    static SELECTED_ITEM_CHANGE = "selected_item_change";
    static CLICK_ITEM = "click_item";
    static TOUCH_BEGIN_ITEM = "touch_begin_item";

    static _eventPool = [];

    static create(type, data = null, bubbles = false) {
        var e;
        if (!flower.Event._eventPool.length) {
            e = new flower.Event(type);
        }
        else {
            e = flower.Event._eventPool.pop();
            e.$cycle = false;
        }
        e.$type = type;
        e.$bubbles = bubbles;
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

flower.Event = Event;
//////////////////////////End File:flower/event/Event.js///////////////////////////



//////////////////////////File:flower/event/TouchEvent.js///////////////////////////
class TouchEvent extends Event {

    $touchId = 0;
    $touchX = 0;
    $touchY = 0;
    $stageX = 0;
    $stageY = 0;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get touchId() {
        return this.$touchId;
    }

    get touchX() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchX;
        }
        return this.$touchX;
    }

    get touchY() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchY;
        }
        return this.$touchY;
    }

    get stageX() {
        return this.$stageX;
    }

    get stageY() {
        return this.$stageY;
    }

    static TOUCH_BEGIN = "touch_begin";
    static TOUCH_MOVE = "touch_move";
    static TOUCH_END = "touch_end";
    static TOUCH_RELEASE = "touch_release";
    /**
     * 此事件是在没有 touch 的情况下发生的，即没有按下
     * @type {string}
     */
    static MOVE = "move";
}

flower.TouchEvent = TouchEvent;
//////////////////////////End File:flower/event/TouchEvent.js///////////////////////////



//////////////////////////File:flower/event/MouseEvent.js///////////////////////////
class MouseEvent extends Event {

    $touchX;
    $touchY;
    $stageX;
    $stageY;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get mouseX() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchX;
        }
        return this.$touchX;
    }

    get mouseY() {
        if (this.currentTarget) {
            return this.currentTarget.lastTouchY;
        }
        return this.$touchY;
    }

    get stageX() {
        return this.$stageX;
    }

    get stageY() {
        return this.$stageY;
    }

    /**
     * 此事件是在没有 touch 的情况下发生的，即没有按下
     * @type {string}
     */
    static MOUSE_MOVE = "mouse_move";
    static MOUSE_OVER = "mouse_over";
    static MOUSE_OUT = "mouse_out";
    static RIGHT_CLICK = "right_click";
}

flower.MouseEvent = MouseEvent;
//////////////////////////End File:flower/event/MouseEvent.js///////////////////////////



//////////////////////////File:flower/event/DragEvent.js///////////////////////////
class DragEvent extends Event {

    //DisplayObject
    $dragSource;
    $dragType;
    $accept = false;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get dragSource() {
        return this.$dragSource;
    }

    get dragType() {
        return this.$dragType;
    }

    get hasAccept() {
        return this.$accept;
    }

    accept() {
        this.$accept = true;
    }

    static DRAG_OVER = "drag_over";
    static DRAG_OUT = "drag_out";
    static DRAG_END = "drag_end";

    static $Pools = [];

    static create(type, bubbles, dragSource, dragType, dragData) {
        var event = DragEvent.$Pools.pop();
        if (!event) {
            event = new DragEvent(type, bubbles);
        } else {
            event.$type = type;
            event.$bubbles = bubbles;
        }
        event.data = dragData;
        event.$dragSource = dragSource;
        event.$dragType = dragType;
        return event;
    }

    static release(e) {
        DragEvent.$Pools.push(e);
    }
}

flower.DragEvent = DragEvent;
//////////////////////////End File:flower/event/DragEvent.js///////////////////////////



//////////////////////////File:flower/event/KeyboardEvent.js///////////////////////////
class KeyboardEvent extends Event {

    __keyCode;
    __key;


    constructor(type, key, bubbles = true) {
        super(type, bubbles);
        this.__keyCode = key;
        this.__key = String.fromCharCode(key);
    }

    get keyCode() {
        return this.__keyCode;
    }

    get key() {
        return this.__key;
    }

    get shift() {
        return KeyboardEvent.$shift;
    }

    get control() {
        return KeyboardEvent.$control;
    }

    get alt() {
        return KeyboardEvent.$alt;
    }

    static $shift = false; //16
    static $control = false; //17
    static $alt = false; //18

    static KEY_DOWN = "key_down";
    static KEY_UP = "key_up";
}

flower.KeyboardEvent = KeyboardEvent;
//////////////////////////End File:flower/event/KeyboardEvent.js///////////////////////////



//////////////////////////File:flower/filters/Filter.js///////////////////////////
class Filter {

    //滤镜类型，在 shader 中与之对应
    //1 为 ColorFilter
    __type = 0;

    constructor(type) {
        this.__type = type;
    }

    get type() {
        return this.__type;
    }

    get params() {
        return this.$getParams();
    }

    $getParams() {

    }
}

flower.Filter = Filter;
//////////////////////////End File:flower/filters/Filter.js///////////////////////////



//////////////////////////File:flower/filters/ColorFilter.js///////////////////////////
class ColorFilter extends Filter {
    __h = 0;
    __s = 0;
    __l = 0;

    constructor(h = 0, s = -100, l = 0) {
        super(1);
        this.h = h;
        this.s = s;
        this.l = l;
    }

    $getParams() {
        return [this.h, this.s, this.l];
    }

    get h() {
        return this.__h;
    }

    set h(val) {
        val += 180;
        if (val < 0) {
            val = 360 - (-val) % 360;
        } else {
            val = val % 360;
        }
        val -= 180;
        this.__h = val;
    }

    get s() {
        return this.__s;
    }

    set s(val) {
        if (val > 100) {
            val = 100;
        } else if (val < -100) {
            val = -100;
        }
        this.__s = val;
    }

    get l() {
        return this.__l;
    }

    set l(val) {
        if (val > 100) {
            val = 100;
        } else if (val < -100) {
            val = -100;
        }
        this.__l = val;
    }
}

flower.ColorFilter = ColorFilter;
//////////////////////////End File:flower/filters/ColorFilter.js///////////////////////////



//////////////////////////File:flower/filters/StrokeFilter.js///////////////////////////
class StrokeFilter extends Filter {

    __size = 0;
    __r = 0;
    __g = 0;
    __b = 0;

    /**
     * 描边滤镜
     * @param size 描边大小
     * @param color 描边颜色
     */
    constructor(size = 1, color = 0x000000) {
        super(2);
        this.size = size;
        this.color = color;
    }

    set size(val) {
        this.__size = val;
    }

    get size() {
        return this.__size;
    }

    set color(val) {
        val = +val || 0;
        this.__r = val >> 16 & 0xFF;
        this.__g = val >> 8 & 0xFF;
        this.__b = val & 0xFF;
    }

    get color() {
        return this.__r << 16 | this.__g << 8 | this.__b;
    }

    $getParams() {
        return [this.__size, this.__r/255, this.__g/255, this.__b/255];
    }
}

flower.StrokeFilter = StrokeFilter;
//////////////////////////End File:flower/filters/StrokeFilter.js///////////////////////////



//////////////////////////File:flower/filters/BlurFilter.js///////////////////////////
class BlurFilter extends Filter {

    __blurX = 0;
    __blurY = 0;

    constructor(blurX = 4, blurY = 4) {
        super(100);
        this.blurX = blurX;
        this.blurY = blurY;
    }

    get blurX() {
        return this.__blurX;
    }

    set blurX(val) {
        val = +val||0;
        if(val < 1) {
            val = 0;
        }
        this.__blurX = val;
    }

    get blurY() {
        return this.__blurY;
    }

    set blurY(val) {
        val = +val||0;
        if(val < 1) {
            val = 0;
        }
        this.__blurY = val;
    }

    $getParams() {
        return [this.__blurX, this.__blurY];
    }
}

flower.BlurFilter = BlurFilter;
//////////////////////////End File:flower/filters/BlurFilter.js///////////////////////////



//////////////////////////File:flower/geom/Matrix.js///////////////////////////
class Matrix {
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
        var sin = math.sin(angle);
        var cos = math.cos(angle);
        this.setTo(this.a * cos - this.c * sin, this.a * sin + this.c * cos,
            this.b * cos - this.d * sin, this.b * sin + this.d * cos,
            this.tx * cos - this.ty * sin, this.tx * sin + this.ty * cos);
    }

    scale(scaleX, scaleY) {
        this.a *= scaleX;
        this.d *= scaleY;
        this.tx *= scaleX;
        this.ty *= scaleY;
    }

    transformPoint(pointX, pointY, resultPoint) {
        var x = this.a * pointX + this.c * pointY + this.tx;
        var y = this.b * pointX + this.d * pointY + this.ty;
        if (resultPoint) {
            resultPoint.setTo(x, y);
            return resultPoint;
        }
        return new Point(x, y);
    }

    $updateSR(scaleX, scaleY, rotation) {
        var sin = 0;
        var cos = 1;
        if (rotation) {
            sin = math.sin(rotation);
            cos = math.cos(rotation);
        }
        this.a = cos * scaleX;
        this.b = sin * scaleY;
        this.c = -sin * scaleX;
        this.d = cos * scaleY;
    }

    $updateRST(rotation, scaleX, scaleY, tx, ty) {
        var sin = 0;
        var cos = 1;
        if (rotation) {
            sin = math.sin(rotation);
            cos = math.cos(rotation);
        }
        this.a = cos * scaleX;
        this.b = sin * scaleX;
        this.c = -sin * scaleY;
        this.d = cos * scaleY;
        this.tx = cos * scaleX * tx - sin * scaleY * ty;
        this.ty = sin * scaleX * tx + cos * scaleY * ty;
    }

    $transformRectangle(rect) {
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var tx = this.tx;
        var ty = this.ty;
        var x = rect.x;
        var y = rect.y;
        var xMax = x + rect.width;
        var yMax = y + rect.height;
        var x0 = a * x + c * y + tx;
        var y0 = b * x + d * y + ty;
        var x1 = a * xMax + c * y + tx;
        var y1 = b * xMax + d * y + ty;
        var x2 = a * xMax + c * yMax + tx;
        var y2 = b * xMax + d * yMax + ty;
        var x3 = a * x + c * yMax + tx;
        var y3 = b * x + d * yMax + ty;
        var tmp = 0;
        if (x0 > x1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
        }
        if (x2 > x3) {
            tmp = x2;
            x2 = x3;
            x3 = tmp;
        }
        rect.x = math.floor(x0 < x2 ? x0 : x2);
        rect.width = math.ceil((x1 > x3 ? x1 : x3) - rect.x);
        if (y0 > y1) {
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        if (y2 > y3) {
            tmp = y2;
            y2 = y3;
            y3 = tmp;
        }
        rect.y = math.floor(y0 < y2 ? y0 : y2);
        rect.height = math.ceil((y1 > y3 ? y1 : y3) - rect.y);
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

    /**
     * 创建出来的矩阵可能不是规范矩阵
     * @returns {flower.Matrix}
     */
    static create() {
        var matrix = flower.Matrix.matrixPool.pop();
        if (!matrix) {
            matrix = new flower.Matrix();
        }
        return matrix;
    }

}

flower.Matrix = Matrix;
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
        return math.sqrt(this.x * this.x + this.y * this.y);
    }

    static distance(p1, p2) {
        return math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
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

flower.Point = Point;
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
        var l = math.max(x0, x1);
        var r = math.min(x0 + this.width, x1 + clipRect.width);
        if (l <= r) {
            var t = math.max(y0, y1);
            var b = math.min(y0 + this.height, y1 + clipRect.height);
            if (t <= b) {
                this.setTo(l, t, r - l, b - t);
                return this;
            }
        }
        this.setEmpty();
        return this;
    }

    intersects(toIntersect) {
        return math.max(this.x, toIntersect.x) <= math.min(this.right, toIntersect.right) && math.max(this.y, toIntersect.y) <= math.min(this.bottom, toIntersect.bottom);
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
        var u = math.abs(math.cos(angle));
        var v = math.abs(math.sin(angle));
        return u * this.width + v * this.height;
    }

    _getBaseHeight(angle) {
        var u = math.abs(math.cos(angle));
        var v = math.abs(math.sin(angle));
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

flower.Rectangle = Rectangle;
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

flower.Size = Size;
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

    static id = 0;

    $DisplayObject;

    /**
     * 脏标识
     * 0x0001 contentBounds 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     *        1) 父容器 contentBounds 失效 (并且设置了 percentWidth 或 percentHeight 或 left&right 或
     *        left&horizontalCenter 或 right& horizontalCenter或 top&bottom 或 top&verticalCenter 或 bottom&verticalCenter)
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0004 bounds 在父类中的尺寸失效
     * 0x0008 matrix
     * 0x0010 reverseMatrix
     * 0x0100 重排子对象顺序
     * 0x0400 shape需要重绘
     * 0x0800 文字内容改变
     * 0x1000 UI 属性失效
     * 0x2000 layout 失效
     * 0x4000 DataGroup 需要显示对象 data
     */
    __flags = 0;

    /**
     * 父对象
     */
    __parent;

    /**
     * 舞台类
     */
    __stage;

    __alpha = 1;
    __parentAlpha = 1;
    __concatAlpha = 1;
    __visible = true;

    /**
     * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
     */
    $nativeShow;

    constructor() {
        super();
        var id = DisplayObject.id++;
        this.$DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: null, //settingWidth
            4: null, //settingHeight
            5: "instance" + id, //name
            6: new Rectangle(), //contentBounds 自身显示尺寸失效
            7: new Rectangle(), //bounds 在父类中的表现尺寸
            8: true, //touchEnabeld
            9: true, //multiplyTouchEnabled
            10: 0, //lastTouchX
            11: 0, //lastTouchY
            12: new Matrix(), //matrix
            13: new Matrix(), //reverseMatrix
            14: 0, //radian
            20: id, //id
            21: true, //dispatchEventToParent
            50: false, //focusEnabeld
            60: [], //filters
            61: [], //parentFilters
        }
    }

    /**
     * 是否有此标识位
     * @param flags
     * @returns {boolean}
     */
    $hasFlags(flags) {
        return (this.__flags & flags) == flags ? true : false;
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
            this.__parent.$addFlagsUp(flags);
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
            this.__parent.$removeFlagsUp(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
    }

    $getX() {
        return this.$DisplayObject[12].tx;
    }

    $setX(val) {
        val = +val || 0;
        var matrix = this.$DisplayObject[12];
        if (val == matrix.tx) {
            return;
        }
        matrix.tx = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setX(val);
        this.$invalidateReverseMatrix();
    }

    $getY() {
        return this.$DisplayObject[12].ty;
    }

    $setY(val) {
        val = +val || 0;
        var matrix = this.$DisplayObject[12];
        if (val == matrix.ty) {
            return;
        }
        matrix.ty = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setY(val);
        this.$invalidateReverseMatrix();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setScaleX(val);
        this.$invalidateMatrix();
    }

    $getScaleX() {
        var p = this.$DisplayObject;
        return p[0];
    }

    $setScaleY(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setScaleY(val);
        this.$invalidateMatrix();
    }

    $getScaleY() {
        var p = this.$DisplayObject;
        return p[1];
    }

    $setRotation(val) {
        val = +val || 0;
        if (val < 0) {
            val = 360 - (-val) % 360;
        } else {
            val = val % 360;
        }
        var p = this.$DisplayObject;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        p[14] = val * math.PI / 180;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setRotation(val);
        this.$invalidateMatrix();
    }

    $getMatrix() {
        var p = this.$DisplayObject;
        var matrix = p[12];
        if (this.$hasFlags(0x0008)) {
            this.$removeFlags(0x0008);
            matrix.$updateSR(p[0], p[1], p[14]);
        }
        return matrix;
    }

    $getReverseMatrix() {
        var p = this.$DisplayObject;
        var matrix = p[13];
        if (this.$hasFlags(0x0010)) {
            this.$removeFlags(0x0010);
            matrix.$updateRST(-p[14], 1 / p[0], 1 / p[1], -p[12].tx, -p[12].ty);
        }
        return matrix;
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

    $setVisible(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.__visible) {
            return false;
        }
        this.__visible = val;
        this.$nativeShow.setVisible(val);
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
        var p = this.$DisplayObject;
        if (val == null) {
            if (p[3] == null) {
                return;
            }
        } else {
            val = +val;
            val = val < 0 ? 0 : val;
            if (p[3] == val) {
                return false;
            }
        }
        p[3] = val;
        this.$invalidatePosition();
        return true;
    }

    $getWidth() {
        var p = this.$DisplayObject;
        return p[3] != null ? p[3] : this.$getContentBounds().width;
    }

    $setHeight(val) {
        var p = this.$DisplayObject;
        if (val == null) {
            if (p[4] == null) {
                return;
            }
        } else {
            val = +val;
            val = val < 0 ? 0 : val;
            if (p[4] == val) {
                return false;
            }
        }
        p[4] = val;
        this.$invalidatePosition();
        return true;
    }

    $getHeight() {
        var p = this.$DisplayObject;
        return p[4] != null ? p[4] : this.$getContentBounds().height;
    }

    $getBounds(fromParent = false) {
        var rect = this.$DisplayObject[7];
        if (this.$hasFlags(0x0004)) {
            this.$removeFlags(0x0004);
            var contentRect = this.$getContentBounds();
            rect.copyFrom(contentRect);
            var width = this.width;
            var height = this.height;
            if (rect.width != width) {
                rect.x = 0;
                rect.width = width;
            }
            if (rect.height != height) {
                rect.y = 0;
                rect.height = height = height;
            }
            var matrix = this.$getMatrix();
            matrix.$transformRectangle(rect);
        }
        return rect;
    }

    $getContentBounds() {
        var rect = this.$DisplayObject[6];
        while (this.$hasFlags(0x0001)) {
            this.$removeFlags(0x0001);
            this.$measureContentBounds(rect);
        }
        return rect;
    }

    $setTouchEnabled(val) {
        var p = this.$DisplayObject;
        if (p[8] == val) {
            return false;
        }
        p[8] = val;
        return true;
    }

    $setMultiplyTouchEnabled(val) {
        varp = this.$DisplayObject;
        if (p[9] == val) {
            return false;
        }
        p[9] = val;
        return true;
    }

    $setParent(parent) {
        this.__parent = parent;
        var parentAlpha = parent ? parent.$getConcatAlpha() : 1;
        if (this.__parentAlpha != parentAlpha) {
            this.__parentAlpha = parentAlpha;
            this.$addFlagsDown(0x0002);
        }
        if (this.__parent) {
            this.$setParentFilters(this.__parent.$getAllFilters());
            this.dispatchWith(Event.ADDED);
        } else {
            this.$setParentFilters(null);
            this.dispatchWith(Event.REMOVED);
        }
    }

    $setStage(stage) {
        this.__stage = stage;
    }

    $dispatchAddedToStageEvent() {
        if (this.__stage) {
            this.dispatchWith(Event.ADDED_TO_STAGE);
        }
    }

    $dispatchRemovedFromStageEvent() {
        if (!this.__stage) {
            this.dispatchWith(Event.REMOVED_FROM_STAGE);
        }
    }

    $setFilters(val) {
        if (val == null) {
            val = [];
        }
        var p = this.$DisplayObject;
        p[60] = val;
        this.$changeAllFilters();
        return true;
    }

    $setDispatchEventToParent(val) {
        if (val == "false") {
            val = false;
        }
        this.$DisplayObject[21] = !!val;
    }

    $setParentFilters(val) {
        if (val == null) {
            val = [];
        }
        var p = this.$DisplayObject;
        p[61] = val;
        this.$changeAllFilters();
    }

    $changeAllFilters() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setFilters(this.$getAllFilters());
    }

    $getAllFilters() {
        var p = this.$DisplayObject;
        return [].concat(p[60]).concat(p[61]);
    }

    dispatch(e) {
        super.dispatch(e);
        if (e.bubbles && !e.isPropagationStopped && this.__parent && this.$DisplayObject[21]) {
            this.__parent.dispatch(e);
        }
    }

    /**
     * 计算自身尺寸
     * 子类实现
     * @param size
     */
    $measureContentBounds(rect) {

    }

    /**
     * 计算自身在父类中的尺寸
     * @param rect
     */
    $measureBounds(rect) {

    }

    /**
     * 本身尺寸失效
     */
    $invalidateContentBounds() {
        this.$addFlagsUp(0x0001 | 0x0004);
    }

    /**
     * 矩阵失效
     */
    $invalidateMatrix() {
        this.$addFlags(0x0008 | 0x0010);
        this.$invalidatePosition();
    }

    /**
     * 逆矩阵失效
     */
    $invalidateReverseMatrix() {
        this.$addFlags(0x0010);
        this.$invalidatePosition();
    }

    /**
     * 位置失效
     */
    $invalidatePosition() {
        this.$addFlagsUp(0x0004);
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var bounds = this.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + this.width && touchY < bounds.y + this.height) {
            return this;
        }
        return null;
    }

    $onFrameEnd() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
    }

    localToGlobal(point) {
        var display = this;
        while (display.parent) {
            display = display.parent;
        }
        return this.localToDisplay(point, display);
    }

    localToDisplay(point, display) {
        point = point || new flower.Point();
        var parentsThis = [];
        var dis = this;
        while (dis) {
            parentsThis.push(dis);
            dis = dis.parent;
        }
        var parentsDisplay = [];
        dis = display;
        while (dis) {
            parentsDisplay.push(dis);
            dis = dis.parent;
        }
        var find = false;
        for (var i = 0; i < parentsThis.length; i++) {
            for (var j = 0; j < parentsDisplay.length; j++) {
                if (parentsThis[i] == parentsDisplay[j]) {
                    parentsThis.splice(i, parentsThis.length - i);
                    parentsDisplay.splice(j, parentsDisplay.length - j);
                    find = true;
                    break;
                }
            }
        }
        if (!find) {
            $error(1030);
        }
        var matrix;
        for (var i = 0; i < parentsThis.length; i++) {
            matrix = parentsThis[i].$getMatrix();
            matrix.transformPoint(point.x, point.y, point);
        }
        for (var i = 0; i < parentsDisplay.length; i++) {
            matrix = parentsDisplay[i].$getReverseMatrix();
            matrix.transformPoint(point.x, point.y, point);
        }
        return point;
    }

    startDrag(dragSprite = null, dragType = "", dragData = null) {
        var point = this.localToGlobal(flower.Point.create());
        DragManager.startDrag(point.x, point.y, this, dragSprite, dragType, dragData);
        flower.Point.release(point);
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.dispose();
    }

    get x() {
        return this.$getX();
    }

    set x(val) {
        this.$setX(val);
    }

    get y() {
        return this.$getY();
    }

    set y(val) {
        this.$setY(val);
    }

    get scaleX() {
        return this.$getScaleX();
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        return this.$getScaleY();
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    get rotation() {
        var p = this.$DisplayObject;
        return p[2];
    }

    set rotation(val) {
        this.$setRotation(val);
    }

    get radian() {
        return this.$DisplayObject[14];
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

    get visible() {
        return this.__visible;
    }

    set visible(val) {
        this.$setVisible(val);
    }

    get stage() {
        return this.__stage;
    }

    get name() {
        return this.$DisplayObject[5];
    }

    set name(val) {
        this.$DisplayObject[5] = val;
    }

    get touchEnabled() {
        var p = this.$DisplayObject;
        return p[8];
    }

    set touchEnabled(val) {
        this.$setTouchEnabled(val);
    }

    get multiplyTouchEnabled() {
        var p = this.$DisplayObject;
        return p[9];
    }

    set multiplyTouchEnabled(val) {
        this.$setMultiplyTouchEnabled(val);
    }

    get lastTouchX() {
        var p = this.$DisplayObject;
        return p[10];
    }

    get lastTouchY() {
        var p = this.$DisplayObject;
        return p[11];
    }

    get filters() {
        return this.$getAllFilters();
    }

    set filters(val) {
        this.$setFilters(val);
    }

    get focusEnabled() {
        return this.$DisplayObject[50];
    }

    set focusEnabled(val) {
        this.$DisplayObject[50] = val;
    }

    get id() {
        return this.$DisplayObject[20];
    }

    get dispatchEventToParent() {
        return this.$DisplayObject[21];
    }

    set dispatchEventToParent(val) {
        this.$setDispatchEventToParent(val);
    }

    get contentBounds() {
        return this.$getContentBounds().clone();
    }
}

flower.DisplayObject = DisplayObject;
//////////////////////////End File:flower/display/DisplayObject.js///////////////////////////



//////////////////////////File:flower/display/Sprite.js///////////////////////////
class Sprite extends DisplayObject {

    __children;
    __childrenBounds;

    constructor() {
        super();
        this.$Sprite = {
            0: new flower.Rectangle() //childrenBounds
        }
        this.$initContainer();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Sprite");
    }

    //$addFlags(flags) {
    //    if (flags == 0x0001) {
    //        this.$addFlagsDown()
    //    }
    //    //this.__flags |= flags;
    //}

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
        return child;
    }

    addChildAt(child, index) {
        var children = this.__children;
        if (index < 0 || index > children.length) {
            return child;
        }
        if (child.parent == this) {
            this.setChildIndex(child, index);
        } else {
            if (child.parent) {
                child.parent.$removeChild(child);
            }
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return null;
            }
            this.$nativeShow.addChild(child.$nativeShow);
            children.splice(index, 0, child);
            child.$setStage(this.stage);
            child.$setParent(this);
            if (child.parent == this) {
                child.$dispatchAddedToStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
            }
        }
        return child;
    }

    $setStage(stage) {
        super.$setStage(stage);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setStage(this.stage);
        }
    }

    $dispatchAddedToStageEvent() {
        super.$dispatchAddedToStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchAddedToStageEvent();
        }
    }

    $dispatchRemovedFromStageEvent() {
        super.$dispatchRemovedFromStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchRemovedFromStageEvent();
        }
    }

    $removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                child.$setStage(null);
                child.$setParent(null);
                child.$dispatchRemovedFromStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChildAt(index) {
        var children = this.__children;
        if (index < 0 || index >= children.length) {
            return;
        }
        return this.removeChild(children[index]);
    }

    setChildIndex(child, index) {
        var childIndex = this.getChildIndex(child);
        if (childIndex == index || childIndex < 0) {
            return null;
        }
        var children = this.__children;
        children.splice(childIndex, 1);
        children.splice(index, 0, child);
        this.$addFlags(0x0100);
        return child;
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

    getChildAt(index) {
        index = index & ~0;
        if (index < 0 || index > this.__children.length - 1) {
            $error(1007, "getChildAt", index, this.__children.length);
            return null;
        }
        return this.__children[index];
    }

    removeAll() {
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    }

    $changeAllFilters() {
        super.$changeAllFilters();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setParentFilters(this.$getAllFilters());
        }
    }

    /**
     * 测量子对象的区域
     * @param rect
     */
    $measureContentBounds(rect) {
        var minX = 0;
        var minY = 0;
        var maxX = 0;
        var maxY = 0;
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (!children[i].visible) {
                continue;
            }
            var bounds = children[i].$getBounds(true);
            if (i == 0) {
                maxX = bounds.x + bounds.width;
                maxY = bounds.y + bounds.height;
            } else {
                if (bounds.x + bounds.width > maxX) {
                    maxX = bounds.x + bounds.width;
                }
                if (bounds.y + bounds.height > maxY) {
                    maxY = bounds.y + bounds.height;
                }
            }
        }
        rect.x = minX;
        rect.y = minY;
        rect.width = maxX - minX;
        rect.height = maxY - minY;
        var childrenBounds = this.$Sprite[0];
        childrenBounds.x = rect.x;
        childrenBounds.y = rect.y;
        childrenBounds.width = rect.width;
        childrenBounds.height = rect.height;
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var target;
        var childs = this.__children;
        var len = childs.length;
        for (var i = len - 1; i >= 0; i--) {
            if (childs[i].touchEnabled && childs[i].visible && (multiply == false || (multiply == true && childs[i].multiplyTouchEnabled == true))) {
                target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                if (target) {
                    break;
                }
            }
        }
        return target;
    }

    $onFrameEnd() {
        var children = this.__children;
        /**
         * 子对象序列改变
         */
        if (this.$hasFlags(0x0100)) {
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return;
            }
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

    get $childrenBounds() {
        return this.$Sprite[0];
    }

    $releaseContainer() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Platform.release("Sprite", this.$nativeShow);
        this.$nativeShow = null;
    }

    dispose() {
        var children = this.__children;
        while (children.length) {
            var child = children[children.length - 1];
            child.dispose();
        }
        super.dispose();
        this.$releaseContainer();
    }
}

flower.Sprite = Sprite;
//////////////////////////End File:flower/display/Sprite.js///////////////////////////



//////////////////////////File:flower/display/Mask.js///////////////////////////
class Mask extends Sprite {

    __shape;

    constructor() {
        super();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Mask");
        this.__shape = this.$createShape();
        this.$nativeShow.setShape(this.__shape.$nativeShow,this.__shape);
    }

    $createShape() {
        return new Shape();
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var bounds = this.shape.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
            var target;
            var childs = this.__children;
            var len = childs.length;
            for (var i = len - 1; i >= 0; i--) {
                if (childs[i].touchEnabled && (multiply == false || (multiply == true && childs[i].multiplyTouchEnabled == true))) {
                    target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                    if (target) {
                        break;
                    }
                }
            }
            return target;
        }
        return null;
    }

    get shape() {
        return this.__shape;
    }

    $releaseContainer() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Platform.release("Mask", this.$nativeShow);
        this.$nativeShow = null;
    }
}

flower.Mask = Mask;
//////////////////////////End File:flower/display/Mask.js///////////////////////////



//////////////////////////File:flower/display/Bitmap.js///////////////////////////
class Bitmap extends DisplayObject {

    __texture;
    $Bitmap;

    constructor(texture) {
        super();
        this.$nativeShow = Platform.create("Bitmap");
        this.texture = texture;
        this.$Bitmap = {
            0: null,    //scale9Grid
        }
    }

    $setTexture(val) {
        if (val == this.__texture) {
            return false;
        }
        if (this.__texture) {
            this.__texture.$delCount();
            if (this.__texture.dispatcher) {
                this.__texture.dispatcher.removeListener(Event.COMPLETE, this.$updateTexture, this);
            }
        }
        this.__texture = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        if (val) {
            this.__texture.$useTexture();
            this.$nativeShow.setWidth(this.__texture.width);
            this.$nativeShow.setHeight(this.__texture.height);
            this.$nativeShow.setTexture(this.__texture);
        }
        else {
            this.$nativeShow.setTexture(Texture.$blank);
        }
        if (this.__texture && this.__texture.dispatcher) {
            this.__texture.dispatcher.addListener(Event.UPDATE, this.$updateTexture, this);
        }
        this.$invalidateContentBounds();
        return true;
    }

    $updateTexture(e) {
        var txt = this.texture;
        this.texture = null;
        this.texture = txt;
    }

    $setWidth(val) {
        if (super.$setWidth(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingWidth(p[3]);
        this.$invalidateContentBounds();
        return true;
    }

    $setHeight(val) {
        if (super.$setHeight(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingHeight(p[4]);
        this.$invalidateContentBounds();
        return true;
    }

    $measureContentBounds(rect) {
        if (this.__texture) {
            rect.x = this.__texture.offX;
            rect.y = this.__texture.offY;
            var p = this.$DisplayObject;
            rect.width = p[3] || this.__texture.width;
            rect.height = p[4] || this.__texture.height;
        } else {
            rect.x = rect.y = rect.width = rect.height = 0;
        }
    }

    $setScale9Grid(val) {
        if (typeof val == "string" && val.split(",").length == 4) {
            var params = val.split(",");
            val = new Rectangle(+params[0], +params[1], +params[2], +params[3]);
        }
        if (!(val instanceof Rectangle)) {
            val = null;
        }
        var p = this.$Bitmap;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setScale9Grid(val);
        return true;
    }

    get texture() {
        return this.__texture;
    }

    set texture(val) {
        this.$setTexture(val);
    }

    get scale9Grid() {
        var p = this.$Bitmap;
        return p[0];
    }

    set scale9Grid(val) {
        this.$setScale9Grid(val);
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.texture = null;
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
        this.$nativeShow = null;
    }
}

flower.Bitmap = Bitmap;
//////////////////////////End File:flower/display/Bitmap.js///////////////////////////



//////////////////////////File:flower/display/TextField.js///////////////////////////
class TextField extends DisplayObject {

    $TextField;

    constructor(text = "") {
        super();
        this.$nativeShow = Platform.create("TextField");
        this.$TextField = {
            0: "", //text
            1: 12, //fontSize
            2: 0x000000, //fontColor
            3: true, //wordWrap
            4: true, //multiline
            5: true //autoSize
        };
        if (text != "") {
            this.text = text;
        }
    }

    $checkSettingSize(rect) {

    }

    $setText(val) {
        val = "" + val;
        var p = this.$TextField;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $measureText(rect) {
        if (this.$hasFlags(0x0800)) {
            this.$removeFlags(0x0800);
            var d = this.$DisplayObject;
            var p = this.$TextField;
            //text, width, height, size, wordWrap, multiline, autoSize
            var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], p[3], p[4], p[5]);
            rect.x = 0;
            rect.y = 0;
            rect.width = size.width;
            rect.height = size.height;
        }
    }

    $measureContentBounds(rect) {
        this.$measureText(rect);
    }

    $setFontSize(val) {
        var p = this.$TextField;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setMultiLine(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        var p = this.$TextField;
        if (p[4] == val) {
            return false;
        }
        p[4] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setFontColor(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = +val || 0;
        var p = this.$TextField;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        this.$nativeShow.setFontColor(val);
        return true;
    }

    $setWordWrap(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = !!val;
        var p = this.$TextField;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setAutoSize(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = !!val;
        var p = this.$TextField;
        if (p[5] == val) {
            return false;
        }
        p[5] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setWidth(val) {
        var flag = super.$setWidth(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
    }

    $setHeight(val) {
        var flag = super.$setHeight(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
    }

    get text() {
        var p = this.$TextField;
        return p[0];
    }

    set text(val) {
        this.$setText(val);
    }

    get fontColor() {
        var p = this.$TextField;
        return p[2];
    }

    set fontColor(val) {
        this.$setFontColor(val);
    }

    get fontSize() {
        var p = this.$TextField;
        return p[1];
    }

    set fontSize(val) {
        this.$setFontSize(val);
    }

    get autoSize() {
        var p = this.$TextField;
        return p[5];
    }

    set autoSize(val) {
        this.$setAutoSize(val);
    }

    set wordWrap(val) {
        this.$setWordWrap(val);
    }

    get wordWrap() {
        var p = this.$TextField;
        return p[3];
    }

    get multiLine() {
        var p = this.$TextField;
        return p[4];
    }

    set multiLine(val) {
        this.$setMultiLine(val);
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x0800)) {
            this.$getContentBounds();
        }
        super.$onFrameEnd();
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        super.dispose();
        Platform.release("TextField", this.$nativeShow);
        this.$nativeShow = null;
    }
}

flower.TextField = TextField;
//////////////////////////End File:flower/display/TextField.js///////////////////////////



//////////////////////////File:flower/display/TextInput.js///////////////////////////
class TextInput extends DisplayObject {

    $TextField;

    constructor(text = "") {
        super();
        this.$nativeShow = Platform.create("TextInput");
        this.$TextField = {
            0: "", //text
            1: 12, //fontSize
            2: 0x000000, //fontColor
            3: true, //editEnabled
            4: false, //inputing
            5: false, //autoSize
            6: false  //multiline
        };
        this.addListener(Event.FOCUS_IN, this.$onFocusIn, this);
        this.addListener(Event.FOCUS_OUT, this.$onFocusOut, this);
        this.addListener(KeyboardEvent.KEY_DOWN, this.$keyDown, this);
        if (text != "") {
            this.text = text;
        }
        this.width = 100;
        this.height = 21;
        this.focusEnabled = true;
        this.$nativeShow.setChangeBack(this.$onTextChange, this);
    }

    $onTextChange() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.text = this.$nativeShow.getNativeText();
    }

    $checkSettingSize(rect) {

    }

    $setText(val) {
        val = "" + val;
        var p = this.$TextField;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $measureText(rect) {
        if (this.$hasFlags(0x0800)) {
            var d = this.$DisplayObject;
            var p = this.$TextField;
            //text, width, height, size, wordWrap, multiline, autoSize
            var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], false, p[6], p[5]);
            rect.x = 0;
            rect.y = 0;
            rect.width = this.width;//size.width;
            rect.height = this.height;
            this.$removeFlags(0x0800);
        }
    }

    $measureContentBounds(rect) {
        this.$measureText(rect);
    }

    $setFontColor(val) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        val = +val || 0;
        var p = this.$TextField;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        this.$nativeShow.setFontColor(val);
        return true;
    }

    $setAutoSize(val) {
        var p = this.$TextField;
        if (p[5] == val) {
            return false;
        }
        p[5] = val;
    }

    $setWidth(val) {
        var flag = super.$setWidth(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        this.$nativeShow.setSize(this.width, this.height);
    }

    $setHeight(val) {
        var flag = super.$setHeight(val);
        if (!flag) {
            return;
        }
        var d = this.$DisplayObject;
        if (d[3] != null || d[4] != null) {
            this.$TextField[5] = false;
        } else {
            this.$TextField[5] = true;
        }
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        this.$nativeShow.setSize(this.width, this.height);
    }

    $setFontSize(val) {
        var p = this.$TextField;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        this.$addFlags(0x0800);
        this.$invalidateContentBounds();
        return true;
    }

    $setEditEnabled(val) {
        var p = this.$TextField;
        if (p[6] == val) {
            return false;
        }
        p[6] = val;
        return true;
    }

    $onFocusIn(e) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        if (this.editEnabled) {
            var p = this.$TextField;
            this.$nativeShow.startInput();
            p[4] = true;
            this.dispatchWith(Event.START_INPUT);
        }
    }

    $onFocusOut() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$inputEnd();
    }

    $inputEnd() {
        var p = this.$TextField;
        if (p[4]) {
            this.$nativeShow.stopInput();
        }
        this.text = this.$nativeShow.getNativeText();
        this.dispatchWith(Event.STOP_INPUT);
    }

    $keyDown(e) {
        var p = this.$TextField;
        p[0] = this.$nativeShow.getNativeText();
        if (e.keyCode == 13 && !p[6]) {
            this.$inputEnd();
        }
    }

    get text() {
        var p = this.$TextField;
        return p[0];
    }

    set text(val) {
        this.$setText(val);
    }

    get fontColor() {
        var p = this.$TextField;
        return p[2];
    }

    set fontColor(val) {
        this.$setFontColor(val);
    }

    get fontSize() {
        var p = this.$TextField;
        return p[1];
    }

    set fontSize(val) {
        this.$setFontSize(val);
    }

    get editEnabled() {
        var p = this.$TextField;
        return p[3];
    }

    set editEnabled(val) {
        this.$setEditEnabled(val);
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x0800)) {
            var width = this.width;
        }
        super.$onFrameEnd();
    }

    inputOver() {
        this.$inputEnd();
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        super.dispose();
        Platform.release("TextInput", this.$nativeShow);
        this.$nativeShow = null;
    }
}

flower.TextInput = TextInput;
//////////////////////////End File:flower/display/TextInput.js///////////////////////////



//////////////////////////File:flower/display/Shape.js///////////////////////////
class Shape extends DisplayObject {

    $Shape;

    constructor() {
        super();
        this.$nativeShow = Platform.create("Shape");
        this.$Shape = {
            0: 0xffffff, //fillColor
            1: 1,        //fillAlpha
            2: 0,        //lineWidth
            3: 0x000000, //lineColor
            4: 1,        //lineAlpha
            5: null,     //minX
            6: null,     //minY
            7: null,     //maxX
            8: null,     //maxY
            9: []       //record
        };
        this.$nativeShow.draw([{x: 0, y: 0}, {x: 1, y: 0}], 0, 0, 0, 0, 0);
    }

    drawRect(x, y, width, height) {
        this.$drawPolygon([
            {x: x, y: y},
            {x: x + width, y: y},
            {x: x + width, y: y + height},
            {x: x, y: y + height},
            {x: x, y: y}]);
    }

    clear() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.clear();
        var p = this.$Shape;
        p[5] = p[6] = p[7] = p[8] = null;
        p[9] = [];
        this.$nativeShow.draw([{x: 0, y: 0}, {x: 1, y: 0}], 0, 0, 0, 0, 0);
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.fillAlpha == 0) {
            return null;
        }
        return super.$getMouseTarget(touchX, touchY, multiply);
    }


    $addFlags(flags) {
        if (flags == 0x0002) {
            this.$addFlags(0x0400);
        }
        this.__flags |= flags;
    }

    $drawPolygon(points) {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        var p = this.$Shape;
        for (var i = 0; i < points.length; i++) {
            if (p[5] == null) {
                p[5] = points[i].x;
                p[7] = points[i].x;
                p[6] = points[i].y;
                p[8] = points[i].y;
                continue;
            }
            if (points[i].x < p[5]) {
                p[5] = points[i].x;
            }
            if (points[i].x > p[7]) {
                p[7] = points[i].x;
            }
            if (points[i].y < p[6]) {
                p[6] = points[i].y;
            }
            if (points[i].y > p[8]) {
                p[8] = points[i].y;
            }
        }
        this.$invalidateContentBounds();
        p[9].push(
            {
                points: points,
                fillColor: p[0],
                fillAlpha: p[1],
                lineWidth: p[2],
                lineColor: p[3],
                lineAlpha: p[4]
            }
        );
        this.$nativeShow.draw(points, p[0], p[1] * this.$getConcatAlpha(), p[2], p[3], p[4] * this.$getConcatAlpha());
    }

    $measureContentBounds(rect) {
        this.$redraw();
        var p = this.$Shape;
        if (p[5] != null) {
            rect.x = p[5];
            rect.y = p[6];
            rect.width = p[7] - p[5];
            rect.height = p[8] - p[6];
        } else {
            rect.x = 0;
            rect.y = 0;
            rect.width = 0;
            rect.height = 0;
        }
    }

    $redraw() {
        if (this.$hasFlags(0x0400)) {
            var p = this.$Shape;
            var record = p[9];
            var fillColor = p[0];
            var fillAlpha = p[1];
            var lineWidth = p[2];
            var lineColor = p[3];
            var lineAlpha = p[4];
            this.clear();
            for (var i = 0; i < record.length; i++) {
                var item = record[i];
                p[0] = item.fillColor;
                p[1] = item.fillAlpha;
                p[2] = item.lineWidth;
                p[3] = item.lineColor;
                p[4] = item.lineAlpha;
                this.$drawPolygon(item.points);
            }
            p[0] = fillColor;
            p[1] = fillAlpha;
            p[2] = lineWidth;
            p[3] = lineColor;
            p[4] = lineAlpha;
            this.$removeFlags(0x0400);
        }
    }

    $setFillColor(val) {
        var p = this.$Shape;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        return true;
    }

    $setFillAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        var p = this.$Shape;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        return true;
    }

    $setLineWidth(val) {
        var p = this.$Shape;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        return true;
    }

    $setLineColor(val) {
        var p = this.$Shape;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        return true;
    }

    $setLineAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        var p = this.$Shape;
        if (p[4] == val) {
            return false;
        }
        p[4] = val;
        return true;
    }

    get fillColor() {
        var p = this.$Shape;
        return p[0];
    }

    set fillColor(val) {
        this.$setFillColor(val);
    }

    get fillAlpha() {
        var p = this.$Shape;
        return p[1];
    }

    set fillAlpha(val) {
        this.$setFillAlpha(val);
    }

    get lineWidth() {
        var p = this.$Shape;
        return p[2];
    }

    set lineWidth(val) {
        this.$setLineWidth(val);
    }

    get lineColor() {
        var p = this.$Shape;
        return p[3];
    }

    set lineColor(val) {
        this.$setLineColor(val);
    }

    get lineAlpha() {
        var p = this.$Shape;
        return p[4];
    }

    set lineAlpha(val) {
        this.$setLineAlpha(val);
    }

    $onFrameEnd() {
        this.$redraw();
        super.$onFrameEnd();
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        super.dispose();
        Platform.release("Shape", this.$nativeShow);
        this.$nativeShow = null;
    }
}

flower.Shape = Shape;
//////////////////////////End File:flower/display/Shape.js///////////////////////////



//////////////////////////File:flower/display/Stage.js///////////////////////////
class Stage extends Sprite {

    __mouseX = 0;
    __mouseY = 0;
    __forntLayer;
    $background;
    $debugSprite
    $pop;
    $menu;
    $drag;

    constructor() {
        super();
        this.__stage = this;
        Stage.stages.push(this);
        this.$background = new Shape();
        this.__forntLayer = new Sprite();
        this.addChild(this.__forntLayer);
        this.$debugSprite = new Sprite();
        this.__forntLayer.addChild(this.$debugSprite);
        this.$pop = PopManager.getInstance();
        this.__forntLayer.addChild(this.$pop);
        this.$menu = MenuManager.getInstance();
        this.__forntLayer.addChild(this.$menu);
        this.$drag = DragManager.getInstance();
        this.__forntLayer.addChild(this.$drag);
        this.backgroundColor = 0;
    }

    get stageWidth() {
        return Platform.width;
    }

    get stageHeight() {
        return Platform.height;
    }

    addChildAt(child, index) {
        super.addChildAt(child, index);
        if (child != this.__forntLayer) {
            this.addChild(this.__forntLayer);
        }
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////
    __nativeMouseMoveEvent = [];
    __nativeRightClickEvent = [];
    __nativeTouchEvent = [];
    __mouseOverList = [this];
    __dragOverList = [this];
    __touchList = [];
    __lastMouseX = -1;
    __lastMouseY = -1;
    __lastRightX = -1;
    __lastRightY = -1;
    __focus = null;
    __touchTarget = null;

    $setFocus(val) {
        if (val && !val.focusEnabled) {
            val = null;
        }
        //if (this.__focus == val) {
        //    return;
        //}
        var event;
        if (this.__focus) {
            event = new flower.Event(Event.FOCUS_OUT, true);
            this.__focus.dispatch(event);
        }
        this.__focus = val;
        if (this.__focus) {
            event = new flower.Event(Event.FOCUS_IN, true);
            this.__focus.dispatch(event);
        }
    }

    $addMouseMoveEvent(x, y) {
        this.__lastMouseX = x;
        this.__lastMouseY = y;
        this.__nativeMouseMoveEvent.push({x: x, y: y});
        //flower.trace("mouseEvent",x,y);
    }

    $addRightClickEvent(x, y) {
        this.__lastRightX = x;
        this.__lastRightY = y;
        this.__nativeRightClickEvent.push({x: x, y: y});
    }

    $addTouchEvent(type, id, x, y) {
        this.__nativeTouchEvent.push({
            type: type,
            id: id,
            x: x,
            y: y
        });
        //flower.trace("touchEvent",type,id,x,y);
    }

    $getMouseTarget(touchX, touchY, mutiply) {
        var target = super.$getMouseTarget(touchX, touchY, mutiply) || this;
        return target;
    }

    $onTouchBegin(id, x, y) {
        var mouse = {
            id: 0,
            mutiply: false,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
            target: null,
            parents: []
        };
        mouse.id = id;
        mouse.startX = x;
        mouse.startY = y;
        mouse.mutiply = this.__touchList.length == 0 ? false : true;
        this.__touchList.push(mouse);
        var target = this.$getMouseTarget(x, y, mouse.mutiply);
        this.__touchTarget = target;
        mouse.target = target;
        var parent = target.parent;
        var isMenu = false;
        while (parent && parent != this) {
            if (parent == this.$menu) {
                isMenu = true;
            }
            mouse.parents.push(parent);
            parent = parent.parent;
        }
        if (this.$menu.$hasMenu() && !isMenu) {
            this.__touchList.length = 0;
            return;
        }
        if (target) {
            this.$setFocus(target);
        }
        //target.addListener(flower.Event.REMOVED, this.onMouseTargetRemove, this);
        if (target) {
            var event;
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_BEGIN);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    $onRightClick(x, y) {
        if (this.$menu.$hasMenu()) {
            return;
        }
        var target = this.$getMouseTarget(x, y, false);
        this.__touchTarget = target;
        var event;
        event = new flower.MouseEvent(flower.MouseEvent.RIGHT_CLICK);
        event.$stageX = x;
        event.$stageY = y;
        event.$target = target;
        event.$touchX = target.lastTouchX;
        event.$touchY = target.lastTouchY;
        target.dispatch(event);
    }

    $onMouseMove(x, y) {
        this.__mouseX = x;
        this.__mouseY = y;
        var target = this.$getMouseTarget(x, y, false);
        var parent = target.parent;
        var event;
        var list = [];
        this.$drag.$updatePosition(x, y);
        if (this.$drag.isDragging) {
            if (target) {
                list.push(target);
            }
            while (parent && parent != this) {
                list.push(parent);
                parent = parent.parent;
            }
            for (var i = 0; i < list.length; i++) {
                var find = false;
                for (var j = 0; j < this.__dragOverList.length; j++) {
                    if (list[i] == this.__dragOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.DragEvent(flower.DragEvent.DRAG_OVER, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = list[i].lastTouchX;
                    event.$touchY = list[i].lastTouchY;
                    list[i].dispatch(event);
                }
            }
            for (var j = 0; j < this.__dragOverList.length; j++) {
                var find = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == this.__dragOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.DragEvent(flower.DragEvent.DRAG_OUT, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = this.__dragOverList[j].lastTouchX;
                    event.$touchY = this.__dragOverList[j].lastTouchY;
                    this.__dragOverList[j].dispatch(event);
                }
            }
            this.__dragOverList = list;
        } else {
            if (target) {
                list.push(target);
            }
            while (parent && parent != this) {
                list.push(parent);
                parent = parent.parent;
            }
            for (var i = 0; i < list.length; i++) {
                var find = false;
                for (var j = 0; j < this.__mouseOverList.length; j++) {
                    if (list[i] == this.__mouseOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.MouseEvent(flower.MouseEvent.MOUSE_OVER, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = list[i].lastTouchX;
                    event.$touchY = list[i].lastTouchY;
                    list[i].dispatch(event);
                }
            }
            for (var j = 0; j < this.__mouseOverList.length; j++) {
                var find = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == this.__mouseOverList[j]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    event = new flower.MouseEvent(flower.MouseEvent.MOUSE_OUT, false);
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = this.__mouseOverList[j].lastTouchX;
                    event.$touchY = this.__mouseOverList[j].lastTouchY;
                    this.__mouseOverList[j].dispatch(event);
                }
            }
            this.__mouseOverList = list;
            if (target) {
                event = new flower.MouseEvent(flower.MouseEvent.MOUSE_MOVE);
                event.$stageX = x;
                event.$stageY = y;
                event.$target = target;
                event.$touchX = target.lastTouchX;
                event.$touchY = target.lastTouchY;
                target.dispatch(event);
            }
        }
    }

    $onTouchMove(id, x, y) {
        var mouse;
        for (var i = 0; i < this.__touchList.length; i++) {
            if (this.__touchList[i].id == id) {
                mouse = this.__touchList[i];
                break;
            }
        }
        if (mouse == null) {
            return;
        }
        if (mouse.moveX == x && mouse.moveY == y) {
            return;
        }
        while (mouse.target.stage == null && mouse.parents.length) {
            mouse.target = mouse.parents.shift();
        }
        if (!mouse.target) {
            mouse.target = this;
        }
        this.$getMouseTarget(x, y, mouse.mutiply);
        var target = mouse.target;//this.$getMouseTarget(x, y, mouse.mutiply);
        mouse.moveX = x;
        mouse.moveY = y;
        var event;
        if (target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    $onTouchEnd(id, x, y) {
        var mouse;
        for (var i = 0; i < this.__touchList.length; i++) {
            if (this.__touchList[i].id == id) {
                mouse = this.__touchList.splice(i, 1)[0];
                break;
            }
        }
        if (mouse == null) {
            return;
        }
        while (mouse.target.stage == null && mouse.parents.length) {
            mouse.target = mouse.parents.shift();
        }
        if (!mouse.target) {
            mouse.target = this;
        }
        var target = this.$getMouseTarget(x, y, mouse.mutiply);
        if (this.$drag.isDragging) {
            this.$drag.$dragEnd(target);
        }
        var event;
        if (target == mouse.target) {
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_END);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        } else {
            target = mouse.target;
            event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
            event.$touchId = id;
            event.$stageX = x;
            event.$stageY = y;
            event.$target = target;
            event.$touchX = target.lastTouchX;
            event.$touchY = target.lastTouchY;
            target.dispatch(event);
        }
    }

    ///////////////////////////////////////触摸事件处理///////////////////////////////////////

    ///////////////////////////////////////键盘事件处理///////////////////////////////////////
    $keyEvents = [];

    $onKeyDown(key) {
        if (key == 16) {
            KeyboardEvent.$shift = true;
        }
        if (key == 17) {
            KeyboardEvent.$control = true;
        }
        if (key == 18) {
            KeyboardEvent.$alt = true;
        }
        this.$keyEvents.push({
            type: KeyboardEvent.KEY_DOWN,
            shift: KeyboardEvent.$shift,
            control: KeyboardEvent.$control,
            alt: KeyboardEvent.$alt,
            key: key
        });

    }

    $onKeyUp(key) {
        if (key == 16) {
            KeyboardEvent.$shift = false;
        }
        if (key == 17) {
            KeyboardEvent.$control = false;
        }
        if (key == 18) {
            KeyboardEvent.$alt = false;
        }
        this.$keyEvents.push({
            type: KeyboardEvent.KEY_UP,
            shift: KeyboardEvent.$shift,
            control: KeyboardEvent.$control,
            alt: KeyboardEvent.$alt,
            key: key
        });
    }

    $dispatchKeyEvent(info) {
        var shift = KeyboardEvent.$shift;
        var control = KeyboardEvent.$control;
        var alt = KeyboardEvent.$alt;
        KeyboardEvent.$shift = info.shift;
        KeyboardEvent.$control = info.control;
        KeyboardEvent.$alt = info.alt;
        if (info.type == KeyboardEvent.KEY_DOWN) {
            var event = new KeyboardEvent(KeyboardEvent.KEY_DOWN, info.key);
            if (this.__focus) {
                this.__focus.dispatch(event);
            } else {
                this.dispatch(event);
            }
        } else if (info.type == KeyboardEvent.KEY_UP) {
            var event = new KeyboardEvent(KeyboardEvent.KEY_UP, info.key);
            if (this.__focus) {
                this.__focus.dispatch(event);
            } else {
                this.dispatch(event);
            }
        }
        KeyboardEvent.$shift = shift;
        KeyboardEvent.$control = control;
        KeyboardEvent.$alt = alt;
    }

    ///////////////////////////////////////键盘事件处理///////////////////////////////////////

    $onFrameEnd() {
        var touchList = this.__nativeTouchEvent;
        var mouseMoveList = this.__nativeMouseMoveEvent;
        var rightClickList = this.__nativeRightClickEvent;
        var hasclick = false;
        while (touchList.length) {
            var touch = touchList.shift();
            if (touch.type == "begin") {
                this.$onTouchBegin(touch.id, touch.x, touch.y);
            } else if (touch.type == "move") {
                this.$onTouchMove(touch.id, touch.x, touch.y);
            } else if (touch.type == "end") {
                hasclick = true;
                this.$onTouchEnd(touch.id, touch.x, touch.y);
            }
        }
        if (mouseMoveList.length == 0) {
            mouseMoveList.push({x: this.__lastMouseX, y: this.__lastMouseY});
        }
        if (mouseMoveList.length) {
            var moveInfo = mouseMoveList[mouseMoveList.length - 1];
            this.$onMouseMove(moveInfo.x, moveInfo.y);
        }
        mouseMoveList.length = 0;
        if (rightClickList.length) {
            hasclick = true;
            var rightInfo = rightClickList[rightClickList.length - 1];
            this.$onRightClick(rightInfo.x, rightInfo.y);
        }
        rightClickList.length = 0;
        if (hasclick) {
            this.$menu.$onTouch(this.__touchTarget);
        }
        while (this.$keyEvents.length) {
            this.$dispatchKeyEvent(this.$keyEvents.shift());
        }
        super.$onFrameEnd();
        this.$background.$onFrameEnd();
    }

    $setWidth(val) {
        return;
    }

    $setHeight(val) {
        return;
    }

    $resize(width, height) {
        super.$setWidth(width);
        super.$setHeight(height);
        this.$background.clear();
        this.$background.drawRect(0, 0, this.width, this.height);
        this.$pop.$resize(width, height);
        this.$menu.$resize(width, height);
    }

    set backgroundColor(val) {
        this.$background.clear();
        this.$background.fillColor = val;
        this.$background.drawRect(0, 0, this.width, this.height);
    }

    get backgroundColor() {
        return this.$background.fillColor;
    }

    get focus() {
        return this.__focus;
    }

    set focus(val) {
        this.$setFocus(val);
    }

    get debugContainer() {
        return this.$debugSprite;
    }

    get mouseX() {
        return this.__mouseX;
    }

    get mouseY() {
        return this.__mouseY;
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

    static getShortcut() {
        return Platform.getShortcut();
    }
}

flower.Stage = Stage;
//////////////////////////End File:flower/display/Stage.js///////////////////////////



//////////////////////////File:flower/manager/DragManager.js///////////////////////////
class DragManager extends Sprite {

    dragSource;
    dragSprite;
    dragType;
    dragData;
    __isDragging = false;
    __dragStartX;
    __dragStartY;
    __dragSourceX;
    __dragSourceY;
    __mouseX;
    __mouseY;

    constructor() {
        super();
        this.touchEnabled = false;
    }

    startDrag(sourceX, soureceY, dragSource, dragSprite, dragType = "", dragData = null) {
        this.dragSource = dragSource;
        this.dragSprite = dragSprite;
        this.dragType = dragType;
        this.dragData = dragData;
        this.__isDragging = true;
        if (dragSprite) {
            dragSprite.x -= (this.x - sourceX);
            dragSprite.y -= (this.y - soureceY);
            this.addChild(dragSprite);
            this.__dragStartX = dragSprite.x + this.x;
            this.__dragStartY = dragSprite.y + this.y;
        } else {
            this.__dragSourceX = dragSource.x;
            this.__dragSourceY = dragSource.y;
            this.__mouseX = this.x;
            this.__mouseY = this.y;
        }
    }

    $updatePosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.isDragging && !this.dragSprite) {
            this.dragSource.x = this.x - this.__mouseX + this.__dragSourceX;
            this.dragSource.y = this.y - this.__mouseY + this.__dragSourceY;
        }
    }

    __stopDrag() {
        if (this.dragSprite && this.dragSprite.parent == this) {
            this.removeChild(this.dragSprite);
        }
        this.dragSource = null;
        this.dragSprite = null;
        this.dragType = "";
        this.dragData = null;
        this.__isDragging = false;
    }

    $dragEnd(display) {
        var event = flower.DragEvent.create(flower.DragEvent.DRAG_END, true, this.dragSource, this.dragType, this.dragData);
        display.dispatch(event);
        if (event.hasAccept) {

        } else {
            if (this.dragSprite) {
                this.parent.addChild(this.dragSprite);
                this.dragSprite.x += this.x;
                this.dragSprite.y += this.y;
                flower.Tween.to(this.dragSprite, 0.5, {
                    x: this.__dragStartX,
                    y: this.__dragStartY,
                    alpha: 0,
                }, flower.Ease.QUAD_EASE_IN_OUT).call(function (sprite) {
                    if (sprite.parent) {
                        sprite.dispose();
                    }
                }, null, this.dragSprite);
            }
        }
        this.__stopDrag();
    }

    get isDragging() {
        return this.__isDragging;
    }

    static instance;

    static getInstance() {
        if (!DragManager.instance) {
            DragManager.instance = new DragManager();
        }
        return DragManager.instance;
    }

    static startDrag(sourceX, soureceY, dragSource, dragSprite, dragType, dragData) {
        DragManager.instance.startDrag(sourceX, soureceY, dragSource, dragSprite, dragType, dragData);
    }
}

//////////////////////////End File:flower/manager/DragManager.js///////////////////////////



//////////////////////////File:flower/manager/MenuManager.js///////////////////////////
class MenuManager extends Sprite {

    __addFrame = 0;
    $autoRemove;

    constructor() {
        super();
    }

    $onTouch(target) {
        var flag = true;
        while (target && flag) {
            flag = target == this ? false : true;
            target = target.parent;
        }
        if ((flag || this.$autoRemove) && flower.EnterFrame.frame > this.__addFrame && this.numChildren) {
            this.removeAll();
            return true;
        }
        return false;
    }

    $hasMenu() {
        return (flower.EnterFrame.frame > this.__addFrame && this.numChildren) ? true : false;
    }


    addChildAt(child, index) {
        this.__addFrame = flower.EnterFrame.frame;
        super.addChildAt(child, index);
    }

    $resize(width, height) {
        this.width = width;
        this.height = height;
    }

    $onFrameEnd() {
        for (var i = 0; i < this.numChildren; i++) {
            var child = this.getChildAt(i);
            if (child.x < 0) {
                child.x = 0;
            }
            if (child.y < 0) {
                child.y = 0;
            }
            if (child.x + child.width > this.width) {
                child.x = this.width - child.width;
            }
            if (child.y + child.height > this.height) {
                child.y = this.height - child.height;
            }
        }
        super.$onFrameEnd();
    }

    static instance;

    static getInstance() {
        if (!MenuManager.instance) {
            MenuManager.instance = new MenuManager();
        }
        return MenuManager.instance;
    }

    static showMenu(display, x = -1, y = -1, autoRemove = true) {
        if (x == -1) {
            x = Stage.getInstance().mouseX + 1;
        }
        if (y == -1) {
            y = Stage.getInstance().mouseY;
        }
        display.x = x;
        display.y = y;
        MenuManager.getInstance().removeAll();
        MenuManager.getInstance().$autoRemove = autoRemove;
        MenuManager.getInstance().addChild(display);
    }

    static hideMenu() {
        MenuManager.getInstance().removeAll();
    }
}

flower.MenuManager = MenuManager;
//////////////////////////End File:flower/manager/MenuManager.js///////////////////////////



//////////////////////////File:flower/manager/PopManager.js///////////////////////////
class PopManager extends Sprite {

    __panels = [];

    constructor() {
        super();
    }

    $resize(width, height) {
        this.width = width;
        this.height = height;
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            var item = panels[i];
            var panel = item.panel;
            if (item.center) {
                panel.x = (this.width - panel.width) / 2;
                panel.y = (this.height - panel.height) / 2;
            }
            if (item.mask) {
                var shape = item.mask;
                shape.clear();
                shape.drawRect(0, 0, width, height);
            }
        }
    }

    removeChild(child) {
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i].panel == child) {
                if (panels[i].mask) {
                    super.removeChild(panels[i].mask);
                }
                panels.splice(i, 1);
            }
        }
        super.removeChild(child);
    }

    pop(panel, mask = false, center = false) {
        var find = false;
        var item;
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i] == panel) {
                item = panels[i];
                if (item.mask) {
                    this.removeChild(item.mask);
                }
                panels.splice(i, 1);
                find = true;
                break;
            }
        }
        var item = {
            mask: null,
            panel: panel,
            center: center
        };
        panels.push(item);
        if (center) {
            panel.x = (this.width - panel.width) / 2;
            panel.y = (this.height - panel.height) / 2;
        }
        if (mask) {
            item.mask = new Shape();
            item.mask.fillColor = 0;
            item.mask.fillAlpha = 0.4;
            item.mask.drawRect(0, 0, this.width, this.height);
            this.addChild(item.mask);
        }
        this.addChild(panel);
    }

    static instance;

    static getInstance() {
        if (!PopManager.instance) {
            PopManager.instance = new PopManager();
        }
        return PopManager.instance;
    }

    static pop(panel, mask = false, center = false) {
        PopManager.getInstance().pop(panel, mask, center);
    }
}

flower.PopManager = PopManager;
//////////////////////////End File:flower/manager/PopManager.js///////////////////////////



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
    __use = false;
    $nativeTexture;
    $count;
    $parentTexture;

    /**
     * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
     * @native
     */
    __dispatcher = UPDATE_RESOURCE ? new EventDispatcher() : null;

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

    $update(nativeTexture, w, h, settingWidth, settingHeight) {
        this.$nativeTexture = nativeTexture;
        this.__width = w;
        this.__height = h;
        this.__settingWidth = settingWidth;
        this.__settingHeight = settingHeight;
        if (this.dispatcher) {
            this.dispatcher.dispatchWith(Event.UPDATE);
        }
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

    $useTexture() {
        if (this.$parentTexture) {
            this.$parentTexture.$useTexture();
        } else {
            if (!this.$nativeTexture) {
                $error(1006, this.__nativeURL);
            }
            this.__use = true;
            this.$addCount();
        }
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

    get count() {
        return this.$count;
    }

    /**
     * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
     * @native
     */
    get dispatcher() {
        return this.__dispatcher;
    }

    dispose() {
        if (this.$count != 0 || !this.__use) {
            return false;
        }
        this.$nativeTexture.dispose();
        this.$nativeTexture = null;
        if (TIP) {
            $tip(1005, this.__nativeURL);
        }
        return true;
    }

    /**
     * 空白图片
     */
    static $blank;
}

flower.Texture = Texture;
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
        if (DEBUG) {
            DebugInfo.getInstance().addTexture(texture);
        }
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

    $getTextureByURL(url) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].url == url) {
                return this.list[i];
            }
        }
        return null;
    }

    $check() {
        var texture;
        for (var i = 0; i < this.list.length; i++) {
            texture = this.list[i];
            if (texture.$count == 0) {
                if (texture.dispose()) {
                    this.list.splice(i, 1);
                    if (DEBUG) {
                        DebugInfo.getInstance().delTexture(texture);
                    }
                    i--;
                }
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

    static urlHead = "";

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
    _method;
    _params;

    constructor(res) {
        super();
        this.$setResource(res);
        this._language = LANGUAGE;
        this._scale = SCALE ? SCALE : null;
    }

    $setResource(res) {
        if (typeof(res) == "string") {
            var resItem = Res.getRes(res);
            if (resItem) {
                res = resItem;
            } else {
                this._createRes = true;
                res = ResItem.create(res);
            }
        }
        this._res = res;
        this._type = this._res.type;
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

    set method(val) {
        this._method = val;
    }

    get method() {
        return this._method;
    }

    set params(val) {
        this._params = val;
    }

    get params() {
        return this._params;
    }

    $addLink(loader) {
        if (!this._links) {
            this._links = [];
        }
        this._links.push(loader);
    }

    load(res) {
        if (res) {
            this.$setResource(res);
        }
        if (this._isLoading) {
            dispatchWith(Event.ERROR, "URLLoader is loading, url:" + this.url);
            return;
        }
        this._loadInfo = this._res.getLoadInfo(this._language, this._scale);
        this._isLoading = true;
        if (this.type != ResType.TEXT) {
            for (var i = 0; i < URLLoader.list.length; i++) {
                if (URLLoader.list[i].loadURL == this.loadURL && URLLoader.list[i].type == this.type) {
                    this._linkLoader = URLLoader.list[i];
                    break;
                }
            }
        }
        if (this._linkLoader) {
            this._linkLoader.$addLink(this);
            return;
        }
        URLLoader.list.push(this);
        if (this.type == ResType.IMAGE) {
            this.loadTexture();
        } else if (this.type == ResType.PLIST) {
            this.loadPlist();
        } else {
            this.loadText();
        }
    }

    loadTexture() {
        var texture = TextureManager.getInstance().$getTextureByURL(this.url);
        if (this._loadInfo.update) {
            texture = null;
        }
        if (texture) {
            texture.$addCount();
            this._data = texture;
            new CallLater(this.loadComplete, this);
        }
        else {
            if (this._loadInfo.plist) {
                var loader = new URLLoader(this._loadInfo.plist);
                loader.addListener(Event.COMPLETE, this.onLoadTexturePlistComplete, this);
                loader.addListener(Event.ERROR, this.loadError, this);
                loader.load();
            } else {
                var params = {};
                params.r = math.random();
                for (var key in this._params) {
                    params[key] = this._params;
                }
                PlatformURLLoader.loadTexture(URLLoader.urlHead + this._loadInfo.url, this.loadTextureComplete, this.loadError, this, params);
            }
        }
    }

    onLoadTexturePlistComplete(e) {
        var plist = e.data;
        this._data = plist.getFrameTexture(this.url);
        this.loadComplete();
    }

    loadTextureComplete(nativeTexture, width, height) {
        nativeTexture = new PlatformTexture(this._loadInfo.url, nativeTexture);
        var oldTexture;
        if (this._loadInfo.update) {
            oldTexture = TextureManager.getInstance().$getTextureByURL(this.url);
        }
        if (oldTexture) {
            oldTexture.$update(nativeTexture, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
        } else {
            var texture = TextureManager.getInstance().$createTexture(nativeTexture, this.url, this._loadInfo.url, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
            this._data = texture;
            texture.$addCount();
        }
        new CallLater(this.loadComplete, this);
    }

    setTextureByLink(texture) {
        texture.$addCount();
        this._data = texture;
        this.loadComplete();
    }

    loadPlist() {
        var plist = PlistManager.getInstance().getPlist(this.url);
        if (plist) {
            this._data = plist;
            new CallLater(this.loadComplete, this);
        } else {
            var load = PlistManager.getInstance().load(this.url, this._loadInfo.url);
            load.addListener(Event.COMPLETE, this.loadPlistComplete, this);
            load.addListener(Event.ERROR, this.loadError, this);
        }
    }

    loadPlistComplete(e) {
        this._data = e.data;
        new CallLater(this.loadComplete, this);
    }

    setPlistByLink(plist) {
        this._data = plist;
        this.loadComplete();
    }

    loadText() {
        var params = {};
        params.r = math.random();
        for (var key in this._params) {
            params[key] = this._params;
        }
        PlatformURLLoader.loadText(URLLoader.urlHead + this._loadInfo.url, this.loadTextComplete, this.loadError, this, this._method, params);
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
                if (this._type == ResType.IMAGE) {
                    this._links[i].setTextureByLink(this._data);
                }
                else if (this._type == ResType.TEXT) {
                    this._links[i].setTextByLink(this._data);
                }
                else if (this._type == ResType.JSON) {
                    this._links[i].setJsonByLink(this._data);
                } else if (this._type == ResType.PLIST) {
                    this._links[i].setPlistByLink(this._data);
                }
            }
        }
        this._links = null;
        this._isLoading = false;
        if (this._res == null || this._data == null) {
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
        if(this.isDispose) {
            return;
        }
        this.dispatchWith(Event.COMPLETE, this._data);
        this._selfDispose = true;
        this.dispose();
        this._selfDispose = false;
    }

    loadError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatchWith(Event.ERROR, getLanguage(2003, this._loadInfo.url));
            if (this._links) {
                for (var i = 0; i < this._links.length; i++) {
                    this._links[i].loadError();
                }
            }
            this.dispose();
        }
        else {
            $error(2003, this._loadInfo.url);
        }
    }

    dispose() {
        if (!this._selfDispose) {
            super.dispose();
            return;
        }
        if (this._data && this._type == ResType.IMAGE) {
            this._data.$delCount();
            this._data = null;
        }
        if (this._createRes && this._res) {
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

flower.URLLoader = URLLoader;
//////////////////////////End File:flower/net/URLLoader.js///////////////////////////



//////////////////////////File:flower/net/URLLoaderList.js///////////////////////////
class URLLoaderList extends EventDispatcher {

    __list;
    __dataList;
    __index;
    __language;
    __scale;

    constructor(list) {
        super();
        this.__list = list;
        this.__dataList = [];
        this.__index = 0;
    }

    set language(val) {
        this.__language = val;
    }

    set scale(val) {
        this.__scale = val;
    }

    load() {
        this.__loadNext();
    }

    __loadNext() {
        if (this.__index >= this.__list.length) {
            this.dispatchWith(flower.Event.COMPLETE, this.__dataList);
            this.__list = null;
            this.__dataList = null;
            this.dispose();
            return;
        }
        var item = this.__list[this.__index];
        var load = new flower.URLLoader(item);
        if (this.__language != null) load.language = this.__language;
        if (this.__scale != null) load.scale = this.__scale;
        load.addListener(flower.Event.COMPLETE, this.__onComplete, this);
        load.addListener(Event.ERROR, this.__onError, this);
        load.load();
    }

    __onError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatch(e);
        }
        else {
            $error(e.message);
        }
    }

    __onComplete(e) {
        this.__dataList[this.__index] = e.data;
        this.__index++;
        this.__loadNext();
    }
}

flower.URLLoaderList = URLLoaderList;
//////////////////////////End File:flower/net/URLLoaderList.js///////////////////////////



//////////////////////////File:flower/net/URLLoaderMethod.js///////////////////////////
class URLLoaderMethod {
    static GET = "GET";
    static POST = "POST";
    static HEAD = "HEAD";
}

flower.URLLoaderMethod = URLLoaderMethod;
//////////////////////////End File:flower/net/URLLoaderMethod.js///////////////////////////



//////////////////////////File:flower/net/WebSocket.js///////////////////////////
class WebSocket extends flower.EventDispatcher {
    _ip;
    _port;
    _localWebSocket;
    _isConnect = false;

    constructor() {
        super();
    }

    connect(ip, port) {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket(this.localWebSocket);
        }
        this._isConnect = false;
        this._ip = ip;
        this._port = port;
        this._localWebSocket = new PlatformWebSocket();
        this._localWebSocket.bindWebSocket(ip, port, this, this.onConnect, this.onReceiveMessage, this.onError, this.onClose);
    }

    get ip() {
        return this._ip;
    }

    get port() {
        return this._port;
    }

    get isConnect() {
        return this._isConnect;
    }

    onConnect() {
        this._isConnect = true;
        this.dispatchWith(flower.Event.CONNECT);
    }

    onReceiveMessage(type, data) {
    }

    send(data) {
        if (data instanceof VByteArray) {
            this._localWebSocket.sendWebSocketBytes(data.bytes);
        } else {
            this._localWebSocket.sendWebSocketBytes(data);
        }
    }

    onError() {
        this.dispatchWith(flower.Event.ERROR);
    }

    onClose() {
        this.dispatchWith(flower.Event.CLOSE);
    }

    close() {
        if (this._localWebSocket) {
            this._localWebSocket.releaseWebSocket();
            this._localWebSocket = null;
        }
    }
}

flower.WebSocket = WebSocket;
//////////////////////////End File:flower/net/WebSocket.js///////////////////////////



//////////////////////////File:flower/net/VBWebSocket.js///////////////////////////
class VBWebSocket extends WebSocket {
    static id = 0;

    _remote;
    remotes = {};
    backs = {};
    zbacks = {};

    constructor(remote = false) {
        super();
        this._remote = remote;
        this.remotes = {};
        this.backs = {};
        this.zbacks = {};
    }

    get remote() {
        return this._remote;
    }

    onReceiveMessage(type, data) {
        var bytes = new VByteArray();
        if (type == "string") {
            bytes.readFromArray(JSON.parse(data));
        } else {
            bytes.readFromArray(data);
        }
        var pos;
        var cmd = bytes.readUInt();
        var removeList;
        var a;
        var i;
        var f;
        var backList;
        //trace("[receive] cmd = ",cmd," data = ",bytes.toString());
        if (cmd == 0) {
            var backCmd = bytes.readUInt();
            var zbackList = this.zbacks[backCmd];
            if (zbackList) {
                removeList = [];
                var errorCode = bytes.readUInt();
                a = zbackList.concat();
                for (i = 0; i < a.length; i++) {
                    a[i].func.call(a[i].thisObj, backCmd, errorCode,bytes);
                    if (a[i].once) {
                        removeList.push(a[i].id);
                    }
                }
                for (i = 0; i < removeList.length; i++) {
                    for (f = 0; f < this.zbacks[cmd].length; f++) {
                        if (this.zbacks[cmd][f].id == removeList[i]) {
                            this.zbacks[cmd].splice(f, 1);
                            break;
                        }
                    }
                }
            }
            bytes.position = 0;
            bytes.readUInt();
            pos = bytes.position;
            backList = this.backs[cmd];
            if (backList) {
                removeList = [];
                a = backList.concat();
                for (i = 0; i < a.length; i++) {
                    bytes.position = pos;
                    a[i].func.call(a[i].thisObj, cmd, bytes);
                    if (a[i].once) {
                        removeList.push(a[i].id);
                    }
                }
                for (i = 0; i < removeList.length; i++) {
                    for (f = 0; f < this.backs[cmd].length; f++) {
                        if (this.backs[cmd][f].id == removeList[i]) {
                            this.backs[cmd].splice(f, 1);
                            break;
                        }
                    }
                }
            }
        } else {
            var remoteId = 0;
            if (this._remote) {
                remoteId = bytes.readUInt();
            }
            pos = bytes.position;
            if (remoteId) {
                var remote = this.remotes[remoteId];
                if (remote) {
                    remote.receive(cmd, bytes);
                }
            } else {
                backList = this.backs[cmd];
                if (backList) {
                    removeList = [];
                    a = backList.concat();
                    for (i = 0; i < a.length; i++) {
                        bytes.position = pos;
                        a[i].func.call(a[i].thisObj, cmd, bytes);
                        if (a[i].once) {
                            removeList.push(a[i].id);
                        }
                    }
                    for (i = 0; i < removeList.length; i++) {
                        for (f = 0; f < this.backs[cmd].length; f++) {
                            if (this.backs[cmd][f].id == removeList[i]) {
                                this.backs[cmd].splice(f, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    //send(data) {
    //    this.sendWebSocketBytes(data.data);
    //}

    registerRemote(remote) {
        this.remotes[remote.id] = remote;
    }

    removeRemote(remote) {
        delete this.remotes[remote.id];
    }

    register(cmd, back, thisObj) {
        if (this.backs[cmd] == null) {
            this.backs[cmd] = [];
        }
        this.backs[cmd].push({func: back, thisObj: thisObj, id: VBWebSocket.id++});
    }

    registerOnce(cmd, back, thisObj) {
        if (this.backs[cmd] == null) {
            this.backs[cmd] = [];
        }
        this.backs[cmd].push({func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++});
    }

    remove(cmd, back, thisObj) {
        var list = this.backs[cmd];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].func == back && list[i].thisObj == thisObj) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    registerZero(cmd, back, thisObj) {
        if (this.zbacks[cmd] == null) {
            this.zbacks[cmd] = [];
        }
        this.zbacks[cmd].push({func: back, thisObj: thisObj, id: VBWebSocket.id++});
    }

    removeZeroe(cmd, back, thisObj) {
        var list = this.zbacks[cmd];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].func == back && list[i].thisObj == thisObj) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    registerZeroOnce(cmd, back, thisObj) {
        if (this.zbacks[cmd] == null) {
            this.zbacks[cmd] = [];
        }
        this.zbacks[cmd].push({func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++});
    }
}

flower.VBWebSocket = VBWebSocket;
//////////////////////////End File:flower/net/VBWebSocket.js///////////////////////////



//////////////////////////File:flower/net/Remote.js///////////////////////////
class Remote {

    static id = 1;

    __id;

    constructor() {
        this.__id = Remote.id++;
    }

    get id() {
        return this.__id;
    }

    receiveMessage(cmd, msg) {
    }
}

flower.Remote = Remote;
//////////////////////////End File:flower/net/Remote.js///////////////////////////



//////////////////////////File:flower/plist/Plist.js///////////////////////////
class Plist {

    frames = [];
    _url;
    _texture;
    _cacheFlag = false;

    constructor(url, texture) {
        this._url = url;
        this._texture = texture;
    }

    addFrame(frame) {
        this.frames.push(frame);
        frame.$setPlist(this);
    }

    get url() {
        return this._url;
    }

    get texture() {
        return this._texture;
    }

    set texture(val) {
        if (this._texture == val) {
            return;
        }
        if (this._texture && this._cacheFlag) {
            this._texture.$delCount();
        }
        this._texture = val;
        for (var i = 0, len = this.frames.length; i < len; i++) {
            this.frames[i].clearTexture();
        }
    }

    cache() {
        if (this._texture) {
            this._texture.$addCount();
            this._cacheFlag = true;
        }
    }

    delCache() {
        if (this._texture && this._cacheFlag) {
            this._texture.$delCount();
            this._cacheFlag = false;
        }
    }

    getFrameTexture(name) {
        if (this.texture.hasDispose) {
            this._texture = TextureManager.getInstance().$getTextureByURL(this.texture.url);
        }
        for (var i = 0, len = this.frames.length; i < len; i++) {
            if (this.frames[i].name == name) {
                return this.frames[i].texture;
            }
        }
        return null;
    }
}
//////////////////////////End File:flower/plist/Plist.js///////////////////////////



//////////////////////////File:flower/plist/PlistFrame.js///////////////////////////
class PlistFrame {
    _name;
    _x;
    _y;
    _width;
    _height;
    _rotation = false;
    _offX = 0;
    _offY = 0;
    _moveX;
    _moveY;
    _sourceHeight;
    _sourceWidth;
    _texture;
    _plist;

    constructor(name) {
        this._name = name;
    }

    decode(xml) {
        var content;
        for (var i = 0; i < xml.list.length; i++) {
            if (xml.list[i].name == "key") {
                content = xml.list[i + 1].value;
                if (content) {
                    while (content.indexOf("{") != -1) {
                        content = content.slice(0, content.indexOf("{")) + content.slice(content.indexOf("{") + 1, content.length);
                    }
                    while (content.indexOf("}") != -1) {
                        content = content.slice(0, content.indexOf("}")) + content.slice(content.indexOf("}") + 1, content.length);
                    }
                }
                if (xml.list[i].value == "frame") {
                    this._x = parseInt(content.split(",")[0]);
                    this._y = parseInt(content.split(",")[1]);
                    this._width = parseInt(content.split(",")[2]);
                    this._height = parseInt(content.split(",")[3]);
                }
                else if (xml.list[i].value == "rotated") {
                    if (xml.list[i + 1].name == "true") this._rotation = true;
                    else  this._rotation = false;
                }
                else if (xml.list[i].value == "offset") {
                    this._offX = parseInt(content.split(",")[0]);
                    this._offY = parseInt(content.split(",")[1]);
                }
                else if (xml.list[i].value == "sourceSize") {
                    this._sourceWidth = parseInt(content.split(",")[0]);
                    this._sourceHeight = parseInt(content.split(",")[1]);
                }
                i++;
            }
        }
        this._moveX = this._offX + (this._sourceWidth - this._width) / 2;
        this._moveY = this._offY + (this._sourceHeight - this._height) / 2;
    }

    get name() {
        return this._name;
    }

    $setPlist(plist) {
        this._plist = plist;
    }

    get texture() {
        if (!this._texture) {
            this._texture = this._plist.texture.createSubTexture(this._x, this._y, this._width, this._height, this._moveX, this._moveY, this._rotation);
        }
        return this._texture;
    }

    clearTexture() {
        this._texture = null;
    }
}
//////////////////////////End File:flower/plist/PlistFrame.js///////////////////////////



//////////////////////////File:flower/plist/PlistLoader.js///////////////////////////
class PlistLoader extends EventDispatcher {

    res;
    _url;
    _nativeURL
    textureURL;
    frames;
    disposeFlag = false;
    plist;

    constructor(url, nativeURL) {
        super();
        this._url = url;
        this._nativeURL = nativeURL;
        this.__load();
    }

    __load() {
        var plist = PlistManager.getInstance().getPlist(this._nativeURL);
        if (plist) {
            this.plist = plist;
            this.loadTexture();
        } else {
            var res = new ResItem(this._nativeURL, ResType.TEXT);
            res.addURL(this._nativeURL);
            var loader = new URLLoader(res);
            loader.addListener(Event.COMPLETE, this.loadPlistComplete, this);
            loader.addListener(Event.ERROR, this.loadError, this);
            loader.load();
        }
    }

    loadError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatch(e);
        } else {
            $error(2004, this.url);
        }
    }

    loadPlistComplete(e) {
        var frames = [];
        this.frames = frames;
        var content = e.data;
        var xml = XMLElement.parse(content);
        xml = xml.list[0];
        var reslist;
        var attributes;
        for (var i = 0; i < xml.list.length; i++) {
            if (xml.list[i].name == "key") {
                if (xml.list[i].value == "frames") {
                    reslist = xml.list[i + 1];
                }
                else if (xml.list[i].value == "metadata") {
                    attributes = xml.list[i + 1];
                }
                i++;
            }
        }
        var frameFrame;
        var frame;
        for (i = 0; i < reslist.list.length; i++) {
            if (reslist.list[i].name == "key") {
                frame = new PlistFrame(reslist.list[i].value);
                frame.decode(reslist.list[i + 1]);
                frames.push(frame);
                i++;
            }
        }
        for (i = 0; i < attributes.list.length; i++) {
            if (attributes.list[i].name == "key") {
                if (attributes.list[i].value == "realTextureFileName") {
                    var end = -1;
                    for (var c = 0; c < this._nativeURL.length; c++) {
                        if (this._nativeURL.charAt(c) == "/") {
                            end = c;
                        }
                    }
                    if (end == -1) this.textureURL = attributes.list[i + 1].value;
                    else  this.textureURL = this._nativeURL.slice(0, end + 1) + attributes.list[i + 1].value;
                }
                else if (attributes.list[i].value == "size") {
                    var size = attributes.list[i + 1].value;
                    size = size.slice(1, size.length - 1);
                    //this.width = math.floor(size.split(",")[0]);
                    //this.height = math.floor(size.split(",")[1]);
                }
                i++;
            }
        }
        this.loadTexture();
    }

    loadTexture() {
        var flag = true;
        if (this.plist) {
            var texture = this.plist.texture;
            if (!texture.hasDispose) {
                flag = false;
                texture.$addCount();
            }
        }
        if (flag) {
            var loader = new URLLoader(this.textureURL || this.plist.texture.nativeURL);
            loader.addListener(Event.COMPLETE, this.loadTextureComplete, this);
            loader.addListener(Event.ERROR, this.loadError, this);
            loader.load();
        } else {
            CallLater.add(this.loadComplete, this, [this.plist]);
        }
    }

    loadTextureComplete(e) {
        if (this.disposeFlag) {
            return;
        }
        var texture = e.data;
        texture.$addCount();
        if (this.plist) {
            this.plist.texture = texture;
            this.loadComplete(this.plist);
        } else {
            var plist = new Plist(this.url, texture);
            var list = this.frames || [];
            for (var i = 0, len = list.length; i < len; i++) {
                plist.addFrame(list[i]);
            }
            PlistManager.getInstance().addPlist(plist);
            this.loadComplete(plist);
        }
        this.dispose();
    }

    loadComplete(plist) {
        plist.texture.$delCount();
        //var texture = plist.getFrameTexture(this.childName);
        this.dispatchWith(Event.COMPLETE, plist);
    }

    dispose() {
        this.frames = null;
        this.disposeFlag = true;
    }

    get url() {
        return this._url;
    }
}
//////////////////////////End File:flower/plist/PlistLoader.js///////////////////////////



//////////////////////////File:flower/plist/PlistManager.js///////////////////////////
class PlistManager {

    plists = [];
    caches = {};
    loadingPlist = [];

    constructor() {

    }

    addPlist(plist) {
        this.plists.push(plist);
    }

    addPlistWidthConfig(content) {

    }

    cache(url) {
        this.caches[url] = true;
    }

    delCache(url) {
        delete this.caches[url];
    }

    getPlist(url) {
        for (var i = 0, len = this.plists.length; i < len; i++) {
            if (this.plists[i].url == url) {
                return this.plists[i];
            }
        }
        return null;
    }

    load(url, nativeURL) {
        var loader;
        var list = this.loadingPlist;
        var url;
        for (var i = 0, len = list.length; i < len; i++) {
            if (url == list[i].url) {
                loader = list[i];
                break;
            }
        }
        if (!loader) {
            loader = new PlistLoader(url, nativeURL);
            list.push(loader);
            loader.addListener(Event.COMPLETE, this.__onLoadPlistComplete, this);
        }
        return loader;
    }

    __onLoadPlistComplete(e) {
        var loader = e.currentTarget;
        var list = this.loadingPlist;
        for (var i = 0, len = list.length; i < len; i++) {
            if (loader == list[i]) {
                list.splice(i, 1);
                break;
            }
        }
    }

    getTexture(url) {
        var arr = url.split("#");
        var plistURL = arr[0];
        var frameName = arr[1];
        var plist = this.getPlist(url);
        if (!plist) {
            return null;
        }
        var texture = plist.getFrameTexture(frameName);
        if (!texture || texture.hasDispose == false) {
            return null;
        }
        return texture;
    }

    static instance = new PlistManager();

    static getInstance() {
        return PlistManager.instance;
    }
}
//////////////////////////End File:flower/plist/PlistManager.js///////////////////////////



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

flower.Res = Res;
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
        if (type) {
            this.__type = type;
        } else {
            this.__type = ResType.getURLType(url);
        }
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

    addInfo(url, plist, settingWidth, settingHeight, scale, language, update = false) {
        var info = ResItemInfo.create();
        info.url = url;
        info.plist = plist;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale || 1;
        info.language = language;
        info.update = update;
        this.__loadList.push(info);
        return info;
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
                if (loadList[i].scale != null && math.abs(loadList[i].scale - scale) < math.abs(info.scale - scale)) {
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
        var plist = null;
        var array = url.split("#PLIST#");
        if (array.length == 2) {
            url = array[0];
            plist = array[1];
        }
        array = url.split("/");
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
        res.addInfo(url, plist, settingWidth, settingHeight, scale, language);
        return res;
    }

    static release(item) {
        while (item.__loadList.length) {
            ResItemInfo.release(item.__loadList.pop());
        }
        ResItem.$pools.push(item);
    }
}

flower.ResItem = ResItem;
//////////////////////////End File:flower/res/ResItem.js///////////////////////////



//////////////////////////File:flower/res/ResItemInfo.js///////////////////////////
class ResItemInfo {

    /**
     * 实际的加载地址
     */
    url;

    /**
     * plist 地址
     */
    plist;

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

    /**
     * 是否更新旧的纹理
     * @native
     */
    update = UPDATE_RESOURCE ? false : null;

    static $pools = [];

    static create() {
        if (ResItemInfo.$pools.length) {
            return ResItemInfo.$pools.pop();
        } else {
            return new ResItemInfo();
        }
    }

    static release(info) {
        info.update = false;
        ResItemInfo.$pools.push(info);
    }
}

flower.ResItemInfo = ResItemInfo;
//////////////////////////End File:flower/res/ResItemInfo.js///////////////////////////



//////////////////////////File:flower/res/ResType.js///////////////////////////
class ResType {
    static TEXT = 1;
    static JSON = 2;
    static IMAGE = 3;
    static PLIST = 4;

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
        if (end == "plist") {
            return ResType.PLIST;
        }
        return ResType.TEXT;
    }
}

flower.ResType = ResType;
//////////////////////////End File:flower/res/ResType.js///////////////////////////



//////////////////////////File:flower/tween/plugins/TweenCenter.js///////////////////////////
class TweenCenter {
    constructor() {
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var target = tween.target;
        this.centerX = target.width / 2;
        this.centerY = target.height / 2;
        this.centerLength = math.sqrt(target.width * target.width + target.height * target.height) * .5;
        this.rotationStart = math.atan2(target.height, target.width) * 180 / math.PI;
        if (target.rotation) {
            this.lastMoveX = this.centerX - this.centerLength * math.cos((target.rotation + this.rotationStart) * math.PI / 180);
            this.lastMoveY = this.centerY - this.centerLength * math.sin((target.rotation + this.rotationStart) * math.PI / 180);
        } else {
            this.lastMoveX = 0;
            this.lastMoveY = 0;
        }
        var useAttributes = [];
        useAttributes.push("center");
        if ("scaleX" in propertiesTo) {
            this.scaleXTo = +propertiesTo["scaleX"];
            useAttributes.push("scaleX");
            if (propertiesFrom && "scaleX" in propertiesFrom) {
                this.scaleXFrom = +propertiesFrom["scaleX"];
            }
            else {
                this.scaleXFrom = target["scaleX"];
            }
        }
        if ("scaleY" in propertiesTo) {
            this.scaleYTo = +propertiesTo["scaleY"];
            useAttributes.push("scaleY");
            if (propertiesFrom && "scaleY" in propertiesFrom) {
                this.scaleYFrom = +propertiesFrom["scaleY"];
            }
            else {
                this.scaleYFrom = target["scaleY"];
            }
        }
        if ("rotation" in propertiesTo) {
            this.rotationTo = +propertiesTo["rotation"];
            useAttributes.push("rotation");
            if (propertiesFrom && "rotation" in propertiesFrom) {
                this.rotationFrom = +propertiesFrom["rotation"];
            }
            else {
                this.rotationFrom = target["rotation"];
            }
        }
        return useAttributes;
    }

    tween;
    scaleXFrom;
    scaleYFrom;
    scaleXTo;
    scaleYTo;
    rotationFrom;
    rotationStart;
    rotationTo;
    centerX;
    centerY;
    centerLength;
    lastMoveX;
    lastMoveY;

    update(value) {
        var target = this.tween.target;
        var moveX = 0;
        var moveY = 0;
        if (this.scaleXTo) {
            target.scaleX = this.scaleXFrom + (this.scaleXTo - this.scaleXFrom) * value;
            target.x = this.centerX - target.width / 2;
        }
        if (this.scaleYTo) {
            target.scaleY = this.scaleYFrom + (this.scaleYTo - this.scaleYFrom) * value;
            target.y = this.centerY - target.height / 2;
        }
        if (this.rotationTo) {
            target.rotation = this.rotationFrom + (this.rotationTo - this.rotationFrom) * value;
            moveX += this.centerX - this.centerLength * math.cos((target.rotation + this.rotationStart) * math.PI / 180);
            moveY += this.centerY - this.centerLength * math.sin((target.rotation + this.rotationStart) * math.PI / 180);
            target.x += moveX - this.lastMoveX;
            target.y += moveY - this.lastMoveY;
        }
        this.lastMoveX = moveX;
        this.lastMoveY = moveY;
    }

    static scaleTo(target, time, scaleTo, scaleFrom = null, ease = "None") {
        return flower.Tween.to(target, time, {
            "center": true,
            "scaleX": scaleTo,
            "scaleY": scaleTo
        }, ease, scaleFrom == null ? null : {"scaleX": scaleFrom, "scaleY": scaleFrom});
    }

    static rotationTo(target, time, rotationTo, rotationFrom = null, ease = "None") {
        return flower.Tween.to(target, time, {
            "center": true,
            "rotation": rotationTo
        }, ease, rotationFrom == null ? null : {"rotation": rotationFrom});
    }
}

flower.TweenCenter = TweenCenter;
//////////////////////////End File:flower/tween/plugins/TweenCenter.js///////////////////////////



//////////////////////////File:flower/tween/plugins/TweenPath.js///////////////////////////
class TweenPath {

    constructor() {
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var useAttributes = [];
        useAttributes.push("path");
        var path = propertiesTo["path"];
        var target = tween.target;
        var start = flower.Point.create(target.x, target.y);
        path.splice(0, 0, start);
        if (propertiesFrom) {
            if ("x" in propertiesFrom) {
                start.x = +propertiesFrom["x"];
            }
            if ("y" in propertiesFrom) {
                start.y = +propertiesFrom["y"];
            }
        }
        if ("x" in propertiesTo && "y" in propertiesTo) {
            useAttributes.push("x");
            useAttributes.push("y");
            path.push(flower.Point.create(+propertiesTo["x"], +propertiesTo["y"]));
        }
        this.path = path;
        this.pathSum = [];
        this.pathSum.push(0);
        for (var i = 1, len = path.length; i < len; i++) {
            this.pathSum[i] = this.pathSum[i - 1] + math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
        }
        var sum = this.pathSum[len - 1];
        for (i = 1; i < len; i++) {
            this.pathSum[i] = this.pathSum[i] / sum;
        }
        return useAttributes;
    }

    tween;
    pathSum;
    path;

    update(value) {
        var path = this.path;
        var target = this.tween.target;
        var pathSum = this.pathSum;
        var i, len = pathSum.length;
        for (i = 1; i < len; i++) {
            if (value > pathSum[i - 1] && value <= pathSum[i]) {
                break;
            }
        }
        if (value <= 0) {
            i = 1;
        }
        else if (value >= 1) {
            i = len - 1;
        }
        value = (value - pathSum[i - 1]) / (pathSum[i] - pathSum[i - 1]);
        target.x = value * (path[i].x - path[i - 1].x) + path[i - 1].x;
        target.y = value * (path[i].y - path[i - 1].y) + path[i - 1].y;
    }

    static to(target, time, path, ease = "None") {
        return flower.Tween.to(target, time, {"path": path}, ease);
    }

    static vto(target, v, path, ease = "None") {
        var sum = 0;
        for (var i = 1, len = path.length; i < len; i++) {
            sum += math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
        }
        var time = sum / v;
        return flower.Tween.to(target, time, {"path": path}, ease);
    }

}

flower.TweenPath = TweenPath;
//////////////////////////End File:flower/tween/plugins/TweenPath.js///////////////////////////



//////////////////////////File:flower/tween/plugins/TweenPhysicMove.js///////////////////////////
class TweenPhysicMove {

    constructor() {
        if (!flower.Tween.hasPlugin("physicMove")) {
            flower.Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
        }
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var useAttributes = [];
        useAttributes.push("physicMove");
        var target = tween.target;
        var startX = target.x;
        var startY = target.y;
        if (propertiesFrom) {
            if ("x" in propertiesFrom) {
                startX = +propertiesFrom["x"];
            }
            if ("y" in propertiesFrom) {
                startY = +propertiesFrom["y"];
            }
        }
        this.startX = startX;
        this.startY = startY;
        var endX = startX;
        var endY = startY;
        if ("x" in propertiesTo) {
            endX = +propertiesTo["x"];
            useAttributes.push("x");
        }
        if ("y" in propertiesTo) {
            endY = +propertiesTo["y"];
            useAttributes.push("y");
        }
        var vx = 0;
        var vy = 0;
        var t = tween.time;
        if ("vx" in propertiesTo) {
            vx = +propertiesTo["vx"];
            useAttributes.push("vx");
            if (!("x" in propertiesTo)) {
                endX = startX + t * vx;
            }
        }
        if ("vy" in propertiesTo) {
            vy = +propertiesTo["vy"];
            useAttributes.push("vy");
            if (!("y" in propertiesTo)) {
                endY = startY + t * vy;
            }
        }
        this.vx = vx;
        this.vy = vy;
        this.ax = (endX - startX - vx * t) * 2 / (t * t);
        this.ay = (endY - startY - vy * t) * 2 / (t * t);
        this.time = t;
        return useAttributes;
    }

    tween;
    startX;
    vx;
    ax;
    startY;
    vy;
    ay;
    time;

    update(value) {
        var target = this.tween.target;
        var t = this.time * value;
        target.x = this.startX + this.vx * t + .5 * this.ax * t * t;
        target.y = this.startY + this.vy * t + .5 * this.ay * t * t;
    }

    static freeFallTo(target, time, groundY) {
        return flower.Tween.to(target, time, {"y": groundY, "physicMove": true});
    }

    static freeFallToWithG(target, g, groundY) {
        return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g), {"y": groundY, "physicMove": true});
    }

    static fallTo(target, time, groundY, vX = null, vY = null) {
        return flower.Tween.to(target, time, {"y": groundY, "physicMove": true, "vx": vX, "vy": vY});
    }

    static fallToWithG(target, g, groundY, vX = null, vY = null) {
        vX = +vX;
        vY = +vY;
        return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g + (vY * vY / (g * g))) - vY / g, {
            "y": groundY,
            "physicMove": true,
            "vx": vX,
            "vy": vY
        });
    }

    static to(target, time, xTo, yTo, vX = 0, vY = 0) {
        return flower.Tween.to(target, time, {"x": xTo, "y": yTo, "vx": vX, "vy": vY, "physicMove": true});
    }

}

flower.TweenPhysicMove = TweenPhysicMove;
//////////////////////////End File:flower/tween/plugins/TweenPhysicMove.js///////////////////////////



//////////////////////////File:flower/tween/BasicPlugin.js///////////////////////////
class BasicPlugin {
    constructor() {

    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        this._attributes = propertiesTo;
        this.keys = flower.ObjectDo.keys(propertiesTo);
        var target = tween.target;
        var startAttributes = {};
        var keys = this.keys;
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (propertiesFrom && key in propertiesFrom) {
                startAttributes[key] = propertiesFrom[key];
            }
            else {
                startAttributes[key] = target[key];
            }
        }
        this.startAttributes = startAttributes;
        return null;
    }

    tween;
    keys;
    startAttributes;
    _attributes;

    update(value) {
        var target = this.tween.target;
        var keys = this.keys;
        var length = keys.length;
        var startAttributes = this.startAttributes;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            target[key] = (this._attributes[key] - startAttributes[key]) * value + startAttributes[key];
        }
    }
}

flower.BasicPlugin = BasicPlugin;
//////////////////////////End File:flower/tween/BasicPlugin.js///////////////////////////



//////////////////////////File:flower/tween/Ease.js///////////////////////////
class Ease {

    static NONE = "None";
    static SINE_EASE_IN = "SineEaseIn";
    static SineEaseOut = "SineEaseOut";
    static SINE_EASE_IN_OUT = "SineEaseInOut";
    static SineEaseOutIn = "SineEaseOutIn";
    static QUAD_EASE_IN = "QuadEaseIn";
    static QUAD_EASE_OUT = "QuadEaseOut";
    static QUAD_EASE_IN_OUT = "QuadEaseInOut";
    static QUAD_EASE_OUT_IN = "QuadEaseOutIn";
    static CUBIC_EASE_IN = "CubicEaseIn";
    static CUBIC_EASE_OUT = "CubicEaseOut";
    static CUBIC_EASE_IN_OUT = "CubicEaseInOut";
    static CUBIC_EASE_OUT_IN = "CubicEaseOutIn";
    static QUART_EASE_IN = "QuartEaseIn";
    static QUART_EASE_OUT = "QuartEaseOut";
    static QUART_EASE_IN_OUT = "QuartEaseInOut";
    static QUART_EASE_OUT_IN = "QuartEaseOutIn";
    static QUINT_EASE_IN = "QuintEaseIn";
    static QUINT_EASE_OUT = "QuintEaseOut";
    static QUINT_EASE_IN_OUT = "QuintEaseInOut";
    static QUINT_EASE_OUT_IN = "QuintEaseOutIn";
    static EXPO_EASE_IN = "ExpoEaseIn";
    static EXPO_EASE_OUT = "ExpoEaseOut";
    static EXPO_EASE_IN_OUT = "ExpoEaseInOut";
    static EXPO_EASE_OUT_IN = "ExpoEaseOutIn";
    static CIRC_EASE_IN = "CircEaseIn";
    static CIRC_EASE_OUT = "CircEaseOut";
    static CIRC_EASE_IN_OUT = "CircEaseInOut";
    static CIRC_EASE_OUT_IN = "CircEaseOutIn";
    static BACK_EASE_IN = "BackEaseIn";
    static BACK_EASE_OUT = "BackEaseOut";
    static BACK_EASE_IN_OUT = "BackEaseInOut";
    static BACK_EASE_OUT_IN = "BackEaseOutIn";
    static ELASTIC_EASE_IN = "ElasticEaseIn";
    static ELASTIC_EASE_OUT = "ElasticEaseOut";
    static ELASTIC_EASE_IN_OUT = "ElasticEaseInOut";
    static ELASTIC_EASE_OUT_IN = "ElasticEaseOutIn";
    static BOUNCE_EASE_IN = "BounceEaseIn";
    static BounceEaseOut = "BounceEaseOut";
    static BOUNCE_EASE_IN_OUT = "BounceEaseInOut";
    static BOUNCE_EASE_OUT_IN = "BounceEaseOutIn";

    static registerEaseFunction(name, ease) {
        EaseFunction[name] = ease;
    }
}

flower.Ease = Ease;
//////////////////////////End File:flower/tween/Ease.js///////////////////////////



//////////////////////////File:flower/tween/EaseFunction.js///////////////////////////
class EaseFunction {
    static None(t) {
        return t;
    }

    static SineEaseIn(t) {
        return math.sin((t - 1) * math.PI * .5) + 1;
    }

    static SineEaseOut(t) {
        return math.sin(t * math.PI * .5);
    }

    static SineEaseInOut(t) {
        return math.sin((t - .5) * math.PI) * .5 + .5;
    }

    static SineEaseOutIn(t) {
        if (t < 0.5) {
            return math.sin(t * math.PI) * .5;
        }
        return math.sin((t - 1) * math.PI) * .5 + 1;
    }

    static QuadEaseIn(t) {
        return t * t;
    }

    static QuadEaseOut(t) {
        return -(t - 1) * (t - 1) + 1;
    }

    static QuadEaseInOut(t) {
        if (t < .5) {
            return t * t * 2;
        }
        return -(t - 1) * (t - 1) * 2 + 1;
    }

    static QuadEaseOutIn(t) {
        var s = (t - .5) * (t - .5) * 2;
        if (t < .5) {
            return .5 - s;
        }
        return .5 + s;
    }

    static CubicEaseIn(t) {
        return t * t * t;
    }

    static CubicEaseOut(t) {
        return (t - 1) * (t - 1) * (t - 1) + 1;
    }

    static CubicEaseInOut(t) {
        if (t < .5) {
            return t * t * t * 4;
        }
        return (t - 1) * (t - 1) * (t - 1) * 4 + 1;
    }

    static CubicEaseOutIn(t) {
        return (t - .5) * (t - .5) * (t - .5) * 4 + .5;
    }

    static QuartEaseIn(t) {
        return t * t * t * t;
    }

    static QuartEaseOut(t) {
        var a = (t - 1);
        return -a * a * a * a + 1;
    }

    static QuartEaseInOut(t) {
        if (t < .5) {
            return t * t * t * t * 8;
        }
        var a = (t - 1);
        return -a * a * a * a * 8 + 1;
    }

    static QuartEaseOutIn(t) {
        var s = (t - .5) * (t - .5) * (t - .5) * (t - .5) * 8;
        if (t < .5) {
            return .5 - s;
        }
        return .5 + s;
    }

    static QuintEaseIn(t) {
        return t * t * t * t * t;
    }

    static QuintEaseOut(t) {
        var a = t - 1;
        return a * a * a * a * a + 1;
    }

    static QuintEaseInOut(t) {
        if (t < .5) {
            return t * t * t * t * t * 16;
        }
        var a = t - 1;
        return a * a * a * a * a * 16 + 1;
    }

    static QuintEaseOutIn(t) {
        var a = t - .5;
        return a * a * a * a * a * 16 + 0.5;
    }

    static ExpoEaseIn(t) {
        return math.pow(2, 10 * (t - 1));
    }

    static ExpoEaseOut(t) {
        return -math.pow(2, -10 * t) + 1;
    }

    static ExpoEaseInOut(t) {
        if (t < .5) {
            return math.pow(2, 10 * (t * 2 - 1)) * .5;
        }
        return -math.pow(2, -10 * (t - .5) * 2) * .5 + 1.00048828125;
    }

    static ExpoEaseOutIn(t) {
        if (t < .5) {
            return -math.pow(2, -20 * t) * .5 + .5;
        }
        return math.pow(2, 10 * ((t - .5) * 2 - 1)) * .5 + .5;
    }

    static CircEaseIn(t) {
        return 1 - math.sqrt(1 - t * t);
    }

    static CircEaseOut(t) {
        return math.sqrt(1 - (1 - t) * (1 - t));
    }

    static CircEaseInOut(t) {
        if (t < .5) {
            return .5 - math.sqrt(.25 - t * t);
        }
        return math.sqrt(.25 - (1 - t) * (1 - t)) + .5;
    }

    static CircEaseOutIn(t) {
        var s = math.sqrt(.25 - (.5 - t) * (.5 - t));
        if (t < .5) {
            return s;
        }
        return 1 - s;
    }

    static BackEaseIn(t) {
        return 2.70158 * t * t * t - 1.70158 * t * t;
    }

    static BackEaseOut(t) {
        var a = t - 1;
        return 2.70158 * a * a * a + 1.70158 * a * a + 1;
    }

    static BackEaseInOut(t) {
        var a = t - 1;
        if (t < .5) {
            return 10.80632 * t * t * t - 3.40316 * t * t;
        }
        return 10.80632 * a * a * a + 3.40316 * a * a + 1;
    }

    static BackEaseOutIn(t) {
        var a = t - .5;
        if (t < .5) {
            return 10.80632 * a * a * a + 3.40316 * a * a + .5;
        }
        return 10.80632 * a * a * a - 3.40316 * a * a + .5;
    }

    static ElasticEaseIn(t) {
        if (t == 0 || t == 1)
            return t;
        return -(math.pow(2, 10 * (t - 1)) * math.sin((t - 1.075) * 2 * math.PI / .3));
    }

    static ElasticEaseOut(t) {
        if (t == 0 || t == .5 || t == 1)
            return t;
        return (math.pow(2, 10 * -t) * math.sin((-t - .075) * 2 * math.PI / .3)) + 1;
    }

    static ElasticEaseInOut(t) {
        if (t == 0 || t == .5 || t == 1)
            return t;
        if (t < .5) {
            return -(math.pow(2, 10 * t - 10) * math.sin((t * 2 - 2.15) * math.PI / .3));
        }
        return (math.pow(2, 10 - 20 * t) * math.sin((-4 * t + 1.85) * math.PI / .3)) * .5 + 1;
    }

    static ElasticEaseOutIn(t) {
        if (t == 0 || t == .5 || t == 1)
            return t;
        if (t < .5) {
            return (math.pow(2, -20 * t) * math.sin((-t * 4 - .15) * math.PI / .3)) * .5 + .5;
        }
        return -(math.pow(2, 20 * (t - 1)) * math.sin((t * 4 - 4.15) * math.PI / .3)) * .5 + .5;
    }

    static bounceEaseIn(t) {
        return 1 - flower.EaseFunction.bounceEaseOut(1 - t);
    }

    static bounceEaseOut(t) {
        var s;
        var a = 7.5625;
        var b = 2.75;
        if (t < (1 / 2.75)) {
            s = a * t * t;
        }
        else if (t < (2 / b)) {
            s = (a * (t - (1.5 / b)) * (t - (1.5 / b)) + .75);
        }
        else if (t < (2.5 / b)) {
            s = (a * (t - (2.25 / b)) * (t - (2.25 / b)) + .9375);
        }
        else {
            s = (a * (t - (2.625 / b)) * (t - (2.625 / b)) + .984375);
        }
        return s;
    }


    static BounceEaseInOut(t) {
        if (t < .5)
            return flower.EaseFunction.bounceEaseIn(t * 2) * .5;
        else
            return flower.EaseFunction.bounceEaseOut(t * 2 - 1) * .5 + .5;
    }

    static BounceEaseOutIn(t) {
        if (t < .5)
            return flower.EaseFunction.bounceEaseOut(t * 2) * .5;
        else
            return flower.EaseFunction.bounceEaseIn(t * 2 - 1) * .5 + .5;
    }

    static BounceEaseIn = EaseFunction.bounceEaseIn;
    static BounceEaseOut = EaseFunction.bounceEaseOut;
}
//////////////////////////End File:flower/tween/EaseFunction.js///////////////////////////



//////////////////////////File:flower/tween/TimeLine.js///////////////////////////
class TimeLine {
    tweens;

    constructor() {
        this.tweens = [];
    }

    lastTime = -1;
    _currentTime = 0;

    get totalTime() {
        return this.getTotalTime();
    }

    getTotalTime() {
        if (this.invalidTotalTime == true) {
            return this._totalTime;
        }
        this.invalidTotalTime = true;
        var tweens = this.tweens;
        var endTime = 0;
        var time;
        for (var i = 0, len = tweens.length; i < len; i++) {
            time = tweens[i].startTime + tweens[i].time;
            if (time > endTime) {
                endTime = time;
            }
        }
        this._totalTime = endTime * 1000;
        return this._totalTime;
    }

    _totalTime = 0;
    invalidTotalTime = true;

    $invalidateTotalTime() {
        if (this.invalidTotalTime == false) {
            return;
        }
        this.invalidTotalTime = false;
    }

    _loop = false;
    get loop() {
        return this._loop;
    }

    set loop(value) {
        this._loop = value;
    }

    _isPlaying = false;
    get isPlaying() {
        return this._isPlaying;
    }

    update(timeStamp, gap) {
        var totalTime = this.getTotalTime();
        var lastTime = this._currentTime;
        this._currentTime += timeStamp - this.lastTime;
        var currentTime = -1;
        var loopTime = 0;
        if (this._currentTime >= totalTime) {
            currentTime = this._currentTime % totalTime;
            loopTime = math.floor(this._currentTime / totalTime);
            if (!this._loop) {
                this.$setPlaying(false);
            }
        }
        while (loopTime > -1) {
            if (loopTime && currentTime != -1) {
                this._currentTime = totalTime;
            }
            var calls = this.calls;
            var call;
            var len = calls.length;
            for (i = 0; i < len; i++) {
                call = calls[i];
                if (call.time > lastTime && call.time <= this._currentTime || (call.time == 0 && lastTime == 0 && this._currentTime)) {
                    call.callBack.apply(call.thisObj, call.args);
                }
            }
            var tweens = this.tweens;
            var tween;
            len = tweens.length;
            for (var i = 0; i < len; i++) {
                tween = tweens[i];
                if (tween.$startTime + tween.$time > lastTime && tween.$startTime <= this._currentTime || (tween.$startTime == 0 && lastTime == 0 && this._currentTime)) {
                    tween.$update(this._currentTime);
                }
            }
            loopTime--;
            if (loopTime == 0) {
                if (currentTime != -1) {
                    lastTime = 0;
                    this._currentTime = currentTime;
                }
            }
            else {
                if (loopTime) {
                    lastTime = 0;
                }
            }
            if (this._loop == false) {
                break;
            }
        }
        this.lastTime = timeStamp;
        return true;
    }

    play() {
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(true, now);
    }

    stop() {
        this.$setPlaying(false);
    }

    $setPlaying(value, time = 0) {
        if (value) {
            this.lastTime = time;
        }
        if (this._isPlaying == value) {
            return;
        }
        this._isPlaying = value;
        if (value) {
            flower.EnterFrame.add(this.update, this);
            this.update(flower.CoreTime.currentTime, 0);
        }
        else {
            flower.EnterFrame.remove(this.update, this);
        }
    }

    gotoAndPlay(time) {
        if (!this.tweens.length) {
            return;
        }
        time = +time | 0;
        time = time < 0 ? 0 : time;
        if (time > this.totalTime) {
            time = this.totalTime;
        }
        this._currentTime = time;
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(true, now);
    }

    gotoAndStop(time) {
        if (!this.tweens.length) {
            return;
        }
        time = +time | 0;
        time = time < 0 ? 0 : time;
        if (time > this.totalTime) {
            time = this.totalTime;
        }
        this._currentTime = time;
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(false);
    }

    addTween(tween) {
        this.tweens.push(tween);
        tween.$setTimeLine(this);
        this.$invalidateTotalTime();
        return tween;
    }

    removeTween(tween) {
        var tweens = this.tweens;
        for (var i = 0, len = tweens.length; i < len; i++) {
            if (tweens[i] == tween) {
                tweens.splice(i, 1)[0].$setTimeLine(null);
                this.$invalidateTotalTime();
                break;
            }
        }
        if (tweens.length == 0) {
            this.$setPlaying(false);
        }
    }

    calls = [];

    call(time, callBack, thisObj = null, ...args) {
        this.calls.push({"time": time, "callBack": callBack, "thisObj": thisObj, "args": args});
    }
}

flower.TimeLine = TimeLine;
//////////////////////////End File:flower/tween/TimeLine.js///////////////////////////



//////////////////////////File:flower/tween/Tween.js///////////////////////////
class Tween {
    constructor(target, time, propertiesTo, ease = "None", propertiesFrom = null) {
        if (flower.Tween.plugins == null) {
            flower.Tween.registerPlugin("center", flower.TweenCenter);
            flower.Tween.registerPlugin("path", flower.TweenPath);
            flower.Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
        }
        time = +time;
        if (time < 0) {
            time = 0;
        }
        this.$time = time * 1000;
        this._target = target;
        this._propertiesTo = propertiesTo;
        this._propertiesFrom = propertiesFrom;
        this.ease = ease || "None";
        var timeLine = new flower.TimeLine();
        timeLine.addTween(this);
    }

    invalidProperty = false;
    _propertiesTo;
    set propertiesTo(value) {
        if (value == this._propertiesTo) {
            return;
        }
        this._propertiesTo = value;
        this.invalidProperty = false;
    }

    _propertiesFrom;
    set propertiesFrom(value) {
        if (value == this._propertiesFrom) {
            return;
        }
        this._propertiesFrom = value;
        this.invalidProperty = false;
    }

    $time;

    get time() {
        return this.$time / 1000;
    }

    set time(value) {
        value = +value | 0;
        this.$time = (+value) * 1000;
        if (this._timeLine) {
            this._timeLine.$invalidateTotalTime();
        }
    }

    $startTime = 0;

    get startTime() {
        return this.$startTime / 1000;
    }

    set startTime(value) {
        value = +value | 0;
        if (value < 0) {
            value = 0;
        }
        if (value == this.$startTime) {
            return;
        }
        this.$startTime = value * 1000;
        if (this._timeLine) {
            this._timeLine.$invalidateTotalTime();
        }
        this.invalidProperty = false;
    }

    _currentTime = 0;
    _target;
    get target() {
        return this._target;
    }

    set target(value) {
        if (value == this.target) {
            return;
        }
        this.removeTargetEvent();
        this._target = value;
        this.invalidProperty = false;
        this.addTargetEvent();
    }

    _ease;
    _easeData;

    get ease() {
        return this._ease;
    }

    set ease(val) {
        if (!flower.Tween.easeCache[val]) {
            var func = EaseFunction[val];
            if (func == null) {
                return;
            }
            var cache = [];
            for (var i = 0; i <= 2000; i++) {
                cache[i] = func(i / 2000);
            }
            flower.Tween.easeCache[val] = cache;
        }
        this._ease = val;
        this._easeData = flower.Tween.easeCache[val];
    }

    _startEvent = "";
    get startEvent() {
        return this._startEvent;
    }

    set startEvent(type) {
        this.removeTargetEvent();
        this._startEvent = type;
        this.addTargetEvent();
    }

    _startTarget;
    get startTarget() {
        return this._startTarget;
    }

    set startTarget(value) {
        this.removeTargetEvent();
        this._startTarget = value;
        this.addTargetEvent();
    }

    removeTargetEvent() {
        var target;
        if (this._startTarget) {
            target = this._startTarget;
        }
        else {
            target = this._target;
        }
        if (target && this._startEvent && this._startEvent != "") {
            target.removeListener(this._startEvent, this.startByEvent, this);
        }
    }

    addTargetEvent() {
        var target;
        if (this._startTarget) {
            target = this._startTarget;
        }
        else {
            target = this._target;
        }
        if (target && this._startEvent && this._startEvent != "") {
            target.addListener(this._startEvent, this.startByEvent, this);
        }
    }

    play() {
        this.timeLine.play();
    }

    stop() {
        this.timeLine.stop();
    }

    startByEvent() {
        this._timeLine.gotoAndPlay(0);
    }

    _timeLine;
    get timeLine() {
        if (!this._timeLine) {
            this._timeLine = new flower.TimeLine();
            this._timeLine.addTween(this);
        }
        return this._timeLine;
    }

    $setTimeLine(value) {
        if (this._timeLine) {
            this._timeLine.removeTween(this);
        }
        this._timeLine = value;
    }

    pugins = [];

    initParmas() {
        var controller;
        var params = this._propertiesTo;
        var allPlugins = flower.Tween.plugins;
        if (params) {
            var keys = flower.ObjectDo.keys(allPlugins);
            var deletes = [];
            for (var i = 0, len = keys.length; i < len; i++) {
                if (keys[i] in params) {
                    var plugin = allPlugins[keys[i]];
                    controller = new plugin();
                    deletes = deletes.concat(controller.init(this, params, this._propertiesFrom));
                    this.pugins.push(controller);
                }
            }
            for (i = 0; i < deletes.length; i++) {
                delete params[deletes[i]];
            }
            keys = flower.ObjectDo.keys(params);
            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!(typeof(key) == "string")) {
                    delete params[key];
                    keys.splice(i, 1);
                    i--;
                    continue;
                }
                var attribute = params[key];
                if (!(typeof(attribute) == "number") || !(key in this._target)) {
                    delete params[key];
                    keys.splice(i, 1);
                    i--;
                    continue;
                }
            }
            if (keys.length) {
                controller = new flower.BasicPlugin();
                controller.init(this, params, this._propertiesFrom);
                this.pugins.push(controller);
            }
        }
        this.invalidProperty = true;
    }

    invalidate() {
        this.invalidProperty = false;
    }

    _complete;
    _completeThis;
    _completeParams;

    call(callBack, thisObj = null, ...args) {
        this._complete = callBack;
        this._completeThis = thisObj;
        this._completeParams = args;
        return this;
    }

    _update;
    _updateThis;
    _updateParams;

    update(callBack, thisObj = null, ...args) {
        this._update = callBack;
        this._updateThis = thisObj;
        this._updateParams = args;
        return this;
    }

    $update(time) {
        if (!this.invalidProperty) {
            this.initParmas();
        }
        this._currentTime = time - this.$startTime;
        if (this._currentTime > this.$time) {
            this._currentTime = this.$time;
        }
        var length = this.pugins.length;
        var s = this._easeData[2000 * (this._currentTime / this.$time) | 0];
        for (var i = 0; i < length; i++) {
            this.pugins[i].update(s);
        }
        if (this._update != null) {
            this._update.apply(this._updateThis, this._updateParams);
        }
        if (this._currentTime == this.$time) {
            if (this._complete != null) {
                this._complete.apply(this._completeThis, this._completeParams);
            }
        }
        return true;
    }

    dispose() {
        if (this.timeLine) {
            this.timeLine.removeTween(this);
        }
    }

    static to(target, time, propertiesTo, ease = "None", propertiesFrom = null) {
        var tween = new flower.Tween(target, time, propertiesTo, ease, propertiesFrom);
        tween.timeLine.play();
        return tween;
    }

    static plugins;
    static easeCache = {};

    static registerPlugin(paramName, plugin) {
        if (flower.Tween.plugins == null) {
            flower.Tween.plugins = {};
        }
        flower.Tween.plugins[paramName] = plugin;
    }

    static hasPlugin(paramName) {
        return flower.Tween.plugins[paramName] ? true : false;
    }

}

flower.Tween = Tween;
//////////////////////////End File:flower/tween/Tween.js///////////////////////////



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

    static remove(call, owner) {
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

flower.EnterFrame = EnterFrame;
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

flower.CallLater = CallLater;
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
                str += before + " " + flower.ObjectDo.toString(obj[i], maxDepth, before + " ", depth + 1) + (i < obj.length - 1 ? ",\n" : "\n");
            }
            str += before + "]";
        }
        else if (obj instanceof Object) {
            if (depth > maxDepth) {
                return "...";
            }
            str = "{\n";
            for (var key in obj) {
                str += before + " \"" + key + "\": " + flower.ObjectDo.toString(obj[key], maxDepth, before + " ", depth + 1);
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

flower.ObjectDo = ObjectDo;
//////////////////////////End File:flower/utils/ObjectDo.js///////////////////////////



//////////////////////////File:flower/utils/StringDo.js///////////////////////////
class StringDo {

    static isNumberString(str) {
        var hasDot = false;
        for (var i = 0; i < str.length; i++) {
            if (i == 0 && str.charAt(0) == "+" || str.charAt(0) == "-") {

            } else {
                if (str.charAt(i) == ".") {
                    if (hasDot) {
                        return false;
                    }
                    hasDot = true;
                } else {
                    var code = str.charCodeAt(i);
                    if (code < 48 || code > 57) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

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

    static findStrings(content, findStrings, begin) {
        begin = begin || 0;
        for (var i = begin; i < content.length; i++) {
            for (var j = 0; j < findStrings.length; j++) {
                if (content.slice(i, i + findStrings[j].length) == findStrings[j]) {
                    return i;
                }
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

    static findId(str, pos) {
        if (str.length <= pos) {
            return "";
        }
        var id = "";
        var code;
        for (var j = pos, len = str.length; j < len; j++) {
            code = str.charCodeAt(j);
            if (code >= 65 && code <= 90 || code >= 97 && code <= 122 || code == 36 || code == 95 || j != pos && code >= 48 && code <= 57) {
                id += str.charAt(j);
            } else {
                break;
            }
        }
        return id;
    }

    /**
     * 分析函数体
     * @param str
     * @param pos
     */
    static findFunctionContent(str, pos) {
        if (str.length <= pos) {
            return "";
        }
        //跳过程序空白
        pos = StringDo.jumpProgramSpace(str, pos);
        if (str.charAt(pos) != "{") {
            return "";
        }
        var end = pos + 1;
        var startPos;
        var endPos;
        var count = 0;
        while (true) {
            var startPos = StringDo.findString(str, "{", end);
            var endPos = StringDo.findString(str, "}", end);
            if (startPos != -1 && endPos != -1) {
                if (startPos < endPos) {
                    count++;
                    end = startPos + 1;
                } else {
                    count--;
                    end = endPos + 1;
                    if (count < 0) {
                        break;
                    }
                }
            } else if (startPos != -1) {
                return "";
            } else if (endPos != -1) {
                end = endPos + 1;
                count--;
                if (count < 0) {
                    break;
                }
            } else {
                return "";
            }
        }
        return str.slice(pos, end);
    }

    /**
     * 删除程序注释
     * @param str
     * @param pos
     */
    static deleteProgramNote(str, pos) {
        var end;
        for (var len = str.length; pos < len; pos++) {
            if (str.slice(pos, pos + 2) == "//") {
                end = StringDo.findStrings(str, ["\r", "\n"], pos);
                str = str.slice(0, pos) + str.slice(end, str.length);
                len = str.length;
                pos--;
            } else if (str.slice(pos, pos + 2) == "/*") {
                end = StringDo.findString(str, "*/", pos);
                if (end == -1) {
                    return len;
                }
                end += 2;
                while (true) {
                    var nextStart = StringDo.findString(str, "/*", end);
                    if (nextStart == -1) {
                        nextStart = len;
                    }
                    var nextEnd = StringDo.findString(str, "*/", end);
                    if (nextEnd == -1 || nextEnd > nextStart) {
                        break;
                    }
                    end = nextEnd + 2;
                }
                str = str.slice(0, pos) + str.slice(end, str.length);
                len = str.length;
            }
        }
        return str;
    }

    /**
     * 跳过程序空格，包含 " ","\t","\r","\n"
     * @param str
     * @param pos
     */
    static jumpProgramSpace(str, pos) {
        for (var len = str.length; pos < len; pos++) {
            var char = str.charAt(pos);
            if (char == " " || char == "　" || char == "\t" || char == "\r" || char == "\n") {
            } else {
                break;
            }
        }
        return pos;
    }

    static numberToString(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 0) arr[i] += 256;
        }
        var res = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == 0)break;
            if ((arr[i] & 128) == 0) res.push(arr[i]);				//1位
            else if ((arr[i] & 64) == 0) res.push(arr[i] % 128);		//1位
            else if ((arr[i] & 32) == 0)	//2位
            {
                res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                i++;
            }
            else if ((arr[i] & 16) == 0)	//3位
            {
                res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
            }
            else if ((arr[i] & 8) == 0)	//4位
            {
                res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
                i++;
            }
        }
        var str = "";
        for (i = 0; i < res.length; i++) {
            str += String.fromCharCode(res[i]);
        }
        return str;
    }

    static stringToBytes(str) {
        var res = [];
        var num;
        for (var i = 0; i < str.length; i++) {
            num = str.charCodeAt(i);
            if (num < 128) {
                res.push(num);
            }
            else if (num < 2048) {
                res.push(math.floor(num / 64) + 128 + 64);
                res.push((num % 64) + 128);
            }
            else if (num < 65536) {
                res.push(math.floor(num / 4096) + 128 + 64 + 32);
                res.push(math.floor((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
            else {
                res.push(math.floor(num / 262144) + 128 + 64 + 32 + 16);
                res.push(math.floor((num % 262144) / 4096) + 128);
                res.push(math.floor((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
        }
        return res;
    }

    /**
     * 如果不是数字则返回 null
     * @param value 字符串
     */
    static parseNumber(value) {
        if (typeof value == "number") {
            return value;
        }
        if (typeof value != "string") {
            return null;
        }
        var code0 = "0".charCodeAt(0);
        var code9 = "9".charCodeAt(0);
        var codeP = ".".charCodeAt(0);
        var isNumber;
        var hasPoint = false;
        var before = "";
        var end = "";
        var code;
        var flag = true;
        for (var p = 0; p < value.length; p++) {
            code = value.charCodeAt(p);
            if (hasPoint) {
                if (code >= code0 && code <= code9) {
                    end += value.charAt(p);
                } else {
                    flag = false;
                    break;
                }
            } else {
                if (code == codeP) {
                    hasPoint = true;
                } else if (code >= code0 && code <= code9) {
                    before += value.charAt(p);
                } else {
                    flag = false;
                    break;
                }
            }
        }
        if (flag) {
            return parseInt(before) + (end != "" ? parseInt(end) / (Math.pow(10, end.length)) : 0);
        }
        return null;
    }
}

flower.StringDo = StringDo;
//////////////////////////End File:flower/utils/StringDo.js///////////////////////////



//////////////////////////File:flower/utils/VByteArray.js///////////////////////////
class VByteArray {
    bytes;
    big;
    _position;
    length;

    constructor(big = true) {
        this.bytes = [];
        this.big = big;
        this.position = 0;
        this.length = 0;
    }

    readFromArray(bytes) {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        this.bytes = bytes;
        this.length = this.bytes.length;
    }

    writeInt(val) {
        val = +val & ~0;
        if (val >= 0) {
            val *= 2;
        }
        else {
            val = ~val;
            val *= 2;
            val++;
        }
        this.writeUInt(val);
    }

    writeUInt(val) {
        val = val < 0 ? 0 : val;
        val = +val & ~0;
        var flag = false;
        val = val < 0 ? -val : val;
        var val2 = 0;
        if (val >= 0x10000000) {
            val2 = val / 0x10000000;
            val = val & 0xFFFFFFF;
            flag = true;
        }
        if (flag || val >> 7) {
            this.bytes.splice(this.position, 0, 0x80 | val & 0x7F);
            this.position++;
            this.length++;
        }
        else {
            this.bytes.splice(this.position, 0, val & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 14) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 7) {
            this.bytes.splice(this.position, 0, (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 21) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 14) {
            this.bytes.splice(this.position, 0, (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 28) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 21) {
            this.bytes.splice(this.position, 0, (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag) {
            this.writeUInt(math.floor(val2));
        }
    }

    get position() {
        return this._position;
    }

    set position(val) {
        this._position = val;
    }

    writeByte(val) {
        val = +val & ~0;
        this.bytes.splice(this.position, 0, val);
        this.length += 1;
        this.position += 1;
    }

    writeBoolean(val) {
        val = !!val;
        this.bytes.splice(this.position, 0, val == true ? 1 : 0);
        this.length += 1;
        this.position += 1;
    }

    writeUTF(val) {
        val = "" + val;
        var arr = StringDo.stringToBytes(val);
        this.writeUInt(arr.length);
        for (var i = 0; i < arr.length; i++) {
            this.bytes.splice(this.position, 0, arr[i]);
            this.position++;
        }
        this.length += arr.length;
    }

    writeUTFBytes(val, len) {
        val = "" + val;
        var arr = StringDo.stringToBytes(val);
        for (var i = 0; i < len; i++) {
            if (i < arr.length)
                this.bytes.splice(this.position, 0, arr[i]);
            else
                this.bytes.splice(this.position, 0, 0);
            this.position++;
        }
        this.length += len;
    }

    writeBytes(b, start = null, len = null) {
        start = +start & ~0;
        len = +len & ~0;
        var copy = b.data;
        for (var i = start; i < copy.length && i < start + len; i++) {
            this.bytes.splice(this.position, 0, copy[i]);
            this.position++;
        }
        this.length += len;
    }

    writeByteArray(byteArray) {
        this.bytes = this.bytes.concat(byteArray);
        this.length += byteArray.length;
    }

    readBoolean() {
        var val = this.bytes[this.position] == 0 ? false : true;
        this.position += 1;
        return val;
    }

    readInt() {
        var val = this.readUInt();
        if (val % 2 == 1) {
            val = math.floor(val / 2);
            val = ~val;
        }
        else {
            val = math.floor(val / 2);
        }
        return val;
    }

    readUInt() {
        var val = 0;
        val += this.bytes[this.position] & 0x7F;
        if (this.bytes[this.position] >> 7) {
            this.position++;
            val += (this.bytes[this.position] & 0x7F) << 7;
            if (this.bytes[this.position] >> 7) {
                this.position++;
                val += (this.bytes[this.position] & 0x7F) << 14;
                if (this.bytes[this.position] >> 7) {
                    this.position++;
                    val += (this.bytes[this.position] & 0x7F) << 21;
                    if (this.bytes[this.position] >> 7) {
                        this.position++;
                        val += ((this.bytes[this.position] & 0x7F) << 24) * 16;
                        if (this.bytes[this.position] >> 7) {
                            this.position++;
                            val += ((this.bytes[this.position] & 0x7F) << 24) * 0x800;
                            if (this.bytes[this.position] >> 7) {
                                this.position++;
                                val += (this.bytes[this.position] << 24) * 0x40000;
                            }
                        }
                    }
                }
            }
        }
        this.position++;
        return val;
    }

    readByte() {
        var val = this.bytes[this.position];
        this.position += 1;
        return val;
    }

    readShort() {
        var val;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8;
        }
        else {
            val = bytes[this.position] << 8 | bytes[this.position + 1];
        }
        if (val > (1 << 15))
            val = val - (1 << 16);
        this.position += 2;
        return val;
    }

    readUTF() {
        var len = this.readUInt();
        var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    }

    readUTFBytes(len) {
        len = +len & ~0;
        var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    }

    get bytesAvailable() {
        return this.length - this.position;
    }

    get data() {
        return this.bytes;
    }

    toString() {
        var str = "";
        for (var i = 0; i < this.bytes.length; i++) {
            str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
        }
        return str;
    }
}

flower.VByteArray = VByteArray;
//////////////////////////End File:flower/utils/VByteArray.js///////////////////////////



//////////////////////////File:flower/utils/Path.js///////////////////////////
class Path {
    static getFileType(url) {
        var end = url.split("?")[0];
        end = end.split("/")[end.split("/").length - 1];
        if (end.split(".").length == 1) {
            return "";
        }
        return end.split(".")[end.split(".").length - 1];
    }

    static getPathDirection(url) {
        var arr = url.split("/");
        if (arr.length == 1) {
            return "";
        }
        return url.slice(0, url.length - arr[arr.length - 1].length);
    }

    static getName(url) {
        var arr = url.split("/");
        return arr[arr.length - 1];
    }

    static isPeerDirection(url1, url2) {
        var arr1 = url1.split("/");
        var arr2 = url2.split("/");
        if (arr1.length != arr2.length) {
            return false;
        }
        for (var i = 0; i < arr1.length - 1; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }

    static joinPath(path1, path2) {
        var path = path1;
        if (path.charAt(path.length - 1) != "/") {
            path += "/";
        }
        if (path2.charAt(0) == "/") {
            path2 = path2.slice(1, path2.length);
        }
        while ((path2.slice(0, 2) == "./" || path2.slice(0, 3) == "../") && path != "") {
            if(path2.slice(0, 2) == "./") {
                path2 = path2.slice(2, path2.length);
            } else {
                path2 = path2.slice(3, path2.length);
            }
            for (var i = path.length - 2; i >= 0; i--) {
                if (path.charAt(i) == "/") {
                    path = path.slice(0, i + 1);
                    break;
                } else if (i == 0) {
                    path = "";
                }
            }
        }
        path += path2;
        return path;
    }
}

flower.Path = Path;
//////////////////////////End File:flower/utils/Path.js///////////////////////////



//////////////////////////File:flower/utils/XMLAttribute.js///////////////////////////
class XMLAttribute {
    name = "";
    value = "";

    constructor()
    {
    }

}

flower.XMLAttribute = XMLAttribute;
//////////////////////////End File:flower/utils/XMLAttribute.js///////////////////////////



//////////////////////////File:flower/utils/XMLElement.js///////////////////////////
class XMLElement extends XMLAttribute {
    namespaces;
    attributes;
    list;
    elements;
    value;

    constructor() {
        super();
        this.namespaces = [];
        this.attributes = [];
        this.elements = this.list = [];
    }

    addNameSpace(nameSpace) {
        this.namespaces.push(nameSpace);
    }

    getAttribute(name) {
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name == name) {
                return this.attributes[i];
            }
        }
        return null;
    }

    getNameSapce(name) {
        for (var i = 0; i < this.namespaces.length; i++) {
            if (this.namespaces[i].name == name) {
                return this.namespaces[i];
            }
        }
        return null;
    }

    getElementByAttribute(atrName, value) {
        for (var i = 0; i < this.list.length; i++) {
            for (var a = 0; a < this.list[i].attributes.length; a++) {
                if (this.list[i].attributes[a].name == atrName && this.list[i].attributes[a].value == value) {
                    return this.list[i];
                }
            }
        }
        return null;
    }

    getElement(name) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].name == name) {
                return this.list[i];
            }
        }
        return null;
    }

    getElements(atrName) {
        var res = [];
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].name == atrName) {
                res.push(this.list[i]);
            }
        }
        return res;
    }

    getAllElements() {
        var res = [this];
        for (var i = 0; i < this.list.length; i++) {
            res = res.concat(this.list[i].getAllElements());
        }
        return res;
    }

    parse(content) {
        var delStart = -1;
        for (var i = 0; i < content.length; i++) {
            //if (content.charAt(i) == "\r" || content.charAt(i) == "\n") {
            //    content = content.slice(0, i) + content.slice(i + 1, content.length);
            //    i--;
            //}
            if (delStart == -1 && (content.slice(i, i + 2) == "<!" || content.slice(i, i + 2) == "<?")) {
                delStart = i;
            }
            if (delStart != -1 && content.charAt(i) == ">") {
                content = content.slice(0, delStart) + content.slice(i + 1, content.length);
                i = i - (i - delStart + 1);
                delStart = -1;
            }
        }
        this.readInfo(content);
    }

    __isStringEmpty(str) {
        for(var i = 0,len = str.length; i < len; i++) {
            var char = str.charAt(i);
            if(char != " " && char != "\t" && char != "\r" && char != "\n" && char != "　") {
                return false;
            }
        }
        return true;
    }

    readInfo(content, startIndex = 0) {
        var leftSign = -1;
        var len = content.length;
        var c;
        var j;
        for (var i = startIndex; i < len; i++) {
            c = content.charAt(i);
            if (c == "<") {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c != " " && c != "\t") {
                        i = j;
                        break;
                    }
                }
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c == " " || c == "\t" || c == "\r" || c == "\n" || c == "/" || c == ">") {
                        this.name = content.slice(i, j);
                        i = j;
                        break;
                    }
                }
                break;
            }
        }
        var end = false;
        var attribute;
        var nameSpace;
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c == "/") {
                end = true;
            }
            else if (c == ">") {
                i++;
                break;
            }
            else if (c == " " || c == "\t" || c == "\r" || c == "\n" || c=="　") {
            }
            else {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c == "=" || c == " " || c == "\t") {
                        var atrName = content.slice(i, j);
                        if (atrName.split(":").length == 2) {
                            nameSpace = new XMLNameSpace();
                            this.namespaces.push(nameSpace);
                            nameSpace.name = atrName.split(":")[1];
                        }
                        else {
                            attribute = new XMLAttribute();
                            this.attributes.push(attribute);
                            attribute.name = atrName;
                        }
                        break;
                    }
                }
                j++;
                var startSign;
                for (; j < len; j++) {
                    c = content.charAt(j);
                    if (c == "\"" || c == "'") {
                        i = j + 1;
                        startSign = c;
                        break;
                    }
                }
                j++;
                for (; j < len; j++) {
                    c = content.charAt(j);
                    if (c == startSign && content.charAt(j - 1) != "\\") {
                        if (attribute) {
                            attribute.value = content.slice(i, j);
                            attribute = null;
                        }
                        else {
                            nameSpace.value = content.slice(i, j);
                            nameSpace = null;
                        }
                        i = j;
                        break;
                    }
                }
            }
        }
        if (end == true)
            return i;
        var contentStart;
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c != " " && c != "\t") {
                contentStart = i;
                i--;
                break;
            }
        }
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c == "<") {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c != " " && c != "\t") {
                        break;
                    }
                }
                if (c == "/") {
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c == " " || c == "\t" || c == ">") {
                            var endName = content.slice(i + 2, j);
                            if (endName != this.name) {
                                $error(1020, this.name, endName);
                            }
                            break;
                        }
                    }
                    if (this.list.length == 0) {
                        i--;
                        for (; i >= 0; i--) {
                            c = content.charAt(i);
                            if (c != " " && c != "\t") {
                                break;
                            }
                        }
                        this.value = content.slice(contentStart, i + 1);
                        if (this.value == "" || this.__isStringEmpty(this.value)) {
                            this.value = null;
                        }
                    }
                    for (; j < len; j++) {
                        c = content.charAt(j);
                        if (c == ">") {
                            i = j + 1;
                            break;
                        }
                    }
                    end = true;
                    break;
                }
                else { //视图找 <abcsklsklskl />a
                    var isNextElement = true;
                    for (var n = i + 1; n < len; n++) {
                        c = content.charAt(n);
                        if (c != " " && c != "\t") {
                            break;
                        }
                    }
                    for (; n < len; n++) {
                        c = content.charCodeAt(n);
                        if (c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58) {
                            continue;
                        } else {
                            break;
                        }
                    }
                    for (; n < len; n++) {
                        c = content.charAt(n);
                        if (c != " " && c != "\t") {
                            break;
                        }
                    }
                    var c = content.charCodeAt(n);
                    if (c == 47 || c == 62 || c >= 97 && c <= 122 || c >= 65 && c <= 90) {

                    } else {
                        isNextElement = false;
                    }
                    if (isNextElement) {
                        var element = new XMLElement();
                        this.list.push(element);
                        i = element.readInfo(content, i) - 1;
                    }
                }
            }
        }
        return i;
    }

    static parse(content) {
        var xml = new XMLElement();
        xml.parse(content);
        return xml;
    }

}
flower.XMLElement = XMLElement;
//////////////////////////End File:flower/utils/XMLElement.js///////////////////////////



//////////////////////////File:flower/utils/XMLNameSpace.js///////////////////////////
class XMLNameSpace {
    name = "";
    value = "";

    constructor()
    {
    }

}

flower.XMLNameSpace = XMLNameSpace;
//////////////////////////End File:flower/utils/XMLNameSpace.js///////////////////////////



//////////////////////////File:flower/utils/Math.js///////////////////////////
class Math {

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToHMS(time) {
        var hour = math.floor(time / (1000 * 3600));
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
    }

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToMSM(time) {
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        var ms = math.floor((time % 1000) / 10);
        return (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) + ":" + (ms < 10 ? "0" + ms : ms);
    }
}

flower.Math = Math;
//////////////////////////End File:flower/utils/Math.js///////////////////////////



})(Math);
var trace = flower.trace;
