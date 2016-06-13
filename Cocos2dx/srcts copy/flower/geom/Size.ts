module flower {
    export class Size {
        public width:number;
        public height:number;

        public constructor(width:number = 0,height:number = 0)
        {
            this.width = width;
            this.height = height;
        }

        public setTo(width:number = 0,height:number = 0):flower.Size
        {
            this.width = width;
            this.height = height;
            return this;
        }

        public get area():number
        {
            return this.width*this.height;
        }

        public static $TempSize:flower.Size;
        public static pointPool:Array<flower.Size>;
        public static release(point:flower.Size)
        {
            if(!point)
            {
                return ;
            }
            flower.Size.pointPool.push(point);
        }

        public static create(width:number,height:number):flower.Size
        {
            var point:flower.Size = flower.Size.pointPool.pop();
            if(!point)
            {
                point = new flower.Size(width,height);
            }
            else
            {
                point.width = width;
                point.height = height;
            }
            return point;
        }

    }
}

flower.Size.$TempSize = new flower.Size();
flower.Size.pointPool = new Array<flower.Size>();
