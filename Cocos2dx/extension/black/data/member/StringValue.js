class StringValue extends Value {

    constructor(init = "", enumList = null) {
        super();
        this.__old = this.__value = "" + init;
        this.__enumList = enumList;
    }

    $setValue(val) {
        val = "" + val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWith(flower.Event.UPDATE, this, val);
    }

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }
}

exports.StringValue = StringValue;