class Stmts {
    type = "stmts";
    list = [];

    constructor() {
    }

    addStmt(stmt) {
        this.list.push(stmt);
    }

    addStmtAt(stmt, index) {
        this.list.splice(index, 0, stmt);
    }

    checkPropertyBinding(commonInfo) {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].checkPropertyBinding(commonInfo);
        }
    }

    getValue() {
        var value;
        for (var i = 0; i < this.list.length; i++) {
            if (i == 0) {
                value = this.list[i].getValue();
            }
            else {
                this.list[i].getValue();
            }
        }
        return value;
    }

}