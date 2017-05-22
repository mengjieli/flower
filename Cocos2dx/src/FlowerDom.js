"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalWebSocket = WebSocket;
var $root = eval("this");
var root = root || eval("this");
var __define = $root.__define || function (o, p, g, s) {
    Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s });
};

function __extends(d, b) {
    if (b == null) {
        console.log("bug !!", arguments.callee.caller);
    }
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
}
var flower = {};
(function (math) {
    //////////////////////////File:flower/Flower.js///////////////////////////
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
            flower.sys.TIP = params.TIP;
        }
        if (params.DEBUG) {
            DEBUG = params.DEBUG;
            flower.sys.DEBUG = params.DEBUG;
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
                                if (completeFunc) completeFunc();
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

    function $error(errorCode) {
        var msg;
        if (typeof errorCode == "string") {
            msg = errorCode;
        } else {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            msg = getLanguage.apply(null, [errorCode].concat(args));
        }
        console.log(msg);
        throw msg;
    }

    function $warn(errorCode) {
        var msg;
        if (typeof errorCode == "string") {
            msg = errorCode;
        } else {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            msg = getLanguage.apply(null, [errorCode].concat(args));
        }
        console.log("[警告] " + msg);
    }

    function $tip(errorCode) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
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
    };
    flower.params = params;
    flower.system = {};
    flower.dispose = dispose;
    flower.addStartBack = addStartBack;
    $root.trace = trace;
    //////////////////////////End File:flower/Flower.js///////////////////////////

    //////////////////////////File:flower/platform/dom/Platform.js///////////////////////////

    var Platform = function () {
        function Platform() {
            _classCallCheck(this, Platform);
        }

        _createClass(Platform, null, [{
            key: "start",
            value: function start(engine, root, background) {
                flower.system.platform = Platform.type;
                flower.system.native = Platform.native;
                var paramString = window.location.search;
                while (paramString.charAt(0) == "?") {
                    paramString = paramString.slice(1, paramString.length);
                }
                Platform.engine = engine;
                var params = {};
                var array = paramString.split("&");
                for (var i = 0; i < array.length; i++) {
                    var paramArray = array[i].split("=");
                    var key = paramArray[0];
                    if (paramArray.length > 1) {
                        params[key] = array[i].slice(key.length + 1, array[i].length);
                    } else {
                        params[key] = null;
                    }
                }
                for (var key in params) {
                    flower.params[key] = params[key];
                }
                RETINA = false;
                Platform.native = false; //cc.sys.isNative;
                var div = document.getElementById("FlowerMain");
                var mask = document.createElement("div");
                mask.style.position = "absolute";
                mask.style.left = "0px";
                mask.style.top = "0px";
                mask.style.width = document.documentElement.clientWidth + "px";
                mask.style.height = document.documentElement.clientHeight + "px";
                document.body.appendChild(mask);
                document.body.onkeydown = function (e) {
                    if (e.keyCode == 9) {
                        e.preventDefault();
                    }
                    setTimeout(function () {
                        engine.$onKeyDown(e.which);
                    }, 0);
                };
                document.body.onkeyup = function (e) {
                    setTimeout(function () {
                        engine.$onKeyUp(e.which);
                    }, 0);
                };
                div.appendChild(engine.$background.$nativeShow.show);
                div.appendChild(root.show);
                requestAnimationFrame.call(window, Platform._run);
                var touchDown = false;
                mask.onmousedown = function (e) {
                    if (e.button == 2) return;
                    touchDown = true;
                    Platform.touchDown = true;
                    engine.$addTouchEvent("begin", 0, math.floor(e.clientX), math.floor(e.clientY));
                };
                mask.onmouseup = function (e) {
                    if (e.button == 2) return;
                    touchDown = false;
                    Platform.touchDown = false;
                    engine.$addTouchEvent("end", 0, math.floor(e.clientX), math.floor(e.clientY));
                };
                mask.onmousemove = function (e) {
                    if (e.button == 2) return;
                    if (e.buttons == 0 && touchDown) {
                        touchDown = false;
                        Platform.touchDown = false;
                        engine.$addTouchEvent("end", 0, math.floor(e.clientX), math.floor(e.clientY));
                    }
                    Platform.mouseX = math.floor(e.clientX);
                    Platform.mouseY = math.floor(e.clientY);
                    engine.$addMouseMoveEvent(math.floor(e.clientX), math.floor(e.clientY));
                    if (touchDown) {
                        engine.$addTouchEvent("move", 0, math.floor(e.clientX), math.floor(e.clientY));
                    }
                };
                document.body.oncontextmenu = function (e) {
                    engine.$addRightClickEvent(math.floor(e.clientX), math.floor(e.clientY));
                    return false;
                };
                Platform.width = document.documentElement.clientWidth;
                Platform.height = document.documentElement.clientHeight;
                engine.$resize(Platform.width, Platform.height);
            }
        }, {
            key: "_run",
            value: function _run() {
                Platform.frame++;
                var now = new Date().getTime();
                Platform._runBack(now - Platform.lastTime);
                Platform.lastTime = now;
                if (PlatformURLLoader.loadingList.length) {
                    var item = PlatformURLLoader.loadingList.shift();
                    item[0].apply(null, item.slice(1, item.length));
                }
                Platform.engine.$addMouseMoveEvent(Platform.mouseX, Platform.mouseY);
                if (Platform.touchDown) {
                    Platform.engine.$addTouchEvent("move", 0, Platform.mouseX, Platform.mouseY);
                }
                requestAnimationFrame.call(window, Platform._run);
            }
        }, {
            key: "create",
            value: function create(name) {
                var pools = Platform.pools;
                if (name == "Sprite") {
                    return new PlatformSprite();
                }
                if (name == "Bitmap") {
                    return new PlatformBitmap();
                }
                if (name == "TextField") {
                    return new PlatformTextField();
                }
                if (name == "TextInput") {
                    return new PlatformTextInput();
                }
                if (name == "TextArea") {
                    return new PlatformTextArea();
                }
                if (name == "Shape") {
                    return new PlatformShape();
                }
                if (name == "Mask") {
                    return new PlatformMask();
                }
                return null;
            }
        }, {
            key: "release",
            value: function release(name, object) {
                object.release();
                return;
                var pools = Platform.pools;
                if (!pools[name]) {
                    pools[name] = [];
                }
                pools[name].push(object);
            }
        }, {
            key: "getShortcut",
            value: function getShortcut() {
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
        }]);

        return Platform;
    }();
    //////////////////////////End File:flower/platform/dom/Platform.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformDisplayObject.js///////////////////////////


    Platform.type = "cocos2dx";
    Platform.native = false;
    Platform.touchDown = false;
    Platform.lastTime = new Date().getTime();
    Platform.frame = 0;
    Platform.pools = {};

    var PlatformDisplayObject = function () {
        function PlatformDisplayObject() {
            _classCallCheck(this, PlatformDisplayObject);

            this.__x = 0;
            this.__y = 0;
            this.__scaleX = 1;
            this.__scaleY = 1;
            this.__rotation = 0;
            this.__width = 0;
            this.__height = 0;
            this.__programmer = null;
            this.__filters = null;
            this.__programmerFlag = 0;
        }

        /**
         * 0x0001 scale9Grid
         * 0x0002 filters
         * @type {number}
         * @private
         */


        _createClass(PlatformDisplayObject, [{
            key: "setX",
            value: function setX(val) {
                this.__x = val;
                this.show.style.left = val + "px";
            }
        }, {
            key: "setY",
            value: function setY(val) {
                this.__y = val;
                this.show.style.top = val + "px";
            }
        }, {
            key: "setVisible",
            value: function setVisible(val) {
                if (val) {
                    this.show.style.display = "";
                } else {
                    this.show.style.display = "none";
                }
            }
        }, {
            key: "setWidth",
            value: function setWidth(val) {
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
        }, {
            key: "setHeight",
            value: function setHeight(val) {
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
        }, {
            key: "setScaleX",
            value: function setScaleX(val) {
                this.__scaleX = val;

                //transform:rotate(7deg);
                //-ms-transform:rotate(7deg); 	/* IE 9 */
                //-moz-transform:rotate(7deg); 	/* Firefox */
                //-webkit-transform:rotate(7deg); /* Safari 和 Chrome */
                //-o-transform:rotate(7deg); 	/* Opera */
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.__scaleX + "," + this.__scaleY + ")";
            }
        }, {
            key: "setScaleY",
            value: function setScaleY(val) {
                this.__scaleY = val;
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.__scaleX + "," + this.__scaleY + ")";
            }
        }, {
            key: "setRotation",
            value: function setRotation(val) {
                this.__rotation = val;
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.__scaleX + "," + this.__scaleY + ")";
            }
        }, {
            key: "setAlpha",
            value: function setAlpha(val) {
                this.show.style.opacity = val;
                //this.show.setOpacity(val * 255);
            }
        }, {
            key: "addProgrammerFlag",
            value: function addProgrammerFlag(flag) {
                this.__programmerFlag |= flag;
                this.programmerFlagChange(this.__programmerFlag);
            }
        }, {
            key: "removeProgrammerFlag",
            value: function removeProgrammerFlag(flag) {
                this.__programmerFlag &= ~flag;
                this.programmerFlagChange(this.__programmerFlag);
            }
        }, {
            key: "programmerFlagChange",
            value: function programmerFlagChange(flag) {
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
        }, {
            key: "setFilters",
            value: function setFilters(filters) {
                return;
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
        }, {
            key: "setBigFilters",
            value: function setBigFilters(filters) {
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
        }, {
            key: "release",
            value: function release() {
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
        }]);

        return PlatformDisplayObject;
    }();
    //////////////////////////End File:flower/platform/dom/PlatformDisplayObject.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformSprite.js///////////////////////////


    var PlatformSprite = function (_PlatformDisplayObjec) {
        _inherits(PlatformSprite, _PlatformDisplayObjec);

        function PlatformSprite() {
            _classCallCheck(this, PlatformSprite);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformSprite).call(this));

            _this.__children = [];

            _this.initShow();
            return _this;
        }

        _createClass(PlatformSprite, [{
            key: "initShow",
            value: function initShow() {
                //this.show = new cc.Node();
                //this.show.setAnchorPoint(0, 0);
                //this.show.retain();
                var div = document.createElement("div");
                div.style.position = "absolute";
                div.style.left = "0px";
                div.style.top = "0px";
                div.style.width = "auto";
                div.style.height = "auto";
                div.style["transform-origin"] = "left top";
                this.show = div;
            }
        }, {
            key: "addChild",
            value: function addChild(child) {
                this.show.appendChild(child.show);
                this.__children.push(child.show);
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                this.show.removeChild(child.show);
                for (var i = 0; i < this.__children.length; i++) {
                    if (this.__children[i] == child.show) {
                        this.__children.splice(i, 1);
                        break;
                    }
                }
            }
        }, {
            key: "setAlpha",
            value: function setAlpha(val) {}
        }, {
            key: "resetChildIndex",
            value: function resetChildIndex(children) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var show = children[i].$nativeShow.show;
                    if (this.__children[i] != show) {
                        this.removeChild(children[i].$nativeShow);
                        this.show.insertBefore(show, this.__children[i]);
                        this.__children.splice(i, 0, show);
                    }
                }
            }
        }, {
            key: "setFilters",
            value: function setFilters(filters) {}
        }]);

        return PlatformSprite;
    }(PlatformDisplayObject);
    //////////////////////////End File:flower/platform/dom/PlatformSprite.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformTextField.js///////////////////////////


    var PlatformTextField = function (_PlatformDisplayObjec2) {
        _inherits(PlatformTextField, _PlatformDisplayObjec2);

        function PlatformTextField() {
            _classCallCheck(this, PlatformTextField);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformTextField).call(this));

            var em = document.createElement("div");
            em.style.position = "absolute";
            em.style.left = "0px";
            em.style.top = "0px";
            em.style["font-style"] = "normal";
            //em.style["vertical-align"] = "text-bottom";
            em.style["transform-origin"] = "left top";
            _this2.show = em;
            return _this2;
        }

        _createClass(PlatformTextField, [{
            key: "setFontColor",
            value: function setFontColor(color) {
                this.show.style.color = '#' + this.toColor16(color >> 16) + this.toColor16(color >> 8 & 0xFF) + this.toColor16(color & 0xFF);
            }
        }, {
            key: "changeText",
            value: function changeText(text, width, height, size, wordWrap, multiline, autoSize) {
                text = flower.StringDo.replaceString(text, "\n", "</br>");
                text = flower.StringDo.replaceString(text, "\r", "</br>");
                text = flower.StringDo.replaceString(text, " ", "&nbsp;");
                text = flower.StringDo.replaceString(text, "<", "&lt;");
                text = flower.StringDo.replaceString(text, ">", "&gt;");
                var $mesureTxt = PlatformTextField.$mesureTxt;
                $mesureTxt.style.fontSize = size + "px";
                var txt = this.show;
                txt.style.fontSize = size + "px";
                txt.text = "";
                var txtText = "";
                var start = 0;
                if (text == "") {
                    txt.innerHTML = "";
                }
                txt.innerHTML = text;
                //for (var i = 0; i < text.length; i++) {
                //    //取一行文字进行处理
                //    if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                //        var str = text.slice(start, i);
                //        $mesureTxt.innerHTML = str;
                //        var lineWidth = $mesureTxt.offsetWidth;
                //        var findEnd = i;
                //        var changeLine = false;
                //        //如果这一行的文字宽大于设定宽
                //        while (!autoSize && width && lineWidth > width) {
                //            changeLine = true;
                //            findEnd--;
                //            $mesureTxt.innerHTML = text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                //            lineWidth = $mesureTxt.offsetWidth;
                //        }
                //        if (wordWrap && changeLine) {
                //            i = findEnd;
                //            txt.innerHTML = (txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                //        } else {
                //            txt.innerHTML = (txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                //        }
                //        //如果文字的高度已经大于设定的高，回退一次
                //        if (!autoSize && height && txt.offsetHeight > height) {
                //            txt.innerHTML = (txtText);
                //            break;
                //        } else {
                //            txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                //            if (wordWrap && changeLine) {
                //                txtText += "\n";
                //            }
                //        }
                //        start = i;
                //        if (multiline == false) {
                //            break;
                //        }
                //    }
                //}

                $mesureTxt.innerHTML = txt.innerHTML;
                txt.style.width = $mesureTxt.offsetWidth + 4 + "px";
                return {
                    width: $mesureTxt.offsetWidth,
                    height: $mesureTxt.offsetHeight
                };
            }
        }, {
            key: "setFilters",
            value: function setFilters(filters) {}
        }, {
            key: "release",
            value: function release() {
                var show = this.show;
                show.innerHTML = "";
                show.style.fontSize = "12px";
                this.setFontColor(0);
                _get(Object.getPrototypeOf(PlatformTextField.prototype), "release", this).call(this);
            }
        }, {
            key: "toColor16",
            value: function toColor16(color) {
                var abc;
                var num = math.floor(color / 16);
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                var str = abc + "";
                num = color % 16;
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                str += abc;
                return str;
            }
        }], [{
            key: "measureTextWidth",
            value: function measureTextWidth(size, text) {
                text = flower.StringDo.replaceString(text, " ", "&nbsp;");
                text = flower.StringDo.replaceString(text, "<", "&lt;");
                text = flower.StringDo.replaceString(text, ">", "&gt;");
                var $mesureTxt = PlatformTextField.$mesureTxt;
                $mesureTxt.style.fontSize = size + "px";
                $mesureTxt.innerHTML = text;
                return $mesureTxt.offsetWidth;
            }
        }]);

        return PlatformTextField;
    }(PlatformDisplayObject);

    var measureTxt = document.createElement("span");
    measureTxt.style.visibility = "hidden";
    measureTxt.style.whiteSpace = "nowrap";
    document.body.appendChild(measureTxt);
    //measureTxt.style.width = "0px";
    PlatformTextField.$mesureTxt = measureTxt;
    //PlatformTextField.$mesureTxt.retain();

    flower.$measureTextWidth = PlatformTextField.measureTextWidth;
    //////////////////////////End File:flower/platform/dom/PlatformTextField.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformTextInput.js///////////////////////////

    var PlatformTextInput = function (_PlatformDisplayObjec3) {
        _inherits(PlatformTextInput, _PlatformDisplayObjec3);

        function PlatformTextInput() {
            _classCallCheck(this, PlatformTextInput);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformTextInput).call(this));

            _this3.__changeBack = null;
            _this3.__changeBackThis = null;

            var input = document.createElement("input");
            input.style.position = "absolute";
            input.style.left = "0px";
            input.style.top = "0px";
            input.style["background"] = "none";
            input.style["border"] = "none";
            input.style["font-style"] = "normal";
            input.style["transform-origin"] = "left top";
            input.style["vertical-align"] = "bottom";
            input.onpropertychange = function () {
                console.log(arguments);
            };
            _this3.show = input;
            return _this3;
        }

        _createClass(PlatformTextInput, [{
            key: "setFontColor",
            value: function setFontColor(color) {
                this.show.style.color = '#' + this.toColor16(color >> 16) + this.toColor16(color >> 8 & 0xFF) + this.toColor16(color & 0xFF);
            }
        }, {
            key: "setSize",
            value: function setSize(width, height) {
                var txt = this.show;
                txt.style.width = width + "px";
                //txt.style.height = height + "px";
            }
        }, {
            key: "setChangeBack",
            value: function setChangeBack(changeBack, thisObj) {
                this.__changeBack = changeBack;
                this.__changeBackThis = thisObj;
            }
        }, {
            key: "onTextFieldAttachWithIME",
            value: function onTextFieldAttachWithIME(sender) {
                console.log("start input");
            }
        }, {
            key: "onTextFieldDetachWithIME",
            value: function onTextFieldDetachWithIME(sender) {
                console.log("stop input");
            }
        }, {
            key: "onTextFieldInsertText",
            value: function onTextFieldInsertText(sender, text, len) {
                //console.log(text + " : " + len);
                if (this.__changeBack) {
                    this.__changeBack.call(this.__changeBackThis);
                }
            }
        }, {
            key: "onTextFieldDeleteBackward",
            value: function onTextFieldDeleteBackward() {}
        }, {
            key: "getNativeText",
            value: function getNativeText() {
                return this.show.value;
            }
        }, {
            key: "setNativeText",
            value: function setNativeText(val) {
                this.show.value = val;
            }
        }, {
            key: "changeText",
            value: function changeText(text, width, height, size, wordWrap, multiline, autoSize) {
                var $mesureTxt = PlatformTextField.$mesureTxt;
                $mesureTxt.style.fontSize = size + "px";
                var txt = this.show;
                txt.style.fontSize = size + "px";
                txt.value = text;
                //var txtText = "";
                //var start = 0;
                //if (text == "") {
                //    txt.value = "";
                //}
                //for (var i = 0; i < text.length; i++) {
                //    //取一行文字进行处理
                //    if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                //        var str = text.slice(start, i);
                //        $mesureTxt.innerHTML = str;
                //        var lineWidth = $mesureTxt.offsetWidth;
                //        var findEnd = i;
                //        var changeLine = false;
                //        //如果这一行的文字宽大于设定宽
                //        while (!autoSize && width && lineWidth > width) {
                //            changeLine = true;
                //            findEnd--;
                //            $mesureTxt.innerHTML = text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                //            lineWidth = $mesureTxt.offsetWidth;
                //        }
                //        if (wordWrap && changeLine) {
                //            i = findEnd;
                //            txt.value = (txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                //        } else {
                //            txt.value = (txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                //        }
                //        //如果文字的高度已经大于设定的高，回退一次
                //        if (!autoSize && height && txt.offsetHeight > height) {
                //            txt.value = (txtText);
                //            break;
                //        } else {
                //            txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                //            if (wordWrap && changeLine) {
                //                txtText += "\n";
                //            }
                //        }
                //        start = i;
                //        if (multiline == false) {
                //            break;
                //        }
                //    }
                //}
                txt.value = flower.StringDo.replaceString(txt.value, "\n", "</br>");
                txt.value = flower.StringDo.replaceString(txt.value, "\r", "</br>");
                $mesureTxt.innerHTML = txt.value;
                return {
                    width: $mesureTxt.offsetWidth,
                    height: $mesureTxt.offsetHeight
                };
            }
        }, {
            key: "setFilters",
            value: function setFilters(filters) {}
        }, {
            key: "startInput",
            value: function startInput() {
                this.show.focus();
                //this.show.attachWithIME();
            }
        }, {
            key: "stopInput",
            value: function stopInput() {
                //this.show.detachWithIME();
            }
        }, {
            key: "release",
            value: function release() {
                this.__changeBack = null;
                this.__changeBackThis = null;
                var show = this.show;
                show.innerHTML = "";
                show.style.fontSize = "12px";
                this.setFontColor(0);
                _get(Object.getPrototypeOf(PlatformTextInput.prototype), "release", this).call(this);
            }
        }, {
            key: "toColor16",
            value: function toColor16(color) {
                var abc;
                var num = math.floor(color / 16);
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                var str = abc + "";
                num = color % 16;
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                str += abc;
                return str;
            }
        }]);

        return PlatformTextInput;
    }(PlatformDisplayObject);

    //PlatformTextInput.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
    //PlatformTextInput.$mesureTxt.retain();
    //////////////////////////End File:flower/platform/dom/PlatformTextInput.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformTextArea.js///////////////////////////


    var PlatformTextArea = function (_PlatformDisplayObjec4) {
        _inherits(PlatformTextArea, _PlatformDisplayObjec4);

        function PlatformTextArea() {
            _classCallCheck(this, PlatformTextArea);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformTextArea).call(this));

            _this4.__changeBack = null;
            _this4.__changeBackThis = null;

            var input = document.createElement("textarea");
            input.style.position = "absolute";
            input.style.left = "0px";
            input.style.top = "0px";
            input.style["background"] = "none";
            input.style["border"] = "none";
            input.style["font-style"] = "normal";
            input.style["transform-origin"] = "left top";
            _this4.show = input;
            return _this4;
        }

        _createClass(PlatformTextArea, [{
            key: "setFontColor",
            value: function setFontColor(color) {
                this.show.style.color = '#' + this.toColor16(color >> 16) + this.toColor16(color >> 8 & 0xFF) + this.toColor16(color & 0xFF);
            }
        }, {
            key: "setSize",
            value: function setSize(width, height) {
                var txt = this.show;
                txt.style.width = width + "px";
                txt.style.height = height + "px";
            }
        }, {
            key: "setChangeBack",
            value: function setChangeBack(changeBack, thisObj) {
                this.__changeBack = changeBack;
                this.__changeBackThis = thisObj;
            }
        }, {
            key: "onTextFieldAttachWithIME",
            value: function onTextFieldAttachWithIME(sender) {
                console.log("start input");
            }
        }, {
            key: "onTextFieldDetachWithIME",
            value: function onTextFieldDetachWithIME(sender) {
                console.log("stop input");
            }
        }, {
            key: "onTextFieldInsertText",
            value: function onTextFieldInsertText(sender, text, len) {
                //console.log(text + " : " + len);
                if (this.__changeBack) {
                    this.__changeBack.call(this.__changeBackThis);
                }
            }
        }, {
            key: "onTextFieldDeleteBackward",
            value: function onTextFieldDeleteBackward() {}
        }, {
            key: "getNativeText",
            value: function getNativeText() {
                return this.show.value;
            }
        }, {
            key: "changeText",
            value: function changeText(text, width, height, size, wordWrap, multiline, autoSize) {
                var deleteMore = arguments.length <= 7 || arguments[7] === undefined ? false : arguments[7];

                var $mesureTxt = PlatformTextField.$mesureTxt;
                $mesureTxt.style.fontSize = size + "px";
                var txt = this.show;
                txt.style.fontSize = size + "px";
                txt.value = "";
                var txtText = "";
                var start = 0;
                if (text == "") {
                    txt.value = "";
                }
                var txtHeight = 0;
                var txtWidth = 0;
                for (var i = 0; i < text.length; i++) {
                    //取一行文字进行处理
                    if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                        var str = text.slice(start, i);
                        $mesureTxt.innerHTML = str;
                        var lineWidth = $mesureTxt.offsetWidth;
                        var findEnd = i;
                        var changeLine = false;
                        txtWidth = lineWidth > txtWidth ? lineWidth : txtWidth;
                        //如果这一行的文字宽大于设定宽
                        while (!autoSize && width && lineWidth > width) {
                            changeLine = true;
                            findEnd--;
                            $mesureTxt.innerHTML = text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                            lineWidth = $mesureTxt.offsetWidth;
                        }
                        if (wordWrap && changeLine) {
                            i = findEnd;
                            txt.value = txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                        } else {
                            txt.value = txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                        }
                        txtHeight += size + 3;
                        //如果文字的高度已经大于设定的高，回退一次
                        if (!autoSize && height && txtHeight > height && deleteMore) {
                            txt.value = txtText;
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
                //txt.value = flower.StringDo.replaceString(txt.value, "\n", "</br>");
                //txt.value = flower.StringDo.replaceString(txt.value, "\r", "</br>");
                return {
                    width: txtWidth,
                    height: txtHeight
                };
            }
        }, {
            key: "setFilters",
            value: function setFilters(filters) {}
        }, {
            key: "startInput",
            value: function startInput() {
                this.show.focus();
                //this.show.attachWithIME();
            }
        }, {
            key: "stopInput",
            value: function stopInput() {
                //this.show.detachWithIME();
            }
        }, {
            key: "release",
            value: function release() {
                this.__changeBack = null;
                this.__changeBackThis = null;
                var show = this.show;
                show.innerHTML = "";
                show.style.fontSize = "12px";
                this.setFontColor(0);
                _get(Object.getPrototypeOf(PlatformTextArea.prototype), "release", this).call(this);
            }
        }, {
            key: "toColor16",
            value: function toColor16(color) {
                var abc;
                var num = math.floor(color / 16);
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                var str = abc + "";
                num = color % 16;
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                str += abc;
                return str;
            }
        }]);

        return PlatformTextArea;
    }(PlatformDisplayObject);
    //////////////////////////End File:flower/platform/dom/PlatformTextArea.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformBitmap.js///////////////////////////


    var PlatformBitmap = function (_PlatformDisplayObjec5) {
        _inherits(PlatformBitmap, _PlatformDisplayObjec5);

        function PlatformBitmap() {
            _classCallCheck(this, PlatformBitmap);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformBitmap).call(this));

            _this5.__texture = null;
            _this5.__textureScaleX = 1;
            _this5.__textureScaleY = 1;
            _this5.scaleX = 1;
            _this5.scaleY = 1;


            var image = document.createElement("img");
            image.style.position = "absolute";
            image.style.left = "0px";
            image.style.top = "0px";
            image.style["transform-origin"] = "left top";
            _this5.show = image;

            //this.show = new cc.Sprite();
            //this.show.setAnchorPoint(0, 1);
            //this.show.retain();
            return _this5;
        }

        _createClass(PlatformBitmap, [{
            key: "setTexture",
            value: function setTexture(texture) {
                this.__texture = texture;
                if (texture.$nativeTexture.url != "res/blank.png") {
                    this.show.src = texture.$nativeTexture.textrue;
                }
                var source = texture.source;
                if (source) {
                    this.show.setTextureRect(source, texture.sourceRotation, {
                        width: source.width,
                        height: source.height
                    });
                }
                //this.__textureScaleX = texture.scaleX;
                //this.__textureScaleY = texture.scaleY;
                //this.setX(this.__x);
                //this.setY(this.__y);
                //this.setScaleX(this.__scaleX);
                //this.setScaleY(this.__scaleY);
                this.setScale9Grid(this.__scale9Grid);
                //this.setFilters(this.__filters);

                //if (this.__programmer) {
                //    if (Platform.native) {
                //        this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
                //    } else {
                //        this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
                //    }
                //}
            }
        }, {
            key: "setFilters",
            value: function setFilters(filters) {
                if (!this.__texture) {
                    this.__filters = filters;
                    return;
                }
                _get(Object.getPrototypeOf(PlatformBitmap.prototype), "setFilters", this).call(this, filters);
            }
        }, {
            key: "setSettingWidth",
            value: function setSettingWidth(width) {
                this.__settingWidth = width;
                this.setScaleX(this.__scaleX);
            }
        }, {
            key: "setSettingHeight",
            value: function setSettingHeight(height) {
                this.__settingHeight = height;
                this.setScaleY(this.__scaleY);
            }
        }, {
            key: "setScale9Grid",
            value: function setScale9Grid(scale9Grid) {
                this.__scale9Grid = scale9Grid;
                if (!this.__texture) {
                    return;
                }
                if (scale9Grid) {
                    console.log(scale9Grid);
                }
            }
        }, {
            key: "setX",
            value: function setX(val) {
                this.__x = val;
                this.show.style.left = this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX + "px";
            }
        }, {
            key: "setY",
            value: function setY(val) {
                this.__y = val;
                this.show.style.top = this.__y + (this.__texture ? this.__texture.offY : 0) * this.__scaleY + "px";
            }
        }, {
            key: "setScaleX",
            value: function setScaleX(val) {
                this.__scaleX = val;
                if (this.__texture && this.__settingWidth != null) {
                    this.scaleX = val * this.__textureScaleX * this.__settingWidth / this.__texture.width;
                } else {
                    this.scaleX = val * this.__textureScaleX;
                }
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
                if (this.__texture && this.__texture.offX) {
                    this.show.style.left = this.__x + this.__texture.offX * this.__scaleX + "px";
                }
                //this.setScale9Grid(this.__scale9Grid);
            }
        }, {
            key: "setScaleY",
            value: function setScaleY(val) {
                this.__scaleY = val;
                if (this.__texture && this.__settingHeight != null) {
                    this.scaleY = val * this.__textureScaleY * this.__settingHeight / this.__texture.height;
                } else {
                    this.scaleY = val * this.__textureScaleY;
                }
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
                if (this.__texture && this.__texture.offY) {
                    this.show.style.top = this.__y + this.__texture.offY * this.__scaleY + "px";
                }
                //this.setScale9Grid(this.__scale9Grid);
            }
        }, {
            key: "setRotation",
            value: function setRotation(val) {
                this.__rotation = val;
                this.show.style["-webkit-transform"] = "rotate(" + this.__rotation + "deg) scale(" + this.scaleX + "," + this.scaleY + ")";
            }
        }, {
            key: "release",
            value: function release() {
                this.setScale9Grid(null);
                this.__texture = null;
                this.scaleX = this.scaleY = 1;
                this.__textureScaleX = 1;
                this.__textureScaleY = 1;
                this.__scale9Grid = null;
                this.__colorFilter = null;
                this.__settingWidth = null;
                this.__settingHeight = null;
                _get(Object.getPrototypeOf(PlatformBitmap.prototype), "release", this).call(this);
            }
        }]);

        return PlatformBitmap;
    }(PlatformDisplayObject);
    //////////////////////////End File:flower/platform/dom/PlatformBitmap.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformShape.js///////////////////////////


    var PlatformShape = function (_PlatformDisplayObjec6) {
        _inherits(PlatformShape, _PlatformDisplayObjec6);

        function PlatformShape() {
            _classCallCheck(this, PlatformShape);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformShape).call(this));

            var shape = document.createElement("div");
            shape.style.position = "absolute";
            shape.style.left = "0px";
            shape.style.top = "0px";
            _this6.show = shape;
            _this6.elements = [];
            return _this6;
        }

        _createClass(PlatformShape, [{
            key: "toColor16",
            value: function toColor16(color) {
                var abc;
                var num = math.floor(color / 16);
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                var str = abc + "";
                num = color % 16;
                abc = num + "";
                if (num == 15) {
                    abc = "f";
                }
                if (num == 14) {
                    abc = "e";
                }
                if (num == 13) {
                    abc = "d";
                }
                if (num == 12) {
                    abc = "c";
                }
                if (num == 11) {
                    abc = "b";
                }
                if (num == 10) {
                    abc = "a";
                }
                str += abc;
                return str;
            }
        }, {
            key: "draw",
            value: function draw(points, fillColor, fillAlpha, lineWidth, lineColor, lineAlpha) {
                if (points.length == 0) {
                    this.show.innerHTML = "";
                    return;
                }
                var pointStr = "";
                var minX = 100000000;
                var minY = 100000000;
                var maxX = -100000000;
                var maxY = -100000000;
                for (var i = 0; i < points.length; i++) {
                    if (points[i].x < minX) {
                        minX = points[i].x;
                    }
                    if (points[i].x > maxX) {
                        maxX = points[i].x;
                    }
                    if (points[i].y < minY) {
                        minY = points[i].y;
                    }
                    if (points[i].y > maxY) {
                        maxY = points[i].y;
                    }
                }
                minX -= lineWidth;
                minY -= lineWidth;
                for (var i = 0; i < points.length; i++) {
                    pointStr += points[i].x - minX + "," + (points[i].y - minY) + (i < points.length - 1 ? "," : "");
                }
                this.show.innerHTML = '<div style="position:absolute;left:' + minX + 'px;top:' + minY + 'px;"><svg style="position:absolute;left:0px;top:0px;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + (maxX - minX + 2 + lineWidth) + '" height="' + (maxY - minY + 2 + lineWidth) + '">' + '<polygon points="' + pointStr + '" style="fill:#' + this.toColor16(fillColor >> 16) + this.toColor16(fillColor >> 8 & 0xFF) + this.toColor16(fillColor & 0xFF) + ";" + 'stroke:#' + this.toColor16(lineColor >> 16) + this.toColor16(lineColor >> 8 & 0xFF) + this.toColor16(lineColor & 0xFF) + ";" + 'fill-opacity:' + fillAlpha + ';' + 'stroke-opacity:' + lineAlpha + ';' + 'stroke-width:' + lineWidth + ';"/>' + '</svg></div>';
            }
        }, {
            key: "clear",
            value: function clear() {
                this.show.innerHTML = "";
            }
        }, {
            key: "setAlpha",
            value: function setAlpha(val) {}
        }, {
            key: "setFilters",
            value: function setFilters(filters) {}
        }, {
            key: "release",
            value: function release() {
                this.clear();
                _get(Object.getPrototypeOf(PlatformShape.prototype), "release", this).call(this);
            }
        }]);

        return PlatformShape;
    }(PlatformDisplayObject);
    //////////////////////////End File:flower/platform/dom/PlatformShape.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformMask.js///////////////////////////


    var PlatformMask = function (_PlatformSprite) {
        _inherits(PlatformMask, _PlatformSprite);

        function PlatformMask() {
            _classCallCheck(this, PlatformMask);

            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformMask).call(this));

            _this7.shapeWidth = 0;
            _this7.shapeHeight = 0;
            _this7.shapeX = 0;
            _this7.shapeY = 0;
            flower.EnterFrame.add(_this7.update, _this7);
            return _this7;
        }

        _createClass(PlatformMask, [{
            key: "update",
            value: function update() {
                var width = 0;
                var height = 0;
                var x = 0;
                var y = 0;
                if (this.flowerShape) {
                    var bounds = this.flowerShape.$getContentBounds();
                    width = bounds.width;
                    height = bounds.height;
                    x = bounds.x;
                    y = bounds.y;
                }
                if (width != this.shapeWidth || height != this.shapeHeight || x != this.shapeX || y != this.shapeY) {
                    this.shapeWidth = width;
                    this.shapeHeight = height;
                    this.shapeX = x;
                    this.shapeY = y;
                    this.show.style.clip = "rect(" + y + "px," + (x + width) + "px," + (y + height) + "px," + x + "px)";
                }
            }
        }, {
            key: "initShow",
            value: function initShow() {
                var mask = document.createElement("div");
                mask.style.position = "absolute";
                mask.style.left = "0px";
                mask.style.top = "0px";
                this.show = mask;
            }
        }, {
            key: "setShape",
            value: function setShape(shape, flowerShape) {
                this.shape = shape;
                this.flowerShape = flowerShape;
                //this.show.setStencil(shape.show);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                flower.EnterFrame.remove(this.update, this);
                _get(Object.getPrototypeOf(PlatformMask.prototype), "dispose", this).call(this);
            }
        }]);

        return PlatformMask;
    }(PlatformSprite);
    //////////////////////////End File:flower/platform/dom/PlatformMask.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformTexture.js///////////////////////////


    PlatformMask.id = 0;

    var PlatformTexture = function () {
        function PlatformTexture(url, texture) {
            _classCallCheck(this, PlatformTexture);

            this.url = url;
            this.textrue = texture;
        }

        _createClass(PlatformTexture, [{
            key: "dispose",
            value: function dispose() {
                this.textrue = null;
            }
        }]);

        return PlatformTexture;
    }();
    //////////////////////////End File:flower/platform/dom/PlatformTexture.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformURLLoader.js///////////////////////////


    var PlatformURLLoader = function () {
        function PlatformURLLoader() {
            _classCallCheck(this, PlatformURLLoader);
        }

        _createClass(PlatformURLLoader, null, [{
            key: "loadText",
            value: function loadText(url, back, errorBack, thisObj, method, params, contentType) {
                if (PlatformURLLoader.isLoading) {
                    PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj, method, params, contentType]);
                    return;
                }
                PlatformURLLoader.isLoading = true;
                if (TIP) {
                    $tip(2001, url);
                }
                var hasQ = url.split("?").length > 1 ? true : false;
                var hasParam = hasQ ? url.split("?")[1].length ? true : false : false;
                var pstr = hasParam ? hasQ ? "&" : "" : "?";
                for (var key in params) {
                    pstr += key + "=" + params[key] + "&";
                }
                if (pstr.charAt(pstr.length - 1) == "&") {
                    pstr = pstr.slice(0, pstr.length - 1);
                }
                if (pstr != "?") {
                    url += pstr;
                }
                var xhr = new XMLHttpRequest();
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
            }
        }, {
            key: "loadTexture",
            value: function loadTexture(url, back, errorBack, thisObj, params) {
                if (PlatformURLLoader.isLoading) {
                    PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj, params]);
                    return;
                }
                PlatformURLLoader.isLoading = true;
                if (TIP) {
                    $tip(2002, url);
                }
                params = params || {};
                params.img = "base64";
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
                var xhr = new XMLHttpRequest();
                var method;
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
                        var str = xhr.responseText;
                        var size = str.split("|")[0];
                        var content = "data:image/png;base64," + str.split("|")[1];
                        var width = size.split(",")[0];
                        var height = size.split(",")[1];
                        back.call(thisObj, content, width, height);
                    }
                    PlatformURLLoader.isLoading = false;
                };
                xhr.send();
            }
        }]);

        return PlatformURLLoader;
    }();
    //////////////////////////End File:flower/platform/dom/PlatformURLLoader.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformProgram.js///////////////////////////


    PlatformURLLoader.isLoading = false;
    PlatformURLLoader.loadingList = [];

    var PlatformProgram = function () {
        function PlatformProgram() {
            var vsh = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
            var fsh = arguments.length <= 1 || arguments[1] === undefined ? "res/shaders/Bitmap.fsh" : arguments[1];

            _classCallCheck(this, PlatformProgram);

            this.__uniforms = {};

            if (vsh == "") {
                if (Platform.native) {
                    vsh = "res/shaders/Bitmap.vsh";
                } else {
                    vsh = "res/shaders/BitmapWeb.vsh";
                }
            }
            var shader; // = Programmer.shader;
            shader = new cc.GLProgram();
            shader.initWithString(programmers[vsh], programmers[fsh]);
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

        _createClass(PlatformProgram, [{
            key: "use",
            value: function use() {
                if (!Platform.native) {
                    this.$nativeProgrammer.use();
                }
            }
        }, {
            key: "getUniformLocationForName",
            value: function getUniformLocationForName(name) {
                var uniforms = this.__uniforms;
                if (uniforms[name]) {
                    return uniforms[name];
                }
                uniforms[name] = this.$nativeProgrammer.getUniformLocationForName(name);
                return uniforms[name];
            }
        }], [{
            key: "create",
            value: function create() {
                if (PlatformProgram.programmers.length) {
                    return PlatformProgram.programmers.pop();
                }
                return new PlatformProgram();
            }
        }, {
            key: "release",
            value: function release(programmer) {
                PlatformProgram.programmers.push(programmer);
            }
        }, {
            key: "getInstance",
            value: function getInstance() {
                if (PlatformProgram.instance == null) {
                    PlatformProgram.instance = new PlatformProgram(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
                }
                return PlatformProgram.instance;
            }
        }]);

        return PlatformProgram;
    }();
    //////////////////////////End File:flower/platform/dom/PlatformProgram.js///////////////////////////

    //////////////////////////File:flower/platform/dom/PlatformWebSocket.js///////////////////////////


    PlatformProgram.programmers = [];

    var PlatformWebSocket = function () {
        function PlatformWebSocket() {
            _classCallCheck(this, PlatformWebSocket);
        }

        _createClass(PlatformWebSocket, [{
            key: "bindWebSocket",
            value: function bindWebSocket(ip, port, path, thisObj, onConnect, onReceiveMessage, onError, onClose) {
                var websocket = new LocalWebSocket("ws://" + ip + ":" + port + path);
                this.webSocket = websocket;
                var openFunc = function openFunc() {
                    onConnect.call(thisObj);
                };
                websocket.onopen = openFunc;
                var receiveFunc = function receiveFunc(event) {
                    if (event.data instanceof Blob) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var list = [];
                            var data = new Uint8Array(this.result);
                            for (var i = 0; i < data.length; i++) {
                                list.push(data[i]);
                            }
                            onReceiveMessage.call(thisObj, "buffer", list);
                        };
                        reader.readAsArrayBuffer(event.data);
                    } else if (event.data instanceof ArrayBuffer) {
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
                var errorFunc = function errorFunc() {
                    onError.call(thisObj);
                };
                websocket.onerror = errorFunc;
                var closeFunc = function closeFunc() {
                    onClose.call(thisObj);
                };
                websocket.onclose = closeFunc;
                PlatformWebSocket.webSockets.push({
                    "webSocket": websocket
                });
                return websocket;
            }
        }, {
            key: "sendWebSocketUTF",
            value: function sendWebSocketUTF(data) {
                this.webSocket.send(data);
            }
        }, {
            key: "sendWebSocketBytes",
            value: function sendWebSocketBytes(data) {
                this.webSocket.send(new Uint8Array(data));
            }
        }, {
            key: "releaseWebSocket",
            value: function releaseWebSocket() {
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
        }]);

        return PlatformWebSocket;
    }();
    //////////////////////////End File:flower/platform/dom/PlatformWebSocket.js///////////////////////////

    //////////////////////////File:flower/debug/NativeDisplayInfo.js///////////////////////////


    PlatformWebSocket.webSockets = [];

    var NativeDisplayInfo = function NativeDisplayInfo() {
        _classCallCheck(this, NativeDisplayInfo);

        this.display = 0;
        this.text = 0;
        this.bitmap = 0;
        this.shape = 0;
        this.sprite = 0;
    };
    //////////////////////////End File:flower/debug/NativeDisplayInfo.js///////////////////////////

    //////////////////////////File:flower/debug/DisplayInfo.js///////////////////////////


    var DisplayInfo = function DisplayInfo() {
        _classCallCheck(this, DisplayInfo);

        this.display = 0;
        this.text = 0;
        this.bitmap = 0;
        this.shape = 0;
        this.sprite = 0;
    };

    //////////////////////////End File:flower/debug/DisplayInfo.js///////////////////////////

    //////////////////////////File:flower/debug/CpuInfo.js///////////////////////////


    var CpuInfo = function CpuInfo() {
        _classCallCheck(this, CpuInfo);

        this.enterFrame = 0;
        this.delayCall = 0;
        this.callLater = 0;
        this.frameEnd = 0;
        this.fps = 0;
    };
    //////////////////////////End File:flower/debug/CpuInfo.js///////////////////////////

    //////////////////////////File:flower/debug/FrameInfo.js///////////////////////////


    var FrameInfo = function FrameInfo() {
        _classCallCheck(this, FrameInfo);

        this.display = 0;
        this.text = 0;
        this.bitmap = 0;
        this.shape = 0;
        this.sprite = 0;
    };
    //////////////////////////End File:flower/debug/FrameInfo.js///////////////////////////

    //////////////////////////File:flower/debug/TextureInfo.js///////////////////////////


    var TextureInfo = function () {
        function TextureInfo(texture) {
            _classCallCheck(this, TextureInfo);

            this.__texture = texture;
        }

        _createClass(TextureInfo, [{
            key: "url",
            get: function get() {
                return this.__texture.url;
            }
        }, {
            key: "nativeURL",
            get: function get() {
                return this.__texture.nativeURL;
            }
        }, {
            key: "count",
            get: function get() {
                return this.__texture.count;
            }
        }]);

        return TextureInfo;
    }();

    flower.TextureInfo = TextureInfo;
    //////////////////////////End File:flower/debug/TextureInfo.js///////////////////////////

    //////////////////////////File:flower/debug/DebugInfo.js///////////////////////////
    /**
     * 调试信息
     */

    var DebugInfo = function () {
        function DebugInfo() {
            _classCallCheck(this, DebugInfo);
        }

        _createClass(DebugInfo, null, [{
            key: "addTexture",


            /**
             * native显示对象统计
             */
            value: function addTexture(texture) {
                DebugInfo.textures.push(texture);
            }

            /**
             * 帧遍历显示对象统计
             * @param texture
             */


            /**
             * 显示对象统计
             */

            /**
             * 所有纹理纹理信息
             * @type {Array}
             */

        }, {
            key: "delTexture",
            value: function delTexture(texture) {
                var textures = DebugInfo.textures;
                for (var i = 0; i < textures.length; i++) {
                    if (textures[i] == texture) {
                        textures.splice(i, 1);
                        break;
                    }
                }
            }
        }]);

        return DebugInfo;
    }();

    DebugInfo.textures = [];
    DebugInfo.nativeDisplayInfo = new NativeDisplayInfo();
    DebugInfo.displayInfo = new DisplayInfo();
    DebugInfo.cpu = new CpuInfo();
    DebugInfo.frameInfo = new FrameInfo();


    flower.DebugInfo = DebugInfo;
    //////////////////////////End File:flower/debug/DebugInfo.js///////////////////////////

    //////////////////////////File:flower/core/CoreTime.js///////////////////////////

    var CoreTime = function () {
        function CoreTime() {
            _classCallCheck(this, CoreTime);
        }

        _createClass(CoreTime, null, [{
            key: "$run",
            value: function $run(gap) {
                CoreTime.lastTimeGap = gap;
                CoreTime.currentTime += gap;
                EnterFrame.$update(CoreTime.currentTime, gap);
                var st = new Date().getTime();
                if (CoreTime.$playEnterFrame) {
                    Stage.$onFrameEnd();
                }
                var et = new Date().getTime();
                DebugInfo.cpu.onFrameEnd += et - st;
                TextureManager.getInstance().$check();
            }
        }, {
            key: "getTime",
            value: function getTime() {
                return CoreTime.currentTime;
            }
        }]);

        return CoreTime;
    }();

    CoreTime.currentTime = 0;
    CoreTime.$playEnterFrame = true;


    flower.CoreTime = CoreTime;
    //////////////////////////End File:flower/core/CoreTime.js///////////////////////////

    //////////////////////////File:flower/language/Language.js///////////////////////////

    var Language = function Language() {
        _classCallCheck(this, Language);
    };

    Language.currentLanguage = "";
    Language.__languages = [];


    var $locale_strings = {};

    /**
     * @private
     * 全局多语言翻译函数
     * @param code 要查询的字符串代码
     * @param args 替换字符串中{0}标志的参数列表
     * @returns 返回拼接后的字符串
     */
    function getLanguage(code) {
        var text = $locale_strings[$language][code];
        if (!text) {
            return "{" + code + "}";
        }

        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
        }

        var length = args.length;
        for (var i = 0; i < length; i++) {
            text = StringDo.replaceString(text, "{" + i + "}", args[i]);
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
    locale_strings[1100] = "监听事件类型不能为空";
    locale_strings[1101] = "监听事件回调函数不能为空";
    locale_strings[2001] = "[loadText] {0}";
    locale_strings[2002] = "[loadTexture] {0}";
    locale_strings[2003] = "[加载失败] {0}";
    locale_strings[2004] = "[加载Plist失败] {0}";

    flower.sys.$locale_strings = $locale_strings;
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
                if (this.__EventDispatcher[1][flower.Event.DISPOSE]) {
                    this.dispatchWith(flower.Event.DISPOSE);
                }
                this.__EventDispatcher = null;
                this.__hasDispose = true;
            }
        }, {
            key: "$release",
            value: function $release() {
                this.__EventDispatcher = {
                    0: this,
                    1: {}
                };
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
                var args = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                this.__addListener(type, listener, thisObject, priority, true, args);
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
                var args = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                this.__addListener(type, listener, thisObject, priority, false, args);
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
            value: function __addListener(type, listener, thisObject, priority, once, args) {
                if (DEBUG) {
                    if (this.__hasDispose) {
                        $error(1002);
                    }
                    if (type == null) {
                        $error(1100);
                    }
                    if (listener == null) {
                        $error(1101);
                    }
                }
                var values = this.__EventDispatcher;
                var events = values[1];
                var list = events[type];
                if (!list) {
                    list = values[1][type] = [];
                } else {
                    values[1][type] = list = list.concat();
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    var agrsame = item.args == args ? true : false;
                    if (!agrsame && item.args && args) {
                        var arg1 = item.args.length ? item.args : [item.args];
                        var arg2 = args.length ? args : [args];
                        if (arg1.length == arg2.length) {
                            agrsame = true;
                            for (var a = 0; a < arg1.length; a++) {
                                if (arg1[a] != arg2[a]) {
                                    agrsame = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (item.listener == listener && item.thisObject == thisObject && agrsame) {
                        return false;
                    }
                }
                list.push({ "listener": listener, "thisObject": thisObject, "once": once, args: args });
            }
        }, {
            key: "removeListener",
            value: function removeListener(type, listener, thisObject) {
                if (this.__hasDispose) {
                    return;
                }
                var values = this.__EventDispatcher;
                var events = values[1];
                var list = events[type];
                if (!list) {
                    return;
                }
                events[type] = list = list.concat();
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].listener == listener && list[i].thisObject == thisObject) {
                        list.splice(i, 1);
                        break;
                    }
                }
                if (list.length == 0) {
                    delete events[type];
                }
            }
        }, {
            key: "removeAllListener",
            value: function removeAllListener() {
                if (this.__hasDispose) {
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
                return true;
            }
        }, {
            key: "dispatch",
            value: function dispatch(event) {
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
                    var listener = list[i].listener;
                    var thisObj = list[i].thisObject;
                    if (event.$target == null) {
                        event.$target = this;
                    }
                    event.$currentTarget = this;
                    var args = [event];
                    if (list[i].args) {
                        args = args.concat(list[i].args);
                    }
                    if (list[i].once) {
                        list[i].listener = null;
                        list[i].thisObject = null;
                        list[i].splice(i, 1);
                        i--;
                    }
                    listener.apply(thisObj, args);
                }
            }
        }, {
            key: "dispatchWith",
            value: function dispatchWith(type) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                var bubbles = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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
        }, {
            key: "isDispose",
            get: function get() {
                return this.__hasDispose;
            }
        }]);

        return EventDispatcher;
    }();

    flower.EventDispatcher = EventDispatcher;
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
                var bubbles = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                var e;
                if (!flower.Event._eventPool.length) {
                    e = new flower.Event(type);
                } else {
                    e = flower.Event._eventPool.pop();
                    e.$cycle = false;
                }
                e.$type = type;
                e.$bubbles = bubbles;
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
    Event.ADD = "add";
    Event.REMOVE = "remove";
    Event.ADDED_TO_STAGE = "added_to_stage";
    Event.REMOVED_FROM_STAGE = "removed_from_stage";
    Event.CONNECT = "connect";
    Event.CLOSE = "close";
    Event.CHANGE = "change";
    Event.ERROR = "error";
    Event.FOCUS_IN = "focus_in";
    Event.FOCUS_OUT = "focus_out";
    Event.CONFIRM = "confirm";
    Event.CANCEL = "cancel";
    Event.START_INPUT = "start_input";
    Event.STOP_INPUT = "stop_input";
    Event.DISTORT = "distort";
    Event.DISPOSE = "dispose";
    Event.CREATION_COMPLETE = "creation_complete";
    Event.SELECTED_ITEM_CHANGE = "selected_item_change";
    Event.CLICK_ITEM = "click_item";
    Event.TOUCH_BEGIN_ITEM = "touch_begin_item";
    Event._eventPool = [];


    flower.Event = Event;
    //////////////////////////End File:flower/event/Event.js///////////////////////////

    //////////////////////////File:flower/event/TouchEvent.js///////////////////////////

    var TouchEvent = function (_Event) {
        _inherits(TouchEvent, _Event);

        function TouchEvent(type) {
            var bubbles = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _classCallCheck(this, TouchEvent);

            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(TouchEvent).call(this, type, bubbles));

            _this8.$touchId = 0;
            _this8.$touchX = 0;
            _this8.$touchY = 0;
            _this8.$stageX = 0;
            _this8.$stageY = 0;
            _this8.$beginTouchX = 0;
            _this8.$beginTouchY = 0;
            _this8.$beginStageX = 0;
            _this8.$beginStageY = 0;
            return _this8;
        }

        _createClass(TouchEvent, [{
            key: "touchId",
            get: function get() {
                return this.$touchId;
            }
        }, {
            key: "touchX",
            get: function get() {
                if (this.currentTarget) {
                    return this.currentTarget.mouseX;
                }
                return this.$touchX;
            }
        }, {
            key: "touchY",
            get: function get() {
                if (this.currentTarget) {
                    return this.currentTarget.mouseY;
                }
                return this.$touchY;
            }
        }, {
            key: "stageX",
            get: function get() {
                return this.$stageX;
            }
        }, {
            key: "stageY",
            get: function get() {
                return this.$stageY;
            }
        }, {
            key: "beginTouchX",
            get: function get() {
                return this.$beginTouchX;
            }
        }, {
            key: "beginTouchY",
            get: function get() {
                return this.$beginTouchY;
            }
        }, {
            key: "beginStageX",
            get: function get() {
                return this.$beginStageX;
            }
        }, {
            key: "beginStageY",
            get: function get() {
                return this.$beginStageY;
            }
            /**
             * 此事件是在没有 touch 的情况下发生的，即没有按下
             * @type {string}
             */

        }]);

        return TouchEvent;
    }(Event);

    TouchEvent.TOUCH_BEGIN = "touch_begin";
    TouchEvent.TOUCH_MOVE = "touch_move";
    TouchEvent.TOUCH_END = "touch_end";
    TouchEvent.TOUCH_RELEASE = "touch_release";
    TouchEvent.MOVE = "move";


    flower.TouchEvent = TouchEvent;
    //////////////////////////End File:flower/event/TouchEvent.js///////////////////////////

    //////////////////////////File:flower/event/MouseEvent.js///////////////////////////

    var MouseEvent = function (_Event2) {
        _inherits(MouseEvent, _Event2);

        function MouseEvent(type) {
            var bubbles = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _classCallCheck(this, MouseEvent);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseEvent).call(this, type, bubbles));
        }

        _createClass(MouseEvent, [{
            key: "mouseX",
            get: function get() {
                if (this.currentTarget) {
                    return this.currentTarget.mouseX;
                }
                return this.$touchX;
            }
        }, {
            key: "mouseY",
            get: function get() {
                if (this.currentTarget) {
                    return this.currentTarget.mouseY;
                }
                return this.$touchY;
            }
        }, {
            key: "stageX",
            get: function get() {
                return this.$stageX;
            }
        }, {
            key: "stageY",
            get: function get() {
                return this.$stageY;
            }

            /**
             * 此事件是在没有 touch 的情况下发生的，即没有按下
             * @type {string}
             */

        }]);

        return MouseEvent;
    }(Event);

    MouseEvent.MOUSE_MOVE = "mouse_move";
    MouseEvent.MOUSE_OVER = "mouse_over";
    MouseEvent.MOUSE_OUT = "mouse_out";
    MouseEvent.RIGHT_CLICK = "right_click";


    flower.MouseEvent = MouseEvent;
    //////////////////////////End File:flower/event/MouseEvent.js///////////////////////////

    //////////////////////////File:flower/event/DragEvent.js///////////////////////////

    var DragEvent = function (_Event3) {
        _inherits(DragEvent, _Event3);

        function DragEvent(type) {
            var bubbles = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _classCallCheck(this, DragEvent);

            var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(DragEvent).call(this, type, bubbles));

            _this10.$accept = false;
            return _this10;
        }

        //DisplayObject


        _createClass(DragEvent, [{
            key: "accept",
            value: function accept() {
                this.$accept = true;
            }
        }, {
            key: "dragSource",
            get: function get() {
                return this.$dragSource;
            }
        }, {
            key: "dragType",
            get: function get() {
                return this.$dragType;
            }
        }, {
            key: "hasAccept",
            get: function get() {
                return this.$accept;
            }
        }], [{
            key: "create",
            value: function create(type, bubbles, dragSource, dragType, dragData) {
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
        }, {
            key: "release",
            value: function release(e) {
                DragEvent.$Pools.push(e);
            }
        }]);

        return DragEvent;
    }(Event);

    DragEvent.DRAG_OVER = "drag_over";
    DragEvent.DRAG_OUT = "drag_out";
    DragEvent.DRAG_END = "drag_end";
    DragEvent.$Pools = [];


    flower.DragEvent = DragEvent;
    //////////////////////////End File:flower/event/DragEvent.js///////////////////////////

    //////////////////////////File:flower/event/KeyboardEvent.js///////////////////////////

    var KeyboardEvent = function (_Event4) {
        _inherits(KeyboardEvent, _Event4);

        function KeyboardEvent(type, key) {
            var bubbles = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            _classCallCheck(this, KeyboardEvent);

            var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(KeyboardEvent).call(this, type, bubbles));

            _this11.__keyCode = key;
            _this11.__key = String.fromCharCode(key);
            return _this11;
        }

        _createClass(KeyboardEvent, [{
            key: "keyCode",
            get: function get() {
                return this.__keyCode;
            }
        }, {
            key: "key",
            get: function get() {
                return this.__key;
            }
        }, {
            key: "shift",
            get: function get() {
                return KeyboardEvent.$shift;
            }
        }, {
            key: "control",
            get: function get() {
                return KeyboardEvent.$control;
            }
        }, {
            key: "alt",
            get: function get() {
                return KeyboardEvent.$alt;
            } //16
            //17
            //18

        }]);

        return KeyboardEvent;
    }(Event);

    KeyboardEvent.$shift = false;
    KeyboardEvent.$control = false;
    KeyboardEvent.$alt = false;
    KeyboardEvent.KEY_DOWN = "key_down";
    KeyboardEvent.KEY_UP = "key_up";


    flower.KeyboardEvent = KeyboardEvent;
    //////////////////////////End File:flower/event/KeyboardEvent.js///////////////////////////

    //////////////////////////File:flower/filters/Filter.js///////////////////////////

    var Filter = function () {
        function Filter(type) {
            _classCallCheck(this, Filter);

            this.__type = 0;

            this.__type = type;
        }

        //滤镜类型，在 shader 中与之对应
        //1 为 ColorFilter


        _createClass(Filter, [{
            key: "$getParams",
            value: function $getParams() {}
        }, {
            key: "type",
            get: function get() {
                return this.__type;
            }
        }, {
            key: "params",
            get: function get() {
                return this.$getParams();
            }
        }]);

        return Filter;
    }();

    flower.Filter = Filter;
    //////////////////////////End File:flower/filters/Filter.js///////////////////////////

    //////////////////////////File:flower/filters/ColorFilter.js///////////////////////////

    var ColorFilter = function (_Filter) {
        _inherits(ColorFilter, _Filter);

        function ColorFilter() {
            var h = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var s = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var l = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            _classCallCheck(this, ColorFilter);

            var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorFilter).call(this, 1));

            _this12.__h = 0;
            _this12.__s = 0;
            _this12.__l = 0;

            _this12.h = h;
            _this12.s = s;
            _this12.l = l;
            return _this12;
        }

        _createClass(ColorFilter, [{
            key: "$getParams",
            value: function $getParams() {
                return [this.h, this.s, this.l];
            }
        }, {
            key: "h",
            get: function get() {
                return this.__h;
            },
            set: function set(val) {
                val = +val || 0;
                val += 180;
                if (val < 0) {
                    val = 360 - -val % 360;
                } else {
                    val = val % 360;
                }
                val -= 180;
                this.__h = val;
            }
        }, {
            key: "s",
            get: function get() {
                return this.__s;
            },
            set: function set(val) {
                val = +val || 0;
                if (val > 100) {
                    val = 100;
                } else if (val < -100) {
                    val = -100;
                }
                this.__s = val;
            }
        }, {
            key: "l",
            get: function get() {
                return this.__l;
            },
            set: function set(val) {
                val = +val || 0;
                if (val > 100) {
                    val = 100;
                } else if (val < -100) {
                    val = -100;
                }
                this.__l = val;
            }
        }]);

        return ColorFilter;
    }(Filter);

    flower.ColorFilter = ColorFilter;
    //////////////////////////End File:flower/filters/ColorFilter.js///////////////////////////

    //////////////////////////File:flower/filters/StrokeFilter.js///////////////////////////

    var StrokeFilter = function (_Filter2) {
        _inherits(StrokeFilter, _Filter2);

        /**
         * 描边滤镜
         * @param size 描边大小
         * @param color 描边颜色
         */

        function StrokeFilter() {
            var size = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
            var color = arguments.length <= 1 || arguments[1] === undefined ? 0x000000 : arguments[1];

            _classCallCheck(this, StrokeFilter);

            var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(StrokeFilter).call(this, 2));

            _this13.__size = 0;
            _this13.__r = 0;
            _this13.__g = 0;
            _this13.__b = 0;

            _this13.size = size;
            _this13.color = color;
            return _this13;
        }

        _createClass(StrokeFilter, [{
            key: "$getParams",
            value: function $getParams() {
                return [this.__size, this.__r / 255, this.__g / 255, this.__b / 255];
            }
        }, {
            key: "size",
            set: function set(val) {
                this.__size = val;
            },
            get: function get() {
                return this.__size;
            }
        }, {
            key: "color",
            set: function set(val) {
                val = +val || 0;
                this.__r = val >> 16 & 0xFF;
                this.__g = val >> 8 & 0xFF;
                this.__b = val & 0xFF;
            },
            get: function get() {
                return this.__r << 16 | this.__g << 8 | this.__b;
            }
        }]);

        return StrokeFilter;
    }(Filter);

    flower.StrokeFilter = StrokeFilter;
    //////////////////////////End File:flower/filters/StrokeFilter.js///////////////////////////

    //////////////////////////File:flower/filters/BlurFilter.js///////////////////////////

    var BlurFilter = function (_Filter3) {
        _inherits(BlurFilter, _Filter3);

        function BlurFilter() {
            var blurX = arguments.length <= 0 || arguments[0] === undefined ? 4 : arguments[0];
            var blurY = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];

            _classCallCheck(this, BlurFilter);

            var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(BlurFilter).call(this, 100));

            _this14.__blurX = 0;
            _this14.__blurY = 0;

            _this14.blurX = blurX;
            _this14.blurY = blurY;
            return _this14;
        }

        _createClass(BlurFilter, [{
            key: "$getParams",
            value: function $getParams() {
                return [this.__blurX, this.__blurY];
            }
        }, {
            key: "blurX",
            get: function get() {
                return this.__blurX;
            },
            set: function set(val) {
                val = +val || 0;
                if (val < 1) {
                    val = 0;
                }
                this.__blurX = val;
            }
        }, {
            key: "blurY",
            get: function get() {
                return this.__blurY;
            },
            set: function set(val) {
                val = +val || 0;
                if (val < 1) {
                    val = 0;
                }
                this.__blurY = val;
            }
        }]);

        return BlurFilter;
    }(Filter);

    flower.BlurFilter = BlurFilter;
    //////////////////////////End File:flower/filters/BlurFilter.js///////////////////////////

    //////////////////////////File:flower/filters/DyeingFilter.js///////////////////////////
    /**
     * 收集原有的 r,g,b 计算和，再根据 r,g,b 的比值重新分配 r,g,b
     */

    var DyeingFilter = function (_Filter4) {
        _inherits(DyeingFilter, _Filter4);

        function DyeingFilter() {
            var r = arguments.length <= 0 || arguments[0] === undefined ? 0.0 : arguments[0];
            var g = arguments.length <= 1 || arguments[1] === undefined ? 0.0 : arguments[1];
            var b = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];

            _classCallCheck(this, DyeingFilter);

            var _this15 = _possibleConstructorReturn(this, Object.getPrototypeOf(DyeingFilter).call(this, 3));

            _this15.__r = 0;
            _this15.__g = 0;
            _this15.__b = 0;

            _this15.r = r;
            _this15.g = g;
            _this15.b = b;
            return _this15;
        }

        _createClass(DyeingFilter, [{
            key: "$getParams",
            value: function $getParams() {
                var sum = this.__r + this.__g + this.__b;
                return [this.__r / sum, this.__g / sum, this.__b / sum];
            }
        }, {
            key: "r",
            get: function get() {
                return this.__r;
            },
            set: function set(val) {
                this.__r = +val || 0;
            }
        }, {
            key: "g",
            get: function get() {
                return this.__g;
            },
            set: function set(val) {
                this.__g = +val || 0;
            }
        }, {
            key: "b",
            get: function get() {
                return this.__b;
            },
            set: function set(val) {
                this.__b = +val || 0;
            }
        }]);

        return DyeingFilter;
    }(Filter);

    flower.DyeingFilter = DyeingFilter;
    //////////////////////////End File:flower/filters/DyeingFilter.js///////////////////////////

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
                var sin = math.sin(angle);
                var cos = math.cos(angle);
                this.setTo(this.a * cos - this.c * sin, this.a * sin + this.c * cos, this.b * cos - this.d * sin, this.b * sin + this.d * cos, this.tx * cos - this.ty * sin, this.tx * sin + this.ty * cos);
            }
        }, {
            key: "scale",
            value: function scale(scaleX, scaleY) {
                this.a *= scaleX;
                this.d *= scaleY;
                this.tx *= scaleX;
                this.ty *= scaleY;
            }
        }, {
            key: "transformPoint",
            value: function transformPoint(pointX, pointY, resultPoint) {
                var x = this.a * pointX + this.c * pointY + this.tx;
                var y = this.b * pointX + this.d * pointY + this.ty;
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                    return resultPoint;
                }
                return new Point(x, y);
            }
        }, {
            key: "$updateSR",
            value: function $updateSR(scaleX, scaleY, rotation) {
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
        }, {
            key: "$updateRST",
            value: function $updateRST(rotation, scaleX, scaleY, tx, ty) {
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
        }, {
            key: "$transformRectangle",
            value: function $transformRectangle(rect) {
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

            /**
             * 创建出来的矩阵可能不是规范矩阵
             * @returns {flower.Matrix}
             */

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


    flower.Matrix = Matrix;
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
                return math.sqrt(this.x * this.x + this.y * this.y);
            }
        }], [{
            key: "distance",
            value: function distance(p1, p2) {
                return math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
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


    flower.Point = Point;
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
        }, {
            key: "intersects",
            value: function intersects(toIntersect) {
                return math.max(this.x, toIntersect.x) <= math.min(this.right, toIntersect.right) && math.max(this.y, toIntersect.y) <= math.min(this.bottom, toIntersect.bottom);
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
                var u = math.abs(math.cos(angle));
                var v = math.abs(math.sin(angle));
                return u * this.width + v * this.height;
            }
        }, {
            key: "_getBaseHeight",
            value: function _getBaseHeight(angle) {
                var u = math.abs(math.cos(angle));
                var v = math.abs(math.sin(angle));
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
    Rectangle.$TempRectangle = new Rectangle();


    flower.Rectangle = Rectangle;
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


    flower.Size = Size;
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

        function DisplayObject() {
            _classCallCheck(this, DisplayObject);

            var _this16 = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObject).call(this));

            _this16.__flags = 0;
            _this16.__alpha = 1;
            _this16.__parentAlpha = 1;
            _this16.__concatAlpha = 1;
            _this16.__visible = true;

            var id = DisplayObject.id++;
            _this16.$DisplayObject = {
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
                15: false, //simpleMode
                20: id, //id
                21: true, //dispatchEventToParent
                22: 0, //lastTouchFrame
                50: false, //focusEnabeld
                60: [], //filters
                61: [], //parentFilters
                70: null };
            //program
            DebugInfo.displayInfo.display++;
            return _this16;
        }

        /**
         * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
         */


        /**
         * 父对象
         */


        _createClass(DisplayObject, [{
            key: "$setSimpleMode",
            value: function $setSimpleMode() {
                this.$DisplayObject[15] = true;
            }

            /**
             * 是否有此标识位
             * @param flags
             * @returns {boolean}
             */

        }, {
            key: "$hasFlags",
            value: function $hasFlags(flags) {
                return (this.__flags & flags) == flags ? true : false;
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
                    this.__parent.$addFlagsUp(flags);
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
                    this.__parent.$removeFlagsUp(flags);
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
            key: "$getX",
            value: function $getX() {
                return this.$DisplayObject[12].tx;
            }
        }, {
            key: "$setX",
            value: function $setX(val) {
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
                if (!this.$DisplayObject[15]) {
                    this.$invalidateReverseMatrix();
                }
            }
        }, {
            key: "$getY",
            value: function $getY() {
                return this.$DisplayObject[12].ty;
            }
        }, {
            key: "$setY",
            value: function $setY(val) {
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
                if (!this.$DisplayObject[15]) {
                    this.$invalidateReverseMatrix();
                }
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
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.setScaleX(val);
                if (!this.$DisplayObject[15]) {
                    this.$invalidateMatrix();
                }
            }
        }, {
            key: "$getScaleX",
            value: function $getScaleX() {
                var p = this.$DisplayObject;
                return p[0];
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
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.setScaleY(val);
                if (!this.$DisplayObject[15]) {
                    this.$invalidateMatrix();
                }
            }
        }, {
            key: "$getScaleY",
            value: function $getScaleY() {
                var p = this.$DisplayObject;
                return p[1];
            }
        }, {
            key: "$setRotation",
            value: function $setRotation(val) {
                val = +val || 0;
                if (val < 0) {
                    val = 360 - -val % 360;
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
                if (!this.$DisplayObject[15]) {
                    this.$invalidateMatrix();
                }
            }
        }, {
            key: "$getMatrix",
            value: function $getMatrix() {
                var p = this.$DisplayObject;
                var matrix = p[12];
                if (this.$hasFlags(0x0008)) {
                    this.$removeFlags(0x0008);
                    matrix.$updateSR(p[0], p[1], p[14]);
                }
                return matrix;
            }
        }, {
            key: "$getReverseMatrix",
            value: function $getReverseMatrix() {
                var p = this.$DisplayObject;
                var matrix = p[13];
                if (this.$hasFlags(0x0010)) {
                    this.$removeFlags(0x0010);
                    matrix.$updateRST(-p[14], 1 / p[0], 1 / p[1], -p[12].tx, -p[12].ty);
                }
                return matrix;
            }
        }, {
            key: "$setAlpha",
            value: function $setAlpha(val) {
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
        }, {
            key: "$setVisible",
            value: function $setVisible(val) {
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
        }, {
            key: "$getConcatAlpha",
            value: function $getConcatAlpha() {
                if (this.$hasFlags(0x0002)) {
                    this.__concatAlpha = this.__alpha;
                    if (this.__parent) {
                        this.__concatAlpha *= this.__parent.$getConcatAlpha();
                    }
                    this.$removeFlags(0x0002);
                }
                return this.__concatAlpha;
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
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
                if (!p[15]) {
                    this.$invalidatePosition();
                }
                return true;
            }
        }, {
            key: "$getWidth",
            value: function $getWidth() {
                var p = this.$DisplayObject;
                return p[3] != null ? p[3] : this.$getContentBounds().width;
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
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
                if (!this.$DisplayObject[15]) {
                    this.$invalidatePosition();
                }
                return true;
            }
        }, {
            key: "$getHeight",
            value: function $getHeight() {
                var p = this.$DisplayObject;
                return p[4] != null ? p[4] : this.$getContentBounds().height;
            }
        }, {
            key: "$getBounds",
            value: function $getBounds() {
                var fromParent = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

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
        }, {
            key: "$getContentBounds",
            value: function $getContentBounds() {
                var rect = this.$DisplayObject[6];
                while (this.$hasFlags(0x0001)) {
                    this.$removeFlags(0x0001);
                    this.$measureContentBounds(rect);
                }
                return rect;
            }
        }, {
            key: "$setTouchEnabled",
            value: function $setTouchEnabled(val) {
                var p = this.$DisplayObject;
                if (p[8] == val) {
                    return false;
                }
                p[8] = val;
                return true;
            }
        }, {
            key: "$setMultiplyTouchEnabled",
            value: function $setMultiplyTouchEnabled(val) {
                varp = this.$DisplayObject;
                if (p[9] == val) {
                    return false;
                }
                p[9] = val;
                return true;
            }
        }, {
            key: "$setParent",
            value: function $setParent(parent) {
                this.__parent = parent;
                var parentAlpha = parent ? parent.$getConcatAlpha() : 1;
                if (this.__parentAlpha != parentAlpha) {
                    this.__parentAlpha = parentAlpha;
                    if (!this.$DisplayObject[15]) {
                        this.$addFlagsDown(0x0002);
                    }
                }
                if (this.__parent) {
                    this.$setParentFilters(this.__parent.$getAllFilters());
                    if (!this.$DisplayObject[15]) {
                        this.dispatchWith(Event.ADDED);
                    }
                } else {
                    this.$setParentFilters(null);
                    if (!this.$DisplayObject[15]) {
                        this.dispatchWith(Event.REMOVED);
                    }
                }
            }
        }, {
            key: "$setStage",
            value: function $setStage(stage) {
                this.__stage = stage;
            }
        }, {
            key: "$dispatchAddedToStageEvent",
            value: function $dispatchAddedToStageEvent() {
                if (!this.$DisplayObject[15]) {
                    if (this.__stage) {
                        this.dispatchWith(Event.ADDED_TO_STAGE);
                    }
                }
            }
        }, {
            key: "$dispatchRemovedFromStageEvent",
            value: function $dispatchRemovedFromStageEvent() {
                if (!this.$DisplayObject[15]) {
                    if (!this.__stage) {
                        this.dispatchWith(Event.REMOVED_FROM_STAGE);
                    }
                }
            }
        }, {
            key: "$setFilters",
            value: function $setFilters(val) {
                if (val == null) {
                    val = [];
                }
                var p = this.$DisplayObject;
                p[60] = val;
                this.$changeAllFilters();
                return true;
            }
        }, {
            key: "$setDispatchEventToParent",
            value: function $setDispatchEventToParent(val) {
                if (val == "false") {
                    val = false;
                }
                this.$DisplayObject[21] = !!val;
            }
        }, {
            key: "$setParentFilters",
            value: function $setParentFilters(val) {
                if (val == null) {
                    val = [];
                }
                var p = this.$DisplayObject;
                p[61] = val;
                this.$changeAllFilters();
            }
        }, {
            key: "$changeAllFilters",
            value: function $changeAllFilters() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.setFilters(this.$getAllFilters());
            }
        }, {
            key: "$getAllFilters",
            value: function $getAllFilters() {
                var p = this.$DisplayObject;
                return [].concat(p[60]).concat(p[61]);
            }
        }, {
            key: "dispatch",
            value: function dispatch(e) {
                _get(Object.getPrototypeOf(DisplayObject.prototype), "dispatch", this).call(this, e);
                if (e.bubbles && !e.isPropagationStopped && this.__parent && this.$DisplayObject[21]) {
                    this.__parent.dispatch(e);
                }
            }

            /**
             * 计算自身尺寸
             * 子类实现
             * @param size
             */

        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {}

            /**
             * 计算自身在父类中的尺寸
             * @param rect
             */

        }, {
            key: "$measureBounds",
            value: function $measureBounds(rect) {}

            /**
             * 本身尺寸失效
             */

        }, {
            key: "$invalidateContentBounds",
            value: function $invalidateContentBounds() {
                this.$addFlagsUp(0x0001 | 0x0004);
            }

            /**
             * 矩阵失效
             */

        }, {
            key: "$invalidateMatrix",
            value: function $invalidateMatrix() {
                this.$addFlags(0x0008 | 0x0010);
                this.$invalidatePosition();
            }

            /**
             * 逆矩阵失效
             */

        }, {
            key: "$invalidateReverseMatrix",
            value: function $invalidateReverseMatrix() {
                this.$addFlags(0x0010);
                this.$invalidatePosition();
            }

            /**
             * 位置失效
             */

        }, {
            key: "$invalidatePosition",
            value: function $invalidatePosition() {
                this.$addFlagsUp(0x0004);
                if (this.__parent) {
                    this.__parent.$addFlagsUp(0x0001);
                }
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
                touchX = math.floor(point.x);
                touchY = math.floor(point.y);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                p[22] = flower.EnterFrame.frame;
                var bounds = this.$getContentBounds();
                if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
                    return this;
                }
                return null;
            }

            /**
             * 测量鼠标位置
             */

        }, {
            key: "$measureMousePosition",
            value: function $measureMousePosition() {
                var p = this.$DisplayObject;
                if (p[22] != flower.EnterFrame.frame && this.parent) {
                    this.parent.$measureMousePosition();
                    var mouseX = this.parent.mouseX;
                    var mouseY = this.parent.mouseY;
                    var point = this.$getReverseMatrix().transformPoint(mouseX, mouseY, Point.$TempPoint);
                    mouseX = math.floor(point.x);
                    mouseY = math.floor(point.y);
                    p[10] = mouseX;
                    p[11] = mouseY;
                    p[22] = flower.EnterFrame.frame;
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                DebugInfo.frameInfo.display++;
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }
            }
        }, {
            key: "localToGlobal",
            value: function localToGlobal(point) {
                var display = this;
                while (display.parent) {
                    display = display.parent;
                }
                return this.localToDisplay(point, display);
            }
        }, {
            key: "localToDisplay",
            value: function localToDisplay(point, display) {
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
        }, {
            key: "startDrag",
            value: function startDrag() {
                var dragSprite = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
                var dragType = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
                var dragData = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                var point = this.localToGlobal(flower.Point.create());
                DragManager.startDrag(point.x, point.y, this, dragSprite, dragType, dragData);
                flower.Point.release(point);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.__parent) {
                    this.__parent.removeChild(this);
                }
                DebugInfo.displayInfo.display--;
                _get(Object.getPrototypeOf(DisplayObject.prototype), "dispose", this).call(this);
            }
        }, {
            key: "x",
            get: function get() {
                return this.$getX();
            },
            set: function set(val) {
                this.$setX(val);
            }
        }, {
            key: "y",
            get: function get() {
                return this.$getY();
            },
            set: function set(val) {
                this.$setY(val);
            }
        }, {
            key: "scaleX",
            get: function get() {
                return this.$getScaleX();
            },
            set: function set(val) {
                this.$setScaleX(val);
            }
        }, {
            key: "scaleY",
            get: function get() {
                return this.$getScaleY();
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
            key: "radian",
            get: function get() {
                return this.$DisplayObject[14];
            }
        }, {
            key: "alpha",
            get: function get() {
                return this.__alpha;
            },
            set: function set(val) {
                this.$setAlpha(val);
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
        }, {
            key: "visible",
            get: function get() {
                return this.__visible;
            },
            set: function set(val) {
                this.$setVisible(val);
            }
        }, {
            key: "stage",
            get: function get() {
                return this.__stage;
            }
        }, {
            key: "name",
            get: function get() {
                return this.$DisplayObject[5];
            },
            set: function set(val) {
                this.$DisplayObject[5] = val;
            }
        }, {
            key: "touchEnabled",
            get: function get() {
                var p = this.$DisplayObject;
                return p[8];
            },
            set: function set(val) {
                this.$setTouchEnabled(val);
            }
        }, {
            key: "multiplyTouchEnabled",
            get: function get() {
                var p = this.$DisplayObject;
                return p[9];
            },
            set: function set(val) {
                this.$setMultiplyTouchEnabled(val);
            }
        }, {
            key: "mouseX",
            get: function get() {
                var p = this.$DisplayObject;
                if (p[22] != flower.EnterFrame.frame) {
                    this.$measureMousePosition();
                }
                return p[10];
            }
        }, {
            key: "mouseY",
            get: function get() {
                var p = this.$DisplayObject;
                if (p[22] != flower.EnterFrame.frame) {
                    this.$measureMousePosition();
                }
                return p[11];
            }
        }, {
            key: "filters",
            get: function get() {
                return this.$getAllFilters();
            },
            set: function set(val) {
                this.$setFilters(val);
            }
        }, {
            key: "focusEnabled",
            get: function get() {
                return this.$DisplayObject[50];
            },
            set: function set(val) {
                this.$DisplayObject[50] = val;
            }
        }, {
            key: "id",
            get: function get() {
                return this.$DisplayObject[20];
            }
        }, {
            key: "dispatchEventToParent",
            get: function get() {
                return this.$DisplayObject[21];
            },
            set: function set(val) {
                this.$setDispatchEventToParent(val);
            }
        }, {
            key: "contentBounds",
            get: function get() {
                return this.$getContentBounds().clone();
            }
        }, {
            key: "program",
            set: function set(val) {
                this.$DisplayObject[70] = val;
                if (val) {
                    this.$nativeShow.setProgrammer(val.$nativeProgram);
                } else {
                    this.$nativeShow.setProgrammer(null);
                }
            },
            get: function get() {
                return this.$DisplayObject[70];
            }
        }]);

        return DisplayObject;
    }(EventDispatcher);

    DisplayObject.id = 0;


    flower.DisplayObject = DisplayObject;
    //////////////////////////End File:flower/display/DisplayObject.js///////////////////////////

    //////////////////////////File:flower/display/Sprite.js///////////////////////////

    var Sprite = function (_DisplayObject) {
        _inherits(Sprite, _DisplayObject);

        function Sprite() {
            _classCallCheck(this, Sprite);

            var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(Sprite).call(this));

            _this17.$Sprite = {
                0: new flower.Rectangle() //childrenBounds
            };
            _this17.$initContainer();
            DebugInfo.displayInfo.sprite++;
            return _this17;
        }

        _createClass(Sprite, [{
            key: "$initContainer",
            value: function $initContainer() {
                this.__children = [];
                this.$nativeShow = Platform.create("Sprite");
            }

            //$addFlags(flags) {
            //    if (flags == 0x0001) {
            //        this.$addFlagsDown()
            //    }
            //    //this.__flags |= flags;
            //}

        }, {
            key: "$addFlagsDown",
            value: function $addFlagsDown(flags) {
                if (this.$hasFlags(flags)) {
                    return;
                }
                this.$addFlags(flags);
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
                return child;
            }
        }, {
            key: "addChildAt",
            value: function addChildAt(child, index) {
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
        }, {
            key: "$setStage",
            value: function $setStage(stage) {
                _get(Object.getPrototypeOf(Sprite.prototype), "$setStage", this).call(this, stage);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$setStage(this.stage);
                }
            }
        }, {
            key: "$dispatchAddedToStageEvent",
            value: function $dispatchAddedToStageEvent() {
                _get(Object.getPrototypeOf(Sprite.prototype), "$dispatchAddedToStageEvent", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$dispatchAddedToStageEvent();
                }
            }
        }, {
            key: "$dispatchRemovedFromStageEvent",
            value: function $dispatchRemovedFromStageEvent() {
                _get(Object.getPrototypeOf(Sprite.prototype), "$dispatchRemovedFromStageEvent", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$dispatchRemovedFromStageEvent();
                }
            }
        }, {
            key: "$removeChild",
            value: function $removeChild(child) {
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
        }, {
            key: "removeChild",
            value: function removeChild(child) {
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
        }, {
            key: "removeChildAt",
            value: function removeChildAt(index) {
                var children = this.__children;
                if (index < 0 || index >= children.length) {
                    return;
                }
                return this.removeChild(children[index]);
            }
        }, {
            key: "setChildIndex",
            value: function setChildIndex(child, index) {
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
            key: "getChildAt",
            value: function getChildAt(index) {
                index = index & ~0;
                if (index < 0 || index > this.__children.length - 1) {
                    $error(1007, "getChildAt", index, this.__children.length);
                    return null;
                }
                return this.__children[index];
            }
        }, {
            key: "removeAll",
            value: function removeAll() {
                while (this.numChildren) {
                    this.removeChildAt(0);
                }
            }
        }, {
            key: "$changeAllFilters",
            value: function $changeAllFilters() {
                _get(Object.getPrototypeOf(Sprite.prototype), "$changeAllFilters", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$setParentFilters(this.$getAllFilters());
                }
            }

            /**
             * 测量子对象的区域
             * @param rect
             */

        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
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
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                if (this.touchEnabled == false || this.visible == false) return null;
                if (multiply == true && this.multiplyTouchEnabled == false) return null;
                var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
                touchX = math.floor(point.x);
                touchY = math.floor(point.y);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                p[22] = flower.EnterFrame.frame;
                var target;
                var childs = this.__children;
                var len = childs.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (childs[i].touchEnabled && childs[i].visible && (multiply == false || multiply == true && childs[i].multiplyTouchEnabled == true)) {
                        target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                        if (target) {
                            break;
                        }
                    }
                }
                return target;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
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
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                DebugInfo.frameInfo.display++;
                DebugInfo.frameInfo.sprite++;
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }
            }
        }, {
            key: "$releaseContainer",
            value: function $releaseContainer() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                Platform.release("Sprite", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                DebugInfo.displayInfo.sprite--;
                var children = this.__children;
                while (children.length) {
                    var child = children[children.length - 1];
                    child.dispose();
                }
                _get(Object.getPrototypeOf(Sprite.prototype), "dispose", this).call(this);
                this.$releaseContainer();
            }
        }, {
            key: "numChildren",
            get: function get() {
                return this.__children.length;
            }
        }, {
            key: "$childrenBounds",
            get: function get() {
                return this.$Sprite[0];
            }
        }]);

        return Sprite;
    }(DisplayObject);

    flower.Sprite = Sprite;
    //////////////////////////End File:flower/display/Sprite.js///////////////////////////

    //////////////////////////File:flower/display/Mask.js///////////////////////////

    var Mask = function (_Sprite) {
        _inherits(Mask, _Sprite);

        function Mask() {
            _classCallCheck(this, Mask);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(Mask).call(this));
        }

        _createClass(Mask, [{
            key: "$initContainer",
            value: function $initContainer() {
                this.__children = [];
                this.$nativeShow = Platform.create("Mask");
                this.__shape = this.$createShape();
                this.$nativeShow.setShape(this.__shape.$nativeShow, this.__shape);
            }
        }, {
            key: "$createShape",
            value: function $createShape() {
                return new Shape();
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                if (this.touchEnabled == false || this.visible == false) return null;
                if (multiply == true && this.multiplyTouchEnabled == false) return null;
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
                        if (childs[i].touchEnabled && (multiply == false || multiply == true && childs[i].multiplyTouchEnabled == true)) {
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
        }, {
            key: "$releaseContainer",
            value: function $releaseContainer() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                Platform.release("Mask", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "shape",
            get: function get() {
                return this.__shape;
            }
        }]);

        return Mask;
    }(Sprite);

    flower.Mask = Mask;
    //////////////////////////End File:flower/display/Mask.js///////////////////////////

    //////////////////////////File:flower/display/Bitmap.js///////////////////////////

    var Bitmap = function (_DisplayObject2) {
        _inherits(Bitmap, _DisplayObject2);

        function Bitmap(texture) {
            _classCallCheck(this, Bitmap);

            var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(Bitmap).call(this));

            _this19.$nativeShow = Platform.create("Bitmap");
            _this19.texture = texture;
            _this19.$Bitmap = {
                0: null, //scale9Grid
                1: true //touchSpace
            };
            DebugInfo.displayInfo.bitmap++;
            return _this19;
        }

        _createClass(Bitmap, [{
            key: "$setTexture",
            value: function $setTexture(val) {
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
                } else {
                    this.$nativeShow.setTexture(Texture.$blank);
                }
                if (this.__texture && this.__texture.dispatcher) {
                    this.__texture.dispatcher.addListener(Event.CHANGE, this.$updateTexture, this);
                }
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$updateTexture",
            value: function $updateTexture(e) {
                var txt = this.texture;
                this.texture = null;
                this.texture = txt;
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                if (_get(Object.getPrototypeOf(Bitmap.prototype), "$setWidth", this).call(this, val) == false) {
                    return false;
                }
                var p = this.$DisplayObject;
                this.$nativeShow.setSettingWidth(p[3]);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                if (_get(Object.getPrototypeOf(Bitmap.prototype), "$setHeight", this).call(this, val) == false) {
                    return false;
                }
                var p = this.$DisplayObject;
                this.$nativeShow.setSettingHeight(p[4]);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
                touchX = math.floor(point.x);
                touchY = math.floor(point.y);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                p[22] = flower.EnterFrame.frame;
                var bounds;
                bounds = Rectangle.$TempRectangle;
                if (this.$Bitmap[1] || !this.__texture) {
                    bounds.x = 0;
                    bounds.y = 0;
                    bounds.width = this.width;
                    bounds.height = this.height;
                } else {
                    bounds.x = this.__texture.offX;
                    bounds.y = this.__texture.offY;
                    bounds.width = this.width - this.__texture.offX;
                    bounds.height = this.height - this.__texture.offY;
                }
                if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
                    return this;
                }
                return null;
            }
        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
                rect.x = rect.y = 0;
                if (this.__texture) {
                    rect.width = this.__texture.width;
                    rect.height = this.__texture.height;
                } else {
                    rect.width = rect.height = 0;
                }
            }
        }, {
            key: "$setScale9Grid",
            value: function $setScale9Grid(val) {
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
        }, {
            key: "$setTouchSpace",
            value: function $setTouchSpace(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                var p = this.$Bitmap;
                if (p[1] == val) {
                    return;
                }
                p[1] = val;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                DebugInfo.displayInfo.bitmap--;
                this.texture = null;
                _get(Object.getPrototypeOf(Bitmap.prototype), "dispose", this).call(this);
                Platform.release("Bitmap", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "texture",
            get: function get() {
                return this.__texture;
            },
            set: function set(val) {
                this.$setTexture(val);
            }
        }, {
            key: "scale9Grid",
            get: function get() {
                var p = this.$Bitmap;
                return p[0];
            },
            set: function set(val) {
                this.$setScale9Grid(val);
            }
        }, {
            key: "touchSpace",
            get: function get() {
                return this.$Bitmap[1];
            },
            set: function set(val) {
                this.$setTouchSpace(val);
            }
        }]);

        return Bitmap;
    }(DisplayObject);

    flower.Bitmap = Bitmap;
    //////////////////////////End File:flower/display/Bitmap.js///////////////////////////

    //////////////////////////File:flower/display/$TextField.js///////////////////////////

    var $TextField = function (_DisplayObject3) {
        _inherits($TextField, _DisplayObject3);

        function $TextField() {
            var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, $TextField);

            var _this20 = _possibleConstructorReturn(this, Object.getPrototypeOf($TextField).call(this));

            _this20.$nativeShow = Platform.create("TextField");
            _this20.$TextField = {
                0: "", //text
                1: 12, //fontSize
                2: 0x000000, //fontColor
                3: false, //wordWrap
                4: false, //multiline
                5: true //autoSize
            };
            if (text != "") {
                _this20.text = text;
            }
            //DebugInfo.displayInfo.text++;
            return _this20;
        }

        _createClass($TextField, [{
            key: "$checkSettingSize",
            value: function $checkSettingSize(rect) {}
        }, {
            key: "$setText",
            value: function $setText(val) {
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
        }, {
            key: "$measureText",
            value: function $measureText(rect) {
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
        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
                this.$measureText(rect);
            }
        }, {
            key: "$setFontSize",
            value: function $setFontSize(val) {
                var p = this.$TextField;
                if (p[1] == val) {
                    return false;
                }
                p[1] = val;
                this.$addFlags(0x0800);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$setMultiLine",
            value: function $setMultiLine(val) {
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
        }, {
            key: "$setFontColor",
            value: function $setFontColor(val) {
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
        }, {
            key: "$setWordWrap",
            value: function $setWordWrap(val) {
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
        }, {
            key: "$setAutoSize",
            value: function $setAutoSize(val) {
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
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                var flag = _get(Object.getPrototypeOf($TextField.prototype), "$setWidth", this).call(this, val);
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
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                var flag = _get(Object.getPrototypeOf($TextField.prototype), "$setHeight", this).call(this, val);
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
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x0800)) {
                    this.$getContentBounds();
                }
                //super.$onFrameEnd();
                //DebugInfo.frameInfo.display++;
                //DebugInfo.frameInfo.text++;
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                //DebugInfo.displayInfo.text--;
                _get(Object.getPrototypeOf($TextField.prototype), "dispose", this).call(this);
                Platform.release("TextField", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "text",
            get: function get() {
                var p = this.$TextField;
                return p[0];
            },
            set: function set(val) {
                this.$setText(val);
            }
        }, {
            key: "fontColor",
            get: function get() {
                var p = this.$TextField;
                return p[2];
            },
            set: function set(val) {
                this.$setFontColor(val);
            }
        }, {
            key: "fontSize",
            get: function get() {
                var p = this.$TextField;
                return p[1];
            },
            set: function set(val) {
                this.$setFontSize(val);
            }
        }, {
            key: "autoSize",
            get: function get() {
                var p = this.$TextField;
                return p[5];
            },
            set: function set(val) {
                this.$setAutoSize(val);
            }
        }, {
            key: "wordWrap",
            set: function set(val) {
                this.$setWordWrap(val);
            },
            get: function get() {
                var p = this.$TextField;
                return p[3];
            }
        }, {
            key: "multiLine",
            get: function get() {
                var p = this.$TextField;
                return p[4];
            },
            set: function set(val) {
                this.$setMultiLine(val);
            }
        }]);

        return $TextField;
    }(DisplayObject);
    //////////////////////////End File:flower/display/$TextField.js///////////////////////////

    //////////////////////////File:flower/display/TextField.js///////////////////////////


    var TextField = function (_flower$DisplayObject) {
        _inherits(TextField, _flower$DisplayObject);

        function TextField(text) {
            var _this21$$TextField;

            _classCallCheck(this, TextField);

            var _this21 = _possibleConstructorReturn(this, Object.getPrototypeOf(TextField).call(this));

            _this21.__changeText = TextField.changeText;
            _this21.__changeRealText = TextField.changeRealText;

            _this21.$Sprite = {
                0: new flower.Rectangle() //childrenBounds
            };
            _this21.$initContainer();
            DebugInfo.displayInfo.text++;

            _this21.$TextField = (_this21$$TextField = {
                0: "", //text
                1: "", //htmlText formatHtmlText
                2: [], //lines
                3: 0, //inputLength
                4: new flower.Sprite(), //textContainer
                5: null, //this.__getDefaultFocus(), //focus
                6: "", //setHtmlText
                7: 0, //chars
                9: 0.5, //shineGap
                10: 12, //fontSize
                11: 0, //fontColor
                12: 4, //leading
                13: false, //wordWrap
                14: null, //new flower.Sprite(), //backgroundContainer
                15: 0, //textContainerMaskWidth
                16: 0, //textContainerMaskHeight
                17: 0, //contentWidth
                18: 0, //contentHeight
                21: "left", //algin
                22: false, //input
                23: true, //selectable
                24: true, //multiline
                25: false, //enterend
                26: true, //inputtingChange
                29: 2, //lineStart
                30: 0, //caretIndex
                31: 0, //caretHtmlIndex
                32: null }, _defineProperty(_this21$$TextField, "32", null), _defineProperty(_this21$$TextField, 33, null), _defineProperty(_this21$$TextField, 34, 0), _defineProperty(_this21$$TextField, 50, 0), _defineProperty(_this21$$TextField, 51, 0), _defineProperty(_this21$$TextField, 100, false), _defineProperty(_this21$$TextField, 101, {}), _defineProperty(_this21$$TextField, 102, {}), _defineProperty(_this21$$TextField, 200, 0), _defineProperty(_this21$$TextField, 201, false), _defineProperty(_this21$$TextField, 300, false), _defineProperty(_this21$$TextField, 301, 0), _defineProperty(_this21$$TextField, 302, 0), _defineProperty(_this21$$TextField, 303, 0), _defineProperty(_this21$$TextField, 304, false), _defineProperty(_this21$$TextField, 305, ""), _defineProperty(_this21$$TextField, 306, ""), _defineProperty(_this21$$TextField, 307, 0), _defineProperty(_this21$$TextField, 308, []), _defineProperty(_this21$$TextField, 311, null), _defineProperty(_this21$$TextField, 312, null), _defineProperty(_this21$$TextField, 313, null), _defineProperty(_this21$$TextField, 350, 0), _defineProperty(_this21$$TextField, 351, 0), _defineProperty(_this21$$TextField, 330, 0), _defineProperty(_this21$$TextField, 400, false), _defineProperty(_this21$$TextField, 401, []), _defineProperty(_this21$$TextField, 402, ""), _defineProperty(_this21$$TextField, 1000, 0x526da5), _defineProperty(_this21$$TextField, 1001, 0xffffff), _this21$$TextField);
            //被选文字的颜色
            _this21.$TextField[4].x = _this21.$TextField[29];
            _this21.addChild(_this21.$TextField[4]);
            //this.addChild(this.$TextField[5]);
            _this21.addListener(flower.TouchEvent.TOUCH_BEGIN, _this21.__onTouch, _this21);
            _this21.addListener(flower.TouchEvent.TOUCH_MOVE, _this21.__onTouch, _this21);
            _this21.addListener(flower.Event.FOCUS_OUT, _this21.__stopInput, _this21);
            _this21.focusEnabled = true;
            _this21.__input = flower.Stage.getInstance().$input;
            flower.EnterFrame.add(_this21.$update, _this21);

            if (text && text != "") {
                _this21.text = text;
            }
            return _this21;
        }

        _createClass(TextField, [{
            key: "__createBackgroundContainer",
            value: function __createBackgroundContainer() {
                var p = this.$TextField;
                if (p[14] == null) {
                    p[14] = new flower.Sprite();
                    var index = this.getChildIndex(p[4]);
                    this.addChildAt(p[14], index - 1 < 0 ? 0 : index - 1);
                    if (p[21] == "right") {
                        p[14].x = -p[29];
                    } else if (p[21] == "center") {
                        p[14].x = 0;
                    } else {
                        p[14].x = p[29];
                    }
                }
            }
        }, {
            key: "__crateFocus",
            value: function __crateFocus() {
                var p = this.$TextField;
                if (!p[5]) {
                    var index = this.getChildIndex(p[4]);
                    p[5] = this.__getDefaultFocus();
                    this.addChildAt(p[5], index + 1);
                }
            }
        }, {
            key: "__onTouch",
            value: function __onTouch(e) {
                var p = this.$TextField;
                if (!p[23]) {
                    return;
                }
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        this.__cancelSelect();
                        var doubleClick = false;
                        var tribleClick = false;
                        if (!p[201]) {
                            if (flower.CoreTime.currentTime - p[200] < 200) {
                                doubleClick = true;
                            }
                        } else {
                            if (flower.CoreTime.currentTime - p[200] < 200) {
                                doubleClick = true;
                                tribleClick = true;
                            }
                        }
                        p[200] = flower.CoreTime.currentTime;
                        p[201] = doubleClick;
                        if (tribleClick) {
                            //三击
                            this.__tribleClick();
                        } else if (doubleClick) {
                            //双击
                            this.__doubleClick();
                        } else {
                            //单击
                            this.__click();
                        }
                        p[330] = p[301];
                        break;
                    case flower.TouchEvent.TOUCH_MOVE:
                        var charIndex = p[330];
                        var info = this.__getClickPos();
                        this.__cancelSelect();
                        var htmlTextIndex1 = this.__getHtmlTextIndexByCharIndex(charIndex);
                        var htmlTextIndex2 = this.__getHtmlTextIndexByCharIndex(info.charIndex);
                        this.__selecteText(htmlTextIndex1 < htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2, p[1].slice(htmlTextIndex1 < htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2, htmlTextIndex1 > htmlTextIndex2 ? htmlTextIndex1 : htmlTextIndex2));
                        p[301] = info.charIndex;
                        this.$moveCaretIndex();
                        break;
                }
            }

            /**
             * 连续三次点击
             * @private
             */

        }, {
            key: "__tribleClick",
            value: function __tribleClick() {
                console.log("三击");
            }

            /**
             * 连续两次点击
             * @private
             */

        }, {
            key: "__doubleClick",
            value: function __doubleClick() {
                console.log("双击");
            }

            /**
             * 点击
             * @private
             */

        }, {
            key: "__click",
            value: function __click() {
                this.__startInput(this.__getClickPos());
            }
        }, {
            key: "__startInput",
            value: function __startInput(info) {
                var p = this.$TextField;
                if (p[300]) {
                    return;
                }
                if (this.input) {
                    if (!p[5]) {
                        this.__crateFocus();
                    }
                    p[300] = true;
                    p[301] = info.charIndex;
                    p[302] = info.htmlTextIndex;
                    p[307] = info.lineCharIndex;
                    p[308].length = 0;
                    this.__input.text = "";
                    this.__input.$setNativeText("");
                    this.__input.$startNativeInput();
                    flower.EnterFrame.add(this.__update, this);
                    this.__showFocus(info);
                }
                this.addListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
                this.dispatchWith(flower.Event.START_INPUT, null, true);
            }
        }, {
            key: "__stopInput",
            value: function __stopInput() {
                this.$TextField[300] = false;
                this.__input.$stopNativeInput();
                this.removeListener(flower.KeyboardEvent.KEY_DOWN, this.__onKeyDown, this);
                flower.EnterFrame.remove(this.__update, this);
                this.__hideFocus();
                this.dispatchWith(flower.Event.STOP_INPUT, null, true);
            }
        }, {
            key: "__hideFocus",
            value: function __hideFocus() {
                if (this.$TextField[5]) {
                    this.$TextField[5].visible = false;
                }
            }
        }, {
            key: "__onKeyDown",
            value: function __onKeyDown(e) {
                new flower.CallLater(this.__doKeyEvent, this, [e]);
                //if (e.keyCode == 16) {
                //    this.$TextField[308].push({keyCode: e.keyCode});
                //} else {
                //    this.__doKeyEvent(e);
                //}
            }

            //输入字符

        }, {
            key: "__inputText",
            value: function __inputText(text) {
                var under = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                var p = this.$TextField;
                if (p[400]) {
                    this.__deleteSelect();
                    if (p[304]) {
                        p[311] = p[301];
                        p[312] = p[302];
                        p[313] = p[1];
                        p[323] = p[3];
                    }
                }
                var htmlText = this.__changeText(text);
                if (under) {
                    htmlText = "<u>" + htmlText + "</u>";
                }
                this.__inputHtmlText(htmlText);
            }

            //输入字符

        }, {
            key: "__inputHtmlText",
            value: function __inputHtmlText(text) {
                var p = this.$TextField;
                var chars = p[3];
                this.htmlText = p[1].slice(0, p[302]) + text + p[1].slice(p[302], p[1].length);
                p[301] += p[3] - chars;
                this.$moveCaretIndex();
            }

            /**
             * 从输入点开始删除一个字符
             * @param num
             */

        }, {
            key: "$deleteCaretChar",
            value: function $deleteCaretChar() {
                var p = this.$TextField;
                var lines = p[2];
                var pos = p[301];
                if (pos == 0) {
                    return;
                }
                var findLine;
                if (pos > p[3]) {
                    pos = p[3];
                }
                for (var i = 0; i < lines.length; i++) {
                    if (pos > lines[i].charIndex && pos <= lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                        findLine = lines[i];
                        break;
                    }
                }
                if (!findLine) {
                    return;
                }
                p[301]--;
                pos -= findLine.charIndex;
                if (pos == findLine.chars && findLine.index != lines.length - 1) {
                    this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findLine.htmlText.length) + p[1].slice(findLine.htmlTextIndex + findLine.htmlText.length + findLine.endHtmlText.length, p[1].length);
                    return;
                }
                var findSubline;
                for (var i = 0; i < findLine.sublines.length; i++) {
                    if (pos > findLine.sublines[i].charIndex && pos <= findLine.sublines[i].charIndex + findLine.sublines[i].chars) {
                        findSubline = findLine.sublines[i];
                        break;
                    }
                }
                if (!findSubline) {
                    return;
                }
                pos -= findSubline.charIndex;
                var findDisplay;
                for (var i = 0; i < findSubline.displays.length; i++) {
                    if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                        findDisplay = findSubline.displays[i];
                        break;
                    }
                }
                pos -= findDisplay.charIndex;
                if (findDisplay.type == 0) {
                    this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex) + findDisplay.htmlText.slice(0, findDisplay.textStart) + this.__changeText(findDisplay.text.slice(0, pos - 1)) + this.__changeText(findDisplay.text.slice(pos, findDisplay.text.length)) + findDisplay.htmlText.slice(findDisplay.textEnd, findDisplay.htmlText.length) + p[1].slice(findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex + findDisplay.htmlText.length, p[1].length);
                } else {
                    this.htmlText = p[1].slice(0, findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex) + p[1].slice(findLine.htmlTextIndex + findSubline.htmlTextIndex + findDisplay.htmlTextIndex + findDisplay.htmlText.length, p[1].length);
                }
                this.$moveCaretIndex();
            }

            /**
             * 把焦点移到其它行后，计算当前焦点的位置，当前                                                                                              位置插入的位置(htmlTextIndex)
             * @param index 与当前行相差多少
             */

        }, {
            key: "$moveCaretIndex",
            value: function $moveCaretIndex() {
                var lineIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                var p = this.$TextField;
                this.__moveCareIndex(lineIndex);
                var focus = p[5];
                if (focus) {
                    if (p[21] == "right") {
                        focus.x -= p[29];
                    } else if (p[21] == "center") {} else {
                        focus.x += p[29];
                    }
                    if (focus.x + p[50] < p[29]) {
                        p[50] = p[29] - focus.x;
                        p[100] = true;
                    }
                    if (focus.x + focus.width > this.width - p[29]) {
                        p[50] = this.width - p[29] - (focus.x + focus.width);
                        p[100] = true;
                    }
                    if (focus.y + p[51] < 0) {
                        p[51] = -focus.y;
                        p[100] = true;
                    }
                    if (focus.y + focus.height > this.height) {
                        p[51] = this.height - (focus.y + focus.height);
                        p[100] = true;
                    }
                    focus.x += p[50];
                    focus.y += p[51];
                }
            }
        }, {
            key: "__moveCareIndex",
            value: function __moveCareIndex() {
                var lineIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                var p = this.$TextField;
                var lines = p[2];
                var pos = p[301];
                var focus = p[5];
                if (focus) {
                    focus.x = 0;
                    focus.y = 0;
                    focus.height = p[10] + p[12] * 0.5;
                    if (p[21] == "center") {
                        focus.x = this.width * .5;
                    } else if (p[21] == "right") {
                        focus.x = this.width;
                    }
                }
                p[302] = 0;
                var findLine;
                for (var i = 0; i < lines.length; i++) {
                    if (pos >= lines[i].charIndex && pos < lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                        findLine = lines[i];
                        break;
                    }
                }
                if (!findLine) {
                    return;
                }
                if (focus) {
                    focus.x = findLine.x;
                    focus.y = findLine.y;
                    focus.height = findLine.height;
                }
                pos -= findLine.charIndex;
                p[302] = findLine.htmlTextIndex;
                var findSubline;
                for (var i = 0; i < findLine.sublines.length; i++) {
                    if (pos >= findLine.sublines[i].charIndex && pos < findLine.sublines[i].charIndex + findLine.sublines[i].chars || i == findLine.sublines.length - 1) {
                        findSubline = findLine.sublines[i];
                        break;
                    }
                }
                //如果有行的移动，重新计算所在行
                if (lineIndex) {
                    pos = p[307];
                    while (lineIndex) {
                        if (lineIndex > 0) {
                            if (!findSubline || findSubline.index < findLine.sublines.length - 1) {
                                findSubline = findLine.sublines[findSubline.index + 1];
                            } else {
                                if (findLine.index < lines.length - 1) {
                                    findLine = lines[findLine.index + 1];
                                    if (findLine.sublines.length) {
                                        findSubline = findLine.sublines[0];
                                    } else {
                                        break;
                                    }
                                } else {
                                    break;
                                }
                            }
                            lineIndex--;
                        } else {
                            if (!findSubline || findSubline.index > 0) {
                                findSubline = findLine.sublines[findSubline.index - 1];
                            } else {
                                if (findLine.index > 0) {
                                    findLine = lines[findLine.index - 1];
                                    if (findLine.sublines.length) {
                                        findSubline = findLine.sublines[0];
                                    } else {
                                        break;
                                    }
                                } else {
                                    break;
                                }
                            }
                            lineIndex++;
                        }
                    }
                    if (focus) {
                        focus.x = findLine.x;
                        focus.y = findLine.y;
                        focus.height = findLine.height;
                    }
                    p[302] = findLine.htmlTextIndex;
                    p[301] = findLine.charIndex;
                    if (!findSubline) {
                        return;
                    } else {
                        if (focus) {
                            focus.x += findSubline.x;
                            focus.y += findSubline.y;
                            focus.height = findSubline.height;
                        }
                        p[302] += findSubline.htmlTextIndex;
                        p[301] += pos < findSubline.chars ? pos : findSubline.chars;
                    }
                } else {
                    if (!findSubline) {
                        return;
                    } else {
                        if (focus) {
                            focus.x += findSubline.x;
                            focus.y += findSubline.y;
                            focus.height = findSubline.height;
                        }
                        pos -= findSubline.charIndex;
                        p[302] += findSubline.htmlTextIndex;
                        p[307] = pos;
                    }
                }
                if (pos == 0) {
                    return;
                }
                var findDisplay;
                for (var i = 0; i < findSubline.displays.length; i++) {
                    if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                        findDisplay = findSubline.displays[i];
                        break;
                    }
                }
                if (!findDisplay) {
                    return;
                }
                if (focus) {
                    focus.x += findDisplay.x;
                }
                pos -= findDisplay.charIndex;
                p[302] += findDisplay.htmlTextIndex;
                if (findDisplay.type == 0) {
                    var text = findDisplay.text;
                    var size = findDisplay.font.size;
                    if (focus) {
                        focus.x += flower.$measureTextWidth(size, text.slice(0, pos));
                    }
                    p[302] += findDisplay.textStart + this.__changeText(text.slice(0, pos)).length;
                } else {
                    if (pos) {
                        if (focus) {
                            focus.x += findDisplay.width;
                        }
                        p[302] += findDisplay.htmlText.length;
                    }
                }
            }
        }, {
            key: "__getHtmlTextIndexByCharIndex",
            value: function __getHtmlTextIndexByCharIndex(pos) {
                var p = this.$TextField;
                var lines = p[2];
                var htmlTextIndex = 0;
                if (pos == 0) {
                    return htmlTextIndex;
                }
                var findLine;
                for (var i = 0; i < lines.length; i++) {
                    if (pos >= lines[i].charIndex && pos < lines[i].charIndex + lines[i].chars || i == lines.length - 1) {
                        findLine = lines[i];
                        break;
                    }
                }
                if (!findLine) {
                    return htmlTextIndex;
                }
                pos -= findLine.charIndex;
                htmlTextIndex = findLine.htmlTextIndex;
                var findSubline;
                for (var i = 0; i < findLine.sublines.length; i++) {
                    if (pos >= findLine.sublines[i].charIndex && pos < findLine.sublines[i].charIndex + findLine.sublines[i].chars || i == findLine.sublines.length - 1) {
                        findSubline = findLine.sublines[i];
                        break;
                    }
                }
                if (!findSubline) {
                    return htmlTextIndex;
                } else {
                    pos -= findSubline.charIndex;
                    htmlTextIndex += findSubline.htmlTextIndex;
                }
                if (pos == 0) {
                    return htmlTextIndex;
                }
                var findDisplay;
                for (var i = 0; i < findSubline.displays.length; i++) {
                    if (pos > findSubline.displays[i].charIndex && pos <= findSubline.displays[i].charIndex + findSubline.displays[i].chars || i == findSubline.displays.length - 1) {
                        findDisplay = findSubline.displays[i];
                        break;
                    }
                }
                if (!findDisplay) {
                    return htmlTextIndex;
                }
                pos -= findDisplay.charIndex;
                htmlTextIndex += findDisplay.htmlTextIndex;
                if (findDisplay.type == 0) {
                    var text = findDisplay.text;
                    var size = findDisplay.font.size;
                    htmlTextIndex += findDisplay.textStart + this.__changeText(text.slice(0, pos)).length;
                } else {
                    if (pos) {
                        htmlTextIndex += findDisplay.htmlText.length;
                    }
                }
                return htmlTextIndex;
            }
        }, {
            key: "__getCharIndexByHtmlTextIndex",
            value: function __getCharIndexByHtmlTextIndex(index) {
                var p = this.$TextField;
                var lines = p[2];
                if (lines.length) {
                    return 0;
                }
                for (var i = 0; i < lines.lengt; i++) {
                    var line = lines[i];
                    if (line.htmlTextIndex <= index && line.htmlTextIndex + line.htmlText.length + line.endHtmlText.length > index || i == lines.length - 1) {
                        index -= line.htmlTextIndex;
                        var sublines = line.sublines;
                        if (sublines.length) {
                            return line.charIndex;
                        }
                        for (var s = 0; s < sublines.length; s++) {
                            var subline = sublines[s];
                            if (subline.htmlTextIndex <= index && subline.htmlTextIndex + subline.htmlText.length || s == sublines.length - 1) {
                                var displays = subline.displays;
                                if (displays.length) {
                                    return line.charIndex + subline.charIndex;
                                }
                                index -= subline.htmlTextIndex;
                                for (var d = 0; d < displays.length; d++) {
                                    var display = displays[d];
                                    if (display.htmlTextIndex <= index && display.htmlTextIndex + display.htmlText.length || d == displays.length - 1) {
                                        return line.charIndex + subline.charIndex + display.text.slice(0, this.__changeRealText(display.htmlText.slice(display.textStart, index)).length).length;
                                    }
                                }
                            }
                        }
                    }
                }
                return 0;
            }

            /**
             * 增加选中的段落
             * @param htmlTextIndex
             * @param htmlText
             * @private
             */

        }, {
            key: "__selecteText",
            value: function __selecteText(htmlTextIndex, htmlText) {
                if (htmlText.length == 0) {
                    return;
                }
                var p = this.$TextField;
                if (!p[400]) {
                    p[400] = true;
                    p[402] = p[1];
                }
                p[401].push({ index: htmlTextIndex, htmlText: htmlText });
                var list = p[401];
                var oldHtmlText = p[402];
                var newHtmlText = "";
                var last = 0;
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    newHtmlText += oldHtmlText.slice(last, item.index) + "<s>" + item.htmlText + "</s>";
                    last = item.index + item.htmlText.length;
                    if (i == list.length - 1) {
                        newHtmlText += oldHtmlText.slice(last, oldHtmlText.length);
                    }
                }
                this.__setHtmlText(newHtmlText, false);
            }
        }, {
            key: "__cancelSelect",
            value: function __cancelSelect() {
                var p = this.$TextField;
                if (p[400]) {
                    p[400] = false;
                    this.__setHtmlText(p[402], false);
                    var list = p[401].concat();
                    p[401].length = 0;
                    return list;
                }
                return null;
            }
        }, {
            key: "__deleteSelect",
            value: function __deleteSelect() {
                var p = this.$TextField;
                if (p[400]) {
                    p[400] = false;
                    //this.__setHtmlText(p[402], false);
                    var list = p[401];
                    var oldHtmlText = p[402];
                    var newHtmlText = "";
                    var last = 0;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        newHtmlText += oldHtmlText.slice(last, item.index) + this.__deleteHtmlTextContent(item.htmlText);
                        last = item.index + item.htmlText.length;
                        if (i == list.length - 1) {
                            newHtmlText += oldHtmlText.slice(last, oldHtmlText.length);
                        }
                    }
                    list.length = 0;
                    this.__setHtmlText(newHtmlText, false);
                }
            }
        }, {
            key: "__deleteHtmlTextContent",
            value: function __deleteHtmlTextContent(text) {
                var content = "";
                var last = -1;
                for (var i = 0; i < text.length; i++) {
                    var char = text.charAt(i);
                    if (char == "<") {
                        last = i;
                    } else if (char == ">") {
                        if (last != -1) {
                            var sign = "";
                            var index = last + 1;
                            if (text.charAt(index) == "/") {
                                index++;
                            }
                            while (index < text.length) {
                                var c = text.charAt(index);
                                if (c == " " || c == ">") {
                                    break;
                                }
                                sign += c;
                                index++;
                            }
                            if (sign == "font" || sign == "u" || sign == "s") {
                                content += text.slice(last, i + 1);
                            }
                            last = -1;
                        }
                    }
                }
                return content;
            }
        }, {
            key: "__update",
            value: function __update(now, gap) {
                var p = this.$TextField;
                p[303] += gap;
                if (p[303] < p[9] * 1000 || math.floor(p[303] / (p[9] * 1000)) % 2 == 0) {
                    p[5].visible = true;
                } else {
                    p[5].visible = false;
                }
                while (p[308].length) {
                    this.__doKeyEvent(p[308].shift());
                }
            }
        }, {
            key: "__doKeyEvent",
            value: function __doKeyEvent(e) {
                var p = this.$TextField;
                if (e.keyCode == 229 && this.input) {
                    if (!p[304]) {
                        p[304] = true;
                        p[305] = "";
                        p[311] = p[301];
                        p[312] = p[302];
                        p[313] = p[1];
                        p[323] = p[3];
                        p[350] = p[50];
                        p[351] = p[51];
                    }
                    p[6] += "1";
                    var str = this.__input.$getNativeText();
                    if (p[305] == "") {
                        p[305] = str.charAt(str.length - 1);
                    }
                    p[1] = p[313];
                    p[3] = p[323];
                    p[301] = p[311];
                    p[302] = p[312];
                    p[50] = p[350];
                    p[51] = p[351];
                    if (e.keyCode == 16 || str != p[306].slice(0, str.length) && str.charAt(str.length - 1) != p[305] && str.charAt(str.length - 2) != p[305] && str.charAt(str.length - 3) != p[305]) {
                        this.__inputText(str);
                        this.__input.$setNativeText("");
                        this.$TextField[7] = false;
                        p[304] = false;
                        p[305] == "";
                        p[306] = "";
                    } else {
                        this.__inputText(str, true);
                        p[306] = str;
                        p[305] = str.charAt(str.length - 1);
                    }
                } else if (e.keyCode == 13 && this.input) {
                    if (p[24]) {
                        this.__inputText("\n");
                    } else {
                        if (p[25]) {
                            this.__stopInput();
                        } else {}
                    }
                } else if ((e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 38 || e.keyCode == 40) && this.input) {
                    if (e.keyCode == 37) {
                        if (p[301] == 0) {
                            return;
                        }
                        p[301]--;
                        this.$moveCaretIndex();
                    } else if (e.keyCode == 39) {
                        if (p[301] == p[3]) {
                            return;
                        }
                        p[301]++;
                        this.$moveCaretIndex();
                    } else if (e.keyCode == 38) {
                        //输入点上移一行
                        this.$moveCaretIndex(-1);
                    } else if (e.keyCode == 40) {
                        //输入点下移一行
                        this.$moveCaretIndex(1);
                    } else if (e.keyCode == 8) {
                        if (p[400]) {
                            this.__deleteSelect();
                        } else {
                            if (p[301] == 0) {
                                return;
                            }
                            this.$deleteCaretChar();
                            this.$moveCaretIndex();
                        }
                    }
                } else if (e.keyCode == 91 || e.keyCode == 17) {} else if (this.input) {
                    var str = this.__input.$getNativeText();
                    if (str.length) {
                        this.__inputText(str);
                        this.__input.$setNativeText("");
                    }
                }
            }
        }, {
            key: "__showFocus",
            value: function __showFocus(info) {
                var p = this.$TextField;
                if (this.input) {
                    p[5].visible = true;
                } else {
                    p[5].visible = false;
                }
                p[5].x = info.focusX;
                if (p[21] == "right") {
                    p[5].x -= p[29];
                } else if (p[21] == "center") {} else {
                    p[5].x += p[29];
                }
                p[5].y = info.focusY;
                p[5].height = info.focusHeight;
                if (p[5].x + p[50] < p[29]) {
                    p[50] = p[29] - p[5].x;
                    p[100] = true;
                }
                if (p[5].x + p[5].width > this.width - p[29]) {
                    p[50] = this.width - p[29] - (p[5].x + p[5].width);
                    p[100] = true;
                }
                if (p[5].y + p[51] < 0) {
                    p[51] = -p[5].y;
                    p[100] = true;
                }
                if (p[5].y + p[5].height > this.height) {
                    p[51] = this.height - (p[5].y + p[5].height);
                    p[100] = true;
                }
                p[5].x += p[50];
                p[5].y += p[51];
            }
        }, {
            key: "__getClickPos",
            value: function __getClickPos() {
                var p = this.$TextField;
                var x = this.mouseX;
                var y = this.mouseY;
                if (p[21] == "right") {
                    x += p[29];
                } else if (p[21] == "center") {} else {
                    x -= p[29];
                }
                x -= p[50];
                y -= p[51];
                var lines = p[2];
                var findLine;
                var res = {
                    line: null,
                    subline: null,
                    display: null,
                    charIndex: 0,
                    htmlTextIndex: 0,
                    focusX: 0,
                    focusY: 0,
                    focusHeight: p[10] + p[12] * 0.5,
                    lineCharIndex: 0
                };
                if (p[21] == "center") {
                    res.focusX = this.width * .5;
                } else if (p[21] == "right") {
                    res.focusX = this.width;
                } else {
                    res.focusX = 0;
                }
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.y <= y && line.y + line.height > y || i == lines.length - 1) {
                        findLine = line;
                        break;
                    }
                }
                if (!findLine) {
                    return res;
                }
                res.line = findLine;
                res.charIndex = line.charIndex;
                res.htmlTextIndex = line.htmlTextIndex;
                res.focusX = line.x;
                res.focusY = line.y;
                res.focusHeight = line.height;
                x -= line.x;
                y -= line.y;
                var findSubline;
                for (var i = 0; i < findLine.sublines.length; i++) {
                    var subline = findLine.sublines[i];
                    if (subline.y <= y && subline.y + subline.height > y || i == findLine.sublines.length - 1) {
                        findSubline = subline;
                        break;
                    }
                }
                if (!findSubline) {
                    if (p[21] == "center") {
                        res.focusX = (this.width - line.width) * .5;
                    } else if (p[21] == "right") {
                        res.focusX = this.width;
                    }
                    return res;
                }
                res.subline = findSubline;
                res.charIndex += findSubline.charIndex;
                res.htmlTextIndex += findSubline.htmlTextIndex;
                res.focusX += findSubline.x;
                res.focusY += findSubline.y;
                res.focusHeight = findSubline.height;
                x -= subline.x;
                y -= subline.y;
                var findDisplay;
                for (var i = 0; i < findSubline.displays.length; i++) {
                    var display = findSubline.displays[i];
                    if (x < display.x + display.width || i == findSubline.displays.length - 1) {
                        findDisplay = display;
                        break;
                    }
                }
                if (!findDisplay) {
                    return res;
                }
                res.display = findDisplay;
                res.charIndex += findDisplay.charIndex;
                res.htmlTextIndex += findDisplay.htmlTextIndex;
                res.focusX += findDisplay.x;
                x -= findDisplay.x;
                if (findDisplay.type == 0) {
                    res.htmlTextIndex += findDisplay.textStart;
                    res.lineCharIndex = findDisplay.charIndex;
                    var text = findDisplay.text;
                    var size = findDisplay.font.size;
                    var width = 0;
                    for (var i = 1; i <= text.length; i++) {
                        var textWidth = flower.$measureTextWidth(size, text.slice(0, i));
                        var charWidth = textWidth - width;
                        width = textWidth;
                        if (x <= charWidth * 0.5) {
                            break;
                        } else {
                            x -= charWidth;
                            res.charIndex++;
                            res.htmlTextIndex += this.__changeText(text.charAt(i - 1)).length;
                            res.focusX += charWidth;
                            res.lineCharIndex++;
                        }
                    }
                } else {
                    if (x > findDisplay.width * 0.5) {
                        res.charIndex += findDisplay.chars;
                        res.htmlTextIndex += findDisplay.htmlText.length;
                        res.focusX += findDisplay.width;
                        res.lineCharIndex = findDisplay.charIndex + findDisplay.chars;
                    } else {
                        res.lineCharIndex = findDisplay.charIndex;
                    }
                }
                return res;
            }
        }, {
            key: "$setHtmlText",
            value: function $setHtmlText(text) {
                var p = this.$TextField;
                this.__resetCaches();
                this.__clearOldDisplay();
                var ids = p[102];
                for (var key in ids) {
                    delete ids[key];
                    delete this[key];
                }
                var container = p[4];
                var lines = p[2];
                lines.length = 0;
                var font = {
                    size: p[10],
                    color: p[11],
                    under: false, //下划线
                    underColor: p[11],
                    select: false,
                    gap: p[12],
                    sizes: [],
                    colors: [],
                    unders: [],
                    selects: [],
                    gaps: []
                };
                var line = this.__getNewLine(null, font);
                lines.push(line);
                var last = -1; //上一个 <
                var lastText = "";
                var lastHtmlText = "";
                var lastTextStart = -1;
                for (var i = 0, len = text.length; i < len; i++) {
                    var char = text.charAt(i);
                    var decodeText = false;
                    var addSingle = null;
                    var oldFont = font;
                    var nextHtmlText = "";
                    var single = false;
                    lastHtmlText += char;
                    if (char == "<") {
                        last = i;
                    } else if (char == ">") {
                        //分析<...>标签里的内容
                        var sign = text.slice(last + 1, i);
                        var end = false;
                        if (sign.charAt(sign.length - 1) == "/") {
                            sign = sign.slice(0, sign.length - 1);
                            single = true;
                        }
                        var s = 0;
                        if (sign.charAt(0) == "/") {
                            end = true;
                            s++;
                        }
                        var name = "";
                        //获取标签名称
                        for (; s < sign.length; s++) {
                            char = sign.charAt(s);
                            if (char == " ") {
                                break;
                            } else {
                                name += char;
                            }
                        }
                        //分析属性
                        var attributes = [];
                        while (s < sign.length) {
                            //跳过空格
                            while (sign.charAt(s) == " " && s < sign.length) {
                                s++;
                            }
                            if (s == sign.length) {
                                break;
                            }
                            //获取属性名称
                            var pos = s;
                            while (sign.charAt(s) != "=" && sign.charAt(s) != " " && s < sign.length) {
                                s++;
                            }
                            if (s == sign.length) {
                                break;
                            }
                            var attributeName = sign.slice(pos, s);
                            //跳过空格
                            while (sign.charAt(s) == " " && s < sign.length) {
                                s++;
                            }
                            if (s == sign.length) {
                                break;
                            }
                            if (sign.charAt(s) == "=") {
                                s++;
                            } else {
                                break;
                            }
                            //跳过空格
                            while (sign.charAt(s) == " " && s < sign.length) {
                                s++;
                            }
                            if (s == sign.length) {
                                break;
                            }
                            //获取引号
                            var begin = sign.charAt(s);
                            if (begin == "\"" || begin == "'") {
                                s++;
                            } else {
                                break;
                            }
                            //获取内容
                            var pos = s;
                            while (sign.charAt(s) != begin && s < sign.length) {
                                s++;
                            }
                            if (s == sign.length) {
                                break;
                            }
                            var attributeContent = sign.slice(pos, s);
                            s++; //跳过引号
                            attributes.push({
                                name: attributeName,
                                value: attributeContent
                            });
                        }
                        if (single) {
                            //如果是单个内容，比如<img.../>
                            addSingle = {
                                name: name,
                                attributes: attributes
                            };
                            if (name == "img") {
                                decodeText = true;
                                addSingle.htmlText = text.slice(last, i + 1);
                                lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                            } else {
                                var isfxml = false;
                                for (var a = 0; a < attributes.length; a++) {
                                    if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                        isfxml = true;
                                        break;
                                    }
                                }
                                if (isfxml) {
                                    decodeText = true;
                                    addSingle.name = "ui";
                                    addSingle.htmlText = text.slice(last, i + 1);
                                    lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                                }
                            }
                        } else {
                            if (end) {
                                if (name == "font" || name == "u" || name == "s") {
                                    decodeText = true;
                                    font = flower.ObjectDo.clone(font);
                                    if (name == "font") {
                                        font.size = font.sizes.pop();
                                        font.color = font.colors.pop();
                                        font.gap = font.gaps.pop();
                                    } else if (name == "u") {
                                        font.under = font.unders.pop();
                                    } else if (name == "s") {
                                        font.select = font.selects.pop();
                                    }
                                }
                            } else {
                                if (name == "font" || name == "u" || name == "s") {
                                    nextHtmlText = text.slice(last, i + 1);
                                    lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - nextHtmlText.length);
                                    decodeText = true;
                                    font = flower.ObjectDo.clone(font);
                                    if (name == "font") {
                                        font.sizes.push(font.size);
                                        font.colors.push(font.color);
                                        font.gaps.push(font.gap);
                                        for (var a = 0; a < attributes.length; a++) {
                                            if (attributes[a].name == "size") {
                                                if (parseInt(attributes[a].value)) {
                                                    font.size = parseInt(attributes[a].value);
                                                }
                                            } else if (attributes[a].name == "color") {
                                                if (attributes[a].value.charAt(0) == "#") {
                                                    font.color = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                                }
                                            }
                                        }
                                    } else if (name == "u") {
                                        font.unders.push(font.under);
                                        font.under = true;
                                        font.underColor = font.color;
                                        for (var a = 0; a < attributes.length; a++) {
                                            if (attributes[a].name == "color") {
                                                if (attributes[a].value.charAt(0) == "#") {
                                                    font.underColor = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                                }
                                            }
                                        }
                                    } else if (name == "s") {
                                        font.selects.push(font.select);
                                        font.select = true;
                                    }
                                } else {
                                    var isfxml = false;
                                    for (var a = 0; a < attributes.length; a++) {
                                        if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                            isfxml = true;
                                            break;
                                        }
                                    }
                                    if (isfxml) {
                                        single = true;
                                        addSingle = {
                                            name: "ui",
                                            attributes: attributes
                                        };
                                        i = this.__findFXML(text, last);
                                        addSingle.htmlText = text.slice(last, i + 1);
                                        decodeText = true;
                                        lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                                    }
                                }
                            }
                        }
                        last = -1;
                    } else {
                        if (last == -1) {
                            lastText += char;
                            if (lastTextStart == -1) {
                                lastTextStart = lastHtmlText.length - 1;
                            }
                        }
                    }
                    var newLine = false;
                    if (char == "\n" || char == "\r" || text.slice(i, i + "<br/>".length) == "<br/>") {
                        if (p[24]) {
                            newLine = true;
                            decodeText = true;
                            if (oldFont.select) {
                                line.selectEnd = true;
                            }
                            if (char == "\n" || char == "\r") {
                                line.endHtmlText = char;
                                lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - 1);
                                lastText = lastText.slice(0, lastText.length - 1);
                            } else if (text.slice(i, i + "<br/>".length) == "<br/>") {
                                line.endHtmlText = "<br/>";
                                lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - 1);
                                last = -1;
                            }
                        } else {
                            text = text.slice(0, i);
                            len = text.length;
                        }
                    }
                    if (i == len - 1) {
                        decodeText = true;
                    }
                    if (decodeText) {
                        this.__decodeText(line, oldFont, this.__changeRealText(lastText), lastHtmlText, lastTextStart);
                        lastHtmlText = "";
                        lastText = "";
                        lastTextStart = -1;
                        if (single) {
                            if (addSingle.name == "img") {
                                this.__decodeImage(line, addSingle.attributes, addSingle.htmlText, oldFont);
                            } else if (addSingle.name == "ui") {
                                this.__decodeUI(line, addSingle.attributes, addSingle.htmlText, oldFont);
                            }
                        }
                        if (newLine) {
                            line.chars++;
                            line = this.__getNewLine(line, font);
                            lines.push(line);
                        }
                    }
                    if (newLine && text.slice(i, i + "<br/>".length) == "<br/>") {
                        i += "<br/>".length - 1;
                    }
                    lastHtmlText += nextHtmlText;
                }
                var oldText = p[0];
                p[0] = "";
                p[1] = "";
                p[3] = 0;
                var maxWidth = 0;
                var maxHeight = 0;
                for (var i = 0; i < lines.length; i++) {
                    p[1] += lines[i].htmlText + lines[i].endHtmlText;
                    p[3] += lines[i].chars;
                    maxWidth = lines[i].width > maxWidth ? lines[i].width : maxWidth;
                    maxHeight += lines[i].height;
                    p[0] += lines[i].text + (i < lines.length - 1 ? "\n" : "");
                }
                maxWidth += p[29] * 2;
                p[17] = maxWidth;
                p[18] = maxHeight;
                p[100] = true;
                this.$invalidateContentBounds();
                for (var i = 0; i < lines.length; i++) {
                    for (var s = 0; s < lines[i].sublines.length; s++) {
                        var subline = lines[i].sublines[s];
                        if (p[21] == "center") {
                            subline.x = (this.width - subline.width) * .5;
                        } else if (p[21] == "right") {
                            subline.x = this.width - subline.width;
                        }
                    }
                }
                this.$moveCaretIndex();
                if (oldText != p[0]) {
                    this.dispatchWith(flower.Event.CHANGE, null, true);
                }
            }
        }, {
            key: "__findFXML",
            value: function __findFXML(text, start) {
                var name = "";
                var len = text.length;
                for (var i = start + 1; i < len; i++) {
                    if (text.charAt(i) == " " || text.charAt(i) == ">" || text.charAt(i) == "/") {
                        name = text.slice(start + 1, i);
                        break;
                    }
                }
                var flag = 1;
                var num1 = name.length + 1;
                var num2 = name.length + 2;
                var sign1 = "<" + name;
                var sign2 = "</" + name;
                for (var i = start + 1 + name.length; i < len; i++) {
                    if (text.slice(i, i + num1) == sign1) {
                        flag++;
                    }
                    if (text.slice(i, i + num2) == sign2) {
                        flag--;
                        if (flag == 0) {
                            for (; i < len; i++) {
                                if (text.charAt(i) == ">") {
                                    break;
                                }
                            }
                            return i;
                        }
                    }
                }
                return start;
            }
        }, {
            key: "__clearOldDisplay",
            value: function __clearOldDisplay() {
                var p = this.$TextField;
                var lines = p[2];
                for (var l = 0; l < lines.length; l++) {
                    var line = lines[l];
                    for (var s = 0; s < line.sublines.length; s++) {
                        var subline = line.sublines[s];
                        var displays = subline.displays;
                        for (var d = 0; d < displays.length; d++) {
                            var item = displays[d];
                            if (item.type == 0 && item.display) {
                                item.display.dispose();
                            }
                        }
                    }
                }
            }
        }, {
            key: "__decodeText",
            value: function __decodeText(line, font, text, htmlText, textStart) {
                textStart = textStart == -1 ? 0 : textStart;
                var p = this.$TextField;
                if (!line.sublines.length) {
                    this.__addSubLine(line, font);
                }
                var nextText = "";
                var nextHtmlText = "";
                var nextTextStart = 0;
                while (text.length) {
                    nextText = "";
                    nextHtmlText = "";
                    nextTextStart = 0;
                    var subline = line.sublines[line.sublines.length - 1];
                    var width = flower.$measureTextWidth(font.size, text);
                    if (p[13] && this.$DisplayObject[3] != null) {
                        if (subline.width + width + p[29] * 2 > this.width) {
                            var min = 0;
                            var minValue = 0;
                            var max = text.length;
                            var maxValue = width;
                            var widths = {};
                            widths[text.length] = width;
                            while (true) {
                                var mid = ~ ~((min + max) / 2);
                                var midValue = widths[mid];
                                if (mid == min || mid == max) {
                                    if (subline.width + midValue + p[29] * 2 > this.width && mid) {
                                        mid--;
                                    }
                                    if (mid == 0) {
                                        this.__addSubLine(line, font);
                                        subline = line.sublines[line.sublines.length - 1];
                                    } else {
                                        nextText = text.slice(mid, text.length);
                                        nextHtmlText = htmlText.slice(textStart + mid, htmlText.length);
                                        nextTextStart = 0;
                                        text = text.slice(0, mid);
                                        htmlText = htmlText.slice(0, textStart + mid);
                                    }
                                    break;
                                }
                                if (widths[mid] == null) {
                                    midValue = widths[mid] = flower.$measureTextWidth(font.size, text.slice(0, mid));
                                }
                                if (subline.width + midValue + p[29] * 2 > this.width) {
                                    max = mid;
                                    maxValue = midValue;
                                } else {
                                    min = mid;
                                    minValue = midValue;
                                }
                            }

                            //for (var t = text.length; t >= 0; t--) {
                            //    width = flower.$measureTextWidth(font.size, text.slice(0, t));
                            //    if (subline.width + width + p[29] * 2 <= this.width) {
                            //        if (t == 0) {
                            //            this.__addSubLine(line, font);
                            //            subline = line.sublines[line.sublines.length - 1];
                            //            t = text.length + 1;
                            //        } else {
                            //            nextText = text.slice(t, text.length);
                            //            nextHtmlText = htmlText.slice(textStart + t, htmlText.length);
                            //            nextTextStart = 0;
                            //            text = text.slice(0, t);
                            //            htmlText = htmlText.slice(0, textStart + t);
                            //            break;
                            //        }
                            //    }
                            //}
                        }
                    }
                    var item = {
                        type: 0,
                        display: null,
                        font: font,
                        text: text,
                        htmlText: htmlText,
                        htmlTextIndex: subline.htmlText.length,
                        textStart: textStart,
                        textEnd: textStart + this.__changeText(text).length,
                        width: width,
                        height: font.size,
                        x: subline.positionX,
                        charIndex: subline.chars,
                        chars: text.length,
                        subline: subline
                    };
                    subline.chars += item.chars;
                    line.chars += item.chars;
                    if (item.height + subline.gap > subline.height) {
                        var oldHeight = subline.height;
                        subline.height = item.height + subline.gap;
                        line.height += subline.height - oldHeight;
                        line.positionY += subline.height - oldHeight;
                    }
                    subline.width += item.width;
                    if (subline.width > line.width) {
                        line.width = subline.width;
                    }
                    subline.text += item.text;
                    line.text += item.text;
                    subline.htmlText += item.htmlText;
                    line.htmlText += item.htmlText;
                    subline.positionX += item.width;
                    subline.displays.push(item);

                    text = nextText;
                    htmlText = nextHtmlText;
                    textStart = nextTextStart;
                    if (text.length) {
                        this.__addSubLine(line, font);
                        subline = line.sublines[line.sublines.length - 1];
                    }
                }
            }
        }, {
            key: "__decodeImage",
            value: function __decodeImage(line, attributes, htmlText, font) {
                var p = this.$TextField;
                var ids = p[102];
                var id = "";
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i].name == "id") {
                        id = attributes[i].value;
                    }
                }
                var caches = p[101];
                if (!line.sublines.length) {
                    this.__addSubLine(line, font);
                }
                var subline = line.sublines[line.sublines.length - 1];
                var image;
                var cache;
                if (!caches[htmlText]) {
                    caches[htmlText] = [];
                }
                if (caches[htmlText].length) {
                    for (var i = 0; i < caches[htmlText].length; i++) {
                        if (caches[htmlText][i].use == false) {
                            image = caches[htmlText][i].display;
                            caches[htmlText][i].use = true;
                            cache = caches[htmlText][i];
                        }
                    }
                }
                if (!image) {
                    var url = "";
                    for (var i = 0; i < attributes.length; i++) {
                        if (attributes[i].name == "src") {
                            url = attributes[i].value;
                        }
                    }
                    image = new flower.Bitmap();
                    if (url != "") {
                        var loader = new flower.URLLoader(url);
                        loader.load();
                        loader.addListener(flower.Event.COMPLETE, function (e) {
                            if (image.isDispose) {
                                return;
                            }
                            image.texture = e.data;
                            cache.width = image.width;
                            cache.height = image.height;
                            this.$setHtmlText(p[1]);
                        }, this);
                    }
                    cache = {
                        use: true,
                        display: image,
                        loader: loader
                    };
                    caches[htmlText].push(cache);
                }
                if (id != "") {
                    ids[id] = image;
                    if (!this[id]) {
                        this[id] = image;
                    }
                }
                if (p[13] && this.$DisplayObject[3] != null) {
                    if (subline.width + image.width + p[29] * 2 > this.width) {
                        this.__addSubLine(line, font);
                        subline = line.sublines[line.sublines.length - 1];
                    }
                }
                cache.width = image.width;
                cache.height = image.height;
                var item = {
                    type: 1,
                    display: image,
                    font: font,
                    text: "",
                    htmlText: htmlText,
                    htmlTextIndex: subline.htmlText.length,
                    textStart: 0,
                    width: image.width,
                    height: image.height,
                    x: subline.positionX,
                    charIndex: subline.chars,
                    chars: 1,
                    subline: subline
                };
                subline.chars += item.chars;
                line.chars += item.chars;
                if (item.height + subline.gap > subline.height) {
                    var oldHeight = subline.height;
                    subline.height = item.height + subline.gap;
                    line.height += subline.height - oldHeight;
                    line.positionY += subline.height - oldHeight;
                }
                subline.width += item.width;
                if (subline.width > line.width) {
                    line.width = subline.width;
                }
                subline.text += item.text;
                line.text += item.text;
                subline.htmlText += item.htmlText;
                line.htmlText += item.htmlText;
                subline.positionX += item.width;
                subline.displays.push(item);
            }
        }, {
            key: "__decodeUI",
            value: function __decodeUI(line, attributes, htmlText, font) {
                var p = this.$TextField;
                var ids = p[102];
                var id = "";
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i].name == "id") {
                        id = attributes[i].value;
                    }
                }
                var caches = p[101];
                if (!line.sublines.length) {
                    this.__addSubLine(line, font);
                }
                var subline = line.sublines[line.sublines.length - 1];
                var ui;
                var cache;
                if (!caches[htmlText]) {
                    caches[htmlText] = [];
                }
                if (caches[htmlText].length) {
                    for (var i = 0; i < caches[htmlText].length; i++) {
                        if (caches[htmlText][i].use == false) {
                            ui = caches[htmlText][i].display;
                            caches[htmlText][i].use = true;
                            cache = caches[htmlText];
                            break;
                        }
                    }
                }
                if (!ui) {
                    ui = new flower.UIParser();
                    ui.percentWidth = null;
                    ui.percentHeight = null;
                    ui.parseUI(htmlText);
                    cache = {
                        use: true,
                        display: ui
                    };
                    caches[htmlText].push(cache);
                }
                if (id != "") {
                    ids[id] = ui;
                    if (!this[id]) {
                        this[id] = ui;
                    }
                }
                if (p[13] && this.$DisplayObject[3] != null) {
                    if (subline.width + ui.width + p[29] * 2 > this.width) {
                        this.__addSubLine(line, font);
                        subline = line.sublines[line.sublines.length - 1];
                    }
                }
                cache.width = ui.width;
                cache.height = ui.height;
                var item = {
                    type: 1,
                    display: ui,
                    font: font,
                    text: "",
                    htmlText: htmlText,
                    htmlTextIndex: subline.htmlText.length,
                    textStart: 0,
                    width: ui.width,
                    height: ui.height,
                    x: subline.positionX,
                    charIndex: subline.chars,
                    chars: 1,
                    subline: subline
                };
                subline.chars += item.chars;
                line.chars += item.chars;
                if (item.height + subline.gap > subline.height) {
                    var oldHeight = subline.height;
                    subline.height = item.height + subline.gap;
                    line.height += subline.height - oldHeight;
                    line.positionY += subline.height - oldHeight;
                }
                subline.width += item.width;
                if (subline.width > line.width) {
                    line.width = subline.width;
                }
                subline.text += item.text;
                line.text += item.text;
                subline.htmlText += item.htmlText;
                line.htmlText += item.htmlText;
                subline.positionX += item.width;
                subline.displays.push(item);
            }
        }, {
            key: "__resetCaches",
            value: function __resetCaches() {
                var caches = this.$TextField[101];
                for (var key in caches) {
                    var list = caches[key];
                    for (var i = 0; i < list.length; i++) {
                        list[i].use = false;
                    }
                }
            }
        }, {
            key: "__clearCaches",
            value: function __clearCaches() {
                var caches = this.$TextField[101];
                for (var key in caches) {
                    var list = caches[key];
                    while (list.length) {
                        if (list[list.length - 1].use == false) {
                            var item = list.pop();
                            item.display.dispose();
                        } else {
                            break;
                        }
                    }
                }
                var keys = flower.ObjectDo.keys(caches);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (caches[key].length == 0) {
                        delete caches[key];
                    }
                }
            }
        }, {
            key: "__getNewLine",
            value: function __getNewLine(lastLine, font) {
                var line;
                line = {
                    index: this.$TextField[2].length,
                    text: "",
                    htmlText: "",
                    endHtmlText: "",
                    selectEnd: false,
                    htmlTextIndex: 0,
                    width: 4,
                    height: font.size + font.gap,
                    x: 0,
                    y: 0,
                    charIndex: 0,
                    chars: 0,
                    sublines: [],
                    positionY: 0
                };
                if (lastLine) {
                    line.y = lastLine.y + lastLine.height;
                    line.htmlTextIndex = lastLine.htmlTextIndex + lastLine.htmlText.length + lastLine.endHtmlText.length;
                    line.charIndex = lastLine.charIndex + lastLine.chars;
                }
                return line;
            }
        }, {
            key: "__addSubLine",
            value: function __addSubLine(line, font) {
                var subline = {
                    index: line.sublines.length,
                    text: "",
                    htmlText: "",
                    htmlTextIndex: line.htmlText.length,
                    width: 4,
                    gap: font.gap,
                    height: font.size + font.gap,
                    x: 0,
                    y: line.positionY,
                    charIndex: line.chars,
                    chars: 0,
                    displays: [],
                    line: line,
                    positionX: 0
                };
                line.sublines.push(subline);
                line.positionY += subline.height;
                if (subline.y + subline.height > line.height) {
                    line.height = subline.y + subline.height;
                }
            }
        }, {
            key: "__getDefaultFocus",
            value: function __getDefaultFocus() {
                var rect = new flower.Rect();
                rect.fillColor = 0;
                rect.width = 2;
                rect.height = 12;
                rect.visible = false;
                return rect;
            }
        }, {
            key: "__setFontSize",
            value: function __setFontSize(val) {
                val = +val & ~0;
                var p = this.$TextField;
                if (val == p[10]) {
                    return;
                }
                p[10] = val;
                this.$setHtmlText(p[1]);
            }
        }, {
            key: "__setFontColor",
            value: function __setFontColor(val) {
                val = ~ ~val;
                var p = this.$TextField;
                if (val == p[11]) {
                    return;
                }
                p[11] = val;
                this.$setHtmlText(p[1]);
            }
        }, {
            key: "__setHtmlText",
            value: function __setHtmlText(val) {
                var p = this.$TextField;
                if (p[6] == val) {
                    return;
                }
                p[6] = val;
                this.$setHtmlText(val);
            }
        }, {
            key: "__setText",
            value: function __setText(val) {
                val += "";
                var val = this.__changeText(val);
                this.__setHtmlText(val);
            }
        }, {
            key: "__setWordWrap",
            value: function __setWordWrap(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                var p = this.$TextField;
                if (p[13] == val) {
                    return;
                }
                p[13] = val;
                this.$setHtmlText(p[1]);
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                var p = this.$TextField;
                if (p[100]) {
                    p[100] = false;
                    var lines = p[2];
                    var x = p[50];
                    var y = p[51];
                    var container = p[4];
                    var bgcontainer = p[14];
                    container.removeAll();
                    if (bgcontainer) {
                        bgcontainer.removeAll();
                    }
                    var height = this.height;
                    for (var l = 0; l < lines.length; l++) {
                        var line = lines[l];
                        //if (!setHeight || line.y <= y + height && line.y + line.height < y + height) {
                        for (var s = 0; s < line.sublines.length; s++) {
                            var subline = line.sublines[s];
                            //if (!setHeight || subline.y <= y + height && subline.y + subline.height < y + height) {
                            var displays = subline.displays;
                            for (var d = 0; d < displays.length; d++) {
                                var item = displays[d];
                                var display = item.display;
                                if (item.type == 0) {
                                    if (!display) {
                                        display = new $TextField(item.text);
                                        display.fontSize = item.font.size;
                                        display.fontColor = item.font.select ? p[1001] : item.font.color;
                                        item.display = display;
                                    }
                                }
                                if (item.font.under && item.width) {
                                    if (!item.underDisplay) {
                                        item.underDisplay = new flower.Rect();
                                        item.underDisplay.fillColor = item.font.select ? p[1001] : item.font.underColor;
                                        item.underDisplay.width = item.width;
                                        item.underDisplay.height = 1;
                                    }
                                    item.underDisplay.x = x + line.x + subline.x + item.x;
                                    item.underDisplay.y = y + line.y + subline.y + subline.height;
                                    container.addChild(item.underDisplay);
                                }
                                if (item.font.select && item.width) {
                                    if (!item.selectDisplay) {
                                        item.selectDisplay = new flower.Rect();
                                        item.selectDisplay.fillColor = p[1000];
                                        item.selectDisplay.width = item.width;
                                        item.selectDisplay.height = subline.height;
                                    }
                                    item.selectDisplay.x = x + line.x + subline.x + item.x;
                                    item.selectDisplay.y = y + line.y + subline.y;
                                    if (!bgcontainer) {
                                        this.__createBackgroundContainer();
                                        bgcontainer = p[14];
                                    }
                                    bgcontainer.addChild(item.selectDisplay);
                                }
                                container.addChild(item.display);
                                display.x = x + line.x + subline.x + item.x;
                                display.y = y + line.y + subline.y + subline.height - item.height - subline.gap * 0.5;
                            }
                            //}
                        }
                        if (line.selectEnd) {
                            var rect = new flower.Rect();
                            rect.fillColor = p[1000];
                            rect.width = this.width - line.x - line.width;
                            rect.height = line.height;
                            rect.x = x + line.x + line.width;
                            rect.y = y + line.y;
                        }
                        //}
                    }
                    this.__clearCaches();
                }
                if (p[15] != this.width || p[16] != this.height) {
                    p[15] = this.width;
                    p[16] = this.height;
                    this.__shape.clear();
                    this.__shape.drawRect(p[29], 0, this.width - p[29] * 2, this.height + 2);
                    this.$moveCaretIndex();
                }

                //Sprite
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
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                DebugInfo.frameInfo.display++;
                DebugInfo.frameInfo.text++;
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }
            }
        }, {
            key: "$update",
            value: function $update() {
                var p = this.$TextField;
                var caches = p[101];
                var flag = false;
                for (var key in caches) {
                    var list = caches[key];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        if (item.width != item.display.width || item.height != item.display.height) {
                            flag = true;
                            item.width = item.display.width;
                            item.height = item.display.height;
                        }
                    }
                }
                if (flag) {
                    this.$setHtmlText(p[1]);
                }
            }
        }, {
            key: "$initContainer",
            value: function $initContainer() {
                this.__children = [];
                this.$nativeShow = Platform.create("Mask");
                this.__shape = this.$createShape();
                this.$nativeShow.setShape(this.__shape.$nativeShow, this.__shape);
            }
        }, {
            key: "$createShape",
            value: function $createShape() {
                return new Shape();
            }
        }, {
            key: "$addFlagsDown",
            value: function $addFlagsDown(flags) {
                if (this.$hasFlags(flags)) {
                    return;
                }
                this.$addFlags(flags);
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
                return child;
            }
        }, {
            key: "addChildAt",
            value: function addChildAt(child, index) {
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
        }, {
            key: "$setStage",
            value: function $setStage(stage) {
                _get(Object.getPrototypeOf(TextField.prototype), "$setStage", this).call(this, stage);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$setStage(this.stage);
                }
            }
        }, {
            key: "$dispatchAddedToStageEvent",
            value: function $dispatchAddedToStageEvent() {
                _get(Object.getPrototypeOf(TextField.prototype), "$dispatchAddedToStageEvent", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$dispatchAddedToStageEvent();
                }
            }
        }, {
            key: "$dispatchRemovedFromStageEvent",
            value: function $dispatchRemovedFromStageEvent() {
                _get(Object.getPrototypeOf(TextField.prototype), "$dispatchRemovedFromStageEvent", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$dispatchRemovedFromStageEvent();
                }
            }
        }, {
            key: "$removeChild",
            value: function $removeChild(child) {
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
        }, {
            key: "removeChild",
            value: function removeChild(child) {
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
        }, {
            key: "removeChildAt",
            value: function removeChildAt(index) {
                var children = this.__children;
                if (index < 0 || index >= children.length) {
                    return;
                }
                return this.removeChild(children[index]);
            }
        }, {
            key: "setChildIndex",
            value: function setChildIndex(child, index) {
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
            key: "getChildAt",
            value: function getChildAt(index) {
                index = index & ~0;
                if (index < 0 || index > this.__children.length - 1) {
                    $error(1007, "getChildAt", index, this.__children.length);
                    return null;
                }
                return this.__children[index];
            }
        }, {
            key: "removeAll",
            value: function removeAll() {
                while (this.numChildren) {
                    this.removeChildAt(0);
                }
            }
        }, {
            key: "$changeAllFilters",
            value: function $changeAllFilters() {
                _get(Object.getPrototypeOf(TextField.prototype), "$changeAllFilters", this).call(this);
                var children = this.__children;
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$setParentFilters(this.$getAllFilters());
                }
            }

            /**
             * 测量子对象的区域
             * @param rect
             */

        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
                rect.x = 0;
                rect.y = 0;
                rect.width = this.$TextField[17];
                rect.height = this.$TextField[18];
                var childrenBounds = this.$Sprite[0];
                childrenBounds.x = rect.x;
                childrenBounds.y = rect.y;
                childrenBounds.width = rect.width;
                childrenBounds.height = rect.height;
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                if (this.touchEnabled == false || this.visible == false) return null;
                if (multiply == true && this.multiplyTouchEnabled == false) return null;
                var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
                touchX = math.floor(point.x);
                touchY = math.floor(point.y);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                p[22] = flower.EnterFrame.frame;
                var bounds = this.__shape.$getContentBounds();
                if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
                    var target;
                    var childs = this.__children;
                    var len = childs.length;
                    for (var i = len - 1; i >= 0; i--) {
                        if (childs[i].touchEnabled && (multiply == false || multiply == true && childs[i].multiplyTouchEnabled == true)) {
                            target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                            if (target) {
                                break;
                            }
                        }
                    }
                    return this;
                }
                return null;
            }
        }, {
            key: "$releaseContainer",
            value: function $releaseContainer() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                Platform.release("Mask", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.__resetCaches();
                this.__clearCaches();
                flower.EnterFrame.remove(this.$update, this);

                //Sprite
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                DebugInfo.displayInfo.text--;
                var children = this.__children;
                while (children.length) {
                    var child = children[children.length - 1];
                    child.dispose();
                }
                _get(Object.getPrototypeOf(TextField.prototype), "dispose", this).call(this);
                this.$releaseContainer();
            }
        }, {
            key: "fontSize",
            get: function get() {
                return this.$TextField[10];
            },
            set: function set(val) {
                this.__setFontSize(val);
            }
        }, {
            key: "fontColor",
            get: function get() {
                return this.$TextField[11];
            },
            set: function set(val) {
                this.__setFontColor(val);
            }
        }, {
            key: "htmlText",
            get: function get() {
                return this.$TextField[1];
            },
            set: function set(val) {
                this.__setHtmlText(val);
            }
        }, {
            key: "text",
            get: function get() {
                return this.$TextField[0];
            },
            set: function set(val) {
                this.__setText(val);
            }
        }, {
            key: "wordWrap",
            get: function get() {
                return this.$TextField[13];
            },
            set: function set(val) {
                this.__setWordWrap(val);
            }
        }, {
            key: "displays",
            get: function get() {
                return this.$TextField[102];
            }
        }, {
            key: "algin",
            set: function set(val) {
                var p = this.$TextField;
                if (p[21] == val) {
                    return;
                }
                p[21] = val;
                if (p[4]) {
                    if (p[21] == "right") {
                        p[4].x = -p[29];
                    } else if (p[21] == "center") {
                        p[4].x = 0;
                    } else {
                        p[4].x = p[29];
                    }
                }
                if (p[14]) {
                    if (p[21] == "right") {
                        p[14].x = -p[29];
                    } else if (p[21] == "center") {
                        p[14].x = 0;
                    } else {
                        p[14].x = p[29];
                    }
                }
                this.$setHtmlText(p[1]);
            },
            get: function get() {
                return this.$TextField[21];
            }
        }, {
            key: "leading",
            set: function set(val) {
                val = +val & ~0;
                var p = this.$TextField;
                if (p[12] == val) {
                    return;
                }
                p[12] = val;
                this.$setHtmlText(p[1]);
            },
            get: function get() {
                return this.$TextField[12];
            }
        }, {
            key: "input",
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$TextField[22]) {
                    return;
                }
                this.$TextField[22] = val;
            },
            get: function get() {
                return this.$TextField[22];
            }
        }, {
            key: "selectable",
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$TextField[23]) {
                    return;
                }
                this.$TextField[23] = val;
            },
            get: function get() {
                return this.$TextField[23];
            }
        }, {
            key: "multiline",
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$TextField[24]) {
                    return;
                }
                this.$TextField[24] = val;
            },
            get: function get() {
                return this.$TextField[24];
            }
        }, {
            key: "enterStop",
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$TextField[25]) {
                    return;
                }
                this.$TextField[25] = val;
            },
            get: function get() {
                return this.$TextField[25];
            }
        }], [{
            key: "changeText",
            value: function changeText(val) {
                for (var i = 0; i < val.length; i++) {
                    var char = val.charAt(i);
                    if (char == " ") {
                        val = val.slice(0, i) + "&nbsp;" + val.slice(i + 1, val.length);
                        i += 5;
                    } else if (char == "<") {
                        val = val.slice(0, i) + "&lt;" + val.slice(i + 1, val.length);
                        i += 3;
                    } else if (char == ">") {
                        val = val.slice(0, i) + "&gt;" + val.slice(i + 1, val.length);
                        i += 3;
                    } else if (char == "&") {
                        val = val.slice(0, i) + "&amp;" + val.slice(i + 1, val.length);
                        i += 4;
                    } else if (char == "\n" || char == "\r") {
                        //val = val.slice(0, i) + "<br/>" + val.slice(i + 1, val.length);
                        //i += 4
                    }
                }
                return val;
            }
        }, {
            key: "changeRealText",
            value: function changeRealText(val) {
                for (var i = 0; i < val.length; i++) {
                    if (val.slice(i, i + 5) == "&amp;") {
                        val = val.slice(0, i) + "&" + val.slice(i + 5, val.length);
                    } else if (val.slice(i, i + 6) == "&nbsp;") {
                        val = val.slice(0, i) + " " + val.slice(i + 6, val.length);
                    } else if (val.slice(i, i + 4) == "&lt;") {
                        val = val.slice(0, i) + "<" + val.slice(i + 4, val.length);
                    } else if (val.slice(i, i + 4) == "&gt;") {
                        val = val.slice(0, i) + ">" + val.slice(i + 4, val.length);
                    } else if (val.slice(i, i + 5) == "<br/>") {
                        val = val.slice(0, i) + "\n" + val.slice(i + 5, val.length);
                    }
                }
                return val;
            }
        }]);

        return TextField;
    }(flower.DisplayObject);

    flower.TextField = TextField;
    //////////////////////////End File:flower/display/TextField.js///////////////////////////

    //////////////////////////File:flower/display/$TextInput.js///////////////////////////

    var $TextInput = function (_DisplayObject4) {
        _inherits($TextInput, _DisplayObject4);

        function $TextInput() {
            var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, $TextInput);

            var _this22 = _possibleConstructorReturn(this, Object.getPrototypeOf($TextInput).call(this));

            _this22.$TextField = {
                0: "", //text
                1: 12, //fontSize
                2: 0x000000, //fontColor
                3: true, //editEnabled
                4: false, //inputing
                5: false, //autoSize
                6: false, //multiline
                7: false };
            //wordWrap
            _this22.$initNativeShow();
            _this22.addListener(Event.FOCUS_IN, _this22.$onFocusIn, _this22);
            _this22.addListener(Event.FOCUS_OUT, _this22.$onFocusOut, _this22);
            _this22.addListener(KeyboardEvent.KEY_DOWN, _this22.$keyDown, _this22);
            if (text != "") {
                _this22.text = text;
            }
            _this22.width = 100;
            _this22.height = 21;
            _this22.focusEnabled = true;
            _this22.$nativeShow.setChangeBack(_this22.$onTextChange, _this22);
            return _this22;
        }

        _createClass($TextInput, [{
            key: "$initNativeShow",
            value: function $initNativeShow() {
                var textArea = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                if (textArea) {
                    this.$TextField[6] = true;
                    this.$TextField[7] = true;
                    this.$nativeShow = Platform.create("TextArea");
                } else {
                    this.$nativeShow = Platform.create("TextInput");
                }
            }
        }, {
            key: "$onTextChange",
            value: function $onTextChange() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.text = this.$nativeShow.getNativeText();
            }
        }, {
            key: "$checkSettingSize",
            value: function $checkSettingSize(rect) {}
        }, {
            key: "$setText",
            value: function $setText(val) {
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
        }, {
            key: "$measureText",
            value: function $measureText(rect) {
                if (this.$hasFlags(0x0800)) {
                    var d = this.$DisplayObject;
                    var p = this.$TextField;
                    //text, width, height, size, wordWrap, multiline, autoSize
                    var size = this.$nativeShow.changeText(p[0], d[3], d[4], p[1], p[7], p[6], p[5]);
                    rect.x = 0;
                    rect.y = 0;
                    rect.width = this.width; //size.width;
                    rect.height = this.height;
                    this.$removeFlags(0x0800);
                }
            }
        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
                this.$measureText(rect);
            }
        }, {
            key: "$setFontColor",
            value: function $setFontColor(val) {
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
        }, {
            key: "$setAutoSize",
            value: function $setAutoSize(val) {
                var p = this.$TextField;
                if (p[5] == val) {
                    return false;
                }
                p[5] = val;
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                var flag = _get(Object.getPrototypeOf($TextInput.prototype), "$setWidth", this).call(this, val);
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
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                var flag = _get(Object.getPrototypeOf($TextInput.prototype), "$setHeight", this).call(this, val);
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
        }, {
            key: "$setFontSize",
            value: function $setFontSize(val) {
                var p = this.$TextField;
                if (p[1] == val) {
                    return false;
                }
                p[1] = val;
                this.$addFlags(0x0800);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$setEditEnabled",
            value: function $setEditEnabled(val) {
                if (val == "false") {
                    val = false;
                }
                var p = this.$TextField;
                if (p[3] == val) {
                    return false;
                }
                p[3] = val;
                return true;
            }
        }, {
            key: "$setMultiline",
            value: function $setMultiline(val) {
                if (val == "false") {
                    val = false;
                }
                var p = this.$TextField;
                if (p[6] == val) {
                    return false;
                }
                p[6] = val;
                this.$addFlags(0x0800);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$setWordWrap",
            value: function $setWordWrap(val) {
                if (val == "false") {
                    val = false;
                }
                var p = this.$TextField;
                if (p[7] == val) {
                    return false;
                }
                p[7] = val;
                this.$addFlags(0x0800);
                this.$invalidateContentBounds();
                return true;
            }
        }, {
            key: "$onFocusIn",
            value: function $onFocusIn(e) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                var p = this.$TextField;
                if (p[3]) {
                    this.$nativeShow.startInput();
                    p[4] = true;
                    this.dispatchWith(Event.START_INPUT);
                }
            }
        }, {
            key: "$onFocusOut",
            value: function $onFocusOut() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$inputEnd();
            }
        }, {
            key: "$inputEnd",
            value: function $inputEnd() {
                var p = this.$TextField;
                if (p[4]) {
                    this.$nativeShow.stopInput();
                }
                this.text = this.$nativeShow.getNativeText();
                this.$addFlags(0x0800);
                this.$invalidateContentBounds();
                this.dispatchWith(Event.STOP_INPUT);
            }
        }, {
            key: "$keyDown",
            value: function $keyDown(e) {
                var p = this.$TextField;
                p[0] = this.$nativeShow.getNativeText();
                if (e.keyCode == 13 && !p[6]) {
                    this.$inputEnd();
                }
            }
        }, {
            key: "$startNativeInput",
            value: function $startNativeInput() {
                this.$nativeShow.startInput();
            }
        }, {
            key: "$stopNativeInput",
            value: function $stopNativeInput() {
                this.$nativeShow.stopInput();
            }
        }, {
            key: "$getNativeText",
            value: function $getNativeText() {
                return this.$nativeShow.getNativeText();
            }
        }, {
            key: "$setNativeText",
            value: function $setNativeText(val) {
                this.$nativeShow.setNativeText(val);
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x0800)) {
                    var width = this.width;
                }
                _get(Object.getPrototypeOf($TextInput.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "inputOver",
            value: function inputOver() {
                this.$inputEnd();
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                _get(Object.getPrototypeOf($TextInput.prototype), "dispose", this).call(this);
                Platform.release("TextInput", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "text",
            get: function get() {
                return this.$TextField[0];
            },
            set: function set(val) {
                this.$setText(val);
            }
        }, {
            key: "fontColor",
            get: function get() {
                return this.$TextField[2];
            },
            set: function set(val) {
                this.$setFontColor(val);
            }
        }, {
            key: "fontSize",
            get: function get() {
                return this.$TextField[1];
            },
            set: function set(val) {
                this.$setFontSize(val);
            }
        }, {
            key: "editEnabled",
            get: function get() {
                return this.$TextField[3];
            },
            set: function set(val) {
                this.$setEditEnabled(val);
            }
        }]);

        return $TextInput;
    }(DisplayObject);
    //////////////////////////End File:flower/display/$TextInput.js///////////////////////////

    //////////////////////////File:flower/display/Shape.js///////////////////////////


    var Shape = function (_DisplayObject5) {
        _inherits(Shape, _DisplayObject5);

        function Shape() {
            _classCallCheck(this, Shape);

            var _this23 = _possibleConstructorReturn(this, Object.getPrototypeOf(Shape).call(this));

            _this23.$nativeShow = Platform.create("Shape");
            _this23.$Shape = {
                0: 0xffffff, //fillColor
                1: 1, //fillAlpha
                2: 0, //lineWidth
                3: 0x000000, //lineColor
                4: 1, //lineAlpha
                5: null, //minX
                6: null, //minY
                7: null, //maxX
                8: null, //maxY
                9: [] //record
            };
            _this23.$nativeShow.draw([{ x: 0, y: 0 }, { x: 1, y: 0 }], 0, 0, 0, 0, 0);
            DebugInfo.displayInfo.shape++;
            return _this23;
        }

        _createClass(Shape, [{
            key: "drawRect",
            value: function drawRect(x, y, width, height) {
                this.$drawPolygon([{ x: x, y: y }, { x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }]);
            }
        }, {
            key: "drawLine",
            value: function drawLine(startX, startY, endX, endY) {
                this.$drawPolygon([{ x: startX, y: startY }, { x: endX, y: endY }]);
            }
        }, {
            key: "clear",
            value: function clear() {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.clear();
                var p = this.$Shape;
                p[5] = p[6] = p[7] = p[8] = null;
                p[9] = [];
                this.$nativeShow.draw([{ x: 0, y: 0 }, { x: 1, y: 0 }], 0, 0, 0, 0, 0);
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                if (this.fillAlpha == 0) {
                    return null;
                }
                return _get(Object.getPrototypeOf(Shape.prototype), "$getMouseTarget", this).call(this, touchX, touchY, multiply);
            }
        }, {
            key: "$addFlags",
            value: function $addFlags(flags) {
                if (flags == 0x0002) {
                    this.$addFlags(0x0400);
                }
                this.__flags |= flags;
            }
        }, {
            key: "$drawPolygon",
            value: function $drawPolygon(points) {
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
                p[9].push({
                    points: points,
                    fillColor: p[0],
                    fillAlpha: p[1],
                    lineWidth: p[2],
                    lineColor: p[3],
                    lineAlpha: p[4]
                });
                this.$nativeShow.draw(points, p[0], p[1] * this.$getConcatAlpha(), p[2], p[3], p[4] * this.$getConcatAlpha());
            }
        }, {
            key: "$measureContentBounds",
            value: function $measureContentBounds(rect) {
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
        }, {
            key: "$redraw",
            value: function $redraw() {
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
        }, {
            key: "$setFillColor",
            value: function $setFillColor(val) {
                var p = this.$Shape;
                if (p[0] == val) {
                    return false;
                }
                p[0] = val;
                return true;
            }
        }, {
            key: "$setFillAlpha",
            value: function $setFillAlpha(val) {
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
        }, {
            key: "$setLineWidth",
            value: function $setLineWidth(val) {
                var p = this.$Shape;
                if (p[2] == val) {
                    return false;
                }
                p[2] = val;
                return true;
            }
        }, {
            key: "$setLineColor",
            value: function $setLineColor(val) {
                var p = this.$Shape;
                if (p[3] == val) {
                    return false;
                }
                p[3] = val;
                return true;
            }
        }, {
            key: "$setLineAlpha",
            value: function $setLineAlpha(val) {
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
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                this.$redraw();
                //super.$onFrameEnd();
                DebugInfo.frameInfo.display++;
                DebugInfo.frameInfo.shape++;
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                DebugInfo.displayInfo.shape--;
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                _get(Object.getPrototypeOf(Shape.prototype), "dispose", this).call(this);
                Platform.release("Shape", this.$nativeShow);
                this.$nativeShow = null;
            }
        }, {
            key: "fillColor",
            get: function get() {
                var p = this.$Shape;
                return p[0];
            },
            set: function set(val) {
                this.$setFillColor(val);
            }
        }, {
            key: "fillAlpha",
            get: function get() {
                var p = this.$Shape;
                return p[1];
            },
            set: function set(val) {
                this.$setFillAlpha(val);
            }
        }, {
            key: "lineWidth",
            get: function get() {
                var p = this.$Shape;
                return p[2];
            },
            set: function set(val) {
                this.$setLineWidth(val);
            }
        }, {
            key: "lineColor",
            get: function get() {
                var p = this.$Shape;
                return p[3];
            },
            set: function set(val) {
                this.$setLineColor(val);
            }
        }, {
            key: "lineAlpha",
            get: function get() {
                var p = this.$Shape;
                return p[4];
            },
            set: function set(val) {
                this.$setLineAlpha(val);
            }
        }]);

        return Shape;
    }(DisplayObject);

    flower.Shape = Shape;
    //////////////////////////End File:flower/display/Shape.js///////////////////////////

    //////////////////////////File:flower/display/Stage.js///////////////////////////

    var Stage = function (_Sprite2) {
        _inherits(Stage, _Sprite2);

        function Stage() {
            _classCallCheck(this, Stage);

            var _this24 = _possibleConstructorReturn(this, Object.getPrototypeOf(Stage).call(this));

            _this24.__mouseX = 0;
            _this24.__mouseY = 0;
            _this24.__nativeMouseMoveEvent = [];
            _this24.__nativeRightClickEvent = [];
            _this24.__nativeTouchEvent = [];
            _this24.__mouseOverList = [_this24];
            _this24.__dragOverList = [_this24];
            _this24.__touchList = [];
            _this24.__lastMouseX = -1;
            _this24.__lastMouseY = -1;
            _this24.__lastRightX = -1;
            _this24.__lastRightY = -1;
            _this24.__focus = null;
            _this24.__touchTarget = null;
            _this24.$keyEvents = [];

            _this24.__stage = _this24;
            Stage.stages.push(_this24);

            _this24.$inputSprite = new Sprite();
            _this24.addChild(_this24.$inputSprite);
            _this24.$inputSprite.touchEnabled = false;
            _this24.$input = new $TextInput();
            _this24.$input.x = -100;
            _this24.$input.y = -100;
            _this24.$input.width = 10;
            _this24.$inputSprite.addChild(_this24.$input);
            var rect = new flower.Shape();
            rect.drawRect(0, 0, 50, 20);
            rect.alpha = 0.01;
            _this24.$inputSprite.addChild(rect);
            _this24.$background = new Shape();
            _this24.__forntLayer = new Sprite();
            _this24.addChild(_this24.__forntLayer);
            _this24.$debugSprite = new Sprite();
            _this24.__forntLayer.addChild(_this24.$debugSprite);
            _this24.$pop = PopManager.getInstance();
            _this24.__forntLayer.addChild(_this24.$pop);
            _this24.$menu = MenuManager.getInstance();
            _this24.__forntLayer.addChild(_this24.$menu);
            _this24.$drag = DragManager.getInstance();
            _this24.__forntLayer.addChild(_this24.$drag);
            _this24.backgroundColor = 0;
            return _this24;
        }

        _createClass(Stage, [{
            key: "addChildAt",
            value: function addChildAt(child, index) {
                _get(Object.getPrototypeOf(Stage.prototype), "addChildAt", this).call(this, child, index);
                if (child != this.__forntLayer && this.__forntLayer) {
                    this.addChild(this.__forntLayer);
                }
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                if (child == this.$inputSprite || child == this.$background || child == this.$debugSprite || child == this.$pop || child == this.$menu || child == this.$drag) {
                    return;
                }
                _get(Object.getPrototypeOf(Stage.prototype), "removeChild", this).call(this, child);
            }

            ///////////////////////////////////////触摸事件处理///////////////////////////////////////

        }, {
            key: "$setFocus",
            value: function $setFocus(val) {
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
        }, {
            key: "$addMouseMoveEvent",
            value: function $addMouseMoveEvent(x, y) {
                this.__lastMouseX = x;
                this.__lastMouseY = y;
                this.__nativeMouseMoveEvent.push({ x: x, y: y });
                //flower.trace("mouseEvent",x,y);
            }
        }, {
            key: "$addRightClickEvent",
            value: function $addRightClickEvent(x, y) {
                this.__lastRightX = x;
                this.__lastRightY = y;
                this.__nativeRightClickEvent.push({ x: x, y: y });
            }
        }, {
            key: "$addTouchEvent",
            value: function $addTouchEvent(type, id, x, y) {
                this.__nativeTouchEvent.push({
                    type: type,
                    id: id,
                    x: x,
                    y: y
                });
                //flower.trace("touchEvent",type,id,x,y);
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, mutiply) {
                var target = _get(Object.getPrototypeOf(Stage.prototype), "$getMouseTarget", this).call(this, touchX, touchY, mutiply) || this;
                return target;
            }
        }, {
            key: "$onTouchBegin",
            value: function $onTouchBegin(id, x, y) {
                var mouse = {
                    id: 0,
                    mutiply: false,
                    startX: 0,
                    startY: 0,
                    moveX: 0,
                    moveY: 0,
                    touchX: {},
                    touchY: {},
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
                    event.$touchX = target.mouseX;
                    event.$touchY = target.mouseY;
                    mouse.touchX[target.id] = target.mouseX;
                    mouse.touchY[target.id] = target.mouseY;
                    target.dispatch(event);
                }
            }
        }, {
            key: "$onRightClick",
            value: function $onRightClick(x, y) {
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
                event.$touchX = target.mouseX;
                event.$touchY = target.mouseY;
                target.dispatch(event);
            }
        }, {
            key: "$onMouseMove",
            value: function $onMouseMove(x, y) {
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
                            event.$touchX = list[i].mouseX;
                            event.$touchY = list[i].mouseY;
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
                            event.$touchX = this.__dragOverList[j].mouseX;
                            event.$touchY = this.__dragOverList[j].mouseY;
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
                            event.$touchX = list[i].mouseX;
                            event.$touchY = list[i].mouseY;
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
                            event.$touchX = this.__mouseOverList[j].mouseX;
                            event.$touchY = this.__mouseOverList[j].mouseY;
                            this.__mouseOverList[j].dispatch(event);
                        }
                    }
                    this.__mouseOverList = list;
                    if (target) {
                        event = new flower.MouseEvent(flower.MouseEvent.MOUSE_MOVE);
                        event.$stageX = x;
                        event.$stageY = y;
                        event.$target = target;
                        event.$touchX = target.mouseX;
                        event.$touchY = target.mouseY;
                        target.dispatch(event);
                    }
                }
            }
        }, {
            key: "$onTouchMove",
            value: function $onTouchMove(id, x, y) {
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
                var target = mouse.target; //this.$getMouseTarget(x, y, mouse.mutiply);
                mouse.moveX = x;
                mouse.moveY = y;
                var event;
                if (target) {
                    event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
                    event.$touchId = id;
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = target.mouseX;
                    event.$touchY = target.mouseY;
                    event.$beginTouchX = mouse.touchX[target.id];
                    event.$beginTouchY = mouse.touchY[target.id];
                    event.$beginStageX = mouse.startX;
                    event.$beginStageY = mouse.startY;
                    target.dispatch(event);
                }
            }
        }, {
            key: "$onTouchEnd",
            value: function $onTouchEnd(id, x, y) {
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
                    event.$touchX = target.mouseX;
                    event.$touchY = target.mouseY;
                    event.$beginTouchX = mouse.touchX[target.id];
                    event.$beginTouchY = mouse.touchY[target.id];
                    event.$beginStageX = mouse.startX;
                    event.$beginStageY = mouse.startY;
                    target.dispatch(event);
                } else {
                    target = mouse.target;
                    event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
                    event.$touchId = id;
                    event.$stageX = x;
                    event.$stageY = y;
                    event.$target = target;
                    event.$touchX = target.mouseX;
                    event.$touchY = target.mouseY;
                    event.$beginTouchX = mouse.touchX[target.id];
                    event.$beginTouchY = mouse.touchY[target.id];
                    event.$beginStageX = mouse.startX;
                    event.$beginStageY = mouse.startY;
                    target.dispatch(event);
                }
            }

            ///////////////////////////////////////触摸事件处理///////////////////////////////////////

            ///////////////////////////////////////键盘事件处理///////////////////////////////////////

        }, {
            key: "$onKeyDown",
            value: function $onKeyDown(key) {
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
                while (this.$keyEvents.length) {
                    this.$dispatchKeyEvent(this.$keyEvents.shift());
                }
            }
        }, {
            key: "$onKeyUp",
            value: function $onKeyUp(key) {
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
                while (this.$keyEvents.length) {
                    this.$dispatchKeyEvent(this.$keyEvents.shift());
                }
            }
        }, {
            key: "$dispatchKeyEvent",
            value: function $dispatchKeyEvent(info) {
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

        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                DebugInfo.frameInfo.display = 0;
                DebugInfo.frameInfo.text = 0;
                DebugInfo.frameInfo.bitmap = 0;
                DebugInfo.frameInfo.shape = 0;
                DebugInfo.frameInfo.sprite = 0;
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
                    mouseMoveList.push({ x: this.__lastMouseX, y: this.__lastMouseY });
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
                _get(Object.getPrototypeOf(Stage.prototype), "$onFrameEnd", this).call(this);
                //this.$background.$onFrameEnd();
                DebugInfo.frameInfo.bitmap = DebugInfo.frameInfo.display - DebugInfo.frameInfo.text - DebugInfo.frameInfo.shape - DebugInfo.frameInfo.sprite;
                //trace("Display:", DebugInfo.frameInfo.display, "  Text:", DebugInfo.frameInfo.text, "  Bitmap:", DebugInfo.frameInfo.bitmap, "  Shape:", DebugInfo.frameInfo.shape, "  Sprite:", DebugInfo.frameInfo.sprite);
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                return;
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                return;
            }
        }, {
            key: "$resize",
            value: function $resize(width, height) {
                _get(Object.getPrototypeOf(Stage.prototype), "$setWidth", this).call(this, width);
                _get(Object.getPrototypeOf(Stage.prototype), "$setHeight", this).call(this, height);
                this.$background.clear();
                this.$background.drawRect(0, 0, this.width, this.height);
                this.$pop.$resize(width, height);
                this.$menu.$resize(width, height);
            }
        }, {
            key: "stageWidth",
            get: function get() {
                return Platform.width;
            }
        }, {
            key: "stageHeight",
            get: function get() {
                return Platform.height;
            }
        }, {
            key: "backgroundColor",
            set: function set(val) {
                this.$background.clear();
                this.$background.fillColor = val;
                this.$background.drawRect(0, 0, this.width, this.height);
            },
            get: function get() {
                return this.$background.fillColor;
            }
        }, {
            key: "focus",
            get: function get() {
                return this.__focus;
            },
            set: function set(val) {
                this.$setFocus(val);
            }
        }, {
            key: "debugContainer",
            get: function get() {
                return this.$debugSprite;
            }
        }, {
            key: "mouseX",
            get: function get() {
                return this.__mouseX;
            }
        }, {
            key: "mouseY",
            get: function get() {
                return this.__mouseY;
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                return Stage.stages[0];
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                for (var i = 0; i < Stage.stages.length; i++) {
                    Stage.stages[i].$onFrameEnd();
                }
            }
        }, {
            key: "getShortcut",
            value: function getShortcut() {
                return Platform.getShortcut();
            }
        }, {
            key: "$dispose",
            value: function $dispose() {
                //Stage.getInstance().removeAll();
                Stage.stages = [];
            }
        }]);

        return Stage;
    }(Sprite);

    Stage.stages = [];


    flower.Stage = Stage;
    //////////////////////////End File:flower/display/Stage.js///////////////////////////

    //////////////////////////File:flower/display/Particle.js///////////////////////////

    var Particle = function (_flower$Sprite) {
        _inherits(Particle, _flower$Sprite);

        function Particle(config) {
            _classCallCheck(this, Particle);

            var _this25 = _possibleConstructorReturn(this, Object.getPrototypeOf(Particle).call(this));

            _this25.__particles = [];
            _this25.__cycles = [];
            if (typeof config == "string") {
                var loader = new flower.URLLoader(config);
                loader.load();
                loader.addListener(flower.Event.COMPLETE, _this25.__loadConfigComplete, _this25);
            } else {
                _this25.setConfig(config);
            }
            flower.EnterFrame.add(_this25.__update, _this25);
            return _this25;
        }

        _createClass(Particle, [{
            key: "__loadConfigComplete",
            value: function __loadConfigComplete(e) {
                this.setConfig(e.data);
            }
        }, {
            key: "setConfig",
            value: function setConfig(config) {
                this.__config = config;
                //{
                //    "name": "粒子特效",
                //    "image": "",
                //    "mode": 0,
                //    "life": 0,
                //    "lifev": 0,
                //    "max": 0,
                //    "gx": 0,
                //    "gy": 0
                //}
                this.__texture = null;
                if (this.loader) {
                    this.loader.dispose();
                    this.loader = null;
                }
                var loader = new flower.URLLoader(config.image);
                loader.load();
                loader.addListener(flower.Event.COMPLETE, this.__loadTextureComplete, this);
                this.loader = loader;
                while (this.__cycles.length) {
                    this.__cycles.pop().image.dispose();
                }
                this.__lastCount = 0;
            }
        }, {
            key: "__loadTextureComplete",
            value: function __loadTextureComplete(e) {
                this.loader = null;
                this.__texture = e.data;
            }
        }, {
            key: "__update",
            value: function __update(time, gap) {
                if (!this.__texture) {
                    return;
                }
                gap = gap / 1000;
                var cfg = this.__config;
                var particles = this.__particles;
                var cycles = this.__cycles;

                for (var i = 0; i < particles.length; i++) {
                    var particle = particles[i];
                    if (particle.life <= 0) {
                        particles.splice(i, 1);
                        i--;
                        cycles.push(particle);
                        //particle.image.parent.removeChild(particle.image);
                        particle.image.visible = false;
                    }
                }

                for (var i = 0; i < particles.length; i++) {
                    var particle = particles[i];
                    particle.life -= gap;
                    particle.vx += cfg.gx * gap;
                    particle.vy += -cfg.gy * gap;
                    particle.x += particle.vx * gap;
                    particle.y += particle.vy * gap;
                    particle.scale += particle.scaleV * gap;
                    particle.rotation += particle.rotationV * gap;
                    particle.alpha += particle.alphaV * gap;
                    particle.red += particle.redV * gap;
                    particle.green += particle.greenV * gap;
                    particle.blue += particle.blueV * gap;
                    if (particle.oldX != ~ ~particle.x) {
                        particle.oldX = ~ ~particle.x;
                        particle.image.$nativeShow.setX(particle.oldX);
                    }
                    if (particle.oldY != ~ ~particle.y) {
                        particle.oldY = ~ ~particle.y;
                        particle.image.$nativeShow.setY(particle.oldY);
                    }
                    if (particle.oldScale != ~ ~particle.scale) {
                        particle.oldScale = ~ ~particle.scale;
                        particle.image.$nativeShow.setScaleX((particle.oldScale < 0 ? 0 : particle.oldScale) / 100);
                        particle.image.$nativeShow.setScaleY((particle.oldScale < 0 ? 0 : particle.oldScale) / 100);
                    }
                    if (particle.oldAlpha != ~ ~particle.alpha) {
                        particle.oldAlpha = ~ ~particle.alpha;
                        particle.image.alpha = particle.oldAlpha / 255;
                    }
                    if (particle.oldRed != ~ ~particle.red || particle.oldGreen != ~ ~particle.green || particle.oldBlue != ~ ~particle.blue) {
                        particle.oldRed = ~ ~particle.red;
                        particle.oldGreen = ~ ~particle.green;
                        particle.oldBlue = ~ ~particle.blue;
                        particle.filters[0].r = particle.oldRed;
                        particle.filters[0].g = particle.oldGreen;
                        particle.filters[0].b = particle.oldBlue;
                        particle.image.filters = particle.filters;
                    }
                    if (particle.oldRotation != ~ ~particle.rotation) {
                        particle.oldRotation = ~ ~particle.rotation;
                        particle.image.rotation = particle.oldRotation;
                    }
                }

                var count = cfg.max * gap / cfg.life + this.__lastCount;
                this.__lastCount = count - ~ ~count;
                count = ~ ~count;
                if (particles.length + count > cfg.max) {
                    count = cfg.max - particles.length;
                }
                for (var i = 0; i < count; i++) {
                    var item;
                    var scale = cfg.initSize - cfg.initSizeV + 2 * cfg.initSizeV * math.random();
                    var endScale = cfg.endSize - cfg.endSizeV + 2 * cfg.endSizeV * math.random();
                    var alpha = cfg.initAlpha - cfg.initAlphaV + 2 * cfg.initAlphaV * math.random();
                    var endAlpha = cfg.endAlpha - cfg.endAlphaV + 2 * cfg.endAlphaV * math.random();
                    var red = cfg.initRed - cfg.initRedV + 2 * cfg.initRedV * math.random();
                    var endRed = cfg.endRed - cfg.endRedV + 2 * cfg.endRedV * math.random();
                    var green = cfg.initGreen - cfg.initGreenV + 2 * cfg.initGreenV * math.random();
                    var endGreen = cfg.endGreen - cfg.endGreenV + 2 * cfg.endGreenV * math.random();
                    var blue = cfg.initBlue - cfg.initBlueV + 2 * cfg.initBlueV * math.random();
                    var endBlue = cfg.endBlue - cfg.endBlueV + 2 * cfg.endBlueV * math.random();
                    var rotation = cfg.initRotation - cfg.initRotationV + 2 * cfg.initRotationV * math.random();
                    var endRotation = cfg.endRotation - cfg.endRotationV + 2 * cfg.endRotationV * math.random();
                    var shootSpeed = cfg.shootSpeed - cfg.shootSpeedV + 2 * math.random() * cfg.shootSpeedV;
                    var shootRotation = cfg.shootRotation - cfg.shootRotationV + 2 * math.random() * cfg.shootRotationV;
                    shootRotation = shootRotation * math.PI / 180;
                    var vx = math.cos(shootRotation) * shootSpeed;
                    var vy = -math.sin(shootRotation) * shootSpeed;
                    var life = cfg.life - cfg.lifev + 2 * math.random() * cfg.lifev;
                    if (cycles.length) {
                        item = cycles.pop();
                        item.life = life;
                        item.vx = vx;
                        item.vy = vy;
                        item.scale = scale;
                        item.scaleV = (endScale - scale) / life;
                        item.alpha = alpha;
                        item.alphaV = (endAlpha - alpha) / life;
                        item.red = red;
                        item.redV = (endRed - red) / life;
                        item.green = green;
                        item.greenV = (endGreen - green) / life;
                        item.blue = blue;
                        item.blueV = (endBlue - blue) / life;
                        item.rotation = rotation;
                        item.rotationV = (endRotation - rotation) / life;
                        item.image.visible = true;
                    } else {
                        item = {
                            image: new flower.Bitmap(this.__texture),
                            mode: cfg.mode,
                            life: life,
                            x: 0,
                            y: 0,
                            vx: vx,
                            vy: vy,
                            scale: scale,
                            scaleV: (endScale - scale) / life,
                            alpha: alpha,
                            alphaV: (endAlpha - alpha) / life,
                            red: red,
                            redV: (endRed - red) / life,
                            green: green,
                            greenV: (endGreen - green) / life,
                            blue: blue,
                            blueV: (endBlue - blue) / life,
                            rotation: rotation,
                            rotationV: (endRotation - rotation) / life,
                            oldX: 0,
                            oldY: 0,
                            oldScale: 1,
                            oldAlpha: 1,
                            oldRotation: 0,
                            oldRed: 0,
                            oldGreen: 0,
                            oldBlue: 0,
                            filters: [new flower.DyeingFilter()]
                        };
                        item.image.$setSimpleMode();
                        this.addChild(item.image);
                    }
                    item.x = -cfg.xv + cfg.xv * 2 * math.random();
                    item.y = -cfg.yv + cfg.yv * 2 * math.random();
                    if (item.oldX != ~ ~item.x) {
                        item.oldX = ~ ~item.x;
                        item.image.$nativeShow.setX(item.oldX);
                    }
                    if (item.oldY != ~ ~item.y) {
                        item.oldY = ~ ~item.y;
                        item.image.$nativeShow.setY(item.oldY);
                    }
                    if (item.oldScale != ~ ~item.scale) {
                        item.oldScale = ~ ~item.scale;
                        item.image.$nativeShow.setScaleX(item.oldScale / 100);
                        item.image.$nativeShow.setScaleY(item.oldScale / 100);
                    }
                    if (item.oldAlpha != ~ ~item.alpha) {
                        item.oldAlpha = ~ ~item.alpha;
                        item.image.alpha = item.oldAlpha / 255;
                    }
                    if (item.oldRed != ~ ~item.red || item.oldGreen != ~ ~item.green || item.oldBlue != ~ ~item.blue) {
                        item.oldRed = ~ ~item.red;
                        item.oldGreen = ~ ~item.green;
                        item.oldBlue = ~ ~item.blue;
                        item.filters[0].r = item.oldRed;
                        item.filters[0].g = item.oldGreen;
                        item.filters[0].b = item.oldBlue;
                        item.image.filters = item.filters;
                    }
                    if (item.oldRotation != ~ ~item.rotation) {
                        item.oldRotation = ~ ~item.rotation;
                        item.image.rotation = item.oldRotation;
                    }
                    particles.push(item);
                }
            }
        }, {
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
                touchX = math.floor(point.x);
                touchY = math.floor(point.y);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                p[22] = flower.EnterFrame.frame;
                var bounds = this.$getContentBounds();
                if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + this.width && touchY < bounds.y + this.height) {
                    return this;
                }
                return null;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                this.$removeFlags(0x0100);
                _get(Object.getPrototypeOf(Particle.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                flower.EnterFrame.remove(this.__update, this);
                while (this.__cycles.length) {
                    this.__cycles.pop().image.dispose();
                }
                _get(Object.getPrototypeOf(Particle.prototype), "dispose", this).call(this);
            }
        }]);

        return Particle;
    }(flower.Sprite);

    flower.Particle = Particle;
    //////////////////////////End File:flower/display/Particle.js///////////////////////////

    //////////////////////////File:flower/manager/DragManager.js///////////////////////////

    var DragManager = function (_Sprite3) {
        _inherits(DragManager, _Sprite3);

        function DragManager() {
            _classCallCheck(this, DragManager);

            var _this26 = _possibleConstructorReturn(this, Object.getPrototypeOf(DragManager).call(this));

            _this26.__isDragging = false;

            _this26.touchEnabled = false;
            return _this26;
        }

        _createClass(DragManager, [{
            key: "startDrag",
            value: function startDrag(sourceX, soureceY, dragSource, dragSprite) {
                var dragType = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];
                var dragData = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

                this.dragSource = dragSource;
                this.dragSprite = dragSprite;
                this.dragType = dragType;
                this.dragData = dragData;
                this.__isDragging = true;
                if (dragSprite) {
                    dragSprite.x -= this.x - sourceX;
                    dragSprite.y -= this.y - soureceY;
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
        }, {
            key: "$updatePosition",
            value: function $updatePosition(x, y) {
                this.x = x;
                this.y = y;
                if (this.isDragging && !this.dragSprite) {
                    this.dragSource.x = this.x - this.__mouseX + this.__dragSourceX;
                    this.dragSource.y = this.y - this.__mouseY + this.__dragSourceY;
                }
            }
        }, {
            key: "__stopDrag",
            value: function __stopDrag() {
                if (this.dragSprite && this.dragSprite.parent == this) {
                    this.removeChild(this.dragSprite);
                }
                this.dragSource = null;
                this.dragSprite = null;
                this.dragType = "";
                this.dragData = null;
                this.__isDragging = false;
            }
        }, {
            key: "$dragEnd",
            value: function $dragEnd(display) {
                var event = flower.DragEvent.create(flower.DragEvent.DRAG_END, true, this.dragSource, this.dragType, this.dragData);
                display.dispatch(event);
                if (event.hasAccept) {} else {
                    if (this.dragSprite) {
                        this.parent.addChild(this.dragSprite);
                        this.dragSprite.x += this.x;
                        this.dragSprite.y += this.y;
                        flower.Tween.to(this.dragSprite, 0.5, {
                            x: this.__dragStartX,
                            y: this.__dragStartY,
                            alpha: 0
                        }, flower.Ease.QUAD_EASE_IN_OUT).call(function (sprite) {
                            if (sprite.parent) {
                                sprite.dispose();
                            }
                        }, null, this.dragSprite);
                    }
                }
                this.__stopDrag();
            }
        }, {
            key: "isDragging",
            get: function get() {
                return this.__isDragging;
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                if (!DragManager.instance) {
                    DragManager.instance = new DragManager();
                }
                return DragManager.instance;
            }
        }, {
            key: "startDrag",
            value: function startDrag(sourceX, soureceY, dragSource, dragSprite, dragType, dragData) {
                DragManager.instance.startDrag(sourceX, soureceY, dragSource, dragSprite, dragType, dragData);
            }
        }]);

        return DragManager;
    }(Sprite);

    //////////////////////////End File:flower/manager/DragManager.js///////////////////////////

    //////////////////////////File:flower/manager/MenuManager.js///////////////////////////


    var MenuManager = function (_Sprite4) {
        _inherits(MenuManager, _Sprite4);

        function MenuManager() {
            _classCallCheck(this, MenuManager);

            var _this27 = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuManager).call(this));

            _this27.__addFrame = 0;
            return _this27;
        }

        _createClass(MenuManager, [{
            key: "$onTouch",
            value: function $onTouch(target) {
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
        }, {
            key: "$hasMenu",
            value: function $hasMenu() {
                return flower.EnterFrame.frame > this.__addFrame && this.numChildren ? true : false;
            }
        }, {
            key: "addChildAt",
            value: function addChildAt(child, index) {
                this.__addFrame = flower.EnterFrame.frame;
                _get(Object.getPrototypeOf(MenuManager.prototype), "addChildAt", this).call(this, child, index);
            }
        }, {
            key: "$resize",
            value: function $resize(width, height) {
                this.width = width;
                this.height = height;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
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
                _get(Object.getPrototypeOf(MenuManager.prototype), "$onFrameEnd", this).call(this);
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                if (!MenuManager.instance) {
                    MenuManager.instance = new MenuManager();
                }
                return MenuManager.instance;
            }
        }, {
            key: "showMenu",
            value: function showMenu(display) {
                var x = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
                var y = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];
                var autoRemove = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

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
        }, {
            key: "hideMenu",
            value: function hideMenu() {
                MenuManager.getInstance().removeAll();
            }
        }]);

        return MenuManager;
    }(Sprite);

    flower.MenuManager = MenuManager;
    //////////////////////////End File:flower/manager/MenuManager.js///////////////////////////

    //////////////////////////File:flower/manager/PopManager.js///////////////////////////

    var PopManager = function (_Sprite5) {
        _inherits(PopManager, _Sprite5);

        function PopManager() {
            _classCallCheck(this, PopManager);

            var _this28 = _possibleConstructorReturn(this, Object.getPrototypeOf(PopManager).call(this));

            _this28.__panels = [];
            return _this28;
        }

        _createClass(PopManager, [{
            key: "$resize",
            value: function $resize(width, height) {
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
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                var panels = this.__panels;
                for (var i = 0; i < panels.length; i++) {
                    if (panels[i].panel == child) {
                        if (panels[i].mask) {
                            _get(Object.getPrototypeOf(PopManager.prototype), "removeChild", this).call(this, panels[i].mask);
                        }
                        panels.splice(i, 1);
                    }
                }
                _get(Object.getPrototypeOf(PopManager.prototype), "removeChild", this).call(this, child);
            }
        }, {
            key: "pop",
            value: function pop(panel) {
                var mask = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
                var center = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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
        }], [{
            key: "getInstance",
            value: function getInstance() {
                if (!PopManager.instance) {
                    PopManager.instance = new PopManager();
                }
                return PopManager.instance;
            }
        }, {
            key: "pop",
            value: function pop(panel) {
                var mask = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
                var center = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                PopManager.getInstance().pop(panel, mask, center);
            }
        }]);

        return PopManager;
    }(Sprite);

    flower.PopManager = PopManager;
    //////////////////////////End File:flower/manager/PopManager.js///////////////////////////

    //////////////////////////File:flower/texture/Texture.js///////////////////////////

    var Texture = function () {
        function Texture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight, sourceWidth, sourceHeight) {
            _classCallCheck(this, Texture);

            this.__offX = 0;
            this.__offY = 0;
            this.__sourceRotation = false;
            this.__use = false;
            this.__dispatcher = UPDATE_RESOURCE ? new EventDispatcher() : null;

            this.$nativeTexture = nativeTexture;
            this.__url = url;
            this.__nativeURL = nativeURL;
            this.$count = 0;
            this.__width = +w;
            this.__height = +h;
            this.__settingWidth = settingWidth;
            this.__settingHeight = settingHeight;
            this.__sourceWidth = sourceWidth;
            this.__sourceHeight = sourceHeight;
        }

        /**
         * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
         * @native
         */


        _createClass(Texture, [{
            key: "$update",
            value: function $update(nativeTexture, w, h, settingWidth, settingHeight) {
                this.$nativeTexture = nativeTexture;
                this.__width = w;
                this.__height = h;
                this.__settingWidth = settingWidth;
                this.__settingHeight = settingHeight;
                if (this.dispatcher) {
                    this.dispatcher.dispatchWith(Event.UPDATE);
                }
            }
        }, {
            key: "createSubTexture",
            value: function createSubTexture(url, startX, startY, width, height) {
                var sourceWidth = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
                var sourceHeight = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
                var offX = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];
                var offY = arguments.length <= 8 || arguments[8] === undefined ? 0 : arguments[8];
                var rotation = arguments.length <= 9 || arguments[9] === undefined ? false : arguments[9];

                var sub = new Texture(this.$nativeTexture, url, this.__nativeURL, width, height, width * this.scaleX, height * this.scaleY, sourceWidth || this.width, sourceHeight || this.height);
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
            key: "$useTexture",
            value: function $useTexture() {
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
        }, {
            key: "$addCount",
            value: function $addCount() {
                if (this.$parentTexture) {
                    this.$parentTexture.$addCount();
                } else {
                    this.$count++;
                }
            }
        }, {
            key: "$delCount",
            value: function $delCount() {
                if (this.$parentTexture) {
                    this.$parentTexture.$delCount();
                } else {
                    this.$count--;
                    if (this.$count < 0) {
                        this.$count = 0;
                    }
                }
            }
        }, {
            key: "$setSplitInfo",
            value: function $setSplitInfo(data) {
                var content = data;
                var xml = XMLElement.parse(content);
                xml = xml.list[0];
                var reslist;
                var attributes;
                for (var i = 0; i < xml.list.length; i++) {
                    if (xml.list[i].name == "key") {
                        if (xml.list[i].value == "frames") {
                            reslist = xml.list[i + 1];
                        } else if (xml.list[i].value == "metadata") {
                            attributes = xml.list[i + 1];
                        }
                        i++;
                    }
                }
                this.__splits = [];
                var frameFrame;
                var frame;
                var maxw = 0;
                var maxh = 0;
                for (i = 0; i < reslist.list.length; i++) {
                    if (reslist.list[i].name == "key") {
                        frame = new PlistFrame(reslist.list[i].value);
                        frame.decode(reslist.list[i + 1]);
                        var name = frame.name;
                        var posx = ~ ~name.split("_")[0];
                        var posy = ~ ~name.split(".")[0].split("_")[1];
                        var item = {
                            x: posx,
                            y: posy,
                            textureX: frame._x,
                            textureY: frame._y,
                            textureWidth: frame._width,
                            textureHeight: frame._height,
                            offX: frame._moveX,
                            offY: frame._moveY,
                            sourceWidth: frame._sourceWidth,
                            sourceHeight: frame._sourceHeight,
                            rotation: frame._rotation
                        };
                        maxw = posx + item.sourceWidth > maxw ? posx + item.sourceWidth : maxw;
                        maxh = posy + item.sourceHeight > maxh ? posy + item.sourceHeight : maxh;
                        i++;
                    }
                }
                this.__sourceWidth = maxw;
                this.__sourceHeight = maxh;
                trace("原本大小：", maxw, maxh, "现在大小:", this.width, this.height);
            }
        }, {
            key: "getCount",
            value: function getCount() {
                if (this.$parentTexture) {
                    this.$parentTexture.getCount();
                } else {
                    return this.$count;
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
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

        }, {
            key: "$use",
            get: function get() {
                return this.__use;
            },
            set: function set(val) {
                this.__use = val;
            }
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
                return this.__sourceWidth || this.__width;
            }
        }, {
            key: "height",
            get: function get() {
                return this.__sourceHeight || this.__height;
            }
        }, {
            key: "textureWidth",
            get: function get() {
                return this.__settingWidth || this.__width;
            }
        }, {
            key: "textureHeight",
            get: function get() {
                return this.__settingHeight || this.__height;
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
            key: "scaleX",
            get: function get() {
                return this.textureWidth / this.__width;
            }
        }, {
            key: "scaleY",
            get: function get() {
                return this.textureHeight / this.__height;
            }
        }, {
            key: "count",
            get: function get() {
                return this.$count;
            }

            /**
             * 更新时间抛出对象，当 Texture 更新时，此对象抛出更新事件 Event.UPDATE
             * @native
             */

        }, {
            key: "dispatcher",
            get: function get() {
                return this.__dispatcher;
            }
        }]);

        return Texture;
    }();

    flower.Texture = Texture;
    //////////////////////////End File:flower/texture/Texture.js///////////////////////////

    //////////////////////////File:flower/texture/TextureManager.js///////////////////////////

    var TextureManager = function () {
        function TextureManager() {
            _classCallCheck(this, TextureManager);

            this.list = [];
        }

        _createClass(TextureManager, [{
            key: "$createTexture",


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
            value: function $createTexture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
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
                    DebugInfo.addTexture(texture);
                }
                return texture;
            }
        }, {
            key: "$getTextureByNativeURL",
            value: function $getTextureByNativeURL(url) {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].nativeURL == url) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "$getTextureByURL",
            value: function $getTextureByURL(url) {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].url == url) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "$check",
            value: function $check() {
                var texture;
                for (var i = 0; i < this.list.length; i++) {
                    texture = this.list[i];
                    if (texture.$count == 0) {
                        if (texture.dispose()) {
                            this.list.splice(i, 1);
                            if (DEBUG) {
                                DebugInfo.delTexture(texture);
                            }
                            i--;
                        }
                    }
                }
            }
        }, {
            key: "$dispose",
            value: function $dispose() {
                this.list = [];
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                if (TextureManager.instance == null) {
                    TextureManager.instance = new TextureManager();
                }
                return TextureManager.instance;
            }
        }]);

        return TextureManager;
    }();
    //////////////////////////End File:flower/texture/TextureManager.js///////////////////////////

    //////////////////////////File:flower/net/URLLoader.js///////////////////////////


    var URLLoader = function (_EventDispatcher2) {
        _inherits(URLLoader, _EventDispatcher2);

        function URLLoader(res) {
            _classCallCheck(this, URLLoader);

            var _this29 = _possibleConstructorReturn(this, Object.getPrototypeOf(URLLoader).call(this));

            _this29._createRes = false;
            _this29._isLoading = false;
            _this29._selfDispose = false;

            _this29.$setResource(res);
            _this29._language = LANGUAGE;
            _this29._scale = SCALE ? SCALE : null;
            return _this29;
        }

        _createClass(URLLoader, [{
            key: "$setResource",
            value: function $setResource(res) {
                if (typeof res == "string") {
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
        }, {
            key: "$addLink",
            value: function $addLink(loader) {
                if (!this._links) {
                    this._links = [];
                }
                this._links.push(loader);
            }
        }, {
            key: "load",
            value: function load(res) {
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
        }, {
            key: "loadTexture",
            value: function loadTexture() {
                var texture = TextureManager.getInstance().$getTextureByURL(this.url);
                if (this._loadInfo.update) {
                    texture = null;
                }
                if (texture) {
                    texture.$addCount();
                    this._data = texture;
                    new CallLater(this.loadComplete, this);
                } else {
                    if (this._loadInfo.plist) {
                        var loader = new URLLoader(this._loadInfo.plist);
                        loader.addListener(Event.COMPLETE, this.onLoadTexturePlistComplete, this);
                        loader.addListener(Event.ERROR, this.loadError, this);
                        loader.load();
                    } else {
                        var params = {};
                        //params.r = math.random();
                        for (var key in this._params) {
                            params[key] = this._params;
                        }
                        PlatformURLLoader.loadTexture(this.__concatURLHead(URLLoader.urlHead, this._loadInfo.url), this.loadTextureComplete, this.loadError, this, params);
                    }
                }
            }
        }, {
            key: "__concatURLHead",
            value: function __concatURLHead(head, url) {
                if (url.slice(0, 7) == "http://") {
                    return url;
                }
                return head + url;
            }
        }, {
            key: "onLoadTexturePlistComplete",
            value: function onLoadTexturePlistComplete(e) {
                var plist = e.data;
                this._data = plist.getFrameTexture(this.url);
                this._data.$addCount();
                this.loadComplete();
            }
        }, {
            key: "loadTextureComplete",
            value: function loadTextureComplete(nativeTexture, width, height) {
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
                if (this._loadInfo.splitURL) {
                    var res = ResItem.create(this._loadInfo.splitURL);
                    res.__type = ResType.TEXT;
                    var loader = new flower.URLLoader(res);
                    loader.addListener(flower.Event.COMPLETE, this.loadTextureSplitComplete, this);
                    loader.addListener(flower.Event.ERROR, this.loadError, this);
                    loader.load();
                } else {
                    new CallLater(this.loadComplete, this);
                }
            }
        }, {
            key: "loadTextureSplitComplete",
            value: function loadTextureSplitComplete(e) {
                this._data.$setSplitInfo(e.data);
                this.loadComplete();
            }
        }, {
            key: "setTextureByLink",
            value: function setTextureByLink(texture) {
                texture.$addCount();
                this._data = texture;
                this.loadComplete();
            }
        }, {
            key: "loadPlist",
            value: function loadPlist() {
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
        }, {
            key: "loadPlistComplete",
            value: function loadPlistComplete(e) {
                this._data = e.data;
                new CallLater(this.loadComplete, this);
            }
        }, {
            key: "setPlistByLink",
            value: function setPlistByLink(plist) {
                this._data = plist;
                this.loadComplete();
            }
        }, {
            key: "loadText",
            value: function loadText() {
                var params = {};
                //params.r = math.random();
                for (var key in this._params) {
                    params[key] = this._params;
                }
                PlatformURLLoader.loadText(this.__concatURLHead(URLLoader.urlHead, this._loadInfo.url), this.loadTextComplete, this.loadError, this, this._method, params);
            }
        }, {
            key: "loadTextComplete",
            value: function loadTextComplete(content) {
                if (this._type == ResType.TEXT) {
                    this._data = content;
                } else if (this._type == ResType.JSON) {
                    this._data = JSON.parse(content);
                }
                new CallLater(this.loadComplete, this);
            }
        }, {
            key: "setTextByLink",
            value: function setTextByLink(content) {
                if (this._type == ResType.TEXT) {
                    this._data = content;
                } else if (this._type == ResType.JSON) {
                    this._data = JSON.parse(content);
                }
                this.loadComplete();
            }
        }, {
            key: "setJsonByLink",
            value: function setJsonByLink(content) {
                this._data = content;
                this.loadComplete();
            }
        }, {
            key: "loadComplete",
            value: function loadComplete() {
                if (this._links) {
                    for (var i = 0; i < this._links.length; i++) {
                        if (this._type == ResType.IMAGE) {
                            this._links[i].setTextureByLink(this._data);
                        } else if (this._type == ResType.TEXT) {
                            this._links[i].setTextByLink(this._data);
                        } else if (this._type == ResType.JSON) {
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
                if (this.isDispose) {
                    if (this._data && this._type == ResType.IMAGE) {
                        if (this._recordUse) {
                            this._data.$use = true;
                        }
                        //if (!this._loadInfo.plist) {
                        this._data.$delCount();
                        //}
                        this._data = null;
                    }
                    return;
                }
                this.dispatchWith(Event.COMPLETE, this._data);
                this._selfDispose = true;
                this.dispose();
                this._selfDispose = false;
            }
        }, {
            key: "loadError",
            value: function loadError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatchWith(Event.ERROR, getLanguage(2003, this._loadInfo.url));
                    if (this._links) {
                        for (var i = 0; i < this._links.length; i++) {
                            this._links[i].loadError();
                        }
                    }
                    this.dispose();
                } else {
                    $error(2003, this._loadInfo.url);
                }
            }
        }, {
            key: "$useImage",
            value: function $useImage() {
                if (!this._data) {
                    this._recordUse = true;
                    return;
                }
                this._data.$use = true;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this._selfDispose) {
                    _get(Object.getPrototypeOf(URLLoader.prototype), "dispose", this).call(this);
                    return;
                }
                if (this._data && this._type == ResType.IMAGE) {
                    //if (!this._loadInfo.plist) {
                    this._data.$delCount();
                    //}
                    this._data = null;
                }
                if (this._createRes && this._res) {
                    ResItem.release(this._res);
                }
                this._res = null;
                this._data = null;
                _get(Object.getPrototypeOf(URLLoader.prototype), "dispose", this).call(this);
                for (var i = 0; i < URLLoader.list.length; i++) {
                    if (URLLoader.list[i] == this) {
                        URLLoader.list.splice(i, 1);
                        break;
                    }
                }
            }
        }, {
            key: "url",
            get: function get() {
                return this._res ? this._res.url : "";
            }
        }, {
            key: "loadURL",
            get: function get() {
                return this._loadInfo ? this._loadInfo.url : "";
            }
        }, {
            key: "type",
            get: function get() {
                return this._res ? this._res.type : "";
            }
        }, {
            key: "language",
            set: function set(val) {
                this._language = val;
            }
        }, {
            key: "scale",
            set: function set(val) {
                this._scale = val * (SCALE ? SCALE : 1);
            }
        }, {
            key: "method",
            set: function set(val) {
                this._method = val;
            },
            get: function get() {
                return this._method;
            }
        }, {
            key: "params",
            set: function set(val) {
                this._params = val;
            },
            get: function get() {
                return this._params;
            }
        }], [{
            key: "clear",
            value: function clear() {
                while (URLLoader.list.length) {
                    var loader = URLLoader.list.pop();
                    loader.dispose();
                }
            }
        }]);

        return URLLoader;
    }(EventDispatcher);

    URLLoader.urlHead = "";
    URLLoader.list = [];


    flower.URLLoader = URLLoader;
    //////////////////////////End File:flower/net/URLLoader.js///////////////////////////

    //////////////////////////File:flower/net/URLLoaderList.js///////////////////////////

    var URLLoaderList = function (_EventDispatcher3) {
        _inherits(URLLoaderList, _EventDispatcher3);

        function URLLoaderList(list) {
            _classCallCheck(this, URLLoaderList);

            var _this30 = _possibleConstructorReturn(this, Object.getPrototypeOf(URLLoaderList).call(this));

            _this30.__list = list;
            _this30.__dataList = [];
            _this30.__index = 0;
            return _this30;
        }

        _createClass(URLLoaderList, [{
            key: "load",
            value: function load() {
                this.__loadNext();
            }
        }, {
            key: "__loadNext",
            value: function __loadNext() {
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
        }, {
            key: "__onError",
            value: function __onError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatch(e);
                } else {
                    $error(e.message);
                }
            }
        }, {
            key: "__onComplete",
            value: function __onComplete(e) {
                this.__dataList[this.__index] = e.data;
                this.__index++;
                this.__loadNext();
            }
        }, {
            key: "language",
            set: function set(val) {
                this.__language = val;
            }
        }, {
            key: "scale",
            set: function set(val) {
                this.__scale = val;
            }
        }]);

        return URLLoaderList;
    }(EventDispatcher);

    flower.URLLoaderList = URLLoaderList;
    //////////////////////////End File:flower/net/URLLoaderList.js///////////////////////////

    //////////////////////////File:flower/net/URLLoaderMethod.js///////////////////////////

    var URLLoaderMethod = function URLLoaderMethod() {
        _classCallCheck(this, URLLoaderMethod);
    };

    URLLoaderMethod.GET = "GET";
    URLLoaderMethod.POST = "POST";
    URLLoaderMethod.HEAD = "HEAD";


    flower.URLLoaderMethod = URLLoaderMethod;
    //////////////////////////End File:flower/net/URLLoaderMethod.js///////////////////////////

    //////////////////////////File:flower/net/WebSocket.js///////////////////////////

    var WebSocket = function (_flower$EventDispatch) {
        _inherits(WebSocket, _flower$EventDispatch);

        function WebSocket() {
            _classCallCheck(this, WebSocket);

            var _this31 = _possibleConstructorReturn(this, Object.getPrototypeOf(WebSocket).call(this));

            _this31._isConnect = false;
            return _this31;
        }

        _createClass(WebSocket, [{
            key: "connect",
            value: function connect(ip, port) {
                var path = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

                if (this._localWebSocket) {
                    this._localWebSocket.releaseWebSocket(this.localWebSocket);
                }
                this._isConnect = false;
                this._ip = ip;
                this._port = port;
                this._localWebSocket = new PlatformWebSocket();
                this._localWebSocket.bindWebSocket(ip, port, path, this, this.onConnect, this.onReceiveMessage, this.onError, this.onClose);
            }
        }, {
            key: "onConnect",
            value: function onConnect() {
                this._isConnect = true;
                this.dispatchWith(flower.Event.CONNECT);
            }
        }, {
            key: "onReceiveMessage",
            value: function onReceiveMessage(type, data) {}
        }, {
            key: "send",
            value: function send(data) {
                if (data instanceof VByteArray) {
                    this._localWebSocket.sendWebSocketBytes(data.bytes);
                } else {
                    this._localWebSocket.sendWebSocketBytes(data);
                }
            }
        }, {
            key: "onError",
            value: function onError() {
                this.dispatchWith(flower.Event.ERROR);
            }
        }, {
            key: "onClose",
            value: function onClose() {
                this.dispatchWith(flower.Event.CLOSE);
            }
        }, {
            key: "close",
            value: function close() {
                if (this._localWebSocket) {
                    this._localWebSocket.releaseWebSocket();
                    this._localWebSocket = null;
                }
            }
        }, {
            key: "ip",
            get: function get() {
                return this._ip;
            }
        }, {
            key: "port",
            get: function get() {
                return this._port;
            }
        }, {
            key: "isConnect",
            get: function get() {
                return this._isConnect;
            }
        }]);

        return WebSocket;
    }(flower.EventDispatcher);

    flower.WebSocket = WebSocket;
    //////////////////////////End File:flower/net/WebSocket.js///////////////////////////

    //////////////////////////File:flower/net/VBWebSocket.js///////////////////////////

    var VBWebSocket = function (_WebSocket) {
        _inherits(VBWebSocket, _WebSocket);

        function VBWebSocket() {
            var remote = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var errorCodeType = arguments.length <= 1 || arguments[1] === undefined ? "uint" : arguments[1];

            _classCallCheck(this, VBWebSocket);

            var _this32 = _possibleConstructorReturn(this, Object.getPrototypeOf(VBWebSocket).call(this));

            _this32.remotes = {};
            _this32.backs = {};
            _this32.zbacks = {};

            _this32._remote = remote;
            _this32.remotes = {};
            _this32.backs = {};
            _this32.zbacks = {};
            _this32.errorCodeType = errorCodeType;
            return _this32;
        }

        _createClass(VBWebSocket, [{
            key: "onReceiveMessage",
            value: function onReceiveMessage(type, data) {
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
                        var errorCode;
                        if (this.errorCodeType == "uint") {
                            errorCode = bytes.readUInt();
                        } else if (this.errorCodeType == "int") {
                            errorCode = bytes.readInt();
                        }
                        a = zbackList.concat();
                        for (i = 0; i < a.length; i++) {
                            a[i].func.call(a[i].thisObj, backCmd, errorCode, bytes);
                            if (a[i].once) {
                                removeList.push(a[i].id);
                            }
                        }
                        for (i = 0; i < removeList.length; i++) {
                            for (f = 0; f < this.zbacks[backCmd].length; f++) {
                                if (this.zbacks[backCmd][f].id == removeList[i]) {
                                    this.zbacks[backCmd].splice(f, 1);
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

        }, {
            key: "registerRemote",
            value: function registerRemote(remote) {
                this.remotes[remote.id] = remote;
            }
        }, {
            key: "removeRemote",
            value: function removeRemote(remote) {
                delete this.remotes[remote.id];
            }
        }, {
            key: "register",
            value: function register(cmd, back, thisObj) {
                if (this.backs[cmd] == null) {
                    this.backs[cmd] = [];
                }
                this.backs[cmd].push({ func: back, thisObj: thisObj, id: VBWebSocket.id++ });
            }
        }, {
            key: "registerOnce",
            value: function registerOnce(cmd, back, thisObj) {
                if (this.backs[cmd] == null) {
                    this.backs[cmd] = [];
                }
                this.backs[cmd].push({ func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++ });
            }
        }, {
            key: "remove",
            value: function remove(cmd, back, thisObj) {
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
        }, {
            key: "registerZero",
            value: function registerZero(cmd, back, thisObj) {
                if (this.zbacks[cmd] == null) {
                    this.zbacks[cmd] = [];
                }
                this.zbacks[cmd].push({ func: back, thisObj: thisObj, id: VBWebSocket.id++ });
            }
        }, {
            key: "removeZero",
            value: function removeZero(cmd, back, thisObj) {
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
        }, {
            key: "registerZeroOnce",
            value: function registerZeroOnce(cmd, back, thisObj) {
                if (this.zbacks[cmd] == null) {
                    this.zbacks[cmd] = [];
                }
                this.zbacks[cmd].push({ func: back, thisObj: thisObj, once: true, id: VBWebSocket.id++ });
            }
        }, {
            key: "remote",
            get: function get() {
                return this._remote;
            }
        }]);

        return VBWebSocket;
    }(WebSocket);

    VBWebSocket.id = 0;


    flower.VBWebSocket = VBWebSocket;
    //////////////////////////End File:flower/net/VBWebSocket.js///////////////////////////

    //////////////////////////File:flower/net/Remote.js///////////////////////////

    var Remote = function () {
        function Remote() {
            _classCallCheck(this, Remote);

            this.__id = Remote.id++;
        }

        _createClass(Remote, [{
            key: "receiveMessage",
            value: function receiveMessage(cmd, msg) {}
        }, {
            key: "id",
            get: function get() {
                return this.__id;
            }
        }]);

        return Remote;
    }();

    Remote.id = 1;


    flower.Remote = Remote;
    //////////////////////////End File:flower/net/Remote.js///////////////////////////

    //////////////////////////File:flower/plist/Plist.js///////////////////////////

    var Plist = function () {
        function Plist(url, texture) {
            _classCallCheck(this, Plist);

            this.frames = [];
            this._cacheFlag = false;

            this._url = url;
            this._texture = texture;
        }

        _createClass(Plist, [{
            key: "addFrame",
            value: function addFrame(frame) {
                this.frames.push(frame);
                frame.$setPlist(this);
            }
        }, {
            key: "cache",
            value: function cache() {
                if (this._texture) {
                    this._texture.$addCount();
                    this._cacheFlag = true;
                }
            }
        }, {
            key: "delCache",
            value: function delCache() {
                if (this._texture && this._cacheFlag) {
                    this._texture.$delCount();
                    this._cacheFlag = false;
                }
            }
        }, {
            key: "getFrameTexture",
            value: function getFrameTexture(name) {
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
        }, {
            key: "url",
            get: function get() {
                return this._url;
            }
        }, {
            key: "texture",
            get: function get() {
                return this._texture;
            },
            set: function set(val) {
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
        }]);

        return Plist;
    }();
    //////////////////////////End File:flower/plist/Plist.js///////////////////////////

    //////////////////////////File:flower/plist/PlistFrame.js///////////////////////////


    var PlistFrame = function () {
        function PlistFrame(name) {
            _classCallCheck(this, PlistFrame);

            this._rotation = false;
            this._offX = 0;
            this._offY = 0;

            this._name = name;
        }

        _createClass(PlistFrame, [{
            key: "decode",
            value: function decode(xml) {
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
                        } else if (xml.list[i].value == "rotated") {
                            if (xml.list[i + 1].name == "true") this._rotation = true;else this._rotation = false;
                        } else if (xml.list[i].value == "offset") {
                            this._offX = parseInt(content.split(",")[0]);
                            this._offY = parseInt(content.split(",")[1]);
                        } else if (xml.list[i].value == "sourceSize") {
                            this._sourceWidth = parseInt(content.split(",")[0]);
                            this._sourceHeight = parseInt(content.split(",")[1]);
                        }
                        i++;
                    }
                }
                this._moveX = this._offX + (this._sourceWidth - this._width) / 2;
                this._moveY = -this._offY + (this._sourceHeight - this._height) / 2;
            }
        }, {
            key: "$setPlist",
            value: function $setPlist(plist) {
                this._plist = plist;
            }
        }, {
            key: "clearTexture",
            value: function clearTexture() {
                this._texture = null;
            }
        }, {
            key: "name",
            get: function get() {
                return this._name;
            }
        }, {
            key: "texture",
            get: function get() {
                if (!this._texture) {
                    this._texture = this._plist.texture.createSubTexture(this._name, this._x, this._y, this._width, this._height, this._sourceWidth, this._sourceHeight, this._moveX, this._moveY, this._rotation);
                }
                return this._texture;
            }
        }]);

        return PlistFrame;
    }();

    flower.PlistFrame = PlistFrame;
    //////////////////////////End File:flower/plist/PlistFrame.js///////////////////////////

    //////////////////////////File:flower/plist/PlistLoader.js///////////////////////////

    var PlistLoader = function (_EventDispatcher4) {
        _inherits(PlistLoader, _EventDispatcher4);

        function PlistLoader(url, nativeURL) {
            _classCallCheck(this, PlistLoader);

            var _this33 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlistLoader).call(this));

            _this33.disposeFlag = false;

            _this33._url = url;
            _this33._nativeURL = nativeURL;
            _this33.__load();
            return _this33;
        }

        _createClass(PlistLoader, [{
            key: "__load",
            value: function __load() {
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
        }, {
            key: "loadError",
            value: function loadError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatch(e);
                } else {
                    $error(2004, this.url);
                }
            }
        }, {
            key: "loadPlistComplete",
            value: function loadPlistComplete(e) {
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
                        } else if (xml.list[i].value == "metadata") {
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
                            if (end == -1) this.textureURL = attributes.list[i + 1].value;else this.textureURL = this._nativeURL.slice(0, end + 1) + attributes.list[i + 1].value;
                        } else if (attributes.list[i].value == "size") {
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
        }, {
            key: "loadTexture",
            value: function loadTexture() {
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
        }, {
            key: "loadTextureComplete",
            value: function loadTextureComplete(e) {
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
        }, {
            key: "loadComplete",
            value: function loadComplete(plist) {
                plist.texture.$delCount();
                //var texture = plist.getFrameTexture(this.childName);
                this.dispatchWith(Event.COMPLETE, plist);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.frames = null;
                this.disposeFlag = true;
            }
        }, {
            key: "url",
            get: function get() {
                return this._url;
            }
        }]);

        return PlistLoader;
    }(EventDispatcher);
    //////////////////////////End File:flower/plist/PlistLoader.js///////////////////////////

    //////////////////////////File:flower/plist/PlistManager.js///////////////////////////


    var PlistManager = function () {
        function PlistManager() {
            _classCallCheck(this, PlistManager);

            this.plists = [];
            this.caches = {};
            this.loadingPlist = [];
        }

        _createClass(PlistManager, [{
            key: "addPlist",
            value: function addPlist(plist) {
                this.plists.push(plist);
            }
        }, {
            key: "addPlistWidthConfig",
            value: function addPlistWidthConfig(content) {}
        }, {
            key: "cache",
            value: function cache(url) {
                this.caches[url] = true;
            }
        }, {
            key: "delCache",
            value: function delCache(url) {
                delete this.caches[url];
            }
        }, {
            key: "getPlist",
            value: function getPlist(url) {
                for (var i = 0, len = this.plists.length; i < len; i++) {
                    if (this.plists[i].url == url) {
                        return this.plists[i];
                    }
                }
                return null;
            }
        }, {
            key: "load",
            value: function load(url, nativeURL) {
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
        }, {
            key: "__onLoadPlistComplete",
            value: function __onLoadPlistComplete(e) {
                var loader = e.currentTarget;
                var list = this.loadingPlist;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (loader == list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }, {
            key: "getTexture",
            value: function getTexture(url) {
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
        }], [{
            key: "getInstance",
            value: function getInstance() {
                return PlistManager.instance;
            }
        }]);

        return PlistManager;
    }();
    //////////////////////////End File:flower/plist/PlistManager.js///////////////////////////

    //////////////////////////File:flower/shader/Program.js///////////////////////////


    PlistManager.instance = new PlistManager();

    var Program = function () {
        function Program(vsh, fsh) {
            _classCallCheck(this, Program);

            this._vsh = vsh;
            this._fsh = fsh;
        }

        _createClass(Program, [{
            key: "setUniformFloat",
            value: function setUniformFloat(name, val) {
                this._program.setUniformFloat(name, val);
            }
        }, {
            key: "$nativeProgram",
            get: function get() {
                if (!this._program) {
                    this._program = new PlatformProgram("", "", vsh, fsh);
                }
                return this._program;
            }
        }]);

        return Program;
    }();

    flower.Program = Program;
    //////////////////////////End File:flower/shader/Program.js///////////////////////////

    //////////////////////////File:flower/res/Res.js///////////////////////////

    var Res = function () {
        function Res() {
            _classCallCheck(this, Res);
        }

        _createClass(Res, null, [{
            key: "getRes",


            /**
             * 查询存储的 ResItem，通过 url 查找匹配的项
             * @param url
             */
            value: function getRes(url) {
                var list = Res.__resItems;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].url == url) {
                        return list[i];
                    }
                }
                return null;
            }
        }, {
            key: "addRes",
            value: function addRes(res) {
                var list = Res.__resItems;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].url == res.url) {
                        list.splice(i, 1);
                        break;
                    }
                }
                list.push(res);
            }
        }]);

        return Res;
    }();

    Res.__resItems = [];


    flower.Res = Res;
    //////////////////////////End File:flower/res/Res.js///////////////////////////

    //////////////////////////File:flower/res/ResItem.js///////////////////////////

    var ResItem = function () {

        /**
         * 实际的加载地址有哪些
         */

        function ResItem(url, type) {
            _classCallCheck(this, ResItem);

            this.__loadList = [];

            this.__url = url;
            if (type) {
                this.__type = type;
            } else {
                this.__type = ResType.getURLType(url);
            }
        }

        /**
         * 资源类型
         */

        /**
         * 使用时的路径
         */


        _createClass(ResItem, [{
            key: "addURL",
            value: function addURL(url) {
                var info = ResItemInfo.create();

                var plist = null;
                var splitURL = null;
                var array = url.split("#PLIST#");
                if (array.length == 2) {
                    url = array[0];
                    plist = array[1];
                }
                array = url.split("#SPLIT#");
                if (array.length == 2) {
                    url = array[0];
                    splitURL = array[1];
                }
                if (plist && !splitURL) {
                    array = plist.split("#SPLIT#");
                    if (array.length == 2) {
                        plist = array[0];
                        splitURL = array[1];
                    }
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
                info.url = url;
                info.plist = plist;
                info.settingWidth = settingWidth;
                info.settingHeight = settingHeight;
                info.scale = scale || 1;
                info.language = language;
                info.update = false;
                info.splitURL = splitURL;
                this.__loadList.push(info);
            }
        }, {
            key: "addInfo",
            value: function addInfo(url, plist, settingWidth, settingHeight, scale, language) {
                var update = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
                var splitURL = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

                var info = ResItemInfo.create();
                info.url = url;
                info.plist = plist;
                info.settingWidth = settingWidth;
                info.settingHeight = settingHeight;
                info.scale = scale || 1;
                info.language = language;
                info.update = update;
                info.splitURL = splitURL;
                this.__loadList.push(info);
                return info;
            }
        }, {
            key: "getLoadInfo",
            value: function getLoadInfo(language, scale) {
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
        }, {
            key: "type",
            get: function get() {
                return this.__type;
            }
        }, {
            key: "url",
            get: function get() {
                return this.__url;
            }
        }], [{
            key: "create",
            value: function create(url) {
                var plist = null;
                var splitURL = null;
                var array = url.split("#PLIST#");
                if (array.length == 2) {
                    url = array[0];
                    plist = array[1];
                }
                array = url.split("#SPLIT#");
                if (array.length == 2) {
                    url = array[0];
                    splitURL = array[1];
                }
                if (plist && !splitURL) {
                    array = plist.split("#SPLIT#");
                    if (array.length == 2) {
                        plist = array[0];
                        splitURL = array[1];
                    }
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
                res.addInfo(url, plist, settingWidth, settingHeight, scale, language, false, splitURL);
                return res;
            }
        }, {
            key: "release",
            value: function release(item) {
                while (item.__loadList.length) {
                    ResItemInfo.release(item.__loadList.pop());
                }
                ResItem.$pools.push(item);
            }
        }]);

        return ResItem;
    }();

    ResItem.$pools = [];


    flower.ResItem = ResItem;
    //////////////////////////End File:flower/res/ResItem.js///////////////////////////

    //////////////////////////File:flower/res/ResItemInfo.js///////////////////////////

    var ResItemInfo = function () {
        function ResItemInfo() {
            _classCallCheck(this, ResItemInfo);

            this.update = UPDATE_RESOURCE ? false : null;
        }

        /**
         * 实际的加载地址
         */


        /**
         * plist 地址
         */


        /**
         * 拼接信息配置地址
         */


        /**
         * 预设的宽
         */


        /**
         * 预设的高
         */


        /**
         * 支持的缩放倍数
         */


        /**
         * 支持的语言
         */


        /**
         * 是否更新旧的纹理
         * @native
         */


        _createClass(ResItemInfo, null, [{
            key: "create",
            value: function create() {
                if (ResItemInfo.$pools.length) {
                    return ResItemInfo.$pools.pop();
                } else {
                    return new ResItemInfo();
                }
            }
        }, {
            key: "release",
            value: function release(info) {
                info.update = false;
                ResItemInfo.$pools.push(info);
            }
        }]);

        return ResItemInfo;
    }();

    ResItemInfo.$pools = [];


    flower.ResItemInfo = ResItemInfo;
    //////////////////////////End File:flower/res/ResItemInfo.js///////////////////////////

    //////////////////////////File:flower/res/ResType.js///////////////////////////

    var ResType = function () {
        function ResType() {
            _classCallCheck(this, ResType);
        }

        _createClass(ResType, null, [{
            key: "getURLType",
            value: function getURLType(url) {
                if (url.split(".").length == 1) {
                    return ResType.TEXT;
                }
                var end = url.split(".")[url.split(".").length - 1];
                return ResType.getType(end);
            }
        }, {
            key: "getType",
            value: function getType(end) {
                if (end == "json") {
                    return ResType.JSON;
                }
                if (end == "png" || end == "jpg" || end == "PNG" || end == "JPG") {
                    return ResType.IMAGE;
                }
                if (end == "plist") {
                    return ResType.PLIST;
                }
                return ResType.TEXT;
            }
        }]);

        return ResType;
    }();

    ResType.TEXT = 1;
    ResType.JSON = 2;
    ResType.IMAGE = 3;
    ResType.PLIST = 4;


    flower.ResType = ResType;
    //////////////////////////End File:flower/res/ResType.js///////////////////////////

    //////////////////////////File:flower/tween/plugins/TweenCenter.js///////////////////////////

    var TweenCenter = function () {
        function TweenCenter() {
            _classCallCheck(this, TweenCenter);
        }

        _createClass(TweenCenter, [{
            key: "init",
            value: function init(tween, propertiesTo, propertiesFrom) {
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
                    } else {
                        this.scaleXFrom = target["scaleX"];
                    }
                }
                if ("scaleY" in propertiesTo) {
                    this.scaleYTo = +propertiesTo["scaleY"];
                    useAttributes.push("scaleY");
                    if (propertiesFrom && "scaleY" in propertiesFrom) {
                        this.scaleYFrom = +propertiesFrom["scaleY"];
                    } else {
                        this.scaleYFrom = target["scaleY"];
                    }
                }
                if ("rotation" in propertiesTo) {
                    this.rotationTo = +propertiesTo["rotation"];
                    useAttributes.push("rotation");
                    if (propertiesFrom && "rotation" in propertiesFrom) {
                        this.rotationFrom = +propertiesFrom["rotation"];
                    } else {
                        this.rotationFrom = target["rotation"];
                    }
                }
                return useAttributes;
            }
        }, {
            key: "update",
            value: function update(value) {
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
        }], [{
            key: "scaleTo",
            value: function scaleTo(target, time, _scaleTo) {
                var scaleFrom = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                var ease = arguments.length <= 4 || arguments[4] === undefined ? "None" : arguments[4];

                return flower.Tween.to(target, time, {
                    "center": true,
                    "scaleX": _scaleTo,
                    "scaleY": _scaleTo
                }, ease, scaleFrom == null ? null : { "scaleX": scaleFrom, "scaleY": scaleFrom });
            }
        }, {
            key: "rotationTo",
            value: function rotationTo(target, time, _rotationTo) {
                var rotationFrom = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                var ease = arguments.length <= 4 || arguments[4] === undefined ? "None" : arguments[4];

                return flower.Tween.to(target, time, {
                    "center": true,
                    "rotation": _rotationTo
                }, ease, rotationFrom == null ? null : { "rotation": rotationFrom });
            }
        }]);

        return TweenCenter;
    }();

    flower.TweenCenter = TweenCenter;
    //////////////////////////End File:flower/tween/plugins/TweenCenter.js///////////////////////////

    //////////////////////////File:flower/tween/plugins/TweenPath.js///////////////////////////

    var TweenPath = function () {
        function TweenPath() {
            _classCallCheck(this, TweenPath);
        }

        _createClass(TweenPath, [{
            key: "init",
            value: function init(tween, propertiesTo, propertiesFrom) {
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
        }, {
            key: "update",
            value: function update(value) {
                var path = this.path;
                var target = this.tween.target;
                var pathSum = this.pathSum;
                var i,
                    len = pathSum.length;
                for (i = 1; i < len; i++) {
                    if (value > pathSum[i - 1] && value <= pathSum[i]) {
                        break;
                    }
                }
                if (value <= 0) {
                    i = 1;
                } else if (value >= 1) {
                    i = len - 1;
                }
                value = (value - pathSum[i - 1]) / (pathSum[i] - pathSum[i - 1]);
                target.x = value * (path[i].x - path[i - 1].x) + path[i - 1].x;
                target.y = value * (path[i].y - path[i - 1].y) + path[i - 1].y;
            }
        }], [{
            key: "to",
            value: function to(target, time, path) {
                var ease = arguments.length <= 3 || arguments[3] === undefined ? "None" : arguments[3];

                return flower.Tween.to(target, time, { "path": path }, ease);
            }
        }, {
            key: "vto",
            value: function vto(target, v, path) {
                var ease = arguments.length <= 3 || arguments[3] === undefined ? "None" : arguments[3];

                var sum = 0;
                for (var i = 1, len = path.length; i < len; i++) {
                    sum += math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
                }
                var time = sum / v;
                return flower.Tween.to(target, time, { "path": path }, ease);
            }
        }]);

        return TweenPath;
    }();

    flower.TweenPath = TweenPath;
    //////////////////////////End File:flower/tween/plugins/TweenPath.js///////////////////////////

    //////////////////////////File:flower/tween/plugins/TweenPhysicMove.js///////////////////////////

    var TweenPhysicMove = function () {
        function TweenPhysicMove() {
            _classCallCheck(this, TweenPhysicMove);

            if (!flower.Tween.hasPlugin("physicMove")) {
                flower.Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
            }
        }

        _createClass(TweenPhysicMove, [{
            key: "init",
            value: function init(tween, propertiesTo, propertiesFrom) {
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
        }, {
            key: "update",
            value: function update(value) {
                var target = this.tween.target;
                var t = this.time * value;
                target.x = this.startX + this.vx * t + .5 * this.ax * t * t;
                target.y = this.startY + this.vy * t + .5 * this.ay * t * t;
            }
        }], [{
            key: "freeFallTo",
            value: function freeFallTo(target, time, groundY) {
                return flower.Tween.to(target, time, { "y": groundY, "physicMove": true });
            }
        }, {
            key: "freeFallToWithG",
            value: function freeFallToWithG(target, g, groundY) {
                return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g), { "y": groundY, "physicMove": true });
            }
        }, {
            key: "fallTo",
            value: function fallTo(target, time, groundY) {
                var vX = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                var vY = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                return flower.Tween.to(target, time, { "y": groundY, "physicMove": true, "vx": vX, "vy": vY });
            }
        }, {
            key: "fallToWithG",
            value: function fallToWithG(target, g, groundY) {
                var vX = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                var vY = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                vX = +vX;
                vY = +vY;
                return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g + vY * vY / (g * g)) - vY / g, {
                    "y": groundY,
                    "physicMove": true,
                    "vx": vX,
                    "vy": vY
                });
            }
        }, {
            key: "to",
            value: function to(target, time, xTo, yTo) {
                var vX = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
                var vY = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

                return flower.Tween.to(target, time, { "x": xTo, "y": yTo, "vx": vX, "vy": vY, "physicMove": true });
            }
        }]);

        return TweenPhysicMove;
    }();

    flower.TweenPhysicMove = TweenPhysicMove;
    //////////////////////////End File:flower/tween/plugins/TweenPhysicMove.js///////////////////////////

    //////////////////////////File:flower/tween/BasicPlugin.js///////////////////////////

    var BasicPlugin = function () {
        function BasicPlugin() {
            _classCallCheck(this, BasicPlugin);
        }

        _createClass(BasicPlugin, [{
            key: "init",
            value: function init(tween, propertiesTo, propertiesFrom) {
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
                    } else {
                        startAttributes[key] = target[key];
                    }
                }
                this.startAttributes = startAttributes;
                return null;
            }
        }, {
            key: "update",
            value: function update(value) {
                var target = this.tween.target;
                var keys = this.keys;
                var length = keys.length;
                var startAttributes = this.startAttributes;
                for (var i = 0; i < length; i++) {
                    var key = keys[i];
                    target[key] = (this._attributes[key] - startAttributes[key]) * value + startAttributes[key];
                }
            }
        }]);

        return BasicPlugin;
    }();

    flower.BasicPlugin = BasicPlugin;
    //////////////////////////End File:flower/tween/BasicPlugin.js///////////////////////////

    //////////////////////////File:flower/tween/Ease.js///////////////////////////

    var Ease = function () {
        function Ease() {
            _classCallCheck(this, Ease);
        }

        _createClass(Ease, null, [{
            key: "registerEaseFunction",
            value: function registerEaseFunction(name, ease) {
                EaseFunction[name] = ease;
            }
        }]);

        return Ease;
    }();

    Ease.NONE = "None";
    Ease.SINE_EASE_IN = "SineEaseIn";
    Ease.SineEaseOut = "SineEaseOut";
    Ease.SINE_EASE_IN_OUT = "SineEaseInOut";
    Ease.SineEaseOutIn = "SineEaseOutIn";
    Ease.QUAD_EASE_IN = "QuadEaseIn";
    Ease.QUAD_EASE_OUT = "QuadEaseOut";
    Ease.QUAD_EASE_IN_OUT = "QuadEaseInOut";
    Ease.QUAD_EASE_OUT_IN = "QuadEaseOutIn";
    Ease.CUBIC_EASE_IN = "CubicEaseIn";
    Ease.CUBIC_EASE_OUT = "CubicEaseOut";
    Ease.CUBIC_EASE_IN_OUT = "CubicEaseInOut";
    Ease.CUBIC_EASE_OUT_IN = "CubicEaseOutIn";
    Ease.QUART_EASE_IN = "QuartEaseIn";
    Ease.QUART_EASE_OUT = "QuartEaseOut";
    Ease.QUART_EASE_IN_OUT = "QuartEaseInOut";
    Ease.QUART_EASE_OUT_IN = "QuartEaseOutIn";
    Ease.QUINT_EASE_IN = "QuintEaseIn";
    Ease.QUINT_EASE_OUT = "QuintEaseOut";
    Ease.QUINT_EASE_IN_OUT = "QuintEaseInOut";
    Ease.QUINT_EASE_OUT_IN = "QuintEaseOutIn";
    Ease.EXPO_EASE_IN = "ExpoEaseIn";
    Ease.EXPO_EASE_OUT = "ExpoEaseOut";
    Ease.EXPO_EASE_IN_OUT = "ExpoEaseInOut";
    Ease.EXPO_EASE_OUT_IN = "ExpoEaseOutIn";
    Ease.CIRC_EASE_IN = "CircEaseIn";
    Ease.CIRC_EASE_OUT = "CircEaseOut";
    Ease.CIRC_EASE_IN_OUT = "CircEaseInOut";
    Ease.CIRC_EASE_OUT_IN = "CircEaseOutIn";
    Ease.BACK_EASE_IN = "BackEaseIn";
    Ease.BACK_EASE_OUT = "BackEaseOut";
    Ease.BACK_EASE_IN_OUT = "BackEaseInOut";
    Ease.BACK_EASE_OUT_IN = "BackEaseOutIn";
    Ease.ELASTIC_EASE_IN = "ElasticEaseIn";
    Ease.ELASTIC_EASE_OUT = "ElasticEaseOut";
    Ease.ELASTIC_EASE_IN_OUT = "ElasticEaseInOut";
    Ease.ELASTIC_EASE_OUT_IN = "ElasticEaseOutIn";
    Ease.BOUNCE_EASE_IN = "BounceEaseIn";
    Ease.BounceEaseOut = "BounceEaseOut";
    Ease.BOUNCE_EASE_IN_OUT = "BounceEaseInOut";
    Ease.BOUNCE_EASE_OUT_IN = "BounceEaseOutIn";


    flower.Ease = Ease;
    //////////////////////////End File:flower/tween/Ease.js///////////////////////////

    //////////////////////////File:flower/tween/EaseFunction.js///////////////////////////

    var EaseFunction = function () {
        function EaseFunction() {
            _classCallCheck(this, EaseFunction);
        }

        _createClass(EaseFunction, null, [{
            key: "None",
            value: function None(t) {
                return t;
            }
        }, {
            key: "SineEaseIn",
            value: function SineEaseIn(t) {
                return math.sin((t - 1) * math.PI * .5) + 1;
            }
        }, {
            key: "SineEaseOut",
            value: function SineEaseOut(t) {
                return math.sin(t * math.PI * .5);
            }
        }, {
            key: "SineEaseInOut",
            value: function SineEaseInOut(t) {
                return math.sin((t - .5) * math.PI) * .5 + .5;
            }
        }, {
            key: "SineEaseOutIn",
            value: function SineEaseOutIn(t) {
                if (t < 0.5) {
                    return math.sin(t * math.PI) * .5;
                }
                return math.sin((t - 1) * math.PI) * .5 + 1;
            }
        }, {
            key: "QuadEaseIn",
            value: function QuadEaseIn(t) {
                return t * t;
            }
        }, {
            key: "QuadEaseOut",
            value: function QuadEaseOut(t) {
                return -(t - 1) * (t - 1) + 1;
            }
        }, {
            key: "QuadEaseInOut",
            value: function QuadEaseInOut(t) {
                if (t < .5) {
                    return t * t * 2;
                }
                return -(t - 1) * (t - 1) * 2 + 1;
            }
        }, {
            key: "QuadEaseOutIn",
            value: function QuadEaseOutIn(t) {
                var s = (t - .5) * (t - .5) * 2;
                if (t < .5) {
                    return .5 - s;
                }
                return .5 + s;
            }
        }, {
            key: "CubicEaseIn",
            value: function CubicEaseIn(t) {
                return t * t * t;
            }
        }, {
            key: "CubicEaseOut",
            value: function CubicEaseOut(t) {
                return (t - 1) * (t - 1) * (t - 1) + 1;
            }
        }, {
            key: "CubicEaseInOut",
            value: function CubicEaseInOut(t) {
                if (t < .5) {
                    return t * t * t * 4;
                }
                return (t - 1) * (t - 1) * (t - 1) * 4 + 1;
            }
        }, {
            key: "CubicEaseOutIn",
            value: function CubicEaseOutIn(t) {
                return (t - .5) * (t - .5) * (t - .5) * 4 + .5;
            }
        }, {
            key: "QuartEaseIn",
            value: function QuartEaseIn(t) {
                return t * t * t * t;
            }
        }, {
            key: "QuartEaseOut",
            value: function QuartEaseOut(t) {
                var a = t - 1;
                return -a * a * a * a + 1;
            }
        }, {
            key: "QuartEaseInOut",
            value: function QuartEaseInOut(t) {
                if (t < .5) {
                    return t * t * t * t * 8;
                }
                var a = t - 1;
                return -a * a * a * a * 8 + 1;
            }
        }, {
            key: "QuartEaseOutIn",
            value: function QuartEaseOutIn(t) {
                var s = (t - .5) * (t - .5) * (t - .5) * (t - .5) * 8;
                if (t < .5) {
                    return .5 - s;
                }
                return .5 + s;
            }
        }, {
            key: "QuintEaseIn",
            value: function QuintEaseIn(t) {
                return t * t * t * t * t;
            }
        }, {
            key: "QuintEaseOut",
            value: function QuintEaseOut(t) {
                var a = t - 1;
                return a * a * a * a * a + 1;
            }
        }, {
            key: "QuintEaseInOut",
            value: function QuintEaseInOut(t) {
                if (t < .5) {
                    return t * t * t * t * t * 16;
                }
                var a = t - 1;
                return a * a * a * a * a * 16 + 1;
            }
        }, {
            key: "QuintEaseOutIn",
            value: function QuintEaseOutIn(t) {
                var a = t - .5;
                return a * a * a * a * a * 16 + 0.5;
            }
        }, {
            key: "ExpoEaseIn",
            value: function ExpoEaseIn(t) {
                return math.pow(2, 10 * (t - 1));
            }
        }, {
            key: "ExpoEaseOut",
            value: function ExpoEaseOut(t) {
                return -math.pow(2, -10 * t) + 1;
            }
        }, {
            key: "ExpoEaseInOut",
            value: function ExpoEaseInOut(t) {
                if (t < .5) {
                    return math.pow(2, 10 * (t * 2 - 1)) * .5;
                }
                return -math.pow(2, -10 * (t - .5) * 2) * .5 + 1.00048828125;
            }
        }, {
            key: "ExpoEaseOutIn",
            value: function ExpoEaseOutIn(t) {
                if (t < .5) {
                    return -math.pow(2, -20 * t) * .5 + .5;
                }
                return math.pow(2, 10 * ((t - .5) * 2 - 1)) * .5 + .5;
            }
        }, {
            key: "CircEaseIn",
            value: function CircEaseIn(t) {
                return 1 - math.sqrt(1 - t * t);
            }
        }, {
            key: "CircEaseOut",
            value: function CircEaseOut(t) {
                return math.sqrt(1 - (1 - t) * (1 - t));
            }
        }, {
            key: "CircEaseInOut",
            value: function CircEaseInOut(t) {
                if (t < .5) {
                    return .5 - math.sqrt(.25 - t * t);
                }
                return math.sqrt(.25 - (1 - t) * (1 - t)) + .5;
            }
        }, {
            key: "CircEaseOutIn",
            value: function CircEaseOutIn(t) {
                var s = math.sqrt(.25 - (.5 - t) * (.5 - t));
                if (t < .5) {
                    return s;
                }
                return 1 - s;
            }
        }, {
            key: "BackEaseIn",
            value: function BackEaseIn(t) {
                return 2.70158 * t * t * t - 1.70158 * t * t;
            }
        }, {
            key: "BackEaseOut",
            value: function BackEaseOut(t) {
                var a = t - 1;
                return 2.70158 * a * a * a + 1.70158 * a * a + 1;
            }
        }, {
            key: "BackEaseInOut",
            value: function BackEaseInOut(t) {
                var a = t - 1;
                if (t < .5) {
                    return 10.80632 * t * t * t - 3.40316 * t * t;
                }
                return 10.80632 * a * a * a + 3.40316 * a * a + 1;
            }
        }, {
            key: "BackEaseOutIn",
            value: function BackEaseOutIn(t) {
                var a = t - .5;
                if (t < .5) {
                    return 10.80632 * a * a * a + 3.40316 * a * a + .5;
                }
                return 10.80632 * a * a * a - 3.40316 * a * a + .5;
            }
        }, {
            key: "ElasticEaseIn",
            value: function ElasticEaseIn(t) {
                if (t == 0 || t == 1) return t;
                return -(math.pow(2, 10 * (t - 1)) * math.sin((t - 1.075) * 2 * math.PI / .3));
            }
        }, {
            key: "ElasticEaseOut",
            value: function ElasticEaseOut(t) {
                if (t == 0 || t == .5 || t == 1) return t;
                return math.pow(2, 10 * -t) * math.sin((-t - .075) * 2 * math.PI / .3) + 1;
            }
        }, {
            key: "ElasticEaseInOut",
            value: function ElasticEaseInOut(t) {
                if (t == 0 || t == .5 || t == 1) return t;
                if (t < .5) {
                    return -(math.pow(2, 10 * t - 10) * math.sin((t * 2 - 2.15) * math.PI / .3));
                }
                return math.pow(2, 10 - 20 * t) * math.sin((-4 * t + 1.85) * math.PI / .3) * .5 + 1;
            }
        }, {
            key: "ElasticEaseOutIn",
            value: function ElasticEaseOutIn(t) {
                if (t == 0 || t == .5 || t == 1) return t;
                if (t < .5) {
                    return math.pow(2, -20 * t) * math.sin((-t * 4 - .15) * math.PI / .3) * .5 + .5;
                }
                return -(math.pow(2, 20 * (t - 1)) * math.sin((t * 4 - 4.15) * math.PI / .3)) * .5 + .5;
            }
        }, {
            key: "bounceEaseIn",
            value: function bounceEaseIn(t) {
                return 1 - flower.EaseFunction.bounceEaseOut(1 - t);
            }
        }, {
            key: "bounceEaseOut",
            value: function bounceEaseOut(t) {
                var s;
                var a = 7.5625;
                var b = 2.75;
                if (t < 1 / 2.75) {
                    s = a * t * t;
                } else if (t < 2 / b) {
                    s = a * (t - 1.5 / b) * (t - 1.5 / b) + .75;
                } else if (t < 2.5 / b) {
                    s = a * (t - 2.25 / b) * (t - 2.25 / b) + .9375;
                } else {
                    s = a * (t - 2.625 / b) * (t - 2.625 / b) + .984375;
                }
                return s;
            }
        }, {
            key: "BounceEaseInOut",
            value: function BounceEaseInOut(t) {
                if (t < .5) return flower.EaseFunction.bounceEaseIn(t * 2) * .5;else return flower.EaseFunction.bounceEaseOut(t * 2 - 1) * .5 + .5;
            }
        }, {
            key: "BounceEaseOutIn",
            value: function BounceEaseOutIn(t) {
                if (t < .5) return flower.EaseFunction.bounceEaseOut(t * 2) * .5;else return flower.EaseFunction.bounceEaseIn(t * 2 - 1) * .5 + .5;
            }
        }]);

        return EaseFunction;
    }();
    //////////////////////////End File:flower/tween/EaseFunction.js///////////////////////////

    //////////////////////////File:flower/tween/TimeLine.js///////////////////////////


    EaseFunction.BounceEaseIn = EaseFunction.bounceEaseIn;
    EaseFunction.BounceEaseOut = EaseFunction.bounceEaseOut;

    var TimeLine = function () {
        function TimeLine() {
            _classCallCheck(this, TimeLine);

            this.lastTime = -1;
            this._currentTime = 0;
            this._totalTime = 0;
            this.invalidTotalTime = true;
            this._loop = false;
            this._isPlaying = false;
            this.calls = [];

            this.tweens = [];
        }

        _createClass(TimeLine, [{
            key: "getTotalTime",
            value: function getTotalTime() {
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
        }, {
            key: "$invalidateTotalTime",
            value: function $invalidateTotalTime() {
                if (this.invalidTotalTime == false) {
                    return;
                }
                this.invalidTotalTime = false;
            }
        }, {
            key: "update",
            value: function update(timeStamp, gap) {
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
                        if (call.time > lastTime && call.time <= this._currentTime || call.time == 0 && lastTime == 0 && this._currentTime) {
                            call.callBack.apply(call.thisObj, call.args);
                        }
                    }
                    var tweens = this.tweens;
                    var tween;
                    len = tweens.length;
                    for (var i = 0; i < len; i++) {
                        tween = tweens[i];
                        if (tween.$startTime + tween.$time > lastTime && tween.$startTime <= this._currentTime || tween.$startTime == 0 && lastTime == 0 && this._currentTime) {
                            tween.$update(this._currentTime);
                        }
                    }
                    loopTime--;
                    if (loopTime == 0) {
                        if (currentTime != -1) {
                            lastTime = 0;
                            this._currentTime = currentTime;
                        }
                    } else {
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
        }, {
            key: "play",
            value: function play() {
                var now = flower.CoreTime.currentTime;
                this.$setPlaying(true, now);
            }
        }, {
            key: "stop",
            value: function stop() {
                this.$setPlaying(false);
            }
        }, {
            key: "$setPlaying",
            value: function $setPlaying(value) {
                var time = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

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
                } else {
                    flower.EnterFrame.remove(this.update, this);
                }
            }
        }, {
            key: "gotoAndPlay",
            value: function gotoAndPlay(time) {
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
        }, {
            key: "gotoAndStop",
            value: function gotoAndStop(time) {
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
        }, {
            key: "addTween",
            value: function addTween(tween) {
                this.tweens.push(tween);
                tween.$setTimeLine(this);
                this.$invalidateTotalTime();
                return tween;
            }
        }, {
            key: "removeTween",
            value: function removeTween(tween) {
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
        }, {
            key: "call",
            value: function call(time, callBack) {
                for (var _len5 = arguments.length, args = Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
                    args[_key5 - 3] = arguments[_key5];
                }

                var thisObj = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                this.calls.push({ "time": time, "callBack": callBack, "thisObj": thisObj, "args": args });
            }
        }, {
            key: "totalTime",
            get: function get() {
                return this.getTotalTime();
            }
        }, {
            key: "loop",
            get: function get() {
                return this._loop;
            },
            set: function set(value) {
                this._loop = value;
            }
        }, {
            key: "isPlaying",
            get: function get() {
                return this._isPlaying;
            }
        }]);

        return TimeLine;
    }();

    flower.TimeLine = TimeLine;
    //////////////////////////End File:flower/tween/TimeLine.js///////////////////////////

    //////////////////////////File:flower/tween/Tween.js///////////////////////////

    var Tween = function () {
        function Tween(target, time, propertiesTo) {
            var ease = arguments.length <= 3 || arguments[3] === undefined ? "None" : arguments[3];
            var propertiesFrom = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

            _classCallCheck(this, Tween);

            this.invalidProperty = false;
            this.$startTime = 0;
            this._currentTime = 0;
            this._startEvent = "";
            this.pugins = [];

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
            if (target instanceof flower.EventDispatcher) {
                target.addListener(flower.Event.DISPOSE, this.__onTargetDispose, this);
            }
            var timeLine = new flower.TimeLine();
            timeLine.addTween(this);
        }

        _createClass(Tween, [{
            key: "__onTargetDispose",
            value: function __onTargetDispose(e) {
                this.dispose();
            }
        }, {
            key: "removeTargetEvent",
            value: function removeTargetEvent() {
                var target;
                if (this._startTarget) {
                    target = this._startTarget;
                } else {
                    target = this._target;
                }
                if (target && this._startEvent && this._startEvent != "") {
                    target.removeListener(this._startEvent, this.startByEvent, this);
                }
            }
        }, {
            key: "addTargetEvent",
            value: function addTargetEvent() {
                var target;
                if (this._startTarget) {
                    target = this._startTarget;
                } else {
                    target = this._target;
                }
                if (target && this._startEvent && this._startEvent != "") {
                    target.addListener(this._startEvent, this.startByEvent, this);
                }
            }
        }, {
            key: "play",
            value: function play() {
                this.timeLine.play();
            }
        }, {
            key: "stop",
            value: function stop() {
                this.timeLine.stop();
            }
        }, {
            key: "startByEvent",
            value: function startByEvent() {
                this._timeLine.gotoAndPlay(0);
            }
        }, {
            key: "$setTimeLine",
            value: function $setTimeLine(value) {
                if (this._timeLine) {
                    this._timeLine.removeTween(this);
                }
                this._timeLine = value;
            }
        }, {
            key: "initParmas",
            value: function initParmas() {
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
                        if (!(typeof key == "string")) {
                            delete params[key];
                            keys.splice(i, 1);
                            i--;
                            continue;
                        }
                        var attribute = params[key];
                        if (!(typeof attribute == "number") || !(key in this._target)) {
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
        }, {
            key: "invalidate",
            value: function invalidate() {
                this.invalidProperty = false;
            }
        }, {
            key: "call",
            value: function call(callBack) {
                var thisObj = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this._complete = callBack;
                this._completeThis = thisObj;

                for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                    args[_key6 - 2] = arguments[_key6];
                }

                this._completeParams = args;
                return this;
            }
        }, {
            key: "update",
            value: function update(callBack) {
                var thisObj = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this._update = callBack;
                this._updateThis = thisObj;

                for (var _len7 = arguments.length, args = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                    args[_key7 - 2] = arguments[_key7];
                }

                this._updateParams = args;
                return this;
            }
        }, {
            key: "$update",
            value: function $update(time) {
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
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.timeLine) {
                    this.timeLine.removeTween(this);
                }
            }
        }, {
            key: "propertiesTo",
            set: function set(value) {
                if (value == this._propertiesTo) {
                    return;
                }
                this._propertiesTo = value;
                this.invalidProperty = false;
            }
        }, {
            key: "propertiesFrom",
            set: function set(value) {
                if (value == this._propertiesFrom) {
                    return;
                }
                this._propertiesFrom = value;
                this.invalidProperty = false;
            }
        }, {
            key: "time",
            get: function get() {
                return this.$time / 1000;
            },
            set: function set(value) {
                value = +value | 0;
                this.$time = +value * 1000;
                if (this._timeLine) {
                    this._timeLine.$invalidateTotalTime();
                }
            }
        }, {
            key: "startTime",
            get: function get() {
                return this.$startTime / 1000;
            },
            set: function set(value) {
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
        }, {
            key: "target",
            get: function get() {
                return this._target;
            },
            set: function set(value) {
                if (value == this.target) {
                    return;
                }
                this.removeTargetEvent();
                this._target = value;
                this.invalidProperty = false;
                this.addTargetEvent();
            }
        }, {
            key: "ease",
            get: function get() {
                return this._ease;
            },
            set: function set(val) {
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
        }, {
            key: "startEvent",
            get: function get() {
                return this._startEvent;
            },
            set: function set(type) {
                this.removeTargetEvent();
                this._startEvent = type;
                this.addTargetEvent();
            }
        }, {
            key: "startTarget",
            get: function get() {
                return this._startTarget;
            },
            set: function set(value) {
                this.removeTargetEvent();
                this._startTarget = value;
                this.addTargetEvent();
            }
        }, {
            key: "timeLine",
            get: function get() {
                if (!this._timeLine) {
                    this._timeLine = new flower.TimeLine();
                    this._timeLine.addTween(this);
                }
                return this._timeLine;
            }
        }], [{
            key: "to",
            value: function to(target, time, propertiesTo) {
                var ease = arguments.length <= 3 || arguments[3] === undefined ? "None" : arguments[3];
                var propertiesFrom = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                var tween = new flower.Tween(target, time, propertiesTo, ease, propertiesFrom);
                tween.timeLine.play();
                return tween;
            }
        }, {
            key: "registerPlugin",
            value: function registerPlugin(paramName, plugin) {
                if (flower.Tween.plugins == null) {
                    flower.Tween.plugins = {};
                }
                flower.Tween.plugins[paramName] = plugin;
            }
        }, {
            key: "hasPlugin",
            value: function hasPlugin(paramName) {
                return flower.Tween.plugins[paramName] ? true : false;
            }
        }]);

        return Tween;
    }();

    Tween.easeCache = {};


    flower.Tween = Tween;
    //////////////////////////End File:flower/tween/Tween.js///////////////////////////

    //////////////////////////File:flower/utils/EnterFrame.js///////////////////////////

    var EnterFrame = function () {
        function EnterFrame() {
            _classCallCheck(this, EnterFrame);
        }

        _createClass(EnterFrame, null, [{
            key: "add",
            value: function add(call, owner) {
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
                flower.EnterFrame.waitAdd.push({ "call": call, "owner": owner });
            }
        }, {
            key: "remove",
            value: function remove(call, owner) {
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
        }, {
            key: "$update",
            value: function $update(now, gap) {
                flower.EnterFrame.frame++;
                var st = new Date().getTime();
                var et;
                flower.CallLater.$run();
                et = new Date().getTime();
                DebugInfo.cpu.callLater += et - st;
                st = et;
                flower.DelayCall.$run();
                et = new Date().getTime();
                DebugInfo.cpu.delayCall += et - st;
                st = et;
                if (flower.EnterFrame.waitAdd.length) {
                    flower.EnterFrame.enterFrames = flower.EnterFrame.enterFrames.concat(flower.EnterFrame.waitAdd);
                    flower.EnterFrame.waitAdd = [];
                }
                var copy = flower.EnterFrame.enterFrames;
                for (var i = 0; i < copy.length; i++) {
                    copy[i].call.apply(copy[i].owner, [now, gap]);
                }
                et = new Date().getTime();
                DebugInfo.cpu.enterFrame += et - st;
                if (now - EnterFrame.__lastFPSTime > 500) {
                    DebugInfo.cpu.fps = ~ ~((EnterFrame.frame - EnterFrame.__lastFPSFrame) * 500 / (now - EnterFrame.__lastFPSTime));
                    EnterFrame.__lastFPSTime = now;
                    EnterFrame.__lastFPSFrame = EnterFrame.frame;
                }
            }
        }, {
            key: "$dispose",
            value: function $dispose() {
                EnterFrame.enterFrames = [];
                EnterFrame.waitAdd = [];
            }
        }]);

        return EnterFrame;
    }();

    EnterFrame.enterFrames = [];
    EnterFrame.waitAdd = [];
    EnterFrame.frame = 0;
    EnterFrame.updateFactor = 1;
    EnterFrame.__lastFPSTime = 0;
    EnterFrame.__lastFPSFrame = 0;


    flower.EnterFrame = EnterFrame;
    //////////////////////////End File:flower/utils/EnterFrame.js///////////////////////////

    //////////////////////////File:flower/utils/CallLater.js///////////////////////////

    var CallLater = function () {
        function CallLater(func, thisObj) {
            var args = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            _classCallCheck(this, CallLater);

            this._func = func;
            this._thisObj = thisObj;
            this._data = args || [];
            flower.CallLater._next.push(this);
        }

        _createClass(CallLater, [{
            key: "$call",
            value: function $call() {
                this._func.apply(this._thisObj, this._data);
                this._func = null;
                this._thisObj = null;
                this._data = null;
            }
        }], [{
            key: "add",
            value: function add(func, thisObj) {
                var args = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                for (var i = 0, len = flower.CallLater._next.length; i < len; i++) {
                    if (flower.CallLater._next[i]._func == func && flower.CallLater._next[i]._thisObj == thisObj) {
                        flower.CallLater._next[i]._data = args || [];
                        return;
                    }
                }
                new flower.CallLater(func, thisObj, args);
            }
        }, {
            key: "$run",
            value: function $run() {
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
        }, {
            key: "$dispose",
            value: function $dispose() {
                flower.CallLater._list = [];
                flower.CallLater._next = [];
            }
        }]);

        return CallLater;
    }();

    CallLater._next = [];
    CallLater._list = [];


    flower.CallLater = CallLater;
    //////////////////////////End File:flower/utils/CallLater.js///////////////////////////

    //////////////////////////File:flower/utils/DelayCall.js///////////////////////////

    var DelayCall = function () {
        function DelayCall(time, count, func, thisObj) {
            _classCallCheck(this, DelayCall);

            this._func = func;
            this._thisObj = thisObj;

            for (var _len8 = arguments.length, args = Array(_len8 > 4 ? _len8 - 4 : 0), _key8 = 4; _key8 < _len8; _key8++) {
                args[_key8 - 4] = arguments[_key8];
            }

            this._data = args || [];
            this._time = time;
            this._start = flower.CoreTime.currentTime;
            this._count = count || 1000000000;
            this.$complete = false;
            DelayCall._next.push(this);
        }

        _createClass(DelayCall, [{
            key: "$update",
            value: function $update() {
                if (!this.$complete && flower.CoreTime.currentTime - this._start > this._time) {
                    this._func.apply(this._thisObj, this._data);
                    this._count--;
                    if (!this.$complete && this._count > 0) {
                        this._start = flower.CoreTime.currentTime;
                    } else {
                        this._func = null;
                        this._thisObj = null;
                        this._data = null;
                        this.$complete = true;
                    }
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.$complete = true;
            }
        }], [{
            key: "$run",
            value: function $run() {
                DelayCall._list = DelayCall._list.concat(DelayCall._next);
                DelayCall._next.length = 0;
                var list = DelayCall._list;
                for (var i = 0; i < list.length; i++) {
                    list[i].$update();
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].$complete) {
                        list.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: "$dispose",
            value: function $dispose() {
                DelayCall._list.length = 0;
                DelayCall._next.length = 0;
            }
        }]);

        return DelayCall;
    }();

    DelayCall._list = [];
    DelayCall._next = [];


    flower.DelayCall = DelayCall;
    //////////////////////////End File:flower/utils/DelayCall.js///////////////////////////

    //////////////////////////File:flower/utils/ObjectDo.js///////////////////////////

    var ObjectDo = function () {
        function ObjectDo() {
            _classCallCheck(this, ObjectDo);
        }

        _createClass(ObjectDo, null, [{
            key: "toString",
            value: function toString(obj) {
                var maxDepth = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];
                var before = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var depth = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

                before = before || "";
                depth = depth || 0;
                maxDepth = maxDepth || 4;
                var str = "";
                if (typeof obj == "string") {
                    str += "\"" + obj + "\"";
                } else if (typeof obj == "number") {
                    str += obj;
                } else if (obj instanceof Array) {
                    if (depth > maxDepth) {
                        return "...";
                    }
                    str = "[\n";
                    for (var i = 0; i < obj.length; i++) {
                        str += before + " " + flower.ObjectDo.toString(obj[i], maxDepth, before + " ", depth + 1) + (i < obj.length - 1 ? ",\n" : "\n");
                    }
                    str += before + "]";
                } else if (obj instanceof Object) {
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
                } else {
                    str += obj;
                }
                return str;
            }
        }, {
            key: "keys",
            value: function keys(obj) {
                var list = [];
                for (var key in obj) {
                    list.push(key);
                }
                return list;
            }
        }, {
            key: "clone",
            value: function clone(obj) {
                var res = "";
                if (typeof obj == "string" || typeof obj == "number") {
                    res = obj;
                } else if (obj instanceof Array) {
                    res = obj.concat();
                } else if (obj instanceof Object) {
                    res = {};
                    for (var key in obj) {
                        res[key] = ObjectDo.clone(obj[key]);
                    }
                } else {
                    if (obj.hasOwnProperty("clone")) {
                        res = obj.clone();
                    } else {
                        res = obj;
                    }
                }
                return res;
            }
        }]);

        return ObjectDo;
    }();

    flower.ObjectDo = ObjectDo;
    //////////////////////////End File:flower/utils/ObjectDo.js///////////////////////////

    //////////////////////////File:flower/utils/StringDo.js///////////////////////////

    var StringDo = function () {
        function StringDo() {
            _classCallCheck(this, StringDo);
        }

        _createClass(StringDo, null, [{
            key: "isNumberString",
            value: function isNumberString(str) {
                var hasDot = false;
                for (var i = 0; i < str.length; i++) {
                    if (i == 0 && str.charAt(0) == "+" || str.charAt(0) == "-") {} else {
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
        }, {
            key: "changeStringToInner",
            value: function changeStringToInner(content) {
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
        }, {
            key: "findString",
            value: function findString(content, _findString, begin) {
                begin = begin || 0;
                for (var i = begin; i < content.length; i++) {
                    if (content.slice(i, i + _findString.length) == _findString) {
                        return i;
                    }
                }
                return -1;
            }
        }, {
            key: "findStrings",
            value: function findStrings(content, _findStrings, begin) {
                begin = begin || 0;
                for (var i = begin; i < content.length; i++) {
                    for (var j = 0; j < _findStrings.length; j++) {
                        if (content.slice(i, i + _findStrings[j].length) == _findStrings[j]) {
                            return i;
                        }
                    }
                }
                return -1;
            }
        }, {
            key: "jumpStrings",
            value: function jumpStrings(content, start, jumps) {
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
        }, {
            key: "findCharNotABC",
            value: function findCharNotABC(content, start) {
                start = +start;
                for (var i = start; i < content.length; i++) {
                    if (!StringDo.isCharABC(content.charAt(i))) {
                        return i;
                    }
                }
                return content.length;
            }
        }, {
            key: "replaceString",
            value: function replaceString(str, findStr, tstr) {
                for (var i = 0; i < str.length; i++) {
                    if (StringDo.hasStringAt(str, [findStr], i)) {
                        str = str.slice(0, i) + tstr + str.slice(i + findStr.length, str.length);
                        i--;
                    }
                }
                return str;
            }
        }, {
            key: "hasStringAt",
            value: function hasStringAt(str, hstrs, pos) {
                for (var i = 0; i < hstrs.length; i++) {
                    var hstr = hstrs[i];
                    if (str.length - pos >= hstr.length && str.slice(pos, pos + hstr.length) == hstr) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: "findId",
            value: function findId(str, pos) {
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

        }, {
            key: "findFunctionContent",
            value: function findFunctionContent(str, pos) {
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

        }, {
            key: "deleteProgramNote",
            value: function deleteProgramNote(str, pos) {
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

        }, {
            key: "jumpProgramSpace",
            value: function jumpProgramSpace(str, pos) {
                for (var len = str.length; pos < len; pos++) {
                    var char = str.charAt(pos);
                    if (char == " " || char == "　" || char == "\t" || char == "\r" || char == "\n") {} else {
                        break;
                    }
                }
                return pos;
            }
        }, {
            key: "numberToString",
            value: function numberToString(arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] < 0) arr[i] += 256;
                }
                var res = [];
                for (i = 0; i < arr.length; i++) {
                    if (arr[i] == 0) break;
                    if ((arr[i] & 128) == 0) res.push(arr[i]); //1位
                    else if ((arr[i] & 64) == 0) res.push(arr[i] % 128); //1位
                        else if ((arr[i] & 32) == 0) //2位
                                {
                                    res.push(arr[i] % 32 * 64 + arr[i + 1] % 64);
                                    i++;
                                } else if ((arr[i] & 16) == 0) //3位
                                {
                                    res.push(arr[i] % 16 * 64 * 64 + arr[i + 1] % 64 * 64 + arr[i + 2] % 64);
                                    i++;
                                    i++;
                                } else if ((arr[i] & 8) == 0) //4位
                                {
                                    res.push(arr[i] % 8 * 64 * 64 * 64 + arr[i + 1] % 64 * 64 * 64 + arr[i + 2] % 64 * 64 + arr[i + 2] % 64);
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
        }, {
            key: "stringToBytes",
            value: function stringToBytes(str) {
                var res = [];
                var num;
                for (var i = 0; i < str.length; i++) {
                    num = str.charCodeAt(i);
                    if (num < 128) {
                        res.push(num);
                    } else if (num < 2048) {
                        res.push(math.floor(num / 64) + 128 + 64);
                        res.push(num % 64 + 128);
                    } else if (num < 65536) {
                        res.push(math.floor(num / 4096) + 128 + 64 + 32);
                        res.push(math.floor(num % 4096 / 64) + 128);
                        res.push(num % 64 + 128);
                    } else {
                        res.push(math.floor(num / 262144) + 128 + 64 + 32 + 16);
                        res.push(math.floor(num % 262144 / 4096) + 128);
                        res.push(math.floor(num % 4096 / 64) + 128);
                        res.push(num % 64 + 128);
                    }
                }
                return res;
            }

            /**
             * 如果不是数字则返回 null
             * @param value 字符串
             */

        }, {
            key: "parseNumber",
            value: function parseNumber(value) {
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
                    return parseInt(before) + (end != "" ? parseInt(end) / Math.pow(10, end.length) : 0);
                }
                return null;
            }
        }, {
            key: "split",
            value: function split(text, array) {
                if (!array) {
                    return [text];
                }
                if (typeof array == "string") {
                    array = [array];
                }
                var list = [];
                var start = 0;
                for (var i = 0, len = text.length; i < len; i++) {
                    for (var a = 0; a < array.length; a++) {
                        if (text.slice(i, i + array[a].length) == array[a]) {
                            list.push(text.slice(start, i));
                            i += array[a].length - 1;
                            start = i + 1;
                            break;
                        }
                    }
                }
                return list;
            }
        }, {
            key: "intTo16",
            value: function intTo16(num) {
                var str = "";
                while (num) {
                    var n = num & 0xF;
                    num = num >> 4;
                    if (n < 10) {
                        str = n + str;
                    } else if (n == 10) {
                        str = "a" + str;
                    } else if (n == 11) {
                        str = "b" + str;
                    } else if (n == 12) {
                        str = "c" + str;
                    } else if (n == 13) {
                        str = "d" + str;
                    } else if (n == 14) {
                        str = "e" + str;
                    } else if (n == 15) {
                        str = "f" + str;
                    }
                }
                str = "0x" + str;
                return str;
            }
        }]);

        return StringDo;
    }();

    flower.StringDo = StringDo;
    //////////////////////////End File:flower/utils/StringDo.js///////////////////////////

    //////////////////////////File:flower/utils/VByteArray.js///////////////////////////

    var VByteArray = function () {
        function VByteArray() {
            var big = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            _classCallCheck(this, VByteArray);

            this.bytes = [];
            this.big = big;
            this.position = 0;
            this.length = 0;
        }

        _createClass(VByteArray, [{
            key: "readFromArray",
            value: function readFromArray(bytes) {
                this.bytes.length = 0;
                this.position = 0;
                this.length = 0;
                this.bytes = bytes;
                this.length = this.bytes.length;
            }
        }, {
            key: "writeInt",
            value: function writeInt(val) {
                val = +val & ~0;
                if (val >= 0) {
                    val *= 2;
                } else {
                    val = ~val;
                    val *= 2;
                    val++;
                }
                this.writeUInt(val);
            }
        }, {
            key: "writeUInt",
            value: function writeUInt(val) {
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
                } else {
                    this.bytes.splice(this.position, 0, val & 0x7F);
                    this.position++;
                    this.length++;
                }
                if (flag || val >> 14) {
                    this.bytes.splice(this.position, 0, 0x80 | val >> 7 & 0x7F);
                    this.position++;
                    this.length++;
                } else if (val >> 7) {
                    this.bytes.splice(this.position, 0, val >> 7 & 0x7F);
                    this.position++;
                    this.length++;
                }
                if (flag || val >> 21) {
                    this.bytes.splice(this.position, 0, 0x80 | val >> 14 & 0x7F);
                    this.position++;
                    this.length++;
                } else if (val >> 14) {
                    this.bytes.splice(this.position, 0, val >> 14 & 0x7F);
                    this.position++;
                    this.length++;
                }
                if (flag || val >> 28) {
                    this.bytes.splice(this.position, 0, 0x80 | val >> 21 & 0x7F);
                    this.position++;
                    this.length++;
                } else if (val >> 21) {
                    this.bytes.splice(this.position, 0, val >> 21 & 0x7F);
                    this.position++;
                    this.length++;
                }
                if (flag) {
                    this.writeUInt(math.floor(val2));
                }
            }
        }, {
            key: "writeByte",
            value: function writeByte(val) {
                val = +val & ~0;
                this.bytes.splice(this.position, 0, val);
                this.length += 1;
                this.position += 1;
            }
        }, {
            key: "writeBoolean",
            value: function writeBoolean(val) {
                val = !!val;
                this.bytes.splice(this.position, 0, val == true ? 1 : 0);
                this.length += 1;
                this.position += 1;
            }
        }, {
            key: "writeUTF",
            value: function writeUTF(val) {
                val = "" + val;
                var arr = StringDo.stringToBytes(val);
                this.writeUInt(arr.length);
                for (var i = 0; i < arr.length; i++) {
                    this.bytes.splice(this.position, 0, arr[i]);
                    this.position++;
                }
                this.length += arr.length;
            }
        }, {
            key: "writeUTFBytes",
            value: function writeUTFBytes(val, len) {
                val = "" + val;
                var arr = StringDo.stringToBytes(val);
                for (var i = 0; i < len; i++) {
                    if (i < arr.length) this.bytes.splice(this.position, 0, arr[i]);else this.bytes.splice(this.position, 0, 0);
                    this.position++;
                }
                this.length += len;
            }
        }, {
            key: "writeBytes",
            value: function writeBytes(b) {
                var start = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                var len = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                start = +start & ~0;
                len = +len & ~0;
                var copy = b.data;
                for (var i = start; i < copy.length && i < start + len; i++) {
                    this.bytes.splice(this.position, 0, copy[i]);
                    this.position++;
                }
                this.length += len;
            }
        }, {
            key: "writeByteArray",
            value: function writeByteArray(byteArray) {
                this.bytes = this.bytes.concat(byteArray);
                this.length += byteArray.length;
            }
        }, {
            key: "readBoolean",
            value: function readBoolean() {
                var val = this.bytes[this.position] == 0 ? false : true;
                this.position += 1;
                return val;
            }
        }, {
            key: "readInt",
            value: function readInt() {
                var val = this.readUInt();
                if (val % 2 == 1) {
                    val = math.floor(val / 2);
                    val = ~val;
                } else {
                    val = math.floor(val / 2);
                }
                return val;
            }
        }, {
            key: "readUInt",
            value: function readUInt() {
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
        }, {
            key: "readByte",
            value: function readByte() {
                var val = this.bytes[this.position];
                this.position += 1;
                return val;
            }
        }, {
            key: "readShort",
            value: function readShort() {
                var val;
                var bytes = this.bytes;
                if (this.big) {
                    val = bytes[this.position] | bytes[this.position + 1] << 8;
                } else {
                    val = bytes[this.position] << 8 | bytes[this.position + 1];
                }
                if (val > 1 << 15) val = val - (1 << 16);
                this.position += 2;
                return val;
            }
        }, {
            key: "readUTF",
            value: function readUTF() {
                var len = this.readUInt();
                var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
                this.position += len;
                return val;
            }
        }, {
            key: "readUTFBytes",
            value: function readUTFBytes(len) {
                len = +len & ~0;
                var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
                this.position += len;
                return val;
            }
        }, {
            key: "clear",
            value: function clear() {
                this.bytes.length = 0;
                this.position = 0;
                this.length = 0;
            }
        }, {
            key: "toString",
            value: function toString() {
                var str = "";
                for (var i = 0; i < this.bytes.length; i++) {
                    str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
                }
                return str;
            }
        }, {
            key: "position",
            get: function get() {
                return this._position;
            },
            set: function set(val) {
                this._position = val;
            }
        }, {
            key: "bytesAvailable",
            get: function get() {
                return this.length - this.position;
            }
        }, {
            key: "data",
            get: function get() {
                return this.bytes.concat();
            }
        }]);

        return VByteArray;
    }();

    flower.VByteArray = VByteArray;
    //////////////////////////End File:flower/utils/VByteArray.js///////////////////////////

    //////////////////////////File:flower/utils/Path.js///////////////////////////

    var Path = function () {
        function Path() {
            _classCallCheck(this, Path);
        }

        _createClass(Path, null, [{
            key: "getFileType",
            value: function getFileType(url) {
                var end = url.split("?")[0];
                end = end.split("/")[end.split("/").length - 1];
                if (end.split(".").length == 1) {
                    return "";
                }
                return end.split(".")[end.split(".").length - 1];
            }
        }, {
            key: "getPathDirection",
            value: function getPathDirection(url) {
                var arr = url.split("/");
                if (arr.length == 1) {
                    return "";
                }
                return url.slice(0, url.length - arr[arr.length - 1].length);
            }
        }, {
            key: "getName",
            value: function getName(url) {
                var arr = url.split("/");
                return arr[arr.length - 1];
            }
        }, {
            key: "isPeerDirection",
            value: function isPeerDirection(url1, url2) {
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
        }, {
            key: "joinPath",
            value: function joinPath(path1, path2) {
                if (path1.charAt(path1.length - 1) != "/" && path1.split("/")[path1.split("/").length - 1].split(".").length == 1) {
                    path1 += "/";
                }
                var path = path1;
                if (path.charAt(path.length - 1) != "/") {
                    for (var i = path.length - 2; i >= 0; i--) {
                        if (path.charAt(i) == "/") {
                            path = path.slice(0, i + 1);
                            break;
                        } else if (i == 0) {
                            path = "";
                        }
                    }
                }
                if (path2.charAt(0) == "/") {
                    path2 = path2.slice(1, path2.length);
                }
                while ((path2.slice(0, 2) == "./" || path2.slice(0, 3) == "../") && path != "") {
                    if (path2.slice(0, 2) == "./") {
                        path2 = path2.slice(2, path2.length);
                    } else {
                        path2 = path2.slice(3, path2.length);
                        for (var i = path.length - 2; i >= 0; i--) {
                            if (path.charAt(i) == "/") {
                                path = path.slice(0, i + 1);
                                break;
                            } else if (i == 0) {
                                path = "";
                            }
                        }
                    }
                }
                path += path2;
                return path;
            }
        }]);

        return Path;
    }();

    flower.Path = Path;
    //////////////////////////End File:flower/utils/Path.js///////////////////////////

    //////////////////////////File:flower/utils/XMLAttribute.js///////////////////////////

    var XMLAttribute = function XMLAttribute() {
        _classCallCheck(this, XMLAttribute);

        this.name = "";
        this.value = "";
    };

    flower.XMLAttribute = XMLAttribute;
    //////////////////////////End File:flower/utils/XMLAttribute.js///////////////////////////

    //////////////////////////File:flower/utils/XMLElement.js///////////////////////////

    var XMLElement = function (_XMLAttribute) {
        _inherits(XMLElement, _XMLAttribute);

        function XMLElement() {
            _classCallCheck(this, XMLElement);

            var _this34 = _possibleConstructorReturn(this, Object.getPrototypeOf(XMLElement).call(this));

            _this34.namespaces = [];
            _this34.attributes = [];
            _this34.elements = _this34.list = [];
            return _this34;
        }

        _createClass(XMLElement, [{
            key: "addNameSpace",
            value: function addNameSpace(nameSpace) {
                this.namespaces.push(nameSpace);
            }
        }, {
            key: "getAttribute",
            value: function getAttribute(name) {
                for (var i = 0; i < this.attributes.length; i++) {
                    if (this.attributes[i].name == name) {
                        return this.attributes[i];
                    }
                }
                return null;
            }
        }, {
            key: "getNameSapce",
            value: function getNameSapce(name) {
                for (var i = 0; i < this.namespaces.length; i++) {
                    if (this.namespaces[i].name == name) {
                        return this.namespaces[i];
                    }
                }
                return null;
            }
        }, {
            key: "getElementByAttribute",
            value: function getElementByAttribute(atrName, value) {
                for (var i = 0; i < this.list.length; i++) {
                    for (var a = 0; a < this.list[i].attributes.length; a++) {
                        if (this.list[i].attributes[a].name == atrName && this.list[i].attributes[a].value == value) {
                            return this.list[i];
                        }
                    }
                }
                return null;
            }
        }, {
            key: "getElement",
            value: function getElement(name) {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].name == name) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "getElements",
            value: function getElements(atrName) {
                var res = [];
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].name == atrName) {
                        res.push(this.list[i]);
                    }
                }
                return res;
            }
        }, {
            key: "getAllElements",
            value: function getAllElements() {
                var res = [this];
                for (var i = 0; i < this.list.length; i++) {
                    res = res.concat(this.list[i].getAllElements());
                }
                return res;
            }
        }, {
            key: "parse",
            value: function parse(content) {
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
        }, {
            key: "__isStringEmpty",
            value: function __isStringEmpty(str) {
                for (var i = 0, len = str.length; i < len; i++) {
                    var char = str.charAt(i);
                    if (char != " " && char != "\t" && char != "\r" && char != "\n" && char != "　") {
                        return false;
                    }
                }
                return true;
            }
        }, {
            key: "readInfo",
            value: function readInfo(content) {
                var startIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

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
                    } else if (c == ">") {
                        i++;
                        break;
                    } else if (c == " " || c == "\t" || c == "\r" || c == "\n" || c == "　") {} else {
                        for (j = i + 1; j < len; j++) {
                            c = content.charAt(j);
                            if (c == "=" || c == " " || c == "\t") {
                                var atrName = content.slice(i, j);
                                if (atrName.split(":").length == 2) {
                                    nameSpace = new XMLNameSpace();
                                    this.namespaces.push(nameSpace);
                                    nameSpace.name = atrName.split(":")[1];
                                } else {
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
                                } else {
                                    nameSpace.value = content.slice(i, j);
                                    nameSpace = null;
                                }
                                i = j;
                                break;
                            }
                        }
                    }
                }
                if (end == true) return i;
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
                        } else {
                            //视图找 <abcsklsklskl />a
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
                            if (c == 47 || c == 62 || c >= 97 && c <= 122 || c >= 65 && c <= 90) {} else {
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
        }, {
            key: "toString",
            value: function toString() {
                return "<" + this.name + "/>";
            }
        }], [{
            key: "parse",
            value: function parse(content) {
                var xml = new XMLElement();
                xml.parse(content);
                return xml;
            }
        }]);

        return XMLElement;
    }(XMLAttribute);

    flower.XMLElement = XMLElement;
    //////////////////////////End File:flower/utils/XMLElement.js///////////////////////////

    //////////////////////////File:flower/utils/XMLNameSpace.js///////////////////////////

    var XMLNameSpace = function XMLNameSpace() {
        _classCallCheck(this, XMLNameSpace);

        this.name = "";
        this.value = "";
    };

    flower.XMLNameSpace = XMLNameSpace;
    //////////////////////////End File:flower/utils/XMLNameSpace.js///////////////////////////

    //////////////////////////File:flower/utils/Math.js///////////////////////////

    var Math = function () {
        function Math() {
            _classCallCheck(this, Math);
        }

        _createClass(Math, null, [{
            key: "timeToHMS",


            /**
             * 将时间(ms) 转换为 00:00:00 的格式
             * @param time
             */
            value: function timeToHMS(time) {
                var hour = math.floor(time / (1000 * 3600));
                var minute = math.floor(time % (1000 * 3600) / (1000 * 60));
                var second = math.floor(time % (1000 * 60) / 1000);
                return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
            }

            /**
             * 将时间(ms) 转换为 00:00:00 的格式
             * @param time
             */

        }, {
            key: "timeToMSM",
            value: function timeToMSM(time) {
                var minute = math.floor(time % (1000 * 3600) / (1000 * 60));
                var second = math.floor(time % (1000 * 60) / 1000);
                var ms = math.floor(time % 1000 / 10);
                return (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) + ":" + (ms < 10 ? "0" + ms : ms);
            }
        }]);

        return Math;
    }();

    Math.E = math.E;
    Math.LN2 = math.LN2;
    Math.LN10 = math.LN10;
    Math.LOG2E = math.LOG2E;
    Math.LOG10E = math.LOG10E;
    Math.PI = math.PI;
    Math.SQRT1_2 = math.SQRT1_2;
    Math.SQRT2 = math.SQRT2;
    Math.abs = math.abs;
    Math.acos = math.acos;
    Math.acosh = math.acosh;
    Math.asin = math.asin;
    Math.asinh = math.asinh;
    Math.atan = math.atan;
    Math.atan2 = math.atan2;
    Math.atanh = math.atanh;
    Math.cbrt = math.cbrt;
    Math.ceil = math.ceil;
    Math.clz32 = math.clz32;
    Math.cos = math.cos;
    Math.cosh = math.cosh;
    Math.exp = math.exp;
    Math.expm1 = math.expm1;
    Math.floor = math.floor;
    Math.fround = math.fround;
    Math.hypot = math.hypot;
    Math.imul = math.imul;
    Math.log = math.log;
    Math.log1p = math.log1p;
    Math.log2 = math.log2;
    Math.log10 = math.log10;
    Math.max = math.max;
    Math.min = math.min;
    Math.pow = math.pow;
    Math.random = math.random;
    Math.round = math.round;
    Math.sign = math.sign;
    Math.sin = math.sin;
    Math.sinh = math.sinh;
    Math.sqrt = math.sqrt;
    Math.tan = math.tan;
    Math.tanh = math.tanh;
    Math.trunc = math.trunc;


    flower.Math = Math;
    //////////////////////////End File:flower/utils/Math.js///////////////////////////
})(Math);
var trace = flower.trace;