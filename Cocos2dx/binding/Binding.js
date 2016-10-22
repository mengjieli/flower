class Binding {
    singleValue;
    list;
    stmts;
    thisObj;
    property;
    content;
    checks;

    constructor(thisObj, checks, property, content) {
        this.thisObj = thisObj;
        this.checks = checks = checks || [];
        this.property = property;
        this.content = content;
        if (checks && content.search("data") != -1) {
            for (var i = 0; i < checks.length; i++) {
                var display = checks[i];
                if (display.id) {
                    if (!Binding.changeList[display.id]) {
                        Binding.changeList[display.id] = [];
                    }
                    Binding.changeList[display.id].push(this);
                }
            }
        }
        this.__bind(thisObj, checks.concat(), property, content);
    }

    $reset() {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].removeListener(flower.Event.UPDATE, this.update, this);
        }
        this.__bind(this.thisObj, this.checks.concat(), this.property, this.content);
    }

    __bind(thisObj, checks, property, content) {
        this.list = [];
        this.stmts = [];
        this.singleValue = false;
        var i;
        if (checks == null) {
            checks = Binding.bindingChecks.concat();
        }
        else {
            for (i = 0; i < Binding.bindingChecks.length; i++) {
                checks.push(Binding.bindingChecks[i]);
            }
        }
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
                        var needValue = false;
                        var bindContent = content.slice(i + 1, j);
                        if (bindContent && bindContent.charAt(0) == "$") {
                            needValue = true;
                            bindContent = bindContent.slice(1, bindContent.length);
                        }
                        if (i == 0 && j == content.length - 1) {
                            this.singleValue = true;
                        }
                        if (lastEnd < i) {
                            this.stmts.push(content.slice(lastEnd, i));
                        }
                        lastEnd = j + 1;
                        var stmt = Compiler.parserExpr(bindContent, checks, {"this": thisObj}, {
                            "flower": flower,
                            "Tween": flower.Tween,
                            "Ease": flower.Ease,
                            "Math": flower.Math
                        }, this.list, needValue);
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
        var value;
        if (this.singleValue) {
            try {
                value = this.stmts[0].getValue();
            } catch (e) {
                value = null;
            }
            this.thisObj[this.property] = value;
        }
        else {
            var str = "";
            for (var i = 0; i < this.stmts.length; i++) {
                var expr = this.stmts[i];
                if (expr instanceof Stmts) {
                    try {
                        str += expr.getValue();
                    } catch (e) {
                        str += "null";
                    }

                } else {
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

    static changeList = {};

    static changeData(display) {
        var id = display.id;
        var list = Binding.changeList[id];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                list[i].$reset();
            }
        }
    }

    static removeChangeObject(display) {
        var id = display.id;
        delete Binding.changeList[id];
    }

    static clearBindingChecks() {
        Binding.bindingChecks = null
        Binding.changeList = [];
    }

}

Binding.addBindingCheck($root);

exports.Binding = Binding;