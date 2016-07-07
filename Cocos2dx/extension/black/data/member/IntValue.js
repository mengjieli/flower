class IntValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0 || 0;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

exports.IntValue = IntValue;