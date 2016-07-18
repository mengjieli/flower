class BooleanValue extends Value {

    constructor(init = false) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        if(val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

exports.BooleanValue = BooleanValue;