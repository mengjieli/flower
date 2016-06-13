module flower {
	export class IntValue extends flower.Value {
		private _events:Array<any>;
		private _value:any = 0;

		public constructor(initValue:any = 0)
		{
			super();
			if(initValue)
			{
				initValue = +initValue & ~0;
				this._value = initValue;
			}
		}

		public set value(val:any)
		{
			val = +val & ~0;
			if(this._value == val)
			{
				return ;
			}
			var old:any = this._value;
			this._value = val;
			if(!this._events)
			{
				this._events = [];
			}
			var list:Array<any> = this._events;
			for(var i:number = 0,len:number = list.length;i < len; i++)
			{
				if(list[i].del == false)
				{
					var listener:Function = list[i].listener;
					var thisObj:any = list[i].thisObject;
					if(list[i].once)
					{
						list[i].listener = null;
						list[i].thisObject = null;
						list[i].del = true;
					}
					listener.call(thisObj,this._value,old);
				}
			}
			for(i = 0; i < list.length; i++)
			{
				if(list[i].del == true)
				{
					list.splice(i,1);
					i--;
				}
			}
		}

		public get value():any
		{
			return this._value;
		}

		public once(listener:Function,thisObject:any)
		{
			this._addListener(listener,thisObject,true);
		}

		public addListener(listener:Function,thisObject:any)
		{
			this._addListener(listener,thisObject,false);
		}

		private _addListener(listener:Function,thisObject:any,once:boolean)
		{
			if(!this._events)
			{
				this._events = [];
			}
			var list:Array<any> = this._events;
			for(var i:number = 0,len:number = list.length;i < len; i++)
			{
				if(list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false)
				{
					return ;
				}
			}
			list.push({"listener":listener,"thisObject":thisObject,"once":once,"del":false});
		}

		public removeListener(listener:Function,thisObject:any)
		{
			if(!this._events)
			{
				return ;
			}
			var list:Array<any> = this._events;
			for(var i:number = 0,len:number = list.length;i < len; i++)
			{
				if(list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false)
				{
					list[i].listener = null;
					list[i].thisObject = null;
					list[i].del = true;
					break;
				}
			}
		}

		public removeAllListener()
		{
			this._events = [];
		}

		public dispose()
		{
			this._events = null;
		}

		public static pool:Array<flower.IntValue>;
		public static create(initValue:any = null):flower.IntValue
		{
			var value:flower.IntValue;
			if(flower.IntValue.pool.length)
			{
				value = flower.IntValue.pool.pop();
				value._events = [];
				value._value = +initValue & ~0;
			}
			else
			{
				value = new flower.IntValue(initValue);
			}
			return value;
		}

		public static release(value:flower.IntValue)
		{
			value.dispose();
			flower.IntValue.pool.push(value);
		}

	}
}

flower.IntValue.pool = new Array<flower.IntValue>();
