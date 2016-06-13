module flower {
	export class Point {
		public x:number;
		public y:number;

		public constructor(x:number = 0,y:number = 0)
		{
			this.x = x;
			this.y = y;
		}

		public setTo(x:number = 0,y:number = 0):flower.Point
		{
			this.x = x;
			this.y = y;
			return this;
		}

		public get length():number
		{
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}

		public static distance(p1:flower.Point,p2:flower.Point):number
		{
			return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
		}

		public static $TempPoint:flower.Point;
		public static pointPool:Array<flower.Point>;
		public static release(point:flower.Point)
		{
			if(!point)
			{
				return ;
			}
			flower.Point.pointPool.push(point);
		}

		public static create(x:number,y:number):flower.Point
		{
			var point:flower.Point = flower.Point.pointPool.pop();
			if(!point)
			{
				point = new flower.Point(x,y);
			}
			else
			{
				point.x = x;
				point.y = y;
			}
			return point;
		}

	}
}

flower.Point.$TempPoint = new flower.Point();
flower.Point.pointPool = new Array<flower.Point>();
