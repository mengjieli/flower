module flower {
	export class TweenPath implements flower.IPlugin {

		public constructor()
		{
		}

		public init(tween:flower.Tween,propertiesTo:any,propertiesFrom:any):Array<string>
		{
			this.tween = tween;
			var useAttributes:Array<string> = new Array<string>();
			useAttributes.push("path");
			var path:Array<flower.Point> = propertiesTo["path"];
			var target:any = tween.target;
			var start:flower.Point = flower.Point.create(target.x,target.y);
			path.splice(0,0,start);
			if(propertiesFrom)
			{
				if("x" in propertiesFrom)
				{
					start.x = +propertiesFrom["x"];
				}
				if("y" in propertiesFrom)
				{
					start.y = +propertiesFrom["y"];
				}
			}
			if("x" in propertiesTo && "y" in propertiesTo)
			{
				useAttributes.push("x");
				useAttributes.push("y");
				path.push(flower.Point.create(+propertiesTo["x"],+propertiesTo["y"]));
			}
			this.path = path;
			this.pathSum = new Array<number>();
			this.pathSum.push(0);
			for(var i:number = 1,len:number = path.length;i < len; i++)
			{
				this.pathSum[i] = this.pathSum[i - 1] + Math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
			}
			var sum:number = this.pathSum[len - 1];
			for(i = 1; i < len; i++)
			{
				this.pathSum[i] = this.pathSum[i] / sum;
			}
			return useAttributes;
		}

		private tween:flower.Tween;
		private pathSum:Array<number>;
		private path:Array<flower.Point>;
		public update(value:number)
		{
			var path:Array<flower.Point> = this.path;
			var target:any = this.tween.target;
			var pathSum:Array<number> = this.pathSum;
			var i:number,len:number = pathSum.length;
			for(i = 1; i < len; i++)
			{
				if(value > pathSum[i - 1] && value <= pathSum[i])
				{
					break;
				}
			}
			if(value <= 0)
			{
				i = 1;
			}
			else if(value >= 1)
			{
				i = len - 1;
			}
			value = (value - pathSum[i - 1]) / (pathSum[i] - pathSum[i - 1]);
			target.x = value * (path[i].x - path[i - 1].x) + path[i - 1].x;
			target.y = value * (path[i].y - path[i - 1].y) + path[i - 1].y;
		}

		public static to(target:any,time:number,path:Array<flower.Point>,ease:string = "None"):flower.Tween
		{
			return flower.Tween.to(target,time,{"path":path},ease);
		}

		public static vto(target:any,v:number,path:Array<flower.Point>,ease:string = "None"):flower.Tween
		{
			var sum:number = 0;
			for(var i:number = 1,len:number = path.length;i < len; i++)
			{
				sum += Math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
			}
			var time:number = sum / v;
			return flower.Tween.to(target,time,{"path":path},ease);
		}

	}
}

