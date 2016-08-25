class ObjectValue extends Value {

    constructor(init = null) {
        super();
        this.__old = this.__value = {};
        if (init) {
            this.value = init;
        }
        this.__saveClass = {};
    }

    setMember(name, value) {
        var old = this.__value[name];
        this.__value[name] = value;
        //this.dispatchWidth(flower.Event.UPDATE, {
        //    "name": name,
        //    "old": old,
        //    "value": value
        //});
    }

    setMemberSaveClass(name, saveClass = false) {
        this.__saveClass[name] = saveClass;
    }

    hasMember(name) {
        return this.__value.hasOwnProperty(name);
    }

    getValue(name) {
        return this.__value[name];
    }

    setValue(name, value) {
        if (!this.__value.hasOwnProperty(name)) {
            sys.$error(3014, name);
            return;
        }
        if (value == null) {
            this.setMember(name, null);
        } else {
            if (value && (!(value instanceof Value)) && typeof value == "object" && value.__className) {
                value = flower.DataManager.createData(value.__className, value);
            }
            if (value instanceof Value) {
                this.setMember(name, value);
            } else {
                var val = this.__value[name];
                if (val instanceof Value) {
                    val.value = value;
                } else {
                    this.__value[name] = value;
                }
            }
        }
    }

    /**
     * 从 Object 中读取数据
     * @param value
     */
    $setValue(val) {
        if (val == null) {
            sys.$error(3015);
            return;
        }
        var list = Object.keys(val);
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var value = val[key];
            if (!this.__value.hasOwnProperty(key)) {
                this.setMember(key, value);
            } else {
                this.setValue(key, value);
            }
        }
    }

    $getValue(saveClass = false) {
        var val = this.__value;
        var list = Object.keys(val);
        var config = {};
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var member = val[key];
            if (member instanceof Value) {
                if (member instanceof ObjectValue) {
                    config[key] = member.$getValue(this.__saveClass[key]);
                } else {
                    config[key] = member.value;
                }
            } else {
                config[key] = member;
            }
        }
        if (this.__className && saveClass) {
            config.__className = this.__className.value;
        }
        return config;
    }


    /**
     * 将数据转化成 Object
     */
    get value() {
        return this.$getValue();
    }

    set value(val) {
        this.$setValue(val);
    }

    get className() {
        return this.__className ? this.__className.value : "";
    }

    set className(val) {
        if (val) {
            this.__className = new StringValue(val);
        } else {
            this.__className = null;
        }
    }

    dispose() {
        var val = this.__value;
        var list = Object.keys(val);
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (val[key] instanceof Value) {
                val[key].dispose();
            }
        }
        super.dispose();
    }
}

exports.ObjectValue = ObjectValue;