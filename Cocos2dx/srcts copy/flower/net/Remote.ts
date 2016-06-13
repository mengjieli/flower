module flower {
	export class Remote {
		public static id:number;
		private _id:number;
		private back:Function;
		private thisObj:any;
		public data:any;

		public constructor(func:Function,thisObj:any)
		{
			this.back = func;
			this.thisObj = thisObj;
			this._id = flower.Remote.id++;
		}

		public set backFunction(val:Function)
		{
			this.back = val;
		}

		public get id():number
		{
			return this._id;
		}

		public doNext(cmd:number,msg:any)
		{
			this.back.apply(this,[cmd,msg,this]);
		}

		public dispose()
		{
		}

	}
}

flower.Remote.id = 1;
