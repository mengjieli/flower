module flower {
	export class DebugInfo {
		public static NONE:number;
		public static WARN:number;
		public static ERROR:number;
		public static TIP:number;
		public static debug(str:string,type:number = 0)
		{
			if(type == 1 && flower.Setting.warnInfo == false)
				return ;
			if(type == 2 && flower.Setting.errorInfo == false)
				return ;
			if(type == 3 && flower.Setting.tipInfo == false)
				return ;
			if(type == 1)
				str = "[警告]  " + str;
			if(type == 2)
				str = "[错误] " + str;
			if(type == 3)
				str = "[提示] " + str;
			System.log(str);
			if(type == 2)
			{
				var a:any;
				a.abc + 1;
			}
		}

		public static debug2(type:number,...args)
		{
			var str:string = "";
			for(var i:number = 0;i < args.length; i++)
			{
				str += args[i] + "\t";
			}
			flower.DebugInfo.debug(str,type);
		}

	}
}

flower.DebugInfo.NONE = 0;
flower.DebugInfo.WARN = 1;
flower.DebugInfo.ERROR = 2;
flower.DebugInfo.TIP = 3;
