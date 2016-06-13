module flower {
	export class ExprStmt {
		public type:string = "stmt_expr";
		private expr:flower.Expr;

		public constructor(expr:flower.Expr)
		{
			this.expr = expr;
		}

		public checkPropertyBinding(commonInfo:any)
		{
			this.expr.checkPropertyBinding(commonInfo);
		}

		public getValue():any
		{
			return this.expr.getValue();
		}

	}
}

