module flower {
	export class Matrix {
		public static sin:number;
		public static cos:number;
		public a:number = 1;
		public b:number = 0;
		public c:number = 0;
		public d:number = 1;
		public tx:number = 0;
		public ty:number = 0;
		public _storeList:Array<any> = [];

		public constructor()
		{
		}

		public identity()
		{
			this.a = 1;
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.tx = 0;
			this.ty = 0;
		}

		public setTo(aa:number,bb:number,cc:number,dd:number,txx:number,tyy:number)
		{
			this.a = aa;
			this.b = bb;
			this.c = cc;
			this.d = dd;
			this.tx = txx;
			this.ty = tyy;
		}

		public translate(x:number,y:number)
		{
			this.tx += x;
			this.ty += y;
		}

		public rotate(angle:number)
		{
			flower.Matrix.sin = Math.sin(angle);
			flower.Matrix.cos = Math.cos(angle);
			this.setTo(this.a * flower.Matrix.cos - this.c * flower.Matrix.sin,this.a * flower.Matrix.sin + this.c * flower.Matrix.cos,this.b * flower.Matrix.cos - this.d * flower.Matrix.sin,this.b * flower.Matrix.sin + this.d * flower.Matrix.cos,this.tx * flower.Matrix.cos - this.ty * flower.Matrix.sin,this.tx * flower.Matrix.sin + this.ty * flower.Matrix.cos);
		}

		public scale(sx:number,sy:number)
		{
			this.a = sx;
			this.d = sy;
			this.tx *= this.a;
			this.ty *= this.d;
		}

		public prependMatrix(prep:flower.Matrix)
		{
			this.setTo(this.a * prep.a + this.c * prep.b,this.b * prep.a + this.d * prep.b,this.a * prep.c + this.c * prep.d,this.b * prep.c + this.d * prep.d,this.tx + this.a * prep.tx + this.c * prep.ty,this.ty + this.b * prep.tx + this.d * prep.ty);
		}

		public prependTranslation(tx:number,ty:number)
		{
			this.tx += this.a * tx + this.c * ty;
			this.ty += this.b * tx + this.d * ty;
		}

		public prependScale(sx:number,sy:number)
		{
			this.setTo(this.a * sx,this.b * sx,this.c * sy,this.d * sy,this.tx,this.ty);
		}

		public prependRotation(angle:number)
		{
			var sin:number = Math.sin(angle);
			var cos:number = Math.cos(angle);
			this.setTo(this.a * cos + this.c * sin,this.b * cos + this.d * sin,this.c * cos - this.a * sin,this.d * cos - this.b * sin,this.tx,this.ty);
		}

		public prependSkew(skewX:number,skewY:number)
		{
			var sinX:number = Math.sin(skewX);
			var cosX:number = Math.cos(skewX);
			var sinY:number = Math.sin(skewY);
			var cosY:number = Math.cos(skewY);
			this.setTo(this.a * cosY + this.c * sinY,this.b * cosY + this.d * sinY,this.c * cosX - this.a * sinX,this.d * cosX - this.b * sinX,this.tx,this.ty);
		}

		public get deformation():boolean
		{
			if(this.a != 1 || this.b != 0 || this.c != 0 || this.d != 1)
				return true;
			return false;
		}

		public save()
		{
			var matrix:flower.Matrix = flower.Matrix.create();
			matrix.a = this.a;
			matrix.b = this.b;
			matrix.c = this.c;
			matrix.d = this.d;
			matrix.tx = this.tx;
			matrix.ty = this.ty;
			this._storeList.push(matrix);
		}

		public restore()
		{
			var matrix:flower.Matrix = this._storeList.pop();
			this.setTo(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
			flower.Matrix.release(matrix);
		}

		public static $matrix:flower.Matrix;
		public static matrixPool:Array<flower.Matrix>;
		public static release(matrix:flower.Matrix)
		{
			if(!matrix)
			{
				return ;
			}
			matrix._storeList.length = 0;
			flower.Matrix.matrixPool.push(matrix);
		}

		public static create():flower.Matrix
		{
			var matrix:flower.Matrix = flower.Matrix.matrixPool.pop();
			if(!matrix)
			{
				matrix = new flower.Matrix();
			}
			return matrix;
		}

	}
}

flower.Matrix.$matrix = new flower.Matrix();
flower.Matrix.matrixPool = new Array<flower.Matrix>();
