module flower {
	export class CallParams {
		public type:string = "callParams";
		private list:Array<any> = [];

		public constructor()
		{
		}

		public addParam(expr:flower.Expr)
		{
			this.list.push(expr);
		}

		public addParamAt(expr:flower.Expr,index:number)
		{
			this.list.splice(index,0,expr);
		}

		public checkPropertyBinding(commonInfo:any)
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				this.list[i].checkPropertyBinding(commonInfo);
			}
		}

		public getValueList():Array<any>
		{
			var params:Array<any> = [];
			for(var i:number = 0;i < this.list.length; i++)
			{
				params.push((<flower.Expr>this.list[i]).getValue());
			}
			return params;
		}

	}
}

