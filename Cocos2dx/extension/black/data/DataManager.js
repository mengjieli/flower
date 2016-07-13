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
                "percent": {"type": "number", "bind": "{this.current/this.max}"},
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
            "\tfunction " + defineClass + "() {\n" +
            "\t\t_super.call(this);\n";
        var members = config.members;
        var bindContent = "";
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.type === "number" || member.type === "Number") {
                    content += "\t\tthis." + key + " = new NumberValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type === "int" || member.type === "Int") {
                    content += "\t\tthis." + key + " = new IntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type === "uint" || member.type === "Uint") {
                    content += "\t\tthis." + key + " = new UIntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type === "string" || member.type === "String") {
                    content += "\t\tthis." + key + " = new StringValue(" + (member.init != null ? "\"" + member.init + "\"" : "") + ");\n";
                } else if (member.type === "boolean" || member.type === "Boolean" || member.type === "bool") {
                    content += "\t\tthis." + key + " = new BooleanValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type === "array" || member.type === "Array") {
                    content += "\t\tthis." + key + " = new ArrayValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type === "*") {
                    content += "\t\tthis." + key + " = " + (member.init != null ? member.init : "null") + ";\n";
                } else {
                    content += "\t\tthis." + key + " = DataManager.getInstance().createData(\"" + member.type + "\");\n";
                }
                if (member.bind) {
                    bindContent += "\t\tnew flower.Binding(this." + key + ",[this],\"value\",\"" + member.bind + "\");\n"
                }
            }
        }
        content += bindContent;
        content += "\t}\n" +
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
        if(sys.TIP) {
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

    static instance;

    static getInstance() {
        if (DataManager.instance == null) {
            new DataManager();
        }
        return DataManager.instance;
    }
}

exports.DataManager = DataManager;