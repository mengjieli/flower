class DataManager {
    _defines = {};
    _root = {};

    constructor() {
        if (DataManager.instance) {
            return;
        }
        DataManager.instance = this;

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
        this[name] = this.createData(className, className);
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
            if (!extendsItem) {
                sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                return;
            }
            extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
        }
        var content = "var " + defineClass + " = (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "(init) {\n" +
            "\t\t_super.call(this,null);\n";
        content += "\t\tthis.className = \"" + config.name + "\";\n";
        var defineMember = "";
        var members = config.members;
        var bindContent = "";
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.init && typeof member.init == "object" && member.init.__className) {
                    content += "\t\tthis.setMember(\"" + key + "\" , DataManager.getInstance().createData(\"" + member.init.__className + "\"," + (member.init != null ? member.init : "null") + "));\n";
                    content += "\t\tthis.setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                } else {
                    if (member.type === "number" || member.type === "Number") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new NumberValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "int" || member.type === "Int") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new IntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "uint" || member.type === "Uint") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new UIntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "string" || member.type === "String") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new StringValue(" + (member.init != null ? "\"" + member.init + "\"" : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "boolean" || member.type === "Boolean" || member.type === "bool") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new BooleanValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                    } else if (member.type === "array" || member.type === "Array") {
                        content += "\t\tthis.setMember(\"" + key + "\" , new ArrayValue(" + (member.init != null ? member.init : "null") + ",\"" + member.typeValue + "\"));\n";
                    } else if (member.type === "*") {
                        content += "\t\tthis.setMember(\"" + key + "\" , " + (member.init != null ? member.init : "null") + ");\n";
                        content += "\t\tthis.setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                    } else {
                        content += "\t\tthis.setMember(\"" + key + "\" , DataManager.getInstance().createData(\"" + member.type + "\"," + (member.init != null ? member.init : "null") + "));\n";
                        content += "\t\tthis.setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                    }
                }
                if (member.bind) {
                    bindContent += "\t\tnew flower.Binding(this." + key + ",[this],\"value\",\"" + member.bind + "\");\n"
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
        content += "\t\tif(init) this.value = init;\n";
        content += bindContent;
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
            eval(className);
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
        return item.define;
    }

    createData(className, init = null) {
        if (className === "number" || className === "Number") {
            return new NumberValue(init);
        } else if (className === "int" || className === "Int") {
            return new IntValue(init);
        } else if (className === "uint" || className === "Uint") {
            return new UIntValue(init);
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