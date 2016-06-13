module flower {
	export class TimeLine {
		private tweens:Array<any>;

		public constructor()
		{
			this.tweens = [];
		}

		private lastTime:number = -1;
		private _currentTime:number = 0;
		public get totalTime():number
		{
			return this.getTotalTime();
		}

		private getTotalTime():number
		{
			if(this.invalidTotalTime == true)
			{
				return this._totalTime;
			}
			this.invalidTotalTime = true;
			var tweens:Array<any> = this.tweens;
			var endTime:number = 0;
			var time:number;
			for(var i:number = 0,len:number = tweens.length;i < len; i++)
			{
				time = tweens[i].startTime + tweens[i].time;
				if(time > endTime)
				{
					endTime = time;
				}
			}
			this._totalTime = endTime * 1000;
			return this._totalTime;
		}

		private _totalTime:number = 0;
		private invalidTotalTime:boolean = true;
		public $invalidateTotalTime()
		{
			if(this.invalidTotalTime == false)
			{
				return ;
			}
			this.invalidTotalTime = false;
		}

		private _loop:boolean = false;
		public get loop():boolean
		{
			return this._loop;
		}

		public set loop(value:boolean)
		{
			this._loop = value;
		}

		private _isPlaying:boolean = false;
		public get isPlaying():boolean
		{
			return this._isPlaying;
		}

		private update(timeStamp:number,gap:number):boolean
		{
			var totalTime:number = this.getTotalTime();
			var lastTime:number = this._currentTime;
			this._currentTime += timeStamp - this.lastTime;
			var currentTime:number = -1;
			var loopTime:number = 0;
			if(this._currentTime >= totalTime)
			{
				currentTime = this._currentTime % totalTime;
				loopTime = Math.floor(this._currentTime / totalTime);
				if(!this._loop)
				{
					this.$setPlaying(false);
				}
			}
			while(loopTime > -1)
			{
				if(loopTime && currentTime != -1)
				{
					this._currentTime = totalTime;
				}
				var calls:Array<any> = this.calls;
				var call:any;
				var len:number = calls.length;
				for(i = 0; i < len; i++)
				{
					call = calls[i];
					if(call.time > lastTime && call.time <= this._currentTime || (call.time == 0 && lastTime == 0 && this._currentTime))
					{
						call.callBack.apply(call.thisObj,call.args);
					}
				}
				var tweens:Array<any> = this.tweens;
				var tween:flower.Tween;
				len = tweens.length;
				for(var i:number = 0;i < len; i++)
				{
					tween = tweens[i];
					if(tween.$startTime + tween.$time > lastTime && tween.$startTime <= this._currentTime || (tween.$startTime == 0 && lastTime == 0 && this._currentTime))
					{
						tween.$update(this._currentTime);
					}
				}
				loopTime--;
				if(loopTime == 0)
				{
					if(currentTime != -1)
					{
						lastTime = 0;
						this._currentTime = currentTime;
					}
				}
				else
				{
					if(loopTime)
					{
						lastTime = 0;
					}
				}
				if(this._loop == false)
				{
					break;
				}
			}
			this.lastTime = timeStamp;
			return true;
		}

		public play()
		{
			var now:number = flower.Time.currentTime;
			this.$setPlaying(true,now);
		}

		public stop()
		{
			this.$setPlaying(false);
		}

		private $setPlaying(value:boolean,time:number = 0)
		{
			if(value)
			{
				this.lastTime = time;
			}
			if(this._isPlaying == value)
			{
				return ;
			}
			this._isPlaying = value;
			if(value)
			{
				flower.EnterFrame.add(this.update,this);
			}
			else
			{
				flower.EnterFrame.del(this.update,this);
			}
		}

		public gotoAndPlay(time:number)
		{
			if(!this.tweens.length)
			{
				return ;
			}
			time = +time | 0;
			time = time < 0?0:time;
			if(time > this.totalTime)
			{
				time = this.totalTime;
			}
			this._currentTime = time;
			var now:number = flower.Time.currentTime;
			this.$setPlaying(true,now);
		}

		public gotoAndStop(time:number)
		{
			if(!this.tweens.length)
			{
				return ;
			}
			time = +time | 0;
			time = time < 0?0:time;
			if(time > this.totalTime)
			{
				time = this.totalTime;
			}
			this._currentTime = time;
			var now:number = flower.Time.currentTime;
			this.$setPlaying(false);
		}

		public addTween(tween:flower.Tween):flower.Tween
		{
			this.tweens.push(tween);
			tween.$setTimeLine(this);
			this.$invalidateTotalTime();
			return tween;
		}

		public removeTween(tween:flower.Tween)
		{
			var tweens:Array<any> = this.tweens;
			for(var i:number = 0,len:number = tweens.length;i < len; i++)
			{
				if(tweens[i] == tween)
				{
					tweens.splice(i,1)[0].$setTimeLine(null);
					this.$invalidateTotalTime();
					break;
				}
			}
			if(tweens.length == 0)
			{
				this.$setPlaying(false);
			}
		}

		private calls:Array<any> = [];
		public call(time:number,callBack:Function,thisObj:any = null,...args)
		{
			this.calls.push({"time":time,"callBack":callBack,"thisObj":thisObj,"args":args});
		}

	}
}

