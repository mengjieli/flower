module flower {
	export class EnterFrame {
		public static enterFrames:Array<any>;
		public static waitAdd:Array<any>;
		public static add(call:Function,owner:any)
		{
			for(var i:number = 0;i < flower.EnterFrame.enterFrames.length; i++)
			{
				if(flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner)
				{
					return ;
				}
			}
			for(i = 0; i < flower.EnterFrame.waitAdd.length; i++)
			{
				if(flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner)
				{
					return ;
				}
			}
			flower.EnterFrame.waitAdd.push({"call":call,"owner":owner});
		}

		public static del(call:Function,owner:any)
		{
			for(var i:number = 0;i < flower.EnterFrame.enterFrames.length; i++)
			{
				if(flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner)
				{
					flower.EnterFrame.enterFrames.splice(i,1);
					return ;
				}
			}
			for(i = 0; i < flower.EnterFrame.waitAdd.length; i++)
			{
				if(flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner)
				{
					flower.EnterFrame.waitAdd.splice(i,1);
					return ;
				}
			}
		}

		public static frame:number;
		public static updateFactor:number;
		public static $update(now:number,gap:number)
		{
			flower.EnterFrame.frame++;
			flower.CallLater.$run();
			if(flower.EnterFrame.waitAdd.length)
			{
				flower.EnterFrame.enterFrames = flower.EnterFrame.enterFrames.concat(flower.EnterFrame.waitAdd);
				flower.EnterFrame.waitAdd = [];
			}
			var copy:Array<any> = flower.EnterFrame.enterFrames;
			for(var i:number = 0;i < copy.length; i++)
			{
				copy[i].call.apply(copy[i].owner,[now,gap]);
			}
		}

	}
}

flower.EnterFrame.enterFrames = [];
flower.EnterFrame.waitAdd = [];
flower.EnterFrame.frame = 0;
flower.EnterFrame.updateFactor = 1;
