module flower {
	export class Time {
		public static currentTime:number;
		public static lastTimeGap:number;
		public static $run(gap:number)
		{
			flower.Time.lastTimeGap = gap;
			flower.Time.currentTime += gap;
			flower.EnterFrame.$update(flower.Time.currentTime,gap);
			flower.Engine.getInstance().$onFrameEnd();
			flower.TextureManager.getInstance().$check();
		}

		public static getTime():number
		{
			return flower.Time.getTime();
		}

	}
}

flower.Time.currentTime = 0;
flower.Time.lastTimeGap = 0;
