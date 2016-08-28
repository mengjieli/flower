class IntValue extends Value {

    constructor(init = 0, enumList = null)  {
        super();
        this.__old = this.__value = +init & ~0 || 0;
        this.__enumList = enumList;
    }

    $setValue(val) {
        val = +val & ~0 || 0;
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

exports.IntValue = IntValue;