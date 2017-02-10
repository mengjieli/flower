class Compiler {
    _scanner;
    _parser;

    constructor() {
        this._scanner = new Scanner();
        this._parser = new Parser();
    }

    parserExpr(content, checks, objects, classes, result, binding) {
        var scanner = new Scanner();
        var common = {
            "content": content,
            "objects": objects,
            "classes": classes,
            "checks": checks,
            "ids": {},
            "tokenValue": null,
            "scanner": this._scanner,
            "nodeStack": null,
            "bindList": [],
            "binding": binding
        };
        this._scanner.setCommonInfo(common);
        this._parser.setCommonInfo(common);
        this._parser.parser(content);
        if (common.parserError) {
            return null;
        }
        common.result = result;
        common.expr = common.newNode.expval;
        common.expr.checkPropertyBinding(common);
        return common.expr;
    }

    static ist;

    static parserExpr(content, checks, objects, classes, result, binding) {
        if (!Compiler.ist) {
            Compiler.ist = new Compiler();
        }
        return Compiler.ist.parserExpr(content, checks, objects, classes, result, binding);
    }
}