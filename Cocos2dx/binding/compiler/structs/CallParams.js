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

    getValueList(params) {
        var callParams = [];
        for (var i = 0; i < this.list.length; i++) {
            callParams.push((this.list[i]).getValue(params));
        }
        return callParams;
    }
}