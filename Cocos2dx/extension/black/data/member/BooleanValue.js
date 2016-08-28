class BooleanValue extends Value {

    constructor(init = false, enumList = null) {
        super();
        if (init == "false") {
            init = false;
        }
        this.__enumList = enumList;
        this.__old = this.__value = !!init;
    }

    $setValue(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
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

exports.BooleanValue = BooleanValue;