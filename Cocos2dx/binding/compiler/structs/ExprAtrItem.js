class ExprAtrItem {
    type;
    val;
    getValue;

    constructor(type, val, getValue = false) {
        this.type = type;
        this.val = val;
        this.getValue = getValue;
    }
}