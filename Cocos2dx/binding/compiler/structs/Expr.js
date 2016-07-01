class Expr {
    type;
    expr1;
    expr2;
    expr3;

    constructor(type,expr1 = null,expr2 = null,expr3 = null)
    {
        this.type = type;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.expr3 = expr3;
        if(type == "int")
        {
            this.expr1 = parseInt(expr1);
        }
    }

    checkPropertyBinding(commonInfo)
    {
        if(this.type == "Atr")
        {
            (this.expr1).checkPropertyBinding(commonInfo);
        }
        if(this.expr1 && this.expr1 instanceof Expr)
        {
            (this.expr1).checkPropertyBinding(commonInfo);
        }
        if(this.expr2 && this.expr2 instanceof Expr)
        {
            (this.expr2).checkPropertyBinding(commonInfo);
        }
        if(this.expr3 && this.expr3 instanceof Expr)
        {
            (this.expr3).checkPropertyBinding(commonInfo);
        }
    }

    getValue()
    {
        if(this.type == "Atr")
        {
            return this.expr1.getValue();
        }
        if(this.type == "int")
        {
            return this.expr1;
        }
        if(this.type == "0xint")
        {
            return this.expr1;
        }
        if(this.type == "number")
        {
            return this.expr1;
        }
        if(this.type == "boolean")
        {
            return this.expr1;
        }
        if(this.type == "string")
        {
            return this.expr1;
        }
        if(this.type == "+a")
        {
            return this.expr1.getValue();
        }
        if(this.type == "-a")
        {
            return -this.expr1.getValue();
        }
        if(this.type == "!")
        {
            return !this.expr1.getValue();
        }
        if(this.type == "*")
        {
            return this.expr1.getValue() * this.expr2.getValue();
        }
        if(this.type == "/")
        {
            return this.expr1.getValue() / this.expr2.getValue();
        }
        if(this.type == "%")
        {
            return this.expr1.getValue() % this.expr2.getValue();
        }
        if(this.type == "+")
        {
            return this.expr1.getValue() + this.expr2.getValue();
        }
        if(this.type == "-")
        {
            return this.expr1.getValue() - this.expr2.getValue();
        }
        if(this.type == "<<")
        {
            return this.expr1.getValue() << this.expr2.getValue();
        }
        if(this.type == ">>")
        {
            return this.expr1.getValue() >> this.expr2.getValue();
        }
        if(this.type == ">>>")
        {
            return this.expr1.getValue() >>> this.expr2.getValue();
        }
        if(this.type == ">")
        {
            return this.expr1.getValue() > this.expr2.getValue();
        }
        if(this.type == "<")
        {
            return this.expr1.getValue() < this.expr2.getValue();
        }
        if(this.type == ">=")
        {
            return this.expr1.getValue() >= this.expr2.getValue();
        }
        if(this.type == "<=")
        {
            return this.expr1.getValue() <= this.expr2.getValue();
        }
        if(this.type == "==")
        {
            return this.expr1.getValue() == this.expr2.getValue();
        }
        if(this.type == "===")
        {
            return this.expr1.getValue() === this.expr2.getValue();
        }
        if(this.type == "!==")
        {
            return this.expr1.getValue() !== this.expr2.getValue();
        }
        if(this.type == "!=")
        {
            return this.expr1.getValue() != this.expr2.getValue();
        }
        if(this.type == "&")
        {
            return this.expr1.getValue() & this.expr2.getValue();
        }
        if(this.type == "~")
        {
            return ~this.expr1.getValue();
        }
        if(this.type == "^")
        {
            return this.expr1.getValue() ^ this.expr2.getValue();
        }
        if(this.type == "|")
        {
            return this.expr1.getValue() | this.expr2.getValue();
        }
        if(this.type == "&&")
        {
            return this.expr1.getValue() && this.expr2.getValue();
        }
        if(this.type == "||")
        {
            return this.expr1.getValue() || this.expr2.getValue();
        }
        if(this.type == "?:")
        {
            return this.expr1.getValue()?this.expr2.getValue():this.expr3.getValue();
        }
        return null;
    }

}