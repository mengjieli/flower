class Value extends flower.EventDispatcher {

    __old = null;
    __value = null;
    __checkDistort = null;
    __list = null;

    constructor(checkDistort = null) {
        super();
        this.__checkDistort = checkDistort == null ? Value.Default_Check_Distort : checkDistort;
    }

    $setValue(val) {
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
    }

    $getValue() {
        return this.__value;
    }

    push(val) {
        if (!this.__list) {
            this.__list = [];
        }
        this.__list.push(val);
    }

    pop() {
        if (this.__list) {
            return this.__list.pop();
        }
        return null;
    }

    get value() {
        if (this.__checkDistort) {
            return this.$getValue();
        }
        return this.__value;
    }

    set value(val) {
        this.$setValue(val);
    }

    get old() {
        return this.__old;
    }

    //Value 是否自动检测非法修改
    static Default_Check_Distort = false;
}

exports.Value = Value;