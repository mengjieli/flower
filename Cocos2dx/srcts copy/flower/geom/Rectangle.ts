module flower {
	export class Rectangle {
		public x:number;
		public y:number;
		public width:number;
		public height:number;

		public constructor(x:number = 0,y:number = 0,width:number = 0,height:number = 0)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

		public get right():number
		{
			return this.x + this.width;
		}

		public set right(value:number)
		{
			this.width = value - this.x;
		}

		public get bottom():number
		{
			return this.y + this.height;
		}

		public set bottom(value:number)
		{
			this.height = value - this.y;
		}

		public get left():number
		{
			return this.x;
		}

		public set left(value:number)
		{
			this.width += this.x - value;
			this.x = value;
		}

		public get top():number
		{
			return this.y;
		}

		public set top(value:number)
		{
			this.height += this.y - value;
			this.y = value;
		}

		public copyFrom(sourceRect:flower.Rectangle):flower.Rectangle
		{
			this.x = sourceRect.x;
			this.y = sourceRect.y;
			this.width = sourceRect.width;
			this.height = sourceRect.height;
			return this;
		}

		public setTo(x:number,y:number,width:number,height:number):flower.Rectangle
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		}

		public contains(x:number,y:number):boolean
		{
			return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
		}

		public intersection(toIntersect:flower.Rectangle):flower.Rectangle
		{
			return this.clone().$intersectInPlace(toIntersect);
		}

		public $intersectInPlace(clipRect:flower.Rectangle):flower.Rectangle
		{
			var x0:any = this.x;
			var y0:any = this.y;
			var x1:any = clipRect.x;
			var y1:any = clipRect.y;
			var l:any = Math.max(x0,x1);
			var r:any = Math.min(x0 + this.width,x1 + clipRect.width);
			if(l <= r)
			{
				var t:any = Math.max(y0,y1);
				var b:any = Math.min(y0 + this.height,y1 + clipRect.height);
				if(t <= b)
				{
					this.setTo(l,t,r - l,b - t);
					return this;
				}
			}
			this.setEmpty();
			return this;
		}

		public intersects(toIntersect:flower.Rectangle):boolean
		{
			return Math.max(this.x,toIntersect.x) <= Math.min(this.right,toIntersect.right) && Math.max(this.y,toIntersect.y) <= Math.min(this.bottom,toIntersect.bottom);
		}

		public isEmpty():boolean
		{
			return this.width <= 0 || this.height <= 0;
		}

		public setEmpty()
		{
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
		}

		public clone():flower.Rectangle
		{
			return new flower.Rectangle(this.x,this.y,this.width,this.height);
		}

		private _getBaseWidth(angle:number):number
		{
			var u:any = Math.abs(Math.cos(angle));
			var v:any = Math.abs(Math.sin(angle));
			return u * this.width + v * this.height;
		}

		private _getBaseHeight(angle:number):number
		{
			var u:any = Math.abs(Math.cos(angle));
			var v:any = Math.abs(Math.sin(angle));
			return v * this.width + u * this.height;
		}

		public static rectanglePool:Array<flower.Rectangle>;
		public static release(rect:flower.Rectangle)
		{
			if(!rect)
			{
				return ;
			}
			flower.Rectangle.rectanglePool.push(rect);
		}

		public static create():flower.Rectangle
		{
			var rect:flower.Rectangle = flower.Rectangle.rectanglePool.pop();
			if(!rect)
			{
				rect = new flower.Rectangle();
			}
			return rect;
		}

	}
}

flower.Rectangle.rectanglePool = new Array<flower.Rectangle>();
