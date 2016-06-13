module flower {
	export class ObjectDo {
		public static toString(obj:any,maxDepth:number = 4,before:string = "",depth:number = 0):string
		{
			before = before || "";
			depth = depth || 0;
			maxDepth = maxDepth || 4;
			var str:string = "";
			if(typeof(obj) == "string" || typeof(obj) == "number")
			{
				str += obj;
			}
			else if(obj instanceof Array)
			{
				if(depth > maxDepth)
				{
					return "...";
				}
				str = "[\n";
				for(var i:number = 0;i < obj.length; i++)
				{
					str += before + "\t" + flower.ObjectDo.toString(obj[i],maxDepth,before + "\t",depth + 1) + (i < obj.length - 1?",\n":"\n");
				}
				str += before + "]";
			}
			else if(obj instanceof Object)
			{
				if(depth > maxDepth)
				{
					return "...";
				}
				str = "{\n";
				for(var key in obj)
				{
					str += before + "\t" + key + "\t: " + flower.ObjectDo.toString(obj[key],maxDepth,before + "\t",depth + 1);
					str += ",\n";
				}
				if(str.slice(str.length - 2,str.length) == ",\n")
				{
					str = str.slice(0,str.length - 2) + "\n";
				}
				str += before + "}";
			}
			else
			{
				str += obj;
			}
			return str;
		}

		public static keys(obj:any):Array<string>
		{
			var list:Array<string> = new Array<string>();
			for(var key in obj)
			{
				list.push(key);
			}
			return list;
		}

		public static copy(obj:any):any
		{
			return obj;
		}

	}
}

