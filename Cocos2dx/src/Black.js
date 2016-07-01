"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var black = {};
var $root = eval("this");
(function () {
    //////////////////////////File:extension/black/core/Black.js///////////////////////////
    var sys = {};
    for (var key in flower.sys) {
        sys[key] = flower.sys[key];
    }
    //////////////////////////End File:extension/black/core/Black.js///////////////////////////

    //////////////////////////File:extension/black/core/UIComponent.js///////////////////////////

    var UIComponent = function () {
        function UIComponent() {
            _classCallCheck(this, UIComponent);
        }

        _createClass(UIComponent, null, [{
            key: "register",
            value: function register(clazz) {
                var p = clazz.prototype;
                p.$initUIComponent = function () {
                    this.$UIComponent = {
                        0: null, //left
                        1: null, //right
                        2: null, //horizontalCenter
                        3: null, //top
                        4: null, //bottom
                        5: null, //verticalCenter
                        6: null, //percentWidth
                        7: null, //percentHeight
                        8: null, //uiWidth
                        9: null };
                };

                //p.$getWidth = function () {
                //    var p = this.$UIComponent;
                //    var d = this.$DisplayObject;
                //    return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
                //}
                //
                //p.$getHeight = function () {
                //    var p = this.$UIComponent;
                //    var d = this.$DisplayObject;
                //    return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
                //}

                //uiHeight
                p.$setLeft = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[0] == val) {
                        return false;
                    }
                    p[0] = val;
                    this.$invalidateContentBounds();
                };

                p.$setRight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[1] == val) {
                        return false;
                    }
                    p[1] = val;
                    this.$invalidateContentBounds();
                };

                p.$setHorizontalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[2] == val) {
                        return false;
                    }
                    p[2] = val;
                    this.$invalidateContentBounds();
                };

                p.$setTop = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[3] == val) {
                        return false;
                    }
                    p[3] = val;
                    this.$invalidateContentBounds();
                };

                p.$setBottom = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[4] == val) {
                        return false;
                    }
                    p[4] = val;
                    this.$invalidateContentBounds();
                };

                p.$setVerticalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[5] == val) {
                        return false;
                    }
                    p[5] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentWidth = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[6] == val) {
                        return false;
                    }
                    p[6] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentHeight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[7] == val) {
                        return false;
                    }
                    p[7] = val;
                    this.$invalidateContentBounds();
                };

                p.$addFlags = function (flags) {
                    if (flags & 0x0001 == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                        this.__flags |= 0x1000;
                    }
                    this.__flags |= flags;
                };

                //p.$setUIWidth = function (val) {
                //    var p = this.$UIComponent;
                //    if (p[8] == val) {
                //        return;
                //    }
                //    p[8] = val;
                //    this.$invalidatePosition();
                //}
                //
                //p.$setUIHeight = function (val) {
                //    var p = this.$UIComponent;
                //    if (p[9] == val) {
                //        return;
                //    }
                //    p[9] = val;
                //    this.$invalidatePosition();
                //}

                /**
                 * 验证 UI 属性
                 */
                p.$validateUIComponent = function () {
                    this.$removeFlags(0x1000);
                    //开始验证属性
                    //console.log("验证 ui 属性");
                    var p = this.$UIComponent;
                    if (p[0] != null && p[1] == null && p[2] != null) {
                        this.width = (p[2] - p[0]) * 2;
                        this.x = p[0];
                    } else if (p[0] == null && p[1] != null && p[2] != null) {
                        this.width = (p[1] - p[2]) * 2;
                        this.x = 2 * p[2] - p[1];
                    } else if (p[0] != null && p[1] != null) {
                        this.width = this.parent.width - p[1] - p[0];
                        this.x = p[0];
                    } else {
                        if (p[0] != null) {
                            this.x = p[0];
                        }
                        if (p[1] != null) {
                            this.x = this.width - p[1] - this.width;
                        }
                        if (p[6]) {
                            this.width = this.parent.width * p[6] / 100;
                        }
                    }
                    if (p[3] != null && p[4] == null && p[5] != null) {
                        this.height = (p[5] - p[3]) * 2;
                        this.y = p[3];
                    } else if (p[3] == null && p[4] != null && p[5] != null) {
                        this.height = (p[4] - p[5]) * 2;
                        this.y = 2 * p[5] - p[4];
                    } else if (p[3] != null && p[4] != null) {
                        this.height = this.parent.height - p[4] - p[3];
                        this.y = p[3];
                    } else {
                        if (p[2] != null) {
                            this.y = p[0];
                        }
                        if (p[3] != null) {
                            this.y = this.height - p[1] - this.height;
                        }
                        if (p[7]) {
                            this.height = this.parent.height * p[7] / 100;
                        }
                    }
                    var children = this.__children;
                    if (children) {
                        var child;
                        for (var i = 0, len = children.length; i < len; i++) {
                            child = children[i];
                            if (child.__UIComponent) {
                                child.$validateUIComponent();
                            }
                        }
                    }
                };

                p.$onFrameEnd = function () {
                    if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                        this.$validateUIComponent();
                    }
                    $root._get(Object.getPrototypeOf(p), "$onFrameEnd", this).call(this);
                };

                Object.defineProperty(p, "left", {
                    get: function get() {
                        return this.$UIComponent[0];
                    },
                    set: function set(val) {
                        this.$setLeft(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "right", {
                    get: function get() {
                        return this.$UIComponent[1];
                    },
                    set: function set(val) {
                        this.$setRight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "horizontalCenter", {
                    get: function get() {
                        return this.$UIComponent[2];
                    },
                    set: function set(val) {
                        this.$setHorizontalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "top", {
                    get: function get() {
                        return this.$UIComponent[3];
                    },
                    set: function set(val) {
                        this.$setTop(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "bottom", {
                    get: function get() {
                        return this.$UIComponent[4];
                    },
                    set: function set(val) {
                        this.$setBottom(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "verticalCenter", {
                    get: function get() {
                        return this.$UIComponent[5];
                    },
                    set: function set(val) {
                        this.$setVerticalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentWidth", {
                    get: function get() {
                        return this.$UIComponent[6];
                    },
                    set: function set(val) {
                        this.$setPercentWidth(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentHeight", {
                    get: function get() {
                        return this.$UIComponent[7];
                    },
                    set: function set(val) {
                        this.$setPercentHeight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }]);

        return UIComponent;
    }();
    //////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////

    //////////////////////////File:extension/black/Group.js///////////////////////////


    var Group = function (_flower$Sprite) {
        _inherits(Group, _flower$Sprite);

        function Group() {
            _classCallCheck(this, Group);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this));

            _this.$initUIComponent();
            return _this;
        }

        return Group;
    }(flower.Sprite);

    UIComponent.register(Group);
    Group.prototype.__UIComponent = true;
    black.Group = Group;
    //////////////////////////End File:extension/black/Group.js///////////////////////////

    //////////////////////////File:extension/black/DataGroup.js///////////////////////////

    var DataGroup = function (_black$Group) {
        _inherits(DataGroup, _black$Group);

        function DataGroup() {
            _classCallCheck(this, DataGroup);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(DataGroup).call(this));
        }

        return DataGroup;
    }(black.Group);

    black.DataGroup = DataGroup;
    //////////////////////////End File:extension/black/DataGroup.js///////////////////////////

    //////////////////////////File:extension/black/core/UIParser.js///////////////////////////

    var UIParser = function (_Group) {
        _inherits(UIParser, _Group);

        function UIParser() {
            _classCallCheck(this, UIParser);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(UIParser).call(this));

            _this3.classes = flower.UIParser.classes;
            return _this3;
        }

        _createClass(UIParser, [{
            key: "parseUIAsync",
            value: function parseUIAsync(url) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this.loadData = data;
                var loader = new flower.URLLoader(url);
                loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
                loader.addListener(flower.Event.ERROR, this.loadContentError, this);
                this.parseUIAsyncFlag = true;
            }
        }, {
            key: "parseAsync",
            value: function parseAsync(url) {
                var loader = new flower.URLLoader(url);
                loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
                loader.addListener(flower.Event.ERROR, this.loadContentError, this);
                this.parseUIAsyncFlag = false;
            }
        }, {
            key: "loadContentError",
            value: function loadContentError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatchWidth(Event.ERROR, getLanguage(3001, e.currentTarget.url));
                } else {
                    sys.$error(3001, e.currentTarget.url);
                }
            }
        }, {
            key: "loadContentComplete",
            value: function loadContentComplete(e) {
                this.relationUI = [];
                var xml = flower.XMLElement.parse(e.data);
                this.loadContent = xml;
                var list = xml.getAllElements();
                for (var i = 0; i < list.length; i++) {
                    var name = list[i].name;
                    var nameSpace = name.split(":")[0];
                    name = name.split(":")[1];
                    if (nameSpace == "local") {
                        if (!this.classes.local[name] && !this.classes.localContent[name]) {
                            if (!this.classes.localURL[name]) {
                                sys.$error(3002, name);
                                return;
                            }
                            var find = false;
                            for (var f = 0; f < this.relationUI.length; f++) {
                                if (this.relationUI[f] == this.classes.localURL[name]) {
                                    find = true;
                                    break;
                                }
                            }
                            if (!find) {
                                this.relationUI.push(this.classes.localURL[name]);
                            }
                        }
                    }
                }
                this.relationIndex = 0;
                this.loadNextRelationUI();
            }
        }, {
            key: "loadNextRelationUI",
            value: function loadNextRelationUI() {
                var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                if (e) {
                    this.relationIndex++;
                }
                if (this.relationIndex >= this.relationUI.length) {
                    if (this.parseUIAsyncFlag) {
                        this.dispatchWidth(Event.COMPLETE, this.parseUI(this.loadContent, this.loadData));
                    } else {
                        this.dispatchWidth(Event.COMPLETE, this.parse(this.loadContent));
                    }
                } else {
                    var parser = new UIParser();
                    parser.parseAsync(this.relationUI[this.relationIndex]);
                    parser.addListener(flower.Event.COMPLETE, this.loadNextRelationUI, this);
                    parser.addListener(Event.ERROR, this.relationLoadError, this);
                }
            }
        }, {
            key: "relationLoadError",
            value: function relationLoadError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatchWidth(Event.ERROR, e.data);
                } else {
                    $error(e.data);
                }
            }
        }, {
            key: "parseUI",
            value: function parseUI(content) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var className = this.parse(content);
                var UIClass = this.classes.local[className];
                if (data) {
                    return new UIClass(data);
                }
                var ui = new UIClass();
                this.addChild(ui);
                return ui;
            }
        }, {
            key: "parse",
            value: function parse(content) {
                this.parseContent = content;
                var xml;
                if (typeof content == "string") {
                    xml = flower.XMLElement.parse(content);
                } else {
                    xml = content;
                }
                if (xml.getNameSapce("f") == null || xml.getNameSapce("f").value != "flower") {
                    sys.$error(3006, content);
                    return null;
                }
                this.rootXML = xml;
                var className = this.decodeRootComponent(xml, content);
                this.parseContent = "";
                this._className = className;
                this.rootXML = null;
                return className;
            }
        }, {
            key: "decodeRootComponent",
            value: function decodeRootComponent(xml, classContent) {
                var content = "";
                var hasLocalNS = xml.getNameSapce("local") ? true : false;
                var uiname = xml.name;
                var uinameNS = uiname.split(":")[0];
                var extendClass = "";
                uiname = uiname.split(":")[1];
                var className = "";
                var allClassName = "";
                var packages = [];
                if (uinameNS == "local") {
                    extendClass = uiname;
                } else {
                    extendClass = this.classes[uinameNS][uiname];
                    if (!extendClass && this.classes.localContent[extendClass]) {
                        this.parse(this.classes.localContent[extendClass]);
                    }
                }
                var classAtr = xml.getAttribute("class");
                if (classAtr) {
                    className = classAtr.value;
                    allClassName = className;
                    packages = className.split(".");
                    if (packages.length > 1) {
                        className = packages[packages.length - 1];
                        packages.pop();
                    } else {
                        packages = [];
                    }
                } else {
                    className = "$UI" + UIParser.id++;
                    allClassName = className;
                }
                var changeAllClassName = allClassName;
                if (this.classes.local[allClassName]) {
                    if (this.classes.localContent[allClassName] == classContent) {
                        return allClassName;
                    } else {
                        changeAllClassName = changeAllClassName.slice(0, changeAllClassName.length - className.length);
                        className = "$UI" + UIParser.id++;
                        changeAllClassName += className;
                    }
                }
                var before = "";
                for (var i = 0; i < packages.length; i++) {
                    content += before + "var " + packages[i] + ";\n";
                    content += before + "(function (" + packages[i] + ") {\n";
                    before += "\t";
                }
                content += before + "var " + className + " = (function (_super) {\n";
                content += before + "\t__extends(" + className + ", _super);\n";
                content += before + "\tfunction " + className + "(_data) {\n";
                content += before + "\t\tif(_data) this._data = _data;\n";
                content += before + "\t\t _super.call(this);\n";
                var scriptInfo = {
                    content: ""
                };
                this.hasInitFunction = false;
                content += this.decodeScripts(before, className, xml.getElements("f:script"), scriptInfo);
                content += before + "\t\tthis." + className + "_initMain(this);\n";
                var propertyList = [];
                this.decodeObject(before + "\t", className, className + "_initMain", false, xml, hasLocalNS, propertyList, {});
                if (this.hasInitFunction) {
                    content += before + "\t\tthis." + className + "_init();\n";
                }
                content += before + "\t}\n\n";
                content += propertyList[propertyList.length - 1];
                for (var i = 0; i < propertyList.length - 1; i++) {
                    content += propertyList[i];
                }
                content += scriptInfo.content;
                content += before + "\treturn " + className + ";\n";
                if (uinameNS == "f") {
                    content += before + "})(" + extendClass + ");\n";
                } else {
                    content += before + "})(flower.UIParser.getLocalUIClass(\"" + extendClass + "\"));\n";
                }
                before = "";
                var classEnd = "";
                for (var i = 0; i < packages.length; i++) {
                    if (i == 0) {
                        classEnd = before + "})(" + packages[i] + " || (" + packages[i] + " = {}));\n" + classEnd;
                    } else {
                        classEnd = before + "})(" + packages[i] + " = " + packages[i - 1] + "." + packages[i] + " || (" + packages[i - 1] + "." + packages[i] + " = {}));\n" + classEnd;
                    }
                    before += "\t";
                    if (i == packages.length - 1) {
                        classEnd = before + packages[i] + "." + className + " = " + className + ";\n" + classEnd;
                    }
                }
                content += classEnd;
                content += "\n\nUIParser.registerLocalUIClass(\"" + allClassName + "\", " + changeAllClassName + ");\n";
                //trace("解析后内容:\n", content);
                if (sys.DEBUG) {
                    try {
                        eval(content);
                    } catch (e) {
                        sys.$error(3003, e, this.parseContent, content);
                    }
                } else {
                    eval(content);
                }
                flower.UIParser.setLocalUIClassContent(allClassName, classContent);
                trace("解析类:\n", content);
                return allClassName;
            }
        }, {
            key: "decodeScripts",
            value: function decodeScripts(before, className, scripts, script) {
                var content = "";
                for (var i = 0; i < scripts.length; i++) {
                    for (var s = 0; s < scripts[i].list.length; s++) {
                        var item = scripts[i].list[s];
                        var childName = item.name;
                        childName = childName.split(":")[1];
                        if (item.list.length && item.getElement("f:set") || item.getElement("f:get")) {
                            var setFunction = item.getElement("f:set");
                            var getFunction = item.getElement("f:get");
                            script.content += before + "\tObject.defineProperty(" + className + ".prototype, \"" + childName + "\", {\n";
                            if (getFunction) {
                                script.content += "\t\tget: function () {\n";
                                script.content += "\t\t\t" + getFunction.value + "\n";
                                script.content += "\t\t},\n";
                            }
                            if (setFunction) {
                                script.content += "\t\tset: function (val) {\n";
                                script.content += "\t\t\t" + setFunction.value + "\n";
                                script.content += "\t\t},\n";
                            }
                            script.content += "\t\tenumerable: true,\n";
                            script.content += "\t\tconfigurable: true\n";
                            script.content += "\t\t});\n\n";
                        } else if (item.value == null || item.value == "") {
                            var initValue = item.getAttribute("init");
                            content += before + "\t\tthis." + childName + " = " + (initValue == null ? "null" : initValue.value) + ";\n";
                        } else {
                            if (childName == "init") {
                                childName = className + "_" + childName;
                                this.hasInitFunction = true;
                            }
                            script.content += before + "\t" + className + ".prototype." + childName + " = function(";
                            var params = item.getAttribute("params");
                            if (params) {
                                script.content += params.value;
                            }
                            script.content += ") {\n";
                            script.content += "\t\t" + item.value;
                            script.content += "\t}\n\n";
                        }
                    }
                }
                return content;
            }
        }, {
            key: "decodeObject",
            value: function decodeObject(before, className, funcName, createClass, xml, hasLocalNS, propertyFunc, nameIndex) {
                var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
                var thisObj = "parentObject";
                var createClassName;
                if (createClass) {
                    var createClassNameSpace = xml.name.split(":")[0];
                    createClassName = xml.name.split(":")[1];
                    if (createClassNameSpace == "local" && createClassName == "Object") {
                        thisObj = "object";
                        setObject += before + "\t" + thisObj + " = {};\n";
                    } else {
                        if (createClassNameSpace != "local") {
                            createClassName = this.classes[createClassNameSpace][createClassName];
                        }
                        thisObj = createClassName.split(".")[createClassName.split(".").length - 1];
                        thisObj = thisObj.toLocaleLowerCase();
                        if (createClassNameSpace == "local") {
                            setObject += before + "\tvar " + thisObj + " = new (flower.UIParser.getLocalUIClass(\"" + createClassName + "\"))();\n";
                        } else {
                            setObject += before + "\tvar " + thisObj + " = new " + createClassName + "();\n";
                        }
                        setObject += before + "\tif(" + thisObj + ".__UIComponent) " + thisObj + ".eventThis = this;\n";
                    }
                }
                var idAtr = xml.getAttribute("id");
                if (idAtr) {
                    setObject += before + "\tthis." + idAtr.value + " = " + thisObj + ";\n";
                    setObject += before + "\tthis." + idAtr.value + ".name = \"" + idAtr.value + "\";\n";
                }
                for (var i = 0; i < xml.attributes.length; i++) {
                    var atrName = xml.attributes[i].name;
                    var atrValue = xml.attributes[i].value;
                    var atrArray = atrName.split(".");
                    if (atrName == "class") {} else if (atrName == "id") {} else if (atrName == "scale9Grid") {
                        setObject += before + "\t" + thisObj + "." + atrName + " = new flower.Rectangle(" + atrValue + ");\n";
                    } else if (atrArray.length == 2) {
                        var atrState = atrArray[1];
                        atrName = atrArray[0];
                        setObject += before + "\t" + thisObj + ".setStatePropertyValue(\"" + atrName + "\", \"" + atrState + "\", \"" + atrValue + "\", [this]);\n";
                    } else if (atrArray.length == 1) {
                        if (atrValue.indexOf("{") >= 0 && atrValue.indexOf("}") >= 0) {
                            setObject += before + "\t" + thisObj + ".bindProperty(\"" + atrName + "\", \"" + atrValue + "\", [this]);\n";
                        } else {
                            setObject += before + "\t" + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                        }
                    }
                }
                if (xml.list.length) {
                    var itemClassName;
                    for (i = 0; i < xml.list.length; i++) {
                        var item = xml.list[i];
                        var childName = item.name;
                        var childNameNS = childName.split(":")[0];
                        childName = childName.split(":")[1];
                        var childClass = null;
                        if (childNameNS == "f" && childName == "script") {
                            continue;
                        } else if (item.value != null && item.value != "") {
                            //属性
                            setObject += before + "\t" + thisObj + "." + childName + " = \"" + flower.StringDo.changeStringToInner(item.value) + "\";\n";
                            continue;
                        } else if (childNameNS == "local") {
                            if (!hasLocalNS) {
                                $warn(3004, childNameNS, this.parseContent);
                            }
                            if (this.classes.local[childName]) {
                                childClass = childName;
                            } else {
                                if (this.classes.localContent[childName]) {
                                    this.parse(this.classes.localContent[childName]);
                                    childClass = this.classes.local[childName];
                                } else {
                                    $warn(3005, childName, this.parseContent);
                                }
                            }
                        } else {
                            if (this.classes[childNameNS]) {
                                childClass = this.classes[childNameNS][childName];
                            } else {
                                $warn(3004, childNameNS, this.parseContent);
                            }
                        }
                        if (childClass == null) {
                            item = item.list[0];
                        }
                        itemClassName = item.name.split(":")[1];
                        if (!nameIndex[itemClassName]) {
                            nameIndex[itemClassName] = 1;
                        } else {
                            nameIndex[itemClassName]++;
                            itemClassName += nameIndex[itemClassName];
                        }
                        if (childClass == null) {
                            if (childName == "itemRenderer") {
                                for (var n = 0; n < this.rootXML.namesapces.length; n++) {
                                    item.addNameSpace(this.rootXML.namesapces[n]);
                                }
                                setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + new UIParser().parse(item) + "\");\n";
                            } else {
                                funcName = className + "_get" + itemClassName;
                                setObject += before + "\t" + thisObj + "." + childName + " = this." + funcName + "(" + thisObj + ");\n";
                                this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                            }
                        } else {
                            funcName = className + "_get" + itemClassName;
                            setObject += before + "\t" + thisObj + "." + (UIParser.classes.addChild[createClassName] ? UIParser.classes.addChild[createClassName] : "addChild") + "(this." + funcName + "(" + thisObj + "));\n";
                            this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                        }
                    }
                }
                if (createClass) {
                    setObject += before + "\treturn " + thisObj + ";\n";
                }
                setObject += before + "}\n\n";
                propertyFunc.push(setObject);
            }
        }, {
            key: "isNumberOrBoolean",
            value: function isNumberOrBoolean(str) {
                if (str == "true" || str == "false") {
                    return true;
                }
                if (str.length > 3 && (str.slice(0, 2) == "0x" || str.slice(0, 2) == "0X")) {
                    for (var i = 2; i < str.length; i++) {
                        var code = str.charCodeAt(i);
                        if (code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102) {} else {
                            return false;
                        }
                    }
                } else {
                    for (var i = 0; i < str.length; i++) {
                        var code = str.charCodeAt(i);
                        if (code >= 48 && code <= 57) {} else {
                            return false;
                        }
                    }
                }
                return true;
            }
        }, {
            key: "className",
            get: function get() {
                return this._className;
            }
        }], [{
            key: "registerLocalUIClass",
            value: function registerLocalUIClass(name, cls) {
                flower.UIParser.classes.local[name] = cls;
            }
        }, {
            key: "setLocalUIClassContent",
            value: function setLocalUIClassContent(name, content) {
                flower.UIParser.classes.localContent[name] = content;
            }
        }, {
            key: "getLocalUIClassContent",
            value: function getLocalUIClassContent(name) {
                return flower.UIParser.classes.localContent[name];
            }
        }, {
            key: "getLocalUIClass",
            value: function getLocalUIClass(name) {
                return this.classes.local[name];
            }
        }, {
            key: "setLocalUIURL",
            value: function setLocalUIURL(name, url) {
                this.classes.localURL[name] = url;
            }
        }]);

        return UIParser;
    }(Group);

    UIParser.classes = {
        f: {
            "Object": "Object",
            "Array": "Array",
            "Point": "flower.Point",
            "Size": "flower.Size",
            "Rectangle": "flower.Rectangle",
            "ColorFilter": "flower.ColorFilter",
            "TextField": "flower.TextField",
            "TextInput": "flower.TextInput",
            "Bitmap": "flower.Bitmap",
            "Shape": "flower.Shape",
            "Mask": "flower.Mask",
            "Label": "flower.Label",
            "Image": "flower.Image",
            "Group": "flower.Group",
            "Button": "flower.Button",
            "RectUI": "flower.RectUI",
            "MaskUI": "flower.MaskUI",
            "Scroller": "flower.Scroller",
            "DataGroup": "flower.DataGroup",
            "ItemRenderer": "flower.ItemRenderer",
            "ToggleButton": "flower.ToggleButton",
            "ToggleSwitch": "flower.ToggleSwitch",
            "CheckBox": "flower.CheckBox",
            "RadioButton": "flower.RadioButton",
            "RadioButtonGroup": "flower.RadioButtonGroup",
            "ListBase": "flower.ListBase",
            "List": "flower.List",
            "TabBar": "flower.TabBar",
            "ViewStack": "flower.ViewStack",
            "LinearLayoutBase": "flower.LinearLayoutBase",
            "HorizontalLayout": "flower.HorizontalLayout",
            "VerticalLayout": "flower.VerticalLayout"
        },
        local: {},
        localContent: {},
        localURL: {},
        addChild: {
            "Array": "push"
        }
    };


    black.UIParser = UIParser;
    //////////////////////////End File:extension/black/core/UIParser.js///////////////////////////

    //////////////////////////File:extension/black/Image.js///////////////////////////

    var Image = function (_flower$Bitmap) {
        _inherits(Image, _flower$Bitmap);

        function Image() {
            var source = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, Image);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this));

            _this4.$initUIComponent();
            _this4.source = source;
            return _this4;
        }

        _createClass(Image, [{
            key: "$setSource",
            value: function $setSource(val) {
                if (this.__source == val) {
                    return;
                }
                this.__source = val;
                if (val == null) {
                    this.texture = null;
                } else if (val instanceof flower.Texture) {
                    this.texture = val;
                } else {
                    if (this.__loader) {
                        this.__loader.dispose();
                    }
                    this.__loader = new flower.URLLoader(val);
                    this.__loader.load();
                    this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
                    this.__loader.addListener(flower.IOErrorEvent.ERROR, this.__onLoadError, this);
                }
            }
        }, {
            key: "__onLoadError",
            value: function __onLoadError(e) {
                this.__loader = null;
            }
        }, {
            key: "__onLoadComplete",
            value: function __onLoadComplete(e) {
                this.__loader = null;
                this.texture = e.data;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.__loader) {
                    this.__loader.dispose();
                }
                _get(Object.getPrototypeOf(Image.prototype), "dispose", this).call(this);
            }
        }, {
            key: "source",
            get: function get() {
                return this.__source;
            },
            set: function set(val) {
                this.$setSource(val);
            }
        }]);

        return Image;
    }(flower.Bitmap);

    UIComponent.register(Image);
    Image.prototype.__UIComponent = true;
    black.Image = Image;
    //////////////////////////End File:extension/black/Image.js///////////////////////////

    //////////////////////////File:extension/black/TileImage.js///////////////////////////

    var TileImage = function (_Group2) {
        _inherits(TileImage, _Group2);

        function TileImage() {
            _classCallCheck(this, TileImage);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(TileImage).call(this));
        }

        _createClass(TileImage, [{
            key: "$setSource",
            value: function $setSource() {}
        }]);

        return TileImage;
    }(Group);

    //////////////////////////End File:extension/black/TileImage.js///////////////////////////
})();
for (var key in black) {
    flower[key] = black[key];
}