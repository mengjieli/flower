module flower {
	export class TweenPhysicMove implements flower.IPlugin {

		public constructor()
		{
			if(!flower.Tween.hasPlugin("physicMove"))
			{
				flower.Tween.registerPlugin("physicMove",flower.TweenPhysicMove);
			}
		}

		public init(tween:flower.Tween,propertiesTo:any,propertiesFrom:any):Array<string>
		{
			this.tween = tween;
			var useAttributes:Array<string> = new Array<string>();
			useAttributes.push("physicMove");
			var target:any = tween.target;
			var startX:number = target.x;
			var startY:number = target.y;
			if(propertiesFrom)
			{
				if("x" in propertiesFrom)
				{
					startX = +propertiesFrom["x"];
				}
				if("y" in propertiesFrom)
				{
					startY = +propertiesFrom["y"];
				}
			}
			this.startX = startX;
			this.startY = startY;
			var endX:number = startX;
			var endY:number = startY;
			if("x" in propertiesTo)
			{
				endX = +propertiesTo["x"];
				useAttributes.push("x");
			}
			if("y" in propertiesTo)
			{
				endY = +propertiesTo["y"];
				useAttributes.push("y");
			}
			var vx:number = 0;
			var vy:number = 0;
			var t:number = tween.time;
			if("vx" in propertiesTo)
			{
				vx = +propertiesTo["vx"];
				useAttributes.push("vx");
				if(!("x" in propertiesTo))
				{
					endX = startX + t * vx;
				}
			}
			if("vy" in propertiesTo)
			{
				vy = +propertiesTo["vy"];
				useAttributes.push("vy");
				if(!("y" in propertiesTo))
				{
					endY = startY + t * vy;
				}
			}
			this.vx = vx;
			this.vy = vy;
			this.ax = (endX - startX - vx * t) * 2 / (t * t);
			this.ay = (endY - startY - vy * t) * 2 / (t * t);
			this.time = t;
			return useAttributes;
		}

		private tween:flower.Tween;
		private startX:number;
		private vx:number;
		private ax:number;
		private startY:number;
		private vy:number;
		private ay:number;
		private time:number;
		public update(value:number)
		{
			var target:any = this.tween.target;
			var t:number = this.time * value;
			target.x = this.startX + this.vx * t + .5 * this.ax * t * t;
			target.y = this.startY + this.vy * t + .5 * this.ay * t * t;
		}

		public static freeFallTo(target:any,time:number,groundY:number):flower.Tween
		{
			return flower.Tween.to(target,time,{"y":groundY,"physicMove":true});
		}

		public static freeFallToWithG(target:any,g:number,groundY:number):flower.Tween
		{
			return flower.Tween.to(target,Math.sqrt(2 * (groundY - target.y) / g),{"y":groundY,"physicMove":true});
		}

		public static fallTo(target:any,time:number,groundY:number,vX:any = null,vY:any = null):flower.Tween
		{
			return flower.Tween.to(target,time,{"y":groundY,"physicMove":true,"vx":vX,"vy":vY});
		}

		public static fallToWithG(target:any,g:number,groundY:number,vX:any = null,vY:any = null):flower.Tween
		{
			vX = +vX;
			vY = +vY;
			return flower.Tween.to(target,Math.sqrt(2 * (groundY - target.y) / g + (vY * vY / (g * g))) - vY / g,{"y":groundY,"physicMove":true,"vx":vX,"vy":vY});
		}

		public static to(target:any,time:number,xTo:number,yTo:number,vX:number = 0,vY:number = 0):flower.Tween
		{
			return flower.Tween.to(target,time,{"x":xTo,"y":yTo,"vx":vX,"vy":vY,"physicMove":true});
		}

	}
}

