class NumberValue extends Value {

    constructor(init = 0, enumList = null, checkDistort = null) {
        super(checkDistort);
        this.__enumList = enumList;
        this.__old = this.__value = +init || 0;
        this.__precision = 2;
        this.__multiplier = Math.pow(10, this.__precision);
        this.__valueCheck = [48];
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
        if (this.__check && val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        if (this.__checkDistort) {
            var str = val + "";
            this.__valueCheck.length = 0;
            for (var i = 0; i < str.length; i++) {
                this.__valueCheck.push(str.charCodeAt(i));
            }
        }
        this.dispatchWith(flower.Event.CHANGE, this, val);
    }

    $getValue() {
        if (this.__checkDistort) {
            var str = this.__value + "";
            var compare = "";
            for (var i = 0; i < this.__valueCheck.length; i++) {
                compare += String.fromCharCode(this.__valueCheck[i]);
            }
            if (str != compare) {
                this.dispatchWith(flower.Event.DISTORT, this);
                this.__value = parseFloat(compare);
            }
        }
        return this.__value;
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