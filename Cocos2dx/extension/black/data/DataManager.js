class DataManager {
    _defines = {};
    _root = {};

    constructor() {
        if (flower.DataManager.ist) {
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
                define: null
            };
        }
        var item = this._defines[className];
        var defineClass = "Data" + className + (item.id != 0 ? item.id : "");
        var content = "var " + defineClass + " (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "() {\n" +
            "\t\t_super.call(this);\n";
        var members = config.members;
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.type == "int") {
                    content += "\t\this." + key + " = new IntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "uint") {
                    content += "\t\this." + key + " = new UIntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "string") {
                    content += "\t\this." + key + " = new StringValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "boolean") {
                    content += "\t\this." + key + " = new BooleanValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "array") {
                    content += "\t\this." + key + " = new ArrayValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "*") {
                    content += "\t\this." + key + " = " + (member.init != null ? member.init : "null") + ";\n";
                } else {
                    content += "\t\this." + key + " = DataManager.getInstance().createData(" + member.type + ");\n";
                }
            }
        }
        content += "\t}\n" +
            "\treturn " + className + ";\n" +
            "})(ObjectValue);\n";
        if (sys.DEBUG) {
            try {
                item.define = eval(content);
            } catch (e) {
                sys.$error(3011, content);
            }
        } else {
            item.define = eval(className);
        }
        item.id++;
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