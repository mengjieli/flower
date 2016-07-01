class Value extends flower.EventDispatcher {

    __old = null;
    __value = null;

    $setValue(val) {
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
    }

    get value() {
        return this.__value;
    }

    set value(init) {
        this.$setValue(val);
    }

    get old() {
        return this.__old;
    }
}