module flower {
	export class Stmts {
		public type:string = "stmts";
		private list:Array<any> = [];

		public constructor()
		{
		}

		public addStmt(stmt:any)
		{
			this.list.push(stmt);
		}

		public addStmtAt(stmt:any,index:number)
		{
			this.list.splice(index,0,stmt);
		}

		public checkPropertyBinding(commonInfo:any)
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				this.list[i].checkPropertyBinding(commonInfo);
			}
		}

		public getValue():any
		{
			var value:any;
			for(var i:number = 0;i < this.list.length; i++)
			{
				if(i == 0)
				{
					value = this.list[i].getValue();
				}
				else
				{
					this.list[i].getValue();
				}
			}
			return value;
		}

	}
}

