class ObjectAtr {
    list;

    constructor(list) {
        this.list = list;
        for (var i = 0; i < list.length; i++) {
            list[i][0] = list[i][0].getValue();
        }
    }

    checkPropertyBinding(commonInfo) {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i][1].checkPropertyBinding(commonInfo);
        }
    }

    getValue() {
        var val = {};
        for (var i = 0; i < this.list.length; i++) {
            val[this.list[i][0]] = this.list[i][1].getValue();
        }
        return val;
    }
}