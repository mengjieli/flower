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

    function $error(errorCode) {
        var msg;
        if (errorCode instanceof String) {
            msg = errorCode;
        } else {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            msg = getLanguage(errorCode, args);
        }
        console.log(msg);
        throw msg;
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

    function trace() {
        var str = "";
        for (var i = 0; i < arguments.length; i++) {
            str += arguments[i] + "\t\t";
        }
        console.log(str);
    }

    _exports.start = start;
    _exports.getLanguage = $getLanguage;
    _exports.trace = trace;
    //////////////////////////End File:flower/Flower.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/Platform.js///////////////////////////

    var Platform = function () {
        function Platform() {
            _classCallCheck(this, Platform);
        }

        _createClass(Platform, null, [{
            key: "start",
            value: function start(engine, root) {
                Platform.native = cc.sys.isNative;
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
        }, {
            key: "_run",
            value: function _run() {
                Platform.frame++;
                var now = new Date().getTime();
                Platform._runBack(now - Platform.lastTime);
                Platform.lastTime = now;
                if (PlatformURLLoader.loadingList.length) {
                    var item = PlatformURLLoader.loadingList.shift();
                    item[0](item[1], item[2], item[3], item[4]);
                }
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
        }, {
            key: "release",
            value: function release(name, object) {
                object.release();
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

    //////////////////////////File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////


    Platform.type = "cocos2dx";
    Platform.lastTime = new Date().getTime();
    Platform.frame = 0;
    Platform.pools = {};

    var PlatformSprite = function () {
        function PlatformSprite() {
            _classCallCheck(this, PlatformSprite);

            this.show = new cc.Node();
            this.show.setAnchorPoint(0, 0);
            this.show.retain();
        }

        _createClass(PlatformSprite, [{
            key: "addChild",
            value: function addChild(child) {
                this.show.addChild(child.show);
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                this.show.removeChild(child.show);
            }
        }, {
            key: "resetChildIndex",
            value: function resetChildIndex(children) {
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$nativeShow.show.setLocalZOrder(i);
                }
            }
        }, {
            key: "release",
            value: function release() {
                var show = this.show;
                show.setPosition(0, 0);
                show.setScale(1);
                show.setOpacity(255);
                show.setRotation(0);
                show.setVisible(true);
            }
        }, {
            key: "x",
            set: function set(val) {
                this.show.setPositionX(val);
            }
        }, {
            key: "y",
            set: function set(val) {
                this.show.setPositionY(-val);
            }
        }, {
            key: "scaleX",
            set: function set(val) {
                this.show.setScaleX(val);
            }
        }, {
            key: "scaleY",
            set: function set(val) {
                this.show.setScaleY(val);
            }
        }, {
            key: "rotation",
            set: function set(val) {
                this.show.setRotation(val);
            }
        }]);

        return PlatformSprite;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformSprite.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////


    var PlatformTextField = function () {
        function PlatformTextField() {
            _classCallCheck(this, PlatformTextField);

            this.show = new cc.LabelTTF("", "Times Roman", 12);
            this.show.setAnchorPoint(0, 1);
            this.show.retain();
        }

        _createClass(PlatformTextField, [{
            key: "release",
            value: function release() {
                var show = this.show;
                show.setPosition(0, 0);
                show.setScale(1);
                show.setOpacity(255);
                show.setRotation(0);
                show.setVisible(true);
                show.setString("");
                show.setFontSize(12);
                show.setFontFillColor({ r: 0, g: 0, b: 0 }, true);
            }
        }]);

        return PlatformTextField;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformTextField.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////


    var PlatformBitmap = function () {
        function PlatformBitmap() {
            _classCallCheck(this, PlatformBitmap);

            this.__textureChange = false;
            this.__x = 0;
            this.__y = 0;
            this.__programmerChange = false;
            this.__shaderFlagChange = false;
            this.__shaderFlag = 0;
            this.__scaleX = 1;
            this.__scaleY = 1;
            this.__textureScaleX = 1;
            this.__textureScaleY = 1;

            this.show = new cc.Sprite();
            this.show.setAnchorPoint(0, 1);
            this.show.retain();
        }

        _createClass(PlatformBitmap, [{
            key: "setTexture",
            value: function setTexture(texture) {
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
                this.scaleX = this.__scaleX;
                this.scaleY = this.__scaleY;
                this._changeShader();
            }
        }, {
            key: "setScale9Grid",
            value: function setScale9Grid(scale9Grid) {
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
        }, {
            key: "_changeShader",
            value: function _changeShader() {
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
                        this._changeScale9Grid(this.__texture.width, this.__texture.height, this.__scale9Grid, this.__texture.width * this.__scaleX, this.__texture.height * this.__scaleY);
                    }
                }
            }
        }, {
            key: "_changeScale9Grid",
            value: function _changeScale9Grid(width, height, scale9Grid, setWidth, setHeight) {
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
        }, {
            key: "release",
            value: function release() {
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
        }, {
            key: "x",
            set: function set(val) {
                this.__x = val;
                this.show.setPositionX(this.__x + (this.__texture ? this.__texture.offX : 0) * this.__scaleX);
            }
        }, {
            key: "y",
            set: function set(val) {
                this.__y = val;
                this.show.setPositionY(-this.__y - (this.__texture ? this.__texture.offY : 0) * this.__scaleY);
            }
        }, {
            key: "scaleX",
            set: function set(val) {
                this.__scaleX = val;
                this.show.setScaleX(val * this.__textureScaleX);
                if (this.__texture && this.__texture.offX) {
                    this.show.setPositionX(this.__x + this.__texture.offX * this.__scaleX);
                }
                this._changeShader();
            }
        }, {
            key: "scaleY",
            set: function set(val) {
                this.__scaleY = val;
                this.show.setScaleY(val * this.__textureScaleY);
                if (this.__texture && this.__texture.offY) {
                    this.show.setPositionY(-this.__y - this.__texture.offY * this.__scaleY);
                }
                this._changeShader();
            }
        }, {
            key: "rotation",
            set: function set(val) {
                console.log("rot?" + val);
                this.show.setRotation(val);
            }
        }]);

        return PlatformBitmap;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformBitmap.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////


    var PlatformTexture = function () {
        function PlatformTexture() {
            _classCallCheck(this, PlatformTexture);
        }

        _createClass(PlatformTexture, [{
            key: "dispose",
            value: function dispose() {
                cc.TextureCache.getInstance().removeTextureForKey(this.url);
            }
        }]);

        return PlatformTexture;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformTexture.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////


    var PlatformURLLoader = function () {
        function PlatformURLLoader() {
            _classCallCheck(this, PlatformURLLoader);
        }

        _createClass(PlatformURLLoader, null, [{
            key: "loadText",
            value: function loadText(url, back, errorBack, thisObj) {
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
                        if (res instanceof String) {} else {
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
                            } else {
                                if (data instanceof String) {} else {
                                    data = JSON.stringify(data);
                                }
                                back.call(thisObj, data);
                            }
                            PlatformURLLoader.isLoading = false;
                        });
                    }
                }
            }
        }, {
            key: "loadTexture",
            value: function loadTexture(url, back, errorBack, thisObj) {
                if (PlatformURLLoader.isLoading) {
                    PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj]);
                    return;
                }
                PlatformURLLoader.isLoading = true;
                if (TIP) {
                    $tip(2002, url);
                }
                cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, img) {
                    if (err) {
                        errorBack.call(thisObj);
                    } else {
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
        }]);

        return PlatformURLLoader;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformURLLoader.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformProgrammer.js///////////////////////////


    PlatformURLLoader.isLoading = false;
    PlatformURLLoader.loadingList = [];

    var PlatformProgrammer = function () {
        function PlatformProgrammer() {
            var vsh = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
            var fsh = arguments.length <= 1 || arguments[1] === undefined ? "res/shaders/Bitmap.fsh" : arguments[1];

            _classCallCheck(this, PlatformProgrammer);

            if (vsh == "") {
                if (Platform.native) {
                    vsh = "res/shaders/Bitmap.vsh";
                } else {
                    vsh = "res/shaders/BitmapWeb.vsh";
                }
            }
            var shader; // = Programmer.shader;
            shader = new cc.GLProgram(vsh, fsh);
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
        }

        _createClass(PlatformProgrammer, [{
            key: "shaderFlag",
            set: function set(type) {
                if (Platform.native) {
                    this.$nativeProgrammer.setUniformInt("scale9", type & PlatformShaderType.SCALE_9_GRID);
                } else {
                    this.$nativeProgrammer.setUniformLocationI32(this.$nativeProgrammer.getUniformLocationForName("scale9"), type & PlatformShaderType.SCALE_9_GRID);
                }
            }
        }], [{
            key: "createProgrammer",
            value: function createProgrammer() {
                if (PlatformProgrammer.programmers.length) {
                    return PlatformProgrammer.programmers.pop();
                }
                return new PlatformProgrammer();
            }
        }, {
            key: "releaseProgrammer",
            value: function releaseProgrammer(programmer) {
                PlatformProgrammer.programmers.push(programmer);
            }
        }, {
            key: "getInstance",
            value: function getInstance() {
                if (PlatformProgrammer.instance == null) {
                    PlatformProgrammer.instance = new PlatformProgrammer(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
                }
                return PlatformProgrammer.instance;
            }
        }]);

        return PlatformProgrammer;
    }();
    //////////////////////////End File:flower/platform/cocos2dx/PlatformProgrammer.js///////////////////////////

    //////////////////////////File:flower/platform/cocos2dx/PlatformShaderType.js///////////////////////////


    PlatformProgrammer.programmers = [];

    var PlatformShaderType = function PlatformShaderType() {
        _classCallCheck(this, PlatformShaderType);
    };
    //////////////////////////End File:flower/platform/cocos2dx/PlatformShaderType.js///////////////////////////

    //////////////////////////File:flower/core/CoreTime.js///////////////////////////


    PlatformShaderType.TEXTURE_CHANGE = 0x0001;
    PlatformShaderType.SCALE_9_GRID = 0x0002;

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
                Stage.$onFrameEnd();
                TextureManager.getInstance().$check();
            }
        }, {
            key: "getTime",
            value: function getTime() {
                return CoreTime.getTime();
            }
        }]);

        return CoreTime;
    }();
    //////////////////////////End File:flower/core/CoreTime.js///////////////////////////

    //////////////////////////File:flower/language/Language.js///////////////////////////


    CoreTime.currentTime = 0;
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
    locale_strings[2003] = "[加载纹理失败] {0}";

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

    //////////////////////////File:flower/event/TouchEvent.js///////////////////////////

    var TouchEvent = function (_Event) {
        _inherits(TouchEvent, _Event);

        function TouchEvent(type) {
            var bubbles = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _classCallCheck(this, TouchEvent);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(TouchEvent).call(this, type, bubbles));
        }

        return TouchEvent;
    }(Event);

    TouchEvent.TOUCH_BEGIN = "touch_begin";
    TouchEvent.TOUCH_MOVE = "touch_move";
    TouchEvent.TOUCH_END = "touch_end";
    TouchEvent.TOUCH_RELEASE = "touch_release";


    _exports.TouchEvent = TouchEvent;
    //////////////////////////End File:flower/event/TouchEvent.js///////////////////////////

    //////////////////////////File:flower/event/IOErrorEvent.js///////////////////////////

    var IOErrorEvent = function (_Event2) {
        _inherits(IOErrorEvent, _Event2);

        function IOErrorEvent(type, message) {
            _classCallCheck(this, IOErrorEvent);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(IOErrorEvent).call(this, type));
        }

        _createClass(IOErrorEvent, [{
            key: "message",
            get: function get() {
                return this._message;
            }
        }]);

        return IOErrorEvent;
    }(Event);

    IOErrorEvent.ERROR = "error";


    _exports.IOErrorEvent = IOErrorEvent;
    //////////////////////////End File:flower/event/IOErrorEvent.js///////////////////////////

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

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObject).call(this));

            _this3.__x = 0;
            _this3.__y = 0;
            _this3.__flags = 0;
            _this3.__alpha = 1;
            _this3.__concatAlpha = 1;

            _this3.$DisplayObject = {
                0: 1, //scaleX
                1: 1, //scaleY
                2: 0, //rotation
                3: null, //settingWidth
                4: null, //settingHeight
                5: "", //name
                6: new Size(), //size 自身尺寸
                7: true, //touchEnabeld
                8: true, //multiplyTouchEnabled
                10: 0, //lastTouchX
                11: 0 //lastTouchY
            };
            return _this3;
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
                this.$nativeShow.x = val;
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
                this.$nativeShow.y = val;
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
                this.$nativeShow.scaleX = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$getScaleX",
            value: function $getScaleX() {
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
                    this.$getSize();
                }
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
                this.$nativeShow.scaleY = val;
                this.$invalidPositionScale();
            }
        }, {
            key: "$getScaleY",
            value: function $getScaleY() {
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
                    this.$getSize();
                }
                return p[1];
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
                this.$nativeShow.rotation = val;
                this.$invalidPositionScale();
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
                return p[3] != null ? p[3] : this.$getSize().width;
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
                return p[4] != null ? p[4] : this.$getSize().height;
            }
        }, {
            key: "$getSize",
            value: function $getSize() {
                var size = this.$DisplayObject[6];
                if (this.$hasFlags(0x0001)) {
                    this.calculateSize(size);
                    this.__checkSettingSize(size);
                    this.$removeFlags(0x0001);
                }
                return size;
            }
        }, {
            key: "$setTouchEnabled",
            value: function $setTouchEnabled(val) {
                var p = this.$DisplayObject;
                if (p[7] == val) {
                    return false;
                }
                p[7] = val;
                return true;
            }
        }, {
            key: "$setMultiplyTouchEnabled",
            value: function $setMultiplyTouchEnabled(val) {
                varp = this.$DisplayObject;
                if (p[8] == val) {
                    return false;
                }
                p[8] = val;
                return true;
            }
        }, {
            key: "__checkSettingSize",
            value: function __checkSettingSize(size) {
                var p = this.$DisplayObject;
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
        }, {
            key: "$setParent",
            value: function $setParent(parent, stage) {
                this.__parent = parent;
                this.__stage = stage;
                this.$addFlagsDown(0x0002);
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
                _get(Object.getPrototypeOf(DisplayObject.prototype), "dispatch", this).call(this, e);
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
            key: "$getMouseTarget",
            value: function $getMouseTarget(matrix, multiply) {
                if (this.touchEnabled == false || this._visible == false) return null;
                matrix.save();
                matrix.translate(-this.x, -this.y);
                if (this.rotation) matrix.rotate(-this.radian);
                if (this.scaleX != 1 || this.scaleY != 1) matrix.scale(1 / this.scaleX, 1 / this.scaleY);
                var touchX = Math.floor(matrix.tx);
                var touchY = Math.floor(matrix.ty);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                if (touchX >= 0 && touchY >= 0 && touchX < this.width && touchY < this.height) {
                    return this;
                }
                matrix.restore();
                return null;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.alpha = this.$getConcatAlpha();
                }
                if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
                    this.$getSize();
                }
            }
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
            key: "radian",
            get: function get() {
                return this.rotation * Math.PI / 180;
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
            key: "touchEnabled",
            get: function get() {
                var p = this.$DisplayObject;
                return p[7];
            },
            set: function set(val) {
                this.$setTouchEnabeld(val);
            }
        }, {
            key: "multiplyTouchEnabled",
            get: function get() {
                var p = this.$DisplayObject;
                return p[8];
            },
            set: function set(val) {
                this.$setMultiplyTouchEnabled(val);
            }
        }, {
            key: "lastTouchX",
            get: function get() {
                var p = this.$DisplayObject;
                return p[10];
            }
        }, {
            key: "lastTouchY",
            get: function get() {
                var p = this.$DisplayObject;
                return p[11];
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

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Sprite).call(this));

            _this4.__children = [];
            _this4.$nativeShow = Platform.create("Sprite");
            return _this4;
        }

        _createClass(Sprite, [{
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
        }, {
            key: "$removeChild",
            value: function $removeChild(child) {
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
        }, {
            key: "removeChild",
            value: function removeChild(child) {
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
            key: "$getMouseTarget",
            value: function $getMouseTarget(matrix, multiply) {
                if (this.touchEnabled == false || this.visible == false) return null;
                if (multiply == true && this.multiplyTouchEnabled == false) return null;
                matrix.save();
                matrix.translate(-this.x, -this.y);
                if (this.rotation) matrix.rotate(-this.radian);
                if (this.scaleX != 1 || this.scaleY != 1) {
                    matrix.scale(1 / this.scaleX, 1 / this.scaleY);
                }
                var touchX = Math.floor(matrix.tx);
                var touchY = Math.floor(matrix.ty);
                var p = this.$DisplayObject;
                p[10] = touchX;
                p[11] = touchY;
                var target;
                var childs = this.__children;
                var len = childs.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (childs[i].touchEnabled && (multiply == false || multiply == true && childs[i].multiplyTouchEnabled == true)) {
                        target = childs[i].$getMouseTarget(matrix, multiply);
                        if (target) {
                            break;
                        }
                    }
                }
                matrix.restore();
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
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].$onFrameEnd();
                }
                _get(Object.getPrototypeOf(Sprite.prototype), "$onFrameEnd", this).call(this);
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
                Platform.release("Sprite", this.$nativeShow);
            }
        }, {
            key: "numChildren",
            get: function get() {
                return this.__children.length;
            }
        }]);

        return Sprite;
    }(DisplayObject);

    _exports.Sprite = Sprite;
    //////////////////////////End File:flower/display/Sprite.js///////////////////////////

    //////////////////////////File:flower/display/Bitmap.js///////////////////////////

    var Bitmap = function (_DisplayObject2) {
        _inherits(Bitmap, _DisplayObject2);

        function Bitmap(texture) {
            _classCallCheck(this, Bitmap);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Bitmap).call(this));

            _this5.$nativeShow = Platform.create("Bitmap");
            _this5.texture = texture;
            return _this5;
        }

        _createClass(Bitmap, [{
            key: "$setTexture",
            value: function $setTexture(val) {
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
                } else {
                    this.$nativeShow.setTexture(Texture.$blank);
                }
                this.invalidSize();
                return true;
            }
        }, {
            key: "calculateSize",
            value: function calculateSize(size) {
                if (this.__texture) {
                    size.width = this.__texture.width;
                    size.height = this.__texture.height;
                } else {
                    size.width = 0;
                    size.height = 0;
                }
            }
        }, {
            key: "$setScale9Grid",
            value: function $setScale9Grid(val) {
                if (this.__scale9Grid == val) {
                    return false;
                }
                this.__scale9Grid = val;
                this.$nativeShow.setScale9Grid(val);
                return true;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                _get(Object.getPrototypeOf(Bitmap.prototype), "dispose", this).call(this);
                Platform.release("Bitmap", this.$nativeShow);
            }
        }, {
            key: "texture",
            set: function set(val) {
                this.$setTexture(val);
            }
        }, {
            key: "scale9Grid",
            set: function set(val) {
                this.$setScale9Grid(val);
            }
        }]);

        return Bitmap;
    }(DisplayObject);

    _exports.Bitmap = Bitmap;
    //////////////////////////End File:flower/display/Bitmap.js///////////////////////////

    //////////////////////////File:flower/display/Stage.js///////////////////////////

    var Stage = function (_Sprite) {
        _inherits(Stage, _Sprite);

        function Stage() {
            _classCallCheck(this, Stage);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Stage).call(this));

            _this6.__touchList = [];

            _this6.__stage = _this6;
            Stage.stages.push(_this6);
            return _this6;
        }

        _createClass(Stage, [{
            key: "getMouseTarget",
            value: function getMouseTarget(touchX, touchY, mutiply) {
                var matrix = Matrix.$matrix;
                matrix.identity();
                matrix.tx = touchX;
                matrix.ty = touchY;
                var target = this.$getMouseTarget(matrix, mutiply) || this;
                return target;
            }
        }, {
            key: "onMouseDown",
            value: function onMouseDown(id, x, y) {
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
                var target = this.getMouseTarget(x, y, mouse.mutiply);
                mouse.target = target;
                var parent = target.parent;
                while (parent && parent != this) {
                    mouse.parents.push(parent);
                    parent = parent.parent;
                }
                //target.addListener(flower.Event.REMOVED, this.onMouseTargetRemove, this);
                if (target) {
                    var event = new flower.TouchEvent(flower.TouchEvent.TOUCH_BEGIN);
                    event.stageX = x;
                    event.stageY = y;
                    event.$target = target;
                    event.touchX = target.lastTouchX;
                    event.touchY = target.lastTouchY;
                    target.dispatch(event);
                }
            }
        }, {
            key: "onMouseMove",
            value: function onMouseMove(id, x, y) {
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
                this.getMouseTarget(x, y, mouse.mutiply);
                var target = mouse.target; //this.getMouseTarget(x, y, mouse.mutiply);
                mouse.moveX = x;
                mouse.moveY = y;
                var event;
                if (target) {
                    event = new flower.TouchEvent(flower.TouchEvent.TOUCH_MOVE);
                    event.stageX = x;
                    event.stageY = y;
                    event.$target = target;
                    event.touchX = target.lastTouchX;
                    event.touchY = target.lastTouchY;
                    target.dispatch(event);
                }
            }
        }, {
            key: "onMouseUp",
            value: function onMouseUp(id, x, y) {
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
                var target = this.getMouseTarget(x, y, mouse.mutiply);
                var event;
                if (target == mouse.target) {
                    event = new flower.TouchEvent(flower.TouchEvent.TOUCH_END);
                    event.stageX = x;
                    event.stageY = y;
                    event.$target = target;
                    event.touchX = target.lastTouchX;
                    event.touchY = target.lastTouchY;
                    target.dispatch(event);
                } else {
                    target = mouse.target;
                    event = new flower.TouchEvent(flower.TouchEvent.TOUCH_RELEASE);
                    event.stageX = x;
                    event.stageY = y;
                    event.$target = target;
                    event.touchX = target.lastTouchX;
                    event.touchY = target.lastTouchY;
                    target.dispatch(event);
                }
            }

            ///////////////////////////////////////触摸事件处理///////////////////////////////////////

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

            ///////////////////////////////////////触摸事件处理///////////////////////////////////////

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
        }]);

        return Stage;
    }(Sprite);

    Stage.stages = [];


    _exports.Stage = Stage;
    //////////////////////////End File:flower/display/Stage.js///////////////////////////

    //////////////////////////File:flower/texture/Texture.js///////////////////////////

    var Texture = function () {
        function Texture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
            _classCallCheck(this, Texture);

            this.__offX = 0;
            this.__offY = 0;
            this.__sourceRotation = false;

            this.$nativeTexture = nativeTexture;
            this.__url = url;
            this.__nativeURL = nativeURL;
            this.$count = 0;
            this.__width = w;
            this.__height = h;
            this.__settingWidth = settingWidth;
            this.__settingHeight = settingHeight;
        }

        _createClass(Texture, [{
            key: "createSubTexture",
            value: function createSubTexture(startX, startY, width, height) {
                var offX = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
                var offY = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
                var rotation = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

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
                this.$nativeTexture.dispose();
                this.$nativeTexture = null;
                if (TIP) {
                    $tip(1005, this.__nativeURL);
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
                return this.__settingWidth || this.__width;
            }
        }, {
            key: "height",
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
                return this.width / this.__width;
            }
        }, {
            key: "scaleY",
            get: function get() {
                return this.height / this.__height;
            }
        }]);

        return Texture;
    }();
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
            key: "$check",
            value: function $check() {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].$count == 0) {
                        this.list.splice(i, 1)[0].dispose();
                        return;
                    }
                }
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

            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(URLLoader).call(this));

            _this7._createRes = false;
            _this7._isLoading = false;
            _this7._selfDispose = false;

            if (typeof res == "string") {
                var resItem = Res.getRes(res);
                if (resItem) {
                    res = resItem;
                } else {
                    _this7._createRes = true;
                    res = ResItem.create(res);
                }
            }
            _this7._res = res;
            _this7._type = _this7._res.type;
            _this7._language = LANGUAGE;
            _this7._scale = SCALE ? SCALE : null;
            return _this7;
        }

        _createClass(URLLoader, [{
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
        }, {
            key: "loadTexture",
            value: function loadTexture() {
                var texture = TextureManager.getInstance().$getTextureByNativeURL(this._loadInfo.url);
                if (texture) {
                    texture.$addCount();
                    this._data = texture;
                    new CallLater(this.loadComplete, this);
                } else {
                    PlatformURLLoader.loadTexture(this._loadInfo.url, this.loadTextureComplete, this.loadError, this);
                }
            }
        }, {
            key: "loadTextureComplete",
            value: function loadTextureComplete(nativeTexture, width, height) {
                var texture = TextureManager.getInstance().$createTexture(nativeTexture, this.url, this._loadInfo.url, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
                this._data = texture;
                texture.$addCount();
                new CallLater(this.loadComplete, this);
            }
        }, {
            key: "setTextureByLink",
            value: function setTextureByLink(texture) {
                texture.$addCount();
                this._data = texture;
                this.loadComplete();
            }
        }, {
            key: "loadText",
            value: function loadText() {
                PlatformURLLoader.loadText(this._loadInfo.url, this.loadTextComplete, this.loadError, this);
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
                        if (this._type == ResType.Image) {
                            this._links[i].setTextureByLink(this._data);
                        } else if (this._type == ResType.TEXT) {
                            this._links[i].setTextByLink(this._data);
                        } else if (this._type == ResType.JSON) {
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
        }, {
            key: "loadError",
            value: function loadError() {
                if (this.hasListener(IOErrorEvent.ERROR)) {
                    this.dispatch(new IOErrorEvent(IOErrorEvent.ERROR, getLanguage(2003, this._loadInfo.url)));
                } else {
                    $error(2003, this._loadInfo.url);
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (!this._selfDispose) {
                    _get(Object.getPrototypeOf(URLLoader.prototype), "dispose", this).call(this);
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

    URLLoader.list = [];


    _exports.URLLoader = URLLoader;
    //////////////////////////End File:flower/net/URLLoader.js///////////////////////////

    //////////////////////////File:flower/net/URLLoaderList.js///////////////////////////

    var URLLoaderList = function (_EventDispatcher3) {
        _inherits(URLLoaderList, _EventDispatcher3);

        function URLLoaderList(list) {
            _classCallCheck(this, URLLoaderList);

            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(URLLoaderList).call(this));

            _this8.__list = list;
            _this8.__dataList = [];
            _this8.__index = 0;
            return _this8;
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
                    this.dispatchWidth(flower.Event.COMPLETE, this.__dataList);
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
                load.addListener(IOErrorEvent.ERROR, this.__onError, this);
                load.load();
            }
        }, {
            key: "__onError",
            value: function __onError(e) {
                if (this.hasListener(IOErrorEvent.ERROR)) {
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

    _exports.URLLoaderList = URLLoaderList;
    //////////////////////////End File:flower/net/URLLoaderList.js///////////////////////////

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


    _exports.Res = Res;
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
        }, {
            key: "addInfo",
            value: function addInfo(url, settingWidth, settingHeight, scale, language) {
                var info = ResItemInfo.create();
                info.url = url;
                info.settingWidth = settingWidth;
                info.settingHeight = settingHeight;
                info.scale = scale || 1;
                info.language = language;
                this.__loadList.push(info);
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


    _exports.ResItem = ResItem;
    //////////////////////////End File:flower/res/ResItem.js///////////////////////////

    //////////////////////////File:flower/res/ResItemInfo.js///////////////////////////

    var ResItemInfo = function () {
        function ResItemInfo() {
            _classCallCheck(this, ResItemInfo);
        }

        _createClass(ResItemInfo, null, [{
            key: "create",


            /**
             * 支持的语言
             */


            /**
             * 预设的高
             */


            /**
             * 实际的加载地址
             */
            value: function create() {
                if (ResItemInfo.$pools.length) {
                    return ResItemInfo.$pools.pop();
                } else {
                    return new ResItemInfo();
                }
            }

            /**
             * 支持的缩放倍数
             */


            /**
             * 预设的宽
             */

        }, {
            key: "release",
            value: function release(info) {
                ResItemInfo.$pools.push(info);
            }
        }]);

        return ResItemInfo;
    }();

    ResItemInfo.$pools = [];


    _exports.ResItemInfo = ResItemInfo;
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
                if (end == "png" || end == "jpg") {
                    return ResType.IMAGE;
                }
                return ResType.TEXT;
            }
        }]);

        return ResType;
    }();

    ResType.TEXT = 1;
    ResType.JSON = 2;
    ResType.IMAGE = 3;


    _exports.ResType = ResType;
    //////////////////////////End File:flower/res/ResType.js///////////////////////////

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
            key: "del",
            value: function del(call, owner) {
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
        }]);

        return EnterFrame;
    }();

    EnterFrame.enterFrames = [];
    EnterFrame.waitAdd = [];
    EnterFrame.frame = 0;
    EnterFrame.updateFactor = 1;


    _exports.EnterFrame = EnterFrame;
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
        }]);

        return CallLater;
    }();

    CallLater._next = [];
    CallLater._list = [];


    _exports.CallLater = CallLater;
    //////////////////////////End File:flower/utils/CallLater.js///////////////////////////

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
                        str += before + "\t" + flower.ObjectDo.toString(obj[i], maxDepth, before + "\t", depth + 1) + (i < obj.length - 1 ? ",\n" : "\n");
                    }
                    str += before + "]";
                } else if (obj instanceof Object) {
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

    _exports.ObjectDo = ObjectDo;
    //////////////////////////End File:flower/utils/ObjectDo.js///////////////////////////

    //////////////////////////File:flower/utils/StringDo.js///////////////////////////

    var StringDo = function () {
        function StringDo() {
            _classCallCheck(this, StringDo);
        }

        _createClass(StringDo, null, [{
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
        }]);

        return StringDo;
    }();

    _exports.StringDo = StringDo;
    //////////////////////////End File:flower/utils/StringDo.js///////////////////////////
})();
var flower = _exports;