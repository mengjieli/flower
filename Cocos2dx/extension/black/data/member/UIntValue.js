class UIntValue extends Value {

    constructor(init = 0, enumList = null) {
        super();
        init = +init & ~0 || 0;
        if (init < 0) {
            init = 0;
        }
        this.__enumList = enumList;
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0 || 0;
        if (val < 0) {
            val = 0;
        }
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

exports.UIntValue = UIntValue;