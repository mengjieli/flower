class UIntValue extends Value {

    constructor(init = 0) {
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0;
        if (val < 0) {
            val = 0;
        }
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}