class CallParams {
    type = "callParams";
    list = [];

    constructor() {
    }

    addParam(expr) {
        this.list.push(expr);
    }

    addParamAt(expr, index) {
        this.list.splice(index, 0, expr);
    }

    checkPropertyBinding(commonInfo) {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].checkPropertyBinding(commonInfo);
        }
    }

    getValueList() {
        var params = [];
        for (var i = 0; i < this.list.length; i++) {
            params.push((this.list[i]).getValue());
        }
        return params;
    }
}