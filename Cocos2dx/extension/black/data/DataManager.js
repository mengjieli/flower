class DataManager {

    _defines = {};
    _root = {};
    staticScript;
    scriptContent;

    constructor() {
        if (DataManager.instance) {
            return;
        }
        DataManager.instance = this;
        this.addDefine({
            "name": "Attribute",
            "members": {
                "name": {"type": "string"},
                "content": {"type": "string"}
            }
        });
        this.addDefine({
            "name": "Size",
            "members": {
                "width": {"type": "int"},
                "height": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "Point",
            "members": {
                "x": {"type": "int"},
                "y": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "RGB",
            "members": {
                "r": {"type": "uint"},
                "g": {"type": "uint"},
                "b": {"type": "uint"}
            }
        });
        this.addDefine({
            "name": "ARGB",
            "members": {
                "a": {"type": "uint"},
                "r": {"type": "uint"},
                "g": {"type": "uint"},
                "b": {"type": "uint"}
            }
        });
        this.addDefine({
            "name": "Rectangle",
            "members": {
                "x": {"type": "int"},
                "y": {"type": "int"},
                "width": {"type": "int"},
                "height": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "ProgressData",
            "members": {
                "current": {"type": "number"},
                "max": {"type": "number"},
                "percent": {"type": "number", "bind": "{max==0?1:current/max}"},
                "tip": {"type": "string"}
            }
        });
        this.addDefine({
            "name": "flower.System",
            "members": {
                "screen": {"type": "Size"},
            }
        });
        this.addDefine({
            "name": "FlowerData",
            "members": {
                "system": {"type": "flower.System"},
            }
        });
        this.addRootData("flower", "FlowerData");
    }

    addRootData(name, className, init = null) {
        this[name] = this.createData(className, init);
        return this._root[name] = this[name];
    }

    addDefine(config) {
        var className = config.name;
        if (!className) {
            sys.$error(3010, flower.ObjectDo.toString(config));
            return;
        }
        if (!this._defines[className]) {
            this._defines[className] = {
                //moduleKey: moduleKey,
                id: 0,
                className: "",
                define: null
            };
        }
        var item = this._defines[className];
        var packages = className.split(".");
        className = packages.splice(packages.length - 1, 1)[0];
        var defineClass = "" + className + (item.id != 0 ? item.id : "");
        item.className = defineClass;
        var extendClassName = "ObjectValue";
        if (config.extends) {
            var extendsItem = this.getClass(config.extends);
            if (extendsItem) {
                extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
            } else {
                var extendPakcages = config.extends.split(".");
                extendsItem = $root;
                for (var i = 0; i < extendPakcages.length; i++) {
                    extendsItem = extendsItem[extendPakcages[i]];
                }
                if (extendsItem) {
                    extendClassName = config.extends;
                }
            }
            if (!extendsItem) {
                sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                return;
            }
        }
        this.staticScript = "";
        this.scriptContent = config.script;
        var script = {content: "", ctor: ""};
        this.decodeScript("\n\n", defineClass, script);
        var content = "var " + defineClass + " = (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "(init) {\n" +
            "\t\t_super.call(this,null);\n";
        content += "\t\tthis.className = \"" + config.name + "\";\n";
        var defineMember = "";
        var members = config.members;
        var bindContent = "";
        var subContent = "";
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.init && typeof member.init == "object" && member.init.__className) {
                    content += "\t\tthis.$setMember(\"" + key + "\" , flower.DataManager.getInstance().createData(\"" + member.init.__className + "\"," + (member.init != null ? JSON.stringify(member.init) : "null") + "," + member.checkDistort + "));\n";
                    content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                } else {
                    if (member.type === "number" || member.type === "Number") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new NumberValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                    } else if (member.type === "int" || member.type === "Int") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new IntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                    } else if (member.type === "uint" || member.type === "Uint") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new UIntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                    } else if (member.type === "string" || member.type === "String") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new StringValue(" + (member.init != null ? "\"" + member.init + "\"" : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "boolean" || member.type === "Boolean" || member.type === "bool") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new BooleanValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "array" || member.type === "Array") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , new ArrayValue(" + (member.init != null ? JSON.stringify(member.init) : "null") + ",\"" + member.typeValue + "\"));\n";
                    } else if (member.type === "*") {
                        content += "\t\tthis.$setMember(\"" + key + "\" , " + (member.init != null ? member.init : "null") + ");\n";
                        content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                    } else {
                        if (member.hasOwnProperty("init") && member.init == null) {
                            content += "\t\tthis.$setMember(\"" + key + "\" , null);\n";
                        } else {
                            content += "\t\tthis.$setMember(\"" + key + "\" , flower.DataManager.getInstance().createData(\"" + member.type + "\"," + (member.init != null ? JSON.stringify(member.init) : "null") + "));\n";
                        }
                        content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                    }
                }
                if (member.save === true || member.save === false) {
                    content += "\t\tthis.$setMemberSaveFlag(\"" + key + "\" ," + member.save + ");\n";
                }
                if (member.bind) {
                    bindContent += "\t\tnew flower.Binding(this." + key + ",[this],\"value\",\"" + member.bind + "\");\n"
                }
                if (member.sub) {
                    subContent += "\t\tthis." + member.sub.source + ".linkSubArrayValue(this." + key + ",";
                    if (typeof member.sub.type == "string") {
                        subContent += "\"" + member.sub.type + "\"," + (typeof member.sub.value == "string" ? "\"" + member.sub.value + "\"" : member.sub.value) + ");\n";
                    } else {
                        for (var s = 0; s < member.sub.type.length; s++) {
                            subContent += "\"" + member.sub.type[s] + "\"," + (typeof member.sub.value[s] == "string" ? "\"" + member.sub.value[s] + "\"" : member.sub.value[s]) + (s < member.sub.type.length - 1 ? "," : ");\n");
                        }
                    }
                }
                defineMember += "\tObject.defineProperty(" + defineClass + ".prototype,\"" + key + "\", {\n";
                defineMember += "\t\tget: function () {\n";
                defineMember += "\t\t\treturn this.__value[\"" + key + "\"];\n";
                defineMember += "\t\t},\n";
                defineMember += "\t\tset: function (val) {\n";
                defineMember += "\t\t\tthis.setValue(\"" + key + "\", val);\n";
                defineMember += "\t\t},\n";
                defineMember += "\t\tenumerable: true,\n";
                defineMember += "\t\tconfigurable: true\n";
                defineMember += "\t});\n\n";
            }
        }
        if (config.init) {
            content += "\t\tthis.value = " + JSON.stringify(config.init) + ";\n";
        }
        content += "\t\tif(init) this.value = init;\n";
        content += bindContent;
        content += subContent;
        content += script.ctor;
        content += "\t}\n\n" + "var p = " + defineClass + ".prototype;" + "\n\n" +
            script.content + "\n" +
            defineMember +
            "\treturn " + defineClass + ";\n" +
            "})(" + extendClassName + ");\n";
        content += "DataManager.getInstance().$addClassDefine(" + defineClass + ", \"" + config.name + "\");\n";
        if (config.exports) {
            var name = "";
            for (var i = 0; i < packages.length; i++) {
                name += packages[i];
                content += "$root." + name + " = $root." + name + " || {}\n";
                name += ".";
            }
            name += className;
            content += "$root." + name + " = " + defineClass + ";\n";
        }
        if (sys.TIP) {
            flower.trace("数据结构:\n" + content);
        }
        if (sys.DEBUG) {
            try {
                eval(content);
            } catch (e) {
                sys.$error(3011, e, content);
            }
        } else {
            eval(content);
        }
        item.id++;
        return this.getClass(config.name);
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
        //if (item.moduleKey != moduleKey) {
        //    sys.$error(3016, moduleKey);
        //}
        return item.define;
    }

    createData(className, init = null, distort = null) {
        if (className === "number" || className === "Number") {
            return new NumberValue(init, null, distort);
        } else if (className === "int" || className === "Int") {
            return new IntValue(init, null, distort);
        } else if (className === "uint" || className === "Uint") {
            return new UIntValue(init, null, distort);
        } else if (className === "string" || className === "String") {
            return new StringValue(init);
        } else if (className === "boolean" || className === "Boolean" || className === "bool") {
            return new BooleanValue(init);
        } else if (className === "array" || className === "Array") {
            return new ArrayValue(init);
        } else if (className === "*") {
            return init;
        } else {
            var item = this._defines[className];
            if (!item) {
                sys.$error(3012, className);
                return;
            }
            //if (item.moduleKey != moduleKey) {
            //    sys.$error(3016, moduleKey);
            //}
            return new item.define(init);
        }
    }

    decodeScript(before, className, script) {
        if (this.scriptContent && this.scriptContent != "") {
            var scriptContent = this.scriptContent;
            //删除注释
            scriptContent = flower.StringDo.deleteProgramNote(scriptContent, 0);
            var i = 0;
            var len = scriptContent.length;
            var pos = 0;
            var list = [];
            this.staticScript = "";
            while (true) {
                var nextFunction = this.findNextFunction(scriptContent, pos);
                if (nextFunction) {
                    this.staticScript += nextFunction.staticScript;
                    pos = nextFunction.endIndex;
                    list.push(nextFunction);
                } else {
                    break;
                }
            }
            for (var i = 0; i < list.length; i++) {
                var func = list[i];
                if (func.name == "constructor") {
                    script.ctor = before + func.content + "\n";
                } else if (func.gset == 0) {
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
                        script.content += before + "\t\tget: function () " + getContent + ",\n";
                    }
                    if (setContent != "") {
                        script.content += before + "\t\tset: function (" + prams + ") " + setContent + ",\n";
                    }
                    script.content += before + "\t\tenumerable: true,\n"
                    script.content += before + "\t\tconfigurable: true\n";
                    script.content += before + "\t\t});\n\n";
                }
            }
        }
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
        var j = i;
        while (j < content.length) {
            if (content.slice(j, j + "static".length) == "static" || content.slice(j, j + len) == "function") {
                break;
            }
            j++;
        }
        if (j == content.length) {
            this.staticScript += content.slice(i, j);
            return null;
        }
        var staticScript = content.slice(i, j);
        i = j;
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
                    sys.$error(3007, "", this.scriptContent);
                }
            }
            i = pos = i + len;
            //跳过 function 之后的分隔符
            pos2 = flower.StringDo.jumpProgramSpace(content, pos);
            if (pos2 == pos) {
                sys.$error(3007, "", this.scriptContent);
            }
            pos = pos2;
            //获取 function 之后的函数名
            name = flower.StringDo.findId(content, pos);
            if (name == "") {
                i = pos;
                sys.$error(3007, "", this.scriptContent);
            }
            if (name == "get" || name == "set") {
                pos += name.length;
                gset = name == "get" ? 1 : 2;
                //跳过 function 之后的分隔符
                pos2 = flower.StringDo.jumpProgramSpace(content, pos);
                if (pos2 == pos) {
                    sys.$error(3007, "", this.scriptContent);
                }
                pos = pos2;
                //获取 function 之后的函数名
                name = flower.StringDo.findId(content, pos);
                if (name == "") {
                    i = pos;
                    sys.$error(3007, "", this.scriptContent);
                }
            }
            funcName = name;
            //跳过函数名之后的分隔符
            i = pos = flower.StringDo.jumpProgramSpace(content, pos + name.length);
            //判断函数名之后是不是(
            char = content.charAt(pos);
            if (char != "(") {
                sys.$error(3007, "", this.scriptContent);
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
                sys.$error(3007, "", this.scriptContent);
            }
            res = {
                name: funcName,
                gset: gset,
                params: params,
            }
        }
        if (!res) {
            sys.$error(3007, "", this.scriptContent);
        }

        //分析函数体
        //跳过空格
        var content = flower.StringDo.findFunctionContent(content, i);
        if (content == "") {
            sys.$error(3007, "", this.scriptContent);
        }
        res.staticScript = staticScript || "";
        res.content = content;
        res.endIndex = i + content.length + 1;
        res.isStatic = isStatic;
        return res;
    }

    clear() {
        for (var key in this._root) {
            delete this._root[key];
            delete this[key];
        }
        this._defines = {};
    }

    static instance;

    static getInstance() {
        if (DataManager.instance == null) {
            new DataManager();
        }
        return DataManager.instance;
    }

    static addRootData(name, className, init = null) {
        return DataManager.getInstance().addRootData(name, className, init);
    }

    static getClass(className) {
        return DataManager.getInstance().getClass(className);
    }

    static addDefine(config) {
        return DataManager.getInstance().addDefine(config);
    }

    static createData(className, init = null) {
        return DataManager.getInstance().createData(className, init);
    }

    static clear() {
        DataManager.getInstance().clear();
    }
}

exports.DataManager = DataManager;