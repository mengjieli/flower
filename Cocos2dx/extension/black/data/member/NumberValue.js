class NumberValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = +init || 0;
        this.__precision = 2;
        this.__multiplier = Math.pow(10, this.__precision);
    }

    $setValue(val) {
        val = +val || 0;
        if (val > 0) {
            var smallNumber = val - Math.floor(val);
            smallNumber = Math.floor(smallNumber * this.__multiplier) / this.__multiplier;
            val = Math.floor(val) + smallNumber;
        } else {
            val = -val;
            var smallNumber = val - Math.floor(val);
            smallNumber = Math.floor(smallNumber * this.__multiplier) / this.__multiplier;
            val = Math.floor(val) + smallNumber;
            val = -val;
        }
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this, val);
    }

    /**
     * 设置精确到小数点后多少位
     * @param val
     */
    set precision(val) {
        this.__precision = val;
        this.__multiplier = Math.pow(10, this.__precision);
        this.$setValue(this.__value);
    }

    get precision() {
        return this.__precision;
    }
}

exports.NumberValue = NumberValue;