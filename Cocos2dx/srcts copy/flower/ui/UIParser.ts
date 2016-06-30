module flower {
    export class UIParser extends flower.Group {
        private static classes = {
            f: {
                "Object": "Object",
                "ArrayValue": "flower.ArrayValue",
                "BooleanValue": "flower.BooleanValue",
                "IntValue": "flower.IntValue",
                "UIntValue": "flower.UIntValue",
                "NumberValue": "flower.NumberValue",
                "ObjectValue": "flower.ObjectValue",
                "StringValue": "flower.StringValue",
                "Point": "flower.Point",
                "Size": "flower.Size",
                "Rectangle": "flower.Rectangle",
                "TextField": "flower.TextField",
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
                "ListBase":"flower.ListBase",
                "List":"flower.List",
                "TabBar":"flower.TabBar",
                "ViewStack":"flower.ViewStack",
                "LinearLayoutBase": "flower.LinearLayoutBase",
                "HorizontalLayout": "flower.HorizontalLayout",
                "VerticalLayout": "flower.VerticalLayout"
            },
            local: {},
            localContent: {},
            localURL: {}
        };

        private _className:string;
        private classes:any;
        private parseContent:string;
        private parseUIAsyncFlag:boolean;
        private loadContent:XMLElement;
        private loadData:any;
        private rootXML:XMLElement;
        private hasInitFunction;

        public constructor() {
            super();
            this.classes = flower.UIParser.classes;
        }

        public parseUIAsync(url:string, data:any = null):any {
            this.loadData = data;
            var loader = new flower.URLLoader(url);
            loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
            loader.addListener(flower.Event.ERROR, this.loadContentError, this);
            this.parseUIAsyncFlag = true;
        }

        public parseAsync(url:string):any {
            var loader = new flower.URLLoader(url);
            loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
            loader.addListener(flower.Event.ERROR, this.loadContentError, this);
            this.parseUIAsyncFlag = false;
        }

        private loadContentError(e:flower.Event):void {
            if (this.hasListener(Event.ERROR)) {
                this.dispatchWidth(Event.ERROR, "UIParse 异步加载资源出错 :" + (<URLLoader>e.currentTarget).url);
            } else {
                if (Engine.DEBUG) {
                    DebugInfo.debug("UIParse 异步加载资源出错 :" + (<URLLoader>e.currentTarget).url, DebugInfo.ERROR);
                }
            }
        }

        private loadContentComplete(e:flower.Event):void {
            this.relationUI = [];
            var xml:flower.XMLElement = flower.XMLElement.parse(e.data);
            this.loadContent = xml;
            var list = xml.getAllElements();
            for (var i = 0; i < list.length; i++) {
                var name = list[i].name;
                var nameSpace = name.split(":")[0];
                name = name.split(":")[1];
                if (nameSpace == "local") {
                    if (!this.classes.local[name] && !this.classes.localContent[name]) {
                        if (!this.classes.localURL[name]) {
                            if (Engine.DEBUG) {
                                DebugInfo.debug("找不到 UI 对应的路径， UI 类名:" + name, DebugInfo.ERROR);
                            }
                            return;
                        }
                        var find = false;
                        for(var f = 0; f < this.relationUI.length; f++) {
                            if(this.relationUI[f] == this.classes.localURL[name]) {
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            this.relationUI.push(this.classes.localURL[name]);
                        }
                    }
                }
            }
            this.relationIndex = 0;
            this.loadNextRelationUI();
        }

        private relationUI;
        private relationIndex:number;

        private loadNextRelationUI(e:flower.Event = null):void {
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

        private relationLoadError(e:Event):void {
            if (this.hasListener(Event.ERROR)) {
                this.dispatchWidth(Event.ERROR, e.data);
            } else {
                if (Engine.DEBUG) {
                    DebugInfo.debug(e.data, DebugInfo.ERROR);
                }
            }
        }

        public parseUI(content:any, data:any = null):any {
            var className = this.parse(content);
            var UIClass = this.classes.local[className];
            if (data) {
                return new UIClass(data);
            }
            var ui = new UIClass();
            this.addChild(ui);
            return ui;
        }

        public parse(content:any):string {
            this.parseContent = content;
            var xml:flower.XMLElement;
            if (typeof(content) == "string") {
                xml = flower.XMLElement.parse(content);
            }
            else {
                xml = content;
            }
            if (xml.getNameSapce("f") == null || xml.getNameSapce("f").value != "flower.ui") {
                if (flower.Engine.DEBUG) {
                    flower.DebugInfo.debug("解析 UI 出错,未设置命名空间 xmlns:f=\"flower.ui\" :" + "\n" + content, flower.DebugInfo.ERROR);
                }
                return null;
            }
            this.rootXML = xml;
            var className = this.decodeRootComponent(xml, content);
            this.parseContent = "";
            this._className = className;
            this.rootXML = null;
            return className;
        }

        public get className():string {
            return this._className;
        }

        private decodeRootComponent(xml:flower.XMLElement, classContent:string):string {
            var content = "";
            var hasLocalNS:boolean = xml.getNameSapce("local") ? true : false;
            var uiname:string = xml.name;
            var uinameNS:string = uiname.split(":")[0];
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
            var classAtr:flower.XMLAttribute = xml.getAttribute("class");
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
            if (Engine.DEBUG) {
                try {
                    eval(content);
                } catch (e) {
                    flower.DebugInfo.debug("解析 UI 出错,:\n" + e + "\n" + this.parseContent + "\n\n解析后内容为:\n" + content, flower.DebugInfo.ERROR);
                }
            } else {
                eval(content);
            }
            flower.UIParser.setLocalUIClassContent(allClassName, classContent);
            trace("解析类:\n", content);
            return allClassName;
        }

        private decodeScripts(before:string, className:string, scripts:Array<flower.XMLElement>, script):string {
            var content = "";
            for (var i = 0; i < scripts.length; i++) {
                for (var s = 0; s < scripts[i].list.length; s++) {
                    var item = scripts[i].list[s];
                    var childName:string = item.name;
                    childName = childName.split(":")[1];
                    if (item.list.length && item.getElement("f:set") || item.getElement("f:get")) {
                        var setFunction = item.getElement("f:set");
                        var getFunction = item.getElement("f:get");
                        script.content +=  before + "\tObject.defineProperty(" + className + ".prototype, \"" + childName + "\", {\n";
                        if(getFunction) {
                            script.content += "\t\tget: function () {\n"
                            script.content += "\t\t\t" + getFunction.value + "\n";
                            script.content += "\t\t},\n";
                        }
                        if(setFunction) {
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

        private decodeObject(before:string, className:string, funcName:string, createClass:boolean, xml:flower.XMLElement, hasLocalNS:boolean, propertyFunc:Array<string>, nameIndex:any):void {
            var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
            var thisObj = "parentObject";
            if (createClass) {
                var createClassNameSpace = xml.name.split(":")[0];
                var createClassName = xml.name.split(":")[1];
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
                    setObject += before + "\t" + thisObj + ".eventThis = this;\n";
                }
            }
            var idAtr:XMLAttribute = xml.getAttribute("id");
            if (idAtr) {
                setObject += before + "\tthis." + idAtr.value + " = " + thisObj + ";\n";
                setObject += before + "\tthis." + idAtr.value + ".name = \"" + idAtr.value + "\";\n";
            }
            for (var i:number = 0; i < xml.attributes.length; i++) {
                var atrName:string = xml.attributes[i].name;
                var atrValue:string = xml.attributes[i].value;
                var atrArray:Array<any> = atrName.split(".");
                if (atrName == "class") {
                } else if (atrName == "id") {
                }
                else if (atrName == "scale9Grid") {
                    setObject += before + "\t" + thisObj + "." + atrName + " = new flower.Rectangle(" + atrValue + ");\n";
                } else if (atrArray.length == 2) {
                    var atrState:string = atrArray[1];
                    atrName = atrArray[0];
                    setObject += before + "\t" + thisObj + ".setStatePropertyValue(\"" + atrName + "\", \"" + atrState + "\", \"" + atrValue + "\", [this]);\n";
                }
                else if (atrArray.length == 1) {
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
                    var item:flower.XMLElement = xml.list[i];
                    var childName:string = item.name;
                    var childNameNS:string = childName.split(":")[0];
                    childName = childName.split(":")[1];
                    var childClass = null;
                    if (childNameNS == "f" && childName == "script") {
                        continue;
                    } else if (item.value != null && item.value != "") { //属性
                        setObject += before + "\t" + thisObj + "." + childName + " = \"" + flower.StringDo.changeStringToInner(item.value) + "\";\n";
                        continue;
                    } else if (childNameNS == "local") {
                        if (!hasLocalNS) {
                            if (flower.Engine.DEBUG) {
                                flower.DebugInfo.debug("解析 UI 出错:无法解析的命名空间 " + childNameNS + " :\n" + this.parseContent, flower.DebugInfo.ERROR);
                            }
                        }
                        if (this.classes.local[childName]) {
                            childClass = childName;
                        } else {
                            if (this.classes.localContent[childName]) {
                                this.parse(this.classes.localContent[childName]);
                                childClass = this.classes.local[childName];
                            } else if (flower.Engine.DEBUG) {
                                flower.DebugInfo.debug("解析 UI 出错:无法解析的类名 " + childName + " :\n" + this.parseContent, flower.DebugInfo.ERROR);
                            }
                        }
                    } else {
                        if (this.classes[childNameNS]) {
                            childClass = this.classes[childNameNS][childName];
                        } else {
                            if (flower.Engine.DEBUG) {
                                flower.DebugInfo.debug("解析 UI 出错:无法解析的命名空间 " + childNameNS + " :\n" + this.parseContent, flower.DebugInfo.ERROR);
                            }
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
                        setObject += before + "\t" + thisObj + ".addChild(this." + funcName + "(" + thisObj + "));\n";
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

        private isNumberOrBoolean(str:string):boolean {
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

        public static registerLocalUIClass(name:string, cls:any) {
            flower.UIParser.classes.local[name] = cls;
        }

        public static setLocalUIClassContent(name:string, content:string) {
            flower.UIParser.classes.localContent[name] = content;
        }

        public static getLocalUIClassContent(name:string) {
            return flower.UIParser.classes.localContent[name];
        }

        public static getLocalUIClass(name:string):any {
            return this.classes.local[name];
        }

        public static setLocalUIURL(name:string, url:string) {
            this.classes.localURL[name] = url;
        }
    }
}

