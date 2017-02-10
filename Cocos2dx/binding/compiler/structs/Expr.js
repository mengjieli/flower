class Expr {
    type;
    expr1;
    expr2;
    expr3;

    constructor(type, expr1 = null, expr2 = null, expr3 = null) {
        this.type = type;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.expr3 = expr3;
        if (type == "int") {
            this.expr1 = parseInt(expr1);
        }
        if (type == "string") {
            this.expr1 = this.expr1.slice(1, this.expr1.length - 1);
        }
    }

    checkPropertyBinding(commonInfo) {
        if (this.type == "Atr") {
            (this.expr1).checkPropertyBinding(commonInfo);
        } else if (this.expr1 && (this.expr1 instanceof Expr || this.expr1 instanceof ExprAtr)) {
            (this.expr1).checkPropertyBinding(commonInfo);
        }
        if (this.type == "spfor") {
            commonInfo.specialFor = this.expr1.getValue();
        }
        if (this.expr2 && (this.expr2 instanceof Expr || this.expr2 instanceof ExprAtr)) {
            (this.expr2).checkPropertyBinding(commonInfo);
        }
        if (this.expr3 && (this.expr3 instanceof Expr || this.expr3 instanceof ExprAtr)) {
            (this.expr3).checkPropertyBinding(commonInfo);
        }
        if (this.type == "spfor") {
            commonInfo.specialFor = null;
        }
    }

    getValue(params) {
        if (this.type == "Atr") {
            return this.expr1.getValue(params);
        }
        if (this.type == "int") {
            return this.expr1;
        }
        if (this.type == "0xint") {
            return this.expr1;
        }
        if (this.type == "number") {
            return this.expr1;
        }
        if (this.type == "boolean") {
            return this.expr1;
        }
        if (this.type == "string") {
            return this.expr1;
        }
        if (this.type == "+a") {
            return this.expr1.getValue(params);
        }
        if (this.type == "-a") {
            return -this.expr1.getValue(params);
        }
        if (this.type == "!") {
            return !this.expr1.getValue(params);
        }
        if (this.type == "*") {
            return this.expr1.getValue(params) * this.expr2.getValue(params);
        }
        if (this.type == "/") {
            return this.expr1.getValue(params) / this.expr2.getValue(params);
        }
        if (this.type == "%") {
            return this.expr1.getValue(params) % this.expr2.getValue(params);
        }
        if (this.type == "+") {
            return this.expr1.getValue(params) + this.expr2.getValue(params);
        }
        if (this.type == "-") {
            return this.expr1.getValue(params) - this.expr2.getValue(params);
        }
        if (this.type == "<<") {
            return this.expr1.getValue(params) << this.expr2.getValue(params);
        }
        if (this.type == ">>") {
            return this.expr1.getValue(params) >> this.expr2.getValue(params);
        }
        if (this.type == ">>>") {
            return this.expr1.getValue(params) >>> this.expr2.getValue(params);
        }
        if (this.type == ">") {
            return this.expr1.getValue(params) > this.expr2.getValue(params);
        }
        if (this.type == "<") {
            return this.expr1.getValue(params) < this.expr2.getValue(params);
        }
        if (this.type == ">=") {
            return this.expr1.getValue(params) >= this.expr2.getValue(params);
        }
        if (this.type == "<=") {
            return this.expr1.getValue(params) <= this.expr2.getValue(params);
        }
        if (this.type == "==") {
            return this.expr1.getValue(params) == this.expr2.getValue(params);
        }
        if (this.type == "===") {
            return this.expr1.getValue(params) === this.expr2.getValue(params);
        }
        if (this.type == "!==") {
            return this.expr1.getValue(params) !== this.expr2.getValue(params);
        }
        if (this.type == "!=") {
            return this.expr1.getValue(params) != this.expr2.getValue(params);
        }
        if (this.type == "&") {
            return this.expr1.getValue(params) & this.expr2.getValue(params);
        }
        if (this.type == "~") {
            return ~this.expr1.getValue(params);
        }
        if (this.type == "^") {
            return this.expr1.getValue(params) ^ this.expr2.getValue(params);
        }
        if (this.type == "|") {
            return this.expr1.getValue(params) | this.expr2.getValue(params);
        }
        if (this.type == "&&") {
            return this.expr1.getValue(params) && this.expr2.getValue(params);
        }
        if (this.type == "||") {
            return this.expr1.getValue(params) || this.expr2.getValue(params);
        }
        if (this.type == "=") {
            this.expr1.setValue(this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "*=") {
            this.expr1.setValue(this.expr1.getValue(params) * this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "/=") {
            this.expr1.setValue(this.expr1.getValue(params) / this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "%=") {
            this.expr1.setValue(this.expr1.getValue(params) % this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "&=") {
            this.expr1.setValue(this.expr1.getValue(params) & this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "+=") {
            this.expr1.setValue(this.expr1.getValue(params) + this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "-=") {
            this.expr1.setValue(this.expr1.getValue(params) - this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "||=") {
            this.expr1.setValue(this.expr1.getValue(params) || this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "<<=") {
            this.expr1.setValue(this.expr1.getValue(params) << this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == ">>=") {
            this.expr1.setValue(this.expr1.getValue(params) >> this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "^=") {
            this.expr1.setValue(this.expr1.getValue(params) ^ this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "|=") {
            this.expr1.setValue(this.expr1.getValue(params) | this.expr2.getValue(params), params);
            return this.expr1.getValue(params);
        }
        if (this.type == "?:") {
            return this.expr1.getValue(params) ? this.expr2.getValue(params) : this.expr3.getValue(params);
        }
        if (this.type == "spfor") {
            var info = params || {};
            info["$s"] = 0;
            info["$len"] = this.expr1.getAttribute("length");
            info["$i"] = null;
            for (var i = 0; i < info["$len"]; i++) {
                info["$i"] = this.expr1.getAttribute(i);
                this.expr2.getValue(info);
            }
            return info.$s;
        }
        return null;
    }

    setValue(val, params) {
        if (this.type == "Atr") {
            this.expr1.setValue(val, params);
        }
    }
}