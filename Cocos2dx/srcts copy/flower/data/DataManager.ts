module flower {
	export class DataManager {
		private _defines:any = {};
		private _root:any = {};

		public constructor()
		{
			if(flower.DataManager.ist)
			{
				return ;
			}
		}

		public addRootData(name:string,className:string)
		{
			this[name] = this.createData(className);
			this._root[name] = this[name];
		}

		public addDefine(config:any):any
		{
			this._defines[config.name] = config;
		}

		public createData(className:string):Object
		{
			var config:any = this._defines[className];
			if(flower.Engine.DEBUG && !config)
			{
				flower.DebugInfo.debug("没有定义的数据类型 :" + className,flower.DebugInfo.ERROR);
				return null;
			}
			var obj:any = {};
			if(config.members)
			{
				var members:any = config.members;
				for(var key in members)
				{
					var member:any = members[key];
					if(member.type == "int")
					{
						obj[key] = new flower.IntValue(member.init);
					}
					else if(member.type == "uint")
					{
						obj[key] = new flower.UIntValue(member.init);
					}
					else if(member.type == "string")
					{
						obj[key] = new flower.StringValue(member.init);
					}
					else if(member.type == "boolean")
					{
						obj[key] = new flower.BooleanValue(member.init);
					}
					else if(member.type == "array")
					{
						obj[key] = new flower.ArrayValue(member.init);
					}
					else if(member.type == "*")
					{
						obj[key] = member.init;
					}
					else
					{
						obj[key] = this.createData(member.type);
					}
				}
			}
			return obj;
		}

		public clear()
		{
			for(var key in this._root)
			{
				delete this._root[key];
				delete this[key];
			}
			this._defines = {};
		}

		public static ist:any;
	}
}

flower.DataManager.ist = new flower.DataManager();
