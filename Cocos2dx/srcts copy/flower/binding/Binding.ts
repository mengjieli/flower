module flower {
	export class Binding {
		private singleValue:boolean = false;
		private list:Array<any> = [];
		private stmts:Array<any> = [];
		private thisObj:any;
		private property:string;
		private content:string;

		public constructor(thisObj:any,checks:Array<any>,property:string,content:string)
		{
			var i:number;
			if(checks == null)
			{
				checks = flower.Binding.bindingChecks.concat();
			}
			else
			{
				for(i = 0; i < flower.Binding.bindingChecks.length; i++)
				{
					checks.push(flower.Binding.bindingChecks[i]);
				}
			}
			checks.push(thisObj);
			var lastEnd:number = 0;
			var parseError = false;
			for(i = 0; i < content.length; i++)
			{
				if(content.charAt(i) == "{")
				{
					for(var j:number = i + 1;j < content.length; j++)
					{
						if(content.charAt(j) == "{")
						{
							break;
						}
						if(content.charAt(j) == "}")
						{
							if(i == 0 && j == content.length - 1)
							{
								this.singleValue = true;
							}
							if(lastEnd < i)
							{
								this.stmts.push(content.slice(lastEnd,i));
								lastEnd = j + 1;
							}
							var stmt:flower.Stmts = flower.Compiler.parserExpr(content.slice(i + 1,j),checks,{"this":thisObj},{"Tween":flower.Tween,"Ease":flower.Ease},this.list);
							if(stmt == null) {
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
			if(parseError) {
				thisObj[property] = content;
				return ;
			}
			if(lastEnd < content.length)
			{
				this.stmts.push(content.slice(lastEnd,content.length));
			}
			this.thisObj = thisObj;
			this.property = property;
			for(i = 0; i < this.list.length; i++)
			{
				for(j = 0; j < this.list.length; j++)
				{
					if(i != j && this.list[i] == this.list[j])
					{
						this.list.splice(j,1);
						i = -1;
						break;
					}
				}
			}
			for(i = 0; i < this.list.length; i++)
			{
				this.list[i].addListener(this.update,this);
			}
			this.update();
		}

		private update(value:any = null,old:any = null)
		{
			if(this.singleValue)
			{
				try 
				{
					this.thisObj[this.property] = this.stmts[0].getValue();
				}
				catch(e)
				{
					this.thisObj[this.property] = null;
				}

			}
			else
			{
				var str:string = "";
				for(var i:number = 0;i < this.stmts.length; i++)
				{
					var expr:any = this.stmts[i];
					if(expr instanceof flower.Stmts)
					{
						try 
						{
							str += expr.getValue();
						}
						catch(e)
						{
							str += "null";
						}

					}
					else
					{
						str += expr;
					}
				}
				this.thisObj[this.property] = str;
			}
		}

		public dispose()
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				this.list[i].removeListener(this.update,this);
			}
		}

		public static bindingChecks:Array<any>;
		public static addBindingCheck(check:any)
		{
			for(var i:number = 0;i < flower.Binding.bindingChecks.length; i++)
			{
				if(flower.Binding.bindingChecks[i] == check)
				{
					return ;
				}
			}
			flower.Binding.bindingChecks.push(check);
		}

		public static clearBindingChecks()
		{
			flower.Binding.bindingChecks = null;
		}

	}
}

flower.Binding.bindingChecks = [];
