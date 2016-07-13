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

            "ArrayValue": "ArrayValue",
            "BooleanValue": "flower.BooleanValue",
            "IntValue": "flower.IntValue",
            "NumberValue": "flower.NumberValue",
            "ObjectValue": "flower.ObjectValue",
            "StringValue": "flower.StringValue",
            "UIntValue": "flower.UIntValue",

            "Label": "flower.Label",
            "Input": "flower.Input",
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
            "Combox": "flower.Combox",
            "Panel": "flower.Panel",
            "Alert": "flower.Alert",
            "Tree": "flower.Tree",
            "LinearLayoutBase": "flower.LinearLayoutBase",
            "HorizontalLayout": "flower.HorizontalLayout",
            "VerticalLayout": "flower.VerticalLayout",

            "Direction": "flower.Direction",
            "File": "flower.File"
        },
        local: {},
        localContent: {},
        localURL: {},
        addChild: {
            "Array": "push",
            "ArrayValue": "push"
        },
        namesapces: {},
        defaultClassNames: {},
        packages: {
            "local": ""
        }
    };

    _className;
    _classNameSpace;
    defaultClassName = "";
    classes;
    parseContent;
    parseUIAsyncFlag;
    loadContent;
    loadData;
    rootXML;
    hasInitFunction;
    scriptURL;
    scriptContent;
    loadURL;
    localNameSpace = "local";

    constructor() {
        super();
        this.classes = flower.UIParser.classes;
        this.percentWidth = this.percentHeight = 100;
    }

    parseUIAsync(url, data = null) {
        if (this.classes.namesapces[url]) {
            this.localNameSpace = this.classes.namesapces[url];
        }
        if (this.classes.defaultClassNames[url]) {
            this.defaultClassName = this.classes.defaultClassNames[url];
        }
        this.loadURL = url;
        this.loadData = data;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        loader.load();
        this.parseUIAsyncFlag = true;
    }

    parseAsync(url) {
        if (this.classes.namesapces[url]) {
            this.localNameSpace = this.classes.namesapces[url];
        }
        if (this.classes.defaultClassNames[url]) {
            this.defaultClassName = this.classes.defaultClassNames[url];
        }
        this.loadURL = url;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        loader.load();
        this.parseUIAsyncFlag = false;
    }

    loadContentError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatchWidth(flower.Event.ERROR, getLanguage(3001, e.currentTarget.url));
        } else {
            sys.$error(3001, e.currentTarget.url);
        }
    }

    loadContentComplete(e) {
        this.relationUI = [];
        var xml = flower.XMLElement.parse(e.data);
        this.loadContent = xml;
        var list = xml.getAllElements();
        var scriptURL = "";
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var nameSpace = name.split(":")[0];
            name = name.split(":")[1];
            if (nameSpace != "f") {
                if (!this.classes[nameSpace][name] && !this.classes[nameSpace + "Content"][name]) {
                    if (!this.classes[nameSpace + "URL"][name]) {
                        sys.$error(3002, name);
                        return;
                    }
                    var find = false;
                    for (var f = 0; f < this.relationUI.length; f++) {
                        if (this.relationUI[f].url == this.classes[nameSpace + "URL"][name]) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        this.relationUI.push({
                            "namesapce": nameSpace,
                            "url": this.classes[nameSpace + "URL"][name],
                            "name": name
                        });
                    }
                }
            }
            if (nameSpace == "f" && name == "script" && list[i].getAttribute("src")) {
                scriptURL = list[i].getAttribute("src").value;
            }
        }
        this.relationIndex = 0;
        if (scriptURL != "") {
            if (scriptURL.slice(0, 2) == "./") {
                if (this.loadURL.split("/").length == 1) {
                    scriptURL = scriptURL.slice(2, scriptURL.length);
                } else {
                    scriptURL = this.loadURL.slice(0, this.loadURL.length - this.loadURL.split("/")[this.loadURL.split("/").length - 1].length) + scriptURL.slice(2, scriptURL.length);
                }
            }
            this.loadScript(scriptURL);
        } else {
            this.loadNextRelationUI();
        }
    }

    loadScript(url) {
        this.scriptURL = url;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadScriptComplete, this);
        loader.addListener(flower.IOErrorEvent.ERROR, this.loadContentError, this);
        loader.load();
    }

    loadScriptComplete(e) {
        this.scriptContent = e.data;
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
                var ui = this.parseUI(this.loadContent, this.loadData);
                this.dispatchWidth(flower.Event.COMPLETE, ui);
            } else {
                var data = this.parse(this.loadContent);
                this.dispatchWidth(flower.Event.COMPLETE, data);
            }
        } else {
            var parser = new UIParser();
            parser.defaultClassName = this.relationUI[this.relationIndex].name;
            parser.localNameSpace = this.relationUI[this.relationIndex].namesapce;
            parser.parseAsync(this.relationUI[this.relationIndex].url);
            parser.addListener(flower.Event.COMPLETE, this.loadNextRelationUI, this);
            parser.addListener(flower.ERROR, this.relationLoadError, this);
        }
    }

    relationLoadError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatchWidth(flower.Event.ERROR, e.data);
        } else {
            $error(e.data);
        }
    }

    parseUI(content, data = null) {
        this.parse(content);
        var className = this._className;
        var namesapce = this.localNameSpace;
        var UIClass = this.classes[namesapce][className];
        var ui;
        if (data) {
            ui = new UIClass(data);
        } else {
            ui = new UIClass();
        }
        if (!ui.parent) {
            this.addChild(ui);
        }
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
        var classInfo = this.decodeRootComponent(xml, content);
        var namesapce = classInfo.namesapce;
        var className = classInfo.className;
        this.parseContent = "";
        this._className = className;
        this._classNameSpace = classInfo.namesapce;
        this.rootXML = null;
        return classInfo.className;
    }

    get className() {
        return this._className;
    }

    get classDefine() {
        return this.classes[this._classNameSpace][this._className];
    }

    decodeRootComponent(xml, classContent) {
        var content = "";
        var namespacesList = xml.namesapces;
        var namespaces = {};
        for (var i = 0; i < namespacesList.length; i++) {
            namespaces[namespacesList[i]] = namespacesList[i].value;
        }
        //= xml.getNameSapce("local") ? true : false;
        var uiname = xml.name;
        var uinameNS = uiname.split(":")[0];
        var extendClass = "";
        uiname = uiname.split(":")[1];
        var className = "";
        var allClassName = "";
        var packages = [];
        if (uinameNS != "f") {
            extendClass = uiname;
        } else {
            extendClass = this.classes[uinameNS][uiname];
            if (!extendClass && this.classes[uinameNS + "Content"][extendClass]) {
                this.parse(this.classes[uinameNS + "Content"][extendClass]);
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
            if (this.defaultClassName && this.defaultClassName != "") {
                className = this.defaultClassName;
                allClassName = className
            } else {
                className = "$UI" + UIParser.id++;
                allClassName = className;
            }
        }
        var changeAllClassName = allClassName;
        if (uinameNS != "f" && this.classes[uinameNS][allClassName]) {
            if (this.classes[uinameNS + "Content"][allClassName] == classContent) {
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
        content += (packages.length ? before : "") + "var " + className + " = (function (_super) {\n";
        content += before + "\t__extends(" + className + ", _super);\n";
        content += before + "\tfunction " + className + "(data) {\n";
        content += before + "\t\tif(data) this.data = data;\n";
        content += before + "\t\t _super.call(this);\n";
        content += before + "\t\tthis." + className + "_binds = [];\n";
        var scriptInfo = {
            content: ""
        };
        this.hasInitFunction = false;
        content += this.decodeScripts(before, className, xml.getElements("f:script"), scriptInfo);
        content += before + "\t\tthis." + className + "_initMain(this);\n";
        var propertyList = [];
        this.decodeObject(before + "\t", className, className + "_initMain", false, xml, namespaces, propertyList, {});
        if (this.hasInitFunction) {
            content += before + "\t\tthis." + className + "_init();\n";
        }
        content += before + "\t\tthis." + className + "_setBindProperty" + "();\n";
        content += before + "\t\tif(this.dispatchWidth) this.dispatchWidth(flower.UIEvent.CREATION_COMPLETE);\n";
        content += before + "\t}\n\n";
        content += propertyList[propertyList.length - 1];
        for (var i = 0; i < propertyList.length - 1; i++) {
            content += propertyList[i];
        }
        content += scriptInfo.content;
        content += before + "\t" + className + ".prototype." + className + "_setBindProperty = function() {\n";
        content += before + "\t\tfor(var i = 0; i < this." + className + "_binds.length; i++) this." + className + "_binds[i][0].bindProperty(this." + className + "_binds[i][1],this." + className + "_binds[i][2],[this]);\n";
        content += before + "\t}\n\n";
        content += before + "\treturn " + className + ";\n";
        if (uinameNS == "f") {
            content += before + "})(" + extendClass + ");\n";
        } else {
            content += before + "})(flower.UIParser.getLocalUIClass(\"" + extendClass + "\",\"" + uinameNS + "\"));\n";
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
        content += "\n\nUIParser.registerLocalUIClass(\"" + allClassName + "\", " + changeAllClassName + ",\"" + this.localNameSpace + "\");\n";
        var pkg = "";
        var pkgs = flower.UIParser.classes.packages[this.localNameSpace] || [];
        pkgs = pkgs.concat(packages);
        for (var i = 0; i < pkgs.length; i++) {
            pkg = pkgs[i];
            content += "if($root." + pkg + " == null) $root." + pkg + " = {};\n";
            pkg += ".";
        }
        content += "$root." + pkg + allClassName + " = " + allClassName;
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
        flower.UIParser.setLocalUIClassContent(allClassName, classContent, this.localNameSpace);
        //trace("解析类:\n", content);
        return {
            "namesapce": uinameNS,
            "className": allClassName,
        };
    }

    decodeScripts(before, className, scripts, script) {
        var content = "";
        if (this.scriptContent && this.scriptContent != "") {
            var scriptContent = this.scriptContent;
            //删除注释
            scriptContent = flower.StringDo.deleteProgramNote(scriptContent, 0);
            var i = 0;
            var len = scriptContent.length;
            var pos = 0;
            var list = [];
            while (true) {
                var nextFunction = this.findNextFunction(scriptContent, pos);
                if (nextFunction) {
                    pos = nextFunction.endIndex;
                    list.push(nextFunction);
                } else {
                    break;
                }
            }
            for (var i = 0; i < list.length; i++) {
                var func = list[i];
                if (func.gset == 0) {
                    script.content += before + "\t" + className + (func.isStatic ? "." : ".prototype.") + func.name + " = function(" +
                        func.params + ") " + func.content + "\n";
                } else {
                    var setContent = func.gset == 1 ? "" : func.content;
                    var getContent = func.gset == 1 ? func.content : "";
                    var prams = func.gset == 1 ? "" : func.params;
                    for (var f = 0; f < list.length; f++) {
                        if (f != i && list[f].name == func.name && list[f].gset && list[f].gset != func.gset) {
                            if (list[f].gset == 1) {
                                getContent = list[f].content;
                            } else {
                                setContent = list[f].content;
                                prams = list[f].params;
                            }
                            list.splice(f, 1);
                            break;
                        }
                    }
                    script.content += before + "\tObject.defineProperty(" + className + ".prototype, \"" + func.name + "\", {\n";
                    if (getContent != "") {
                        script.content += "\t\tget: function () " + getContent + ",\n";
                    }
                    if (setContent != "") {
                        script.content += "\t\tset: function (" + prams + ") " + setContent + ",\n";
                    }
                    script.content += "\t\tenumerable: true,\n"
                    script.content += "\t\tconfigurable: true\n";
                    script.content += "\t\t});\n\n";
                }
            }
        } else {
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
                        //if (childName == "init") {
                        //    childName = className + "_" + childName;
                        //    this.hasInitFunction = true;
                        //}
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
        }
        return content;
    }

    /**
     * 查找下一个函数，并分析出 函数名和参数列表
     * @param content
     * @param start
     * @return {
     *      name : 函数名
     *      gset : 0.普通函数 1.get函数 2.set函数
     *      params : 参数列表 (也是字符串，直接用就可以)
     *      content : 函数体
     *      endIndex : 函数体结束标识 } 之后的那个位置
     * }
     */
    findNextFunction(content, start) {
        var len = "function".length;
        var flag;
        var name;
        var params;
        var char;
        var pos, pos2, i;
        var res;
        var gset = 0;
        var funcName;
        var isStatic = false;
        //跳过空格和注释
        i = flower.StringDo.jumpProgramSpace(content, start);
        if (i == content.length) {
            return null;
        }
        if (content.slice(i, i + "static".length) == "static") {
            isStatic = true;
            i += "static".length;
            //跳过空格和注释
            i = flower.StringDo.jumpProgramSpace(content, i);
        }
        if (content.slice(i, i + len) == "function") {
            if (i != 0) {
                //判断 function 之前是不是分隔符
                char = content.charAt(i - 1);
                if (char != "\t" && char != " " && char != "\r" && char != "\n") {
                    sys.$error(3007, this.scriptURL, this.scriptContent);
                }
            }
            i = pos = i + len;
            //跳过 function 之后的分隔符
            pos2 = flower.StringDo.jumpProgramSpace(content, pos);
            if (pos2 == pos) {
                sys.$error(3007, this.scriptURL, this.scriptContent);
            }
            pos = pos2;
            //获取 function 之后的函数名
            name = flower.StringDo.findId(content, pos);
            if (name == "") {
                i = pos;
                sys.$error(3007, this.scriptURL, this.scriptContent);
            }
            if (name == "get" || name == "set") {
                pos += name.length;
                gset = name == "get" ? 1 : 2;
                //跳过 function 之后的分隔符
                pos2 = flower.StringDo.jumpProgramSpace(content, pos);
                if (pos2 == pos) {
                    sys.$error(3007, this.scriptURL, this.scriptContent);
                }
                pos = pos2;
                //获取 function 之后的函数名
                name = flower.StringDo.findId(content, pos);
                if (name == "") {
                    i = pos;
                    sys.$error(3007, this.scriptURL, this.scriptContent);
                }
            }
            funcName = name;
            //跳过函数名之后的分隔符
            i = pos = flower.StringDo.jumpProgramSpace(content, pos + name.length);
            //判断函数名之后是不是(
            char = content.charAt(pos);
            if (char != "(") {
                sys.$error(3007, this.scriptURL, this.scriptContent);
            }
            //跳过 (
            pos++;
            //查找 params
            params = "";
            flag = true;
            while (true) {
                //跳过空格
                pos = flower.StringDo.jumpProgramSpace(content, pos);
                //查找 param 名
                name = flower.StringDo.findId(content, pos);
                if (name == "") {
                    if (content.charAt(pos) == ")") {
                        i = pos + 1;
                        break;
                    } else {
                        flag = false;
                        break;
                    }
                } else {
                    params += name;
                    pos += name.length;
                }
                //跳过空格
                pos = flower.StringDo.jumpProgramSpace(content, pos);
                char = content.charAt(pos);
                if (char == ",") {
                    params += ",";
                    pos++;
                }
            }
            if (!flag) {
                sys.$error(3007, this.scriptURL, this.scriptContent);
            }
            res = {
                name: funcName,
                gset: gset,
                params: params,
            }
        }
        if (!res) {
            sys.$error(3007, this.scriptURL, this.scriptContent);
        }

        //分析函数体
        //跳过空格
        var content = flower.StringDo.findFunctionContent(content, i);
        if (content == "") {
            sys.$error(3007, this.scriptURL, this.scriptContent);
        }
        res.content = content;
        res.endIndex = i + content.length + 1;
        res.isStatic = isStatic;
        return res;
    }

    decodeObject(before, className, funcName, createClass, xml, namespaces, propertyFunc, nameIndex) {
        var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
        var thisObj = "parentObject";
        var createClassName;
        if (createClass) {
            var createClassNameSpace = xml.name.split(":")[0];
            createClassName = xml.name.split(":")[1];
            if (createClassNameSpace != "f" && createClassName == "Object") {
                thisObj = "object";
                setObject += before + "\t" + thisObj + " = {};\n";
            } else {
                //if (createClassNameSpace != "f") {
                //    createClassName = this.classes[createClassNameSpace][createClassName];
                //}
                //if (!createClassName.split) {
                //    console.log("???");
                //}
                thisObj = createClassName.split(".")[createClassName.split(".").length - 1];
                thisObj = thisObj.toLocaleLowerCase();
                if (createClassNameSpace != "f") {
                    setObject += before + "\tvar " + thisObj + " = new (flower.UIParser.getLocalUIClass(\"" + createClassName + "\",\"" + createClassNameSpace + "\"))();\n";
                } else {
                    setObject += before + "\tvar " + thisObj + " = new " + this.classes.f[createClassName] + "();\n";
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
                    setObject += before + "\tif(" + thisObj + ".__UIComponent) ";
                    setObject += "this." + className + "_binds.push([" + thisObj + ",\"" + atrName + "\", \"" + atrValue + "\"]);\n";
                    setObject += before + "\telse " + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                    //setObject += before + "\t" + thisObj + ".bindProperty(\"" + atrName + "\", \"" + atrValue + "\", [this]);\n";
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
                } else if (childNameNS != "f") {
                    if (!namespaces[childNameNS]) {
                        sys.$warn(3004, childNameNS, this.parseContent);
                    }
                    if (this.classes[childNameNS][childName]) {
                        childClass = childName;
                    } else {
                        if (this.classes[childNameNS + "Content"][childName]) {
                            this.parse(this.classes[childNameNS + "Content"][childName]);
                            childClass = this.classes[childNameNS][childName];
                        } else {
                            sys.$warn(3005, childName, this.parseContent);
                        }
                    }
                } else {
                    if (this.classes[childNameNS]) {
                        childClass = this.classes[childNameNS][childName];
                    } else {
                        sys.$warn(3004, childNameNS, this.parseContent);
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
                        var itemRenderer = (new UIParser());
                        setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + itemRenderer.parse(item) + "\",\"" + itemRenderer.localNameSpace + "\");\n";
                    } else {
                        funcName = className + "_get" + itemClassName;
                        setObject += before + "\t" + thisObj + "." + childName + " = this." + funcName + "(" + thisObj + ");\n";
                        this.decodeObject(before, className, funcName, true, item, namespaces, propertyFunc, nameIndex);
                    }
                } else {
                    funcName = className + "_get" + itemClassName;
                    setObject += before + "\t" + thisObj + "." + (UIParser.classes.addChild[createClassName] ? UIParser.classes.addChild[createClassName] : "addChild") + "(this." + funcName + "(" + thisObj + "));\n";
                    this.decodeObject(before, className, funcName, true, item, namespaces, propertyFunc, nameIndex);
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

    static registerLocalUIClass(name, cls, namespace = "local") {
        flower.UIParser.classes[namespace][name] = cls;
    }

    static setLocalUIClassContent(name, content, namespace = "local") {
        flower.UIParser.classes[namespace + "Content"][name] = content;
    }

    static getLocalUIClassContent(name, namespace = "local") {
        return flower.UIParser.classes[namespace + "Content"] ? flower.UIParser.classes[namespace + "Content"][name] : null;
    }

    static getLocalUIClass(name, namespace = "local") {
        return this.classes[namespace] ? this.classes[namespace][name] : null;
    }

    static setLocalUIURL(name, url, namespace = "local") {
        this.classes[namespace + "URL"][name] = url;
        this.classes.namesapces[url] = namespace;
        this.classes.defaultClassNames[url] = name;
    }

    static addNameSapce(name, packageURL = "") {
        if (!flower.UIParser.classes[name]) {
            var pkgs = packageURL.split(".");
            if (pkgs[0] == "") {
                pkgs = [];
            }
            flower.UIParser.classes.packages[name] = pkgs;
            flower.UIParser.classes[name] = {};
            flower.UIParser.classes[name + "Content"] = {};
            flower.UIParser.classes[name + "URL"] = {};
        }
    }
}

exports.UIParser = UIParser;