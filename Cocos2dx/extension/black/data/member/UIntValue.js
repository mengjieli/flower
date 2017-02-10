class UIntValue extends Value {

    constructor(init = 0, enumList = null, checkDistort = null) {
        super(checkDistort);
        init = +init & ~0 || 0;
        if (init < 0) {
            init = 0;
        }
        this.__enumList = enumList;
        this.__old = this.__value = init;
        this.__valueCheck = [48];
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
}

exports.UIntValue = UIntValue;