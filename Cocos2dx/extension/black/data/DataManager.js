class DataManager {

    _defines = {};
    _root = {};

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
        content += "\t}\n\n" +
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