module flower {
	export class BasicPlugin implements flower.IPlugin {

		public constructor()
		{
		}

		public init(tween:flower.Tween,propertiesTo:any,propertiesFrom:any):Array<string>
		{
			this.tween = tween;
			this._attributes = propertiesTo;
			this.keys = flower.ObjectDo.keys(propertiesTo);
			var target:any = tween.target;
			var startAttributes:any = {};
			var keys:Array<string> = this.keys;
			var length:number = keys.length;
			for(var i:number = 0;i < length; i++)
			{
				var key:string = keys[i];
				if(propertiesFrom && key in propertiesFrom)
				{
					startAttributes[key] = propertiesFrom[key];
				}
				else
				{
					startAttributes[key] = target[key];
				}
			}
			this.startAttributes = startAttributes;
			return null;
		}

		public tween:flower.Tween;
		public keys:Array<string>;
		public startAttributes:any;
		public _attributes:any;
		public update(value:number)
		{
			var target:any = this.tween.target;
			var keys:Array<string> = this.keys;
			var length:number = keys.length;
			var startAttributes:any = this.startAttributes;
			for(var i:number = 0;i < length; i++)
			{
				var key:string = keys[i];
				target[key] = (this._attributes[key] - startAttributes[key]) * value + startAttributes[key];
			}
		}

	}
}

