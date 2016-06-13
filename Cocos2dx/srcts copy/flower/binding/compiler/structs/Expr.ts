module flower {
	export class Expr {
		private type:string;
		private expr1:any;
		private expr2:any;
		private expr3:any;

		public constructor(type:string,expr1:any = null,expr2:any = null,expr3:any = null)
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

		public checkPropertyBinding(commonInfo:any)
		{
			if(this.type == "Atr")
			{
				(<flower.ExprAtr>this.expr1).checkPropertyBinding(commonInfo);
			}
			if(this.expr1 && this.expr1 instanceof flower.Expr)
			{
				(<flower.Expr>this.expr1).checkPropertyBinding(commonInfo);
			}
			if(this.expr2 && this.expr2 instanceof flower.Expr)
			{
				(<flower.Expr>this.expr2).checkPropertyBinding(commonInfo);
			}
			if(this.expr3 && this.expr3 instanceof flower.Expr)
			{
				(<flower.Expr>this.expr3).checkPropertyBinding(commonInfo);
			}
		}

		public getValue():any
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
}

