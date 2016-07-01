var black = {};
var $root = eval("this");
(function(){
//////////////////////////File:extension/black/core/Black.js///////////////////////////
var sys = {};
for (var key in flower.sys) {
    sys[key] = flower.sys[key];
}
//////////////////////////End File:extension/black/core/Black.js///////////////////////////



//////////////////////////File:extension/black/core/UIComponent.js///////////////////////////
class UIComponent {
    static register(clazz) {
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
                9: null, //uiHeight
                10: {}, //binds
                11: new StringValue(),//state
                12: false, //absoluteState
                13: this, //eventThis
            };
            this.addUIComponentEvents();
        }

        p.addUIComponentEvents = function () {
            this.addListener(flower.Event.ADDED_TO_STAGE, this.onEXEAdded, this);
        }

        p.addChildAt = function (child, index) {
            $root._get(Object.getPrototypeOf(p), "addChildAt", this).call(this, child, index);
            if (child.parent == this && child.__UIComponent && !child.absoluteState) {
                child.currentState = this.currentState;
            }
        }

        p.bindProperty = function (property, content, checks = null) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
            }
            binds[property] = new flower.Binding(this, checks, property, content);
        }

        p.removeBindProperty = function (property) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
                delete binds[property];
            }
        }

        p.removeAllBindProperty = function() {
            var binds = this.$UIComponent[10];
            for (var key in binds) {
                binds[key].dispose();
                delete binds[key];
            }
        }

        p.setStatePropertyValue = function (property, state, val, checks = null) {
            if (!this._propertyValues) {
                this._propertyValues = {};
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this.bindProperty("currentState", "{this.changeState(this.state)}");
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            else {
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            if (state == this.currentState) {
                this.removeBindProperty(property);
                this.bindProperty(property, val);
            }
        }

        p.changeState = function (state) {
            if (!this._propertyValues) {
                return this.currentState;
            }
            for (var property in this._propertyValues) {
                if (this._propertyValues[property][state]) {
                    this.removeBindProperty(property);
                    this.bindProperty(property, this._propertyValues[property][state].value, this._propertyValues[property][state].checks);
                }
            }
            return this.currentState;
        }

        p.onEXEAdded = function (e) {
            if (this.onAddedEXE && e.target == this) {
                this.onAddedEXE.call(this);
            }
        }

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

        p.$setLeft = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[0] == val) {
                return false;
            }
            p[0] = val;
            this.$invalidateContentBounds();
        }

        p.$setRight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[1] == val) {
                return false;
            }
            p[1] = val;
            this.$invalidateContentBounds();
        }

        p.$setHorizontalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[2] == val) {
                return false;
            }
            p[2] = val;
            this.$invalidateContentBounds();
        }

        p.$setTop = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[3] == val) {
                return false;
            }
            p[3] = val;
            this.$invalidateContentBounds();
        }

        p.$setBottom = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[4] == val) {
                return false;
            }
            p[4] = val;
            this.$invalidateContentBounds();
        }

        p.$setVerticalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[5] == val) {
                return false;
            }
            p[5] = val;
            this.$invalidateContentBounds();
        }

        p.$setPercentWidth = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[6] == val) {
                return false;
            }
            p[6] = val;
            this.$invalidateContentBounds();
        }

        p.$setPercentHeight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[7] == val) {
                return false;
            }
            p[7] = val;
            this.$invalidateContentBounds();
        }

        p.$addFlags = function (flags) {
            if (flags & 0x0001 == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                this.__flags |= 0x1000;
            }
            this.__flags |= flags;
        }

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
            if (p[0] != null && p[1] == null && p [2] != null) {
                this.width = (p[2] - p[0]) * 2;
                this.x = p[0];
            }
            else if (p[0] == null && p[1] != null && p[2] != null) {
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
            if (p[3] != null && p[4] == null && p [5] != null) {
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
        }

        p.$onFrameEnd = function () {
            if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                this.$validateUIComponent();
            }
            $root._get(Object.getPrototypeOf(p), "$onFrameEnd", this).call(this);
        }

        Object.defineProperty(p, "left", {
            get: function () {
                return this.$UIComponent[0];
            },
            set: function (val) {
                this.$setLeft(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "right", {
            get: function () {
                return this.$UIComponent[1];
            },
            set: function (val) {
                this.$setRight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "horizontalCenter", {
            get: function () {
                return this.$UIComponent[2];
            },
            set: function (val) {
                this.$setHorizontalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "top", {
            get: function () {
                return this.$UIComponent[3];
            },
            set: function (val) {
                this.$setTop(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "bottom", {
            get: function () {
                return this.$UIComponent[4];
            },
            set: function (val) {
                this.$setBottom(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "verticalCenter", {
            get: function () {
                return this.$UIComponent[5];
            },
            set: function (val) {
                this.$setVerticalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "percentWidth", {
            get: function () {
                return this.$UIComponent[6];
            },
            set: function (val) {
                this.$setPercentWidth(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "percentHeight", {
            get: function () {
                return this.$UIComponent[7];
            },
            set: function (val) {
                this.$setPercentHeight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "currentState", {
            get: function () {
                return this.state.value;
            },
            set: function (val) {
                if (this instanceof flower.Sprite) {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                    for (var i = 0; i < this.numChildren; i++) {
                        var child = this.getChildAt(i);
                        if (child.__UIComponent) {
                            if (!child.absoluteState) {
                                child.currentState = val;
                            }
                        }
                    }
                } else {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "state", {
            get: function () {
                return this.$UIComponent[11];
            },
            set: function (val) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "absoluteState", {
            get: function () {
                return this.$UIComponent[12];
            },
            set: function (val) {
                this.$UIComponent[12] = !!val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "eventThis", {
            get: function () {
                return this.$UIComponent[13];
            },
            set: function (val) {
                this.$UIComponent[13] = val || this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "onAddedToStage", {
            get: function () {
                return this.onAddedEXE;
            },
            set: function (val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onAddedEXE = val;
            },
            enumerable: true,
            configurable: true
        });
    }
}
//////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////



//////////////////////////File:extension/black/Group.js///////////////////////////
class Group extends flower.Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}
UIComponent.register(Group);
Group.prototype.__UIComponent = true;
black.Group = Group;
this.removeAllBindProperty();
//////////////////////////End File:extension/black/Group.js///////////////////////////



//////////////////////////File:extension/black/DataGroup.js///////////////////////////
class DataGroup extends black.Group {
    constructor() {
        super();
    }
}

black.DataGroup = DataGroup;
//////////////////////////End File:extension/black/DataGroup.js///////////////////////////



//////////////////////////File:extension/black/core/UIParser.js///////////////////////////
class UIParser extends Group {
    static classes = {
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

            "ArrayValue": "flower.ArrayValue",
            "BooleanValue": "flower.BooleanValue",
            "IntValue": "flower.IntValue",
            "NumberValue": "flower.NumberValue",
            "ObjectValue": "flower.ObjectValue",
            "StringValue": "flower.StringValue",
            "UIntValue": "flower.UIntValue",

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
            "Array": "push",
            "ArrayValue": "push"
        }
    };

    _className;
    classes;
    parseContent;
    parseUIAsyncFlag;
    loadContent;
    loadData;
    rootXML;
    hasInitFunction;

    constructor() {
        super();
        this.classes = flower.UIParser.classes;
    }

    parseUIAsync(url, data = null) {
        this.loadData = data;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        this.parseUIAsyncFlag = true;
    }

    parseAsync(url) {
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        this.parseUIAsyncFlag = false;
    }

    loadContentError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatchWidth(Event.ERROR, getLanguage(3001, e.currentTarget.url));
        } else {
            sys.$error(3001, e.currentTarget.url);
        }
    }

    loadContentComplete(e) {
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

    relationUI;
    relationIndex;

    loadNextRelationUI(e = null) {
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

    relationLoadError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatchWidth(Event.ERROR, e.data);
        } else {
            $error(e.data);
        }
    }

    parseUI(content, data = null) {
        var className = this.parse(content);
        var UIClass = this.classes.local[className];
        if (data) {
            return new UIClass(data);
        }
        var ui = new UIClass();
        this.addChild(ui);
        return ui;
    }

    parse(content) {
        this.parseContent = content;
        var xml;
        if (typeof(content) == "string") {
            xml = flower.XMLElement.parse(content);
        }
        else {
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

    get className() {
        return this._className;
    }

    decodeRootComponent(xml, classContent) {
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
            allClassName = className
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

    decodeScripts(before, className, scripts, script) {
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
                        script.content += "\t\tget: function () {\n"
                        script.content += "\t\t\t" + getFunction.value + "\n";
                        script.content += "\t\t},\n";
                    }
                    if (setFunction) {
                        script.content += "\t\tset: function (val) {\n";
                        script.content += "\t\t\t" + setFunction.value + "\n";
                        script.content += "\t\t},\n";
                    }
                    script.content += "\t\tenumerable: true,\n"
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

    decodeObject(before, className, funcName, createClass, xml, hasLocalNS, propertyFunc, nameIndex) {
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
            if (atrName == "class") {
            } else if (atrName == "id") {
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
                } else if (item.value != null && item.value != "") { //属性
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
                        setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + (new UIParser()).parse(item) + "\");\n";
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

    isNumberOrBoolean(str) {
        if (str == "true" || str == "false") {
            return true;
        }
        if (str.length > 3 && ( str.slice(0, 2) == "0x" || str.slice(0, 2) == "0X")) {
            for (var i = 2; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102) {
                }
                else {
                    return false;
                }
            }
        }
        else {
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57) {
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    static registerLocalUIClass(name, cls) {
        flower.UIParser.classes.local[name] = cls;
    }

    static setLocalUIClassContent(name, content) {
        flower.UIParser.classes.localContent[name] = content;
    }

    static getLocalUIClassContent(name) {
        return flower.UIParser.classes.localContent[name];
    }

    static getLocalUIClass(name) {
        return this.classes.local[name];
    }

    static setLocalUIURL(name, url) {
        this.classes.localURL[name] = url;
    }
}

black.UIParser = UIParser;
//////////////////////////End File:extension/black/core/UIParser.js///////////////////////////



//////////////////////////File:extension/black/Image.js///////////////////////////
class Image extends flower.Bitmap {

    $UIComponent;
    __source;
    __loader;

    constructor(source = null) {
        super();
        this.$initUIComponent();
        this.source = source;
    }

    $setSource(val) {
        if (this.__source == val) {
            return;
        }
        this.__source = val;
        if (val == null) {
            this.texture = null;
        }
        else if (val instanceof flower.Texture) {
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

    __onLoadError(e) {
        this.__loader = null;
    }

    __onLoadComplete(e) {
        this.__loader = null;
        this.texture = e.data;
    }

    dispose() {
        if (this.__loader) {
            this.__loader.dispose();
        }
        this.removeAllBindProperty();
        super.dispose();
    }

    get source() {
        return this.__source;
    }

    set source(val) {
        this.$setSource(val);
    }
}

UIComponent.register(Image);
Image.prototype.__UIComponent = true;
black.Image = Image;
//////////////////////////End File:extension/black/Image.js///////////////////////////



//////////////////////////File:extension/black/TileImage.js///////////////////////////
class TileImage extends Group {

    constructor() {
        super();
    }

    $setSource() {
        
    }
}

//////////////////////////End File:extension/black/TileImage.js///////////////////////////



//////////////////////////File:extension/black/Button.js///////////////////////////
class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouch, this);
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var target = super.$getMouseTarget(touchX, touchY, multiply);
        if (target) {
            target = this;
        }
        return target;
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                this.currentState = "down";
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                this.currentState = "up";
                break;
        }
    }

    __setEnabled(val) {
        val = !!val;
        if (this._enabled == val) {
            return false;
        }
        this._enabled = val;
        if (this._enabled) {
            this.currentState = "up";
        } else {
            this.currentState = "disabled";
        }
        return true;
    }

    set enabled(val) {
        this.__setEnabled(val);
    }

    get enabled() {
        return this._enabled;
    }

    addUIComponentEvents() {
        super.addUIComponentEvents();
        this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onEXEClick(e) {
        if (this.onClickEXE && e.target == this) {
            this.onClickEXE.call(this);
        }
    }
}

black.Button = Button;
//////////////////////////End File:extension/black/Button.js///////////////////////////



//////////////////////////File:extension/black/language/zh_CN.js///////////////////////////
var locale_strings = flower.sys.$locale_strings["zh_CN"];


locale_strings[3001] = "UIParse 异步加载资源出错:{0}";
locale_strings[3002] = "找不到 UI 对应的路径， UI 类名:{0}";
locale_strings[3003] = "解析 UI 出错,:\n{0}\n{1}\n\n解析后内容为:\n{2}";
locale_strings[3004] = "解析 UI 出错:无法解析的命名空间 {0} :\n{1}";
locale_strings[3005] = "解析 UI 出错:无法解析的类名 {0} :\n{1}";
locale_strings[3006] = "解析 UI 出错,未设置命名空间 xmlns:f=\"flower.ui\" :\n{0}";
locale_strings[3010] = "没有定义数据结构类名 :\n{0}";
locale_strings[3011] = "数据结构类定义解析出错 :{0}\n{1}";
locale_strings[3012] = "没有定义的数据结构 :{0}";
locale_strings[3013] = "没有找到要集成的数据结构类 :{0} ，数据结构定义为:\n{1}";
locale_strings[3100] = "没有定义的数据类型 :{0}";
locale_strings[3101] = "超出索引范围 :{0}，当前索引范围 0 ~ {1}";
//////////////////////////End File:extension/black/language/zh_CN.js///////////////////////////



//////////////////////////File:extension/black/data/member/Value.js///////////////////////////
class Value extends flower.EventDispatcher {

    __old = null;
    __value = null;

    $setValue(val) {
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
    }

    get value() {
        return this.__value;
    }

    set value(val) {
        this.$setValue(val);
    }

    get old() {
        return this.__old;
    }
}

black.Value = Value;
//////////////////////////End File:extension/black/data/member/Value.js///////////////////////////



//////////////////////////File:extension/black/data/member/ArrayValue.js///////////////////////////
/**
 *
 * @Event
 * Event.ADDED item
 * Event.REMOVED item
 * Event.UPDATE ArrayValue 所有更新都会触发，包括排序
 */
class ArrayValue extends Value {

    _length;
    list;
    _key = "";
    _rangeMinKey = "";
    _rangeMaxKey = "";

    constructor(init = null) {
        super();
        this.list = init || [];
        this._length = this.list.length;
    }

    push(item) {
        this.list.push(item);
        this._length = this._length + 1;
        this.dispatchWidth(flower.Event.ADDED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    addItemAt(item, index) {
        index = +index & ~0;
        if (index < 0 || index > this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        this.list.splice(index, 0, item);
        this._length = this._length + 1;
        this.dispatchWidth(flower.Event.ADDED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    shift() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.shift();
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    splice(startIndex, delCount = 0, ...args) {
        var i;
        startIndex = +startIndex & ~0;
        delCount = +delCount & ~0;
        if (delCount <= 0) {
            for (i = 0; i < args.length; i++) {
                this.list.splice(startIndex, 0, args[i]);
            }
            this._length = this._length + 1;
            for (i = 0; i < args.length; i++) {
                this.dispatchWidth(flower.Event.ADDED, args[i]);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
        else {
            var list = this.list.splice(startIndex, delCount);
            this._length = this._length - delCount;
            for (i = 0; i < list.length; i++) {
                this.dispatchWidth(flower.Event.REMOVED, list[i]);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }

    slice(startIndex, end) {
        startIndex = +startIndex & ~0;
        end = +end & ~0;
        return new ArrayValue(this.list.slice(startIndex, end));
    }

    pop() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.pop();
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    removeAll() {
        if (!this.list.length) {
            return;
        }
        while (this.list.length) {
            var item = this.list.pop();
            this._length = this._length - 1;
            this.dispatchWidth(flower.Event.REMOVED, item);
        }
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    removeItem(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                this.list.splice(i, 1);
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }
        return null;
    }

    removeItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        var item = this.list.splice(index, 1)[0];
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    removeItemWith(key, value, key2 = "", value2 = null) {
        var item;
        var i;
        if (key2 != "") {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    item = this.list.splice(i, 1)[0];
                    break;
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    item = this.list.splice(i, 1)[0];
                    break;
                }
            }
        }
        if (!item) {
            return;
        }
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    getItemIndex(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                return i;
            }
        }
        return -1;
    }

    getItemWith(key, value, key2 = null, value2 = null) {
        var i;
        if (!key2) {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    return this.list[i];
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    return this.list[i];
                }
            }
        }
        return null;
    }

    getItemFunction(func, thisObj, ...args) {
        for (var i = 0; i < this.list.length; i++) {
            args.push(this.list[i]);
            var r = func.apply(thisObj, args);
            args.pop();
            if (r == true) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemsWith(key, value, key2 = "", value2 = null) {
        var result = [];
        var i;
        if (key2 != "") {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    result.push(this.list[i]);
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    result.push(this.list[i]);
                }
            }
        }
        return result;
    }

    setItemsAttributeWith(findKey, findValue, setKey = "", setValue = null) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][findKey] == findValue) {
                this.list[i][setKey] = setValue;
            }
        }
    }

    getItemsFunction(func, thisObj = null) {
        var _arguments__ = [];
        for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
            _arguments__ = arguments[argumentsLength];
        }
        var result = [];
        var args = [];
        if (_arguments__.length && _arguments__.length > 2) {
            args = [];
            for (var a = 2; a < _arguments__.length; a++) {
                args.push(_arguments__[a]);
            }
        }
        for (var i = 0; i < this.list.length; i++) {
            args.push(this.list[i]);
            var r = func.apply(thisObj, args);
            args.pop();
            if (r == true) {
                result.push(this.list[i]);
            }
        }
        return result;
    }

    sort() {
        var _arguments__ = [];
        for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
            _arguments__ = arguments[argumentsLength];
        }
        this.list.sort.apply(this.list.sort, _arguments__);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    getItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        return this.list[index];
    }

    getItemByValue(value) {
        if (this.key == "") {
            return null;
        }
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][this.key] == value) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemByRange(value) {
        if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
            return null;
        }
        for (var i = 0; i < this.list.length; i++) {
            var min = this.list[i][this.rangeMinKey];
            var max = this.list[i][this.rangeMaxKey];
            if (value >= min && value <= max) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemsByRange(value) {
        if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
            return null;
        }
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            var min = this.list[i][this.rangeMinKey];
            var max = this.list[i][this.rangeMaxKey];
            if (value >= min && value <= max) {
                list.push(this.list[i]);
            }
        }
        return list;
    }

    set key(val) {
        this._key = val;
    }

    get key() {
        return this._key;
    }

    set rangeMinKey(val) {
        this._rangeMinKey = val;
    }

    get rangeMinKey() {
        return this._rangeMinKey;
    }

    set rangeMaxKey(val) {
        this._rangeMaxKey = val;
    }

    get rangeMaxKey() {
        return this._rangeMaxKey;
    }

    get length() {
        return this._length;
    }

    set length(val) {
        val = +val & ~0;
        if (this._length == val) {
        } else {
            while (this.list.length > val) {
                var item = this.list.pop();
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }
}
//////////////////////////End File:extension/black/data/member/ArrayValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/BooleanValue.js///////////////////////////
class BooleanValue extends Value {

    constructor(init = false) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = !!val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}
//////////////////////////End File:extension/black/data/member/BooleanValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/IntValue.js///////////////////////////
class IntValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}
//////////////////////////End File:extension/black/data/member/IntValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/NumberValue.js///////////////////////////
class NumberValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}
//////////////////////////End File:extension/black/data/member/NumberValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/ObjectValue.js///////////////////////////
class ObjectValue extends Value {

    constructor() {
        super();
        this.__old = this.__value = {};
    }

    update(...args) {
        var change = false;
        for (var i = 0; i < args.length;) {
            var name = args[i];
            if (i + 1 >= args.length) {
                break;
            }
            var value = args[i + 1];
            var obj = this[name];
            if (obj instanceof Value) {
                if (obj.value != value) {
                    obj.value = value;
                    change = true;
                }
            } else {
                if (obj != value) {
                    this[name] = value;
                    change = true;
                }
            }
            this[name] = value;
            i += 2;
        }
        if (change) {
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }

    addMember(name, value) {
        this[name] = value;
    }

    deleteMember(name) {
        delete this[name];
    }
}
//////////////////////////End File:extension/black/data/member/ObjectValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/StringValue.js///////////////////////////
class StringValue extends Value {

    constructor(init = "") {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = "" + val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}
//////////////////////////End File:extension/black/data/member/StringValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/UIntValue.js///////////////////////////
class UIntValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0;
        if (val < 0) {
            val = 0;
        }
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}
//////////////////////////End File:extension/black/data/member/UIntValue.js///////////////////////////



//////////////////////////File:extension/black/data/DataManager.js///////////////////////////
class DataManager {
    _defines = {};
    _root = {};

    constructor() {
        if (DataManager.instance) {
            return;
        }
    }

    addRootData(name, className) {
        this[name] = this.createData(className);
        this._root[name] = this[name];
    }

    addDefine(config) {
        var className = config.name;
        if (!className) {
            sys.$error(3010, flower.ObjectDo.toString(config));
            return;
        }
        if (!this._defines[className]) {
            this._defines[className] = {
                id: 0,
                className: "",
                define: null
            };
        }
        var item = this._defines[className];
        var defineClass = "Data_" + className + (item.id != 0 ? item.id : "");
        item.className = defineClass;
        var extendClassName = "ObjectValue";
        if (config.extends) {
            var extendsItem = this.getClass(config.extends);
            if (!extendsItem) {
                sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                return;
            }
            extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
        }
        var content = "var " + defineClass + " = (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "() {\n" +
            "\t\t_super.call(this);\n";
        var members = config.members;
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.type == "int") {
                    content += "\t\tthis." + key + " = new IntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "uint") {
                    content += "\t\tthis." + key + " = new UIntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "string") {
                    content += "\t\tthis." + key + " = new StringValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "boolean") {
                    content += "\t\tthis." + key + " = new BooleanValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "array") {
                    content += "\t\tthis." + key + " = new ArrayValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "*") {
                    content += "\t\tthis." + key + " = " + (member.init != null ? member.init : "null") + ";\n";
                } else {
                    content += "\t\tthis." + key + " = DataManager.getInstance().createData(" + member.type + ");\n";
                }
            }
        }
        content += "\t}\n" +
            "\treturn " + defineClass + ";\n" +
            "})(" + extendClassName + ");\n";
        content += "DataManager.getInstance().$addClassDefine(" + defineClass + ", \"" + className + "\");\n";
        console.log("数据结构:\n" + content);
        if (sys.DEBUG) {
            try {
                eval(content);
            } catch (e) {
                sys.$error(3011, e, content);
            }
        } else {
            eval(className);
        }
        item.id++;
    }

    $addClassDefine(clazz, className) {
        var item = this._defines[className];
        item.define = clazz;
    }

    getClass(className) {
        var item = this._defines[className];
        if (!item) {
            return null;
        }
        return item.define;
    }

    createData(className) {
        var item = this._defines[className];
        if (!item) {
            sys.$error(3012, className);
            return;
        }
        return new item.define();
    }

    clear() {
        for (var key in this._root) {
            delete this._root[key];
            delete this[key];
        }
        this._defines = {};
    }

    static instance = new DataManager();

    static getInstance() {
        return DataManager.instance;
    }
}

black.DataManager = DataManager;
//////////////////////////End File:extension/black/data/DataManager.js///////////////////////////



})();
for(var key in black) {
	flower[key] = black[key];
}
