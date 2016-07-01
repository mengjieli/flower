class ExprStmt {
    type = "stmt_expr";
    expr;

    constructor(expr) {
        this.expr = expr;
    }

    checkPropertyBinding(commonInfo) {
        this.expr.checkPropertyBinding(commonInfo);
    }

    getValue() {
        return this.expr.getValue();
    }
}