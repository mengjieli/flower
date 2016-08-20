class BooleanValue extends Value {

    constructor(init = false) {
        super();
        if (init == "false") {
            init = false;
        }
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
        this.dispatchWidth(flower.Event.UPDATE, this, val);
    }
}

exports.BooleanValue = BooleanValue;