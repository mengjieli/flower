module flower {
	export class CallLater {
		private _func:Function;
		private _thisObj:any;
		private _data:Array<any>;

		public constructor(func:Function,thisObj:any,args:Array<any> = null)
		{
			this._func = func;
			this._thisObj = thisObj;
			this._data = args || [];
			flower.CallLater._next.push(this);
		}

		private $call()
		{
			this._func.apply(this._thisObj,this._data);
			this._func = null;
			this._thisObj = null;
			this._data = null;
		}

		public static add(func:Function,thisObj:any,args:Array<any> = null)
		{
			for(var i:number = 0,len:number = flower.CallLater._next.length;i < len; i++)
			{
				if(flower.CallLater._next[i]._func == func && flower.CallLater._next[i]._thisObj == thisObj)
				{
					flower.CallLater._next[i]._data = args || [];
					return ;
				}
			}
			new flower.CallLater(func,thisObj,args);
		}

		public static _next:Array<flower.CallLater>;
		public static _list:Array<flower.CallLater>;
		public static $run()
		{
			if(!flower.CallLater._next.length)
			{
				return ;
			}
			flower.CallLater._list = flower.CallLater._next;
			flower.CallLater._next = new Array<flower.CallLater>();
			var list:Array<flower.CallLater> = flower.CallLater._list;
			while(list.length)
			{
				list.pop().$call();
			}
		}

	}
}

flower.CallLater._next = new Array<flower.CallLater>();
flower.CallLater._list = new Array<flower.CallLater>();
