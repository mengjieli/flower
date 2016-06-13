module flower {
	export class ObjectAtr {
		private list:Array<any>;

		public constructor(list:Array<any>)
		{
			this.list = list;
			for(var i:number = 0;i < list.length; i++)
			{
				list[i][0] = list[i][0].getValue();
			}
		}

		public checkPropertyBinding(commonInfo:any)
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				this.list[i][1].checkPropertyBinding(commonInfo);
			}
		}

		public getValue():any
		{
			var val:any = {};
			for(var i:number = 0;i < this.list.length; i++)
			{
				val[this.list[i][0]] = this.list[i][1].getValue();
			}
			return val;
		}

	}
}

