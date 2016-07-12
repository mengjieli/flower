class Binding {
    singleValue = false;
    list = [];
    stmts = [];
    thisObj;
    property;
    content;
    checks;

    constructor(thisObj, checks, property, content) {
        var i;
        if (checks == null) {
            checks = Binding.bindingChecks.concat();
        }
        else {
            for (i = 0; i < Binding.bindingChecks.length; i++) {
                checks.push(Binding.bindingChecks[i]);
            }
        }
        this.checks = checks;
        checks.push(thisObj);
        var lastEnd = 0;
        var parseError = false;
        for (i = 0; i < content.length; i++) {
            if (content.charAt(i) == "{") {
                for (var j = i + 1; j < content.length; j++) {
                    if (content.charAt(j) == "{") {
                        break;
                    }
                    if (content.charAt(j) == "}") {
                        if (i == 0 && j == content.length - 1) {
                            this.singleValue = true;
                        }
                        if (lastEnd < i) {
                            this.stmts.push(content.slice(lastEnd, i));
                        }
                        lastEnd = j + 1;
                        var stmt = Compiler.parserExpr(content.slice(i + 1, j), checks, {"this": thisObj}, {
                            "Tween": flower.Tween,
                            "Ease": flower.Ease
                        }, this.list);
                        if (stmt == null) {
                            parseError = true;
                            break;
                        }
                        this.stmts.push(stmt);
                        i = j;
                        break;
                    }
                }
            }
        }
        if (parseError) {
            thisObj[property] = content;
            return;
        }
        if (lastEnd < content.length) {
            this.stmts.push(content.slice(lastEnd, content.length));
        }
        this.thisObj = thisObj;
        this.property = property;
        for (i = 0; i < this.list.length; i++) {
            for (j = 0; j < this.list.length; j++) {
                if (i != j && this.list[i] == this.list[j]) {
                    this.list.splice(j, 1);
                    i = -1;
                    break;
                }
            }
        }
        for (i = 0; i < this.list.length; i++) {
            this.list[i].addListener(flower.Event.UPDATE, this.update, this);
        }
        this.update();
    }

    update(value = null, old = null) {
        if (this.singleValue) {
            try {
                this.thisObj[this.property] = this.stmts[0].getValue();
            }
            catch (e) {
                this.thisObj[this.property] = null;
            }

        }
        else {
            var str = "";
            for (var i = 0; i < this.stmts.length; i++) {
                var expr = this.stmts[i];
                if (expr instanceof Stmts) {
                    try {
                        str += expr.getValue();
                    }
                    catch (e) {
                        str += "null";
                    }

                }
                else {
                    str += expr;
                }
            }
            this.thisObj[this.property] = str;
        }
    }

    dispose() {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].removeListener(flower.Event.UPDATE, this.update, this);
        }
    }

    static bindingChecks = [];

    static addBindingCheck(check) {
        for (var i = 0; i < Binding.bindingChecks.length; i++) {
            if (Binding.bindingChecks[i] == check) {
                return;
            }
        }
        Binding.bindingChecks.push(check);
    }

    static clearBindingChecks() {
        Binding.bindingChecks = null;
    }

}

exports.Binding = Binding;