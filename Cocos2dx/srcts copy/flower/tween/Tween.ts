module flower {
	export class Tween {

		public constructor(target:any,time:number,propertiesTo:any,ease:string = "None",propertiesFrom:any = null)
		{
			if(flower.Tween.plugins == null)
			{
				flower.Tween.registerPlugin("center",flower.TweenCenter);
				flower.Tween.registerPlugin("path",flower.TweenPath);
				flower.Tween.registerPlugin("physicMove",flower.TweenPhysicMove);
			}
			time = +time;
			if(time < 0)
			{
				time = 0;
			}
			this.$time = time * 1000;
			this._target = target;
			this._propertiesTo = propertiesTo;
			this._propertiesFrom = propertiesFrom;
			this.ease = ease;
			var timeLine:flower.TimeLine = new flower.TimeLine();
			timeLine.addTween(this);
		}

		private invalidProperty:boolean = false;
		private _propertiesTo:any;
		public set propertiesTo(value:any)
		{
			if(value == this._propertiesTo)
			{
				return ;
			}
			this._propertiesTo = value;
			this.invalidProperty = false;
		}

		private _propertiesFrom:any;
		public set propertiesFrom(value:any)
		{
			if(value == this._propertiesFrom)
			{
				return ;
			}
			this._propertiesFrom = value;
			this.invalidProperty = false;
		}

		public $time:number;
		public get time():number
		{
			return this.$time / 1000;
		}

		public set time(value:number)
		{
			value = +value | 0;
			this.$time = (+value) * 1000;
			if(this._timeLine)
			{
				this._timeLine.$invalidateTotalTime();
			}
		}

		public $startTime:number = 0;
		public get startTime():number
		{
			return this.$startTime / 1000;
		}

		public set startTime(value:number)
		{
			value = +value | 0;
			if(value < 0)
			{
				value = 0;
			}
			if(value == this.$startTime)
			{
				return ;
			}
			this.$startTime = value * 1000;
			if(this._timeLine)
			{
				this._timeLine.$invalidateTotalTime();
			}
			this.invalidProperty = false;
		}

		private _currentTime:number = 0;
		private _target:any;
		public get target():any
		{
			return this._target;
		}

		public set target(value:any)
		{
			if(value == this.target)
			{
				return ;
			}
			this.removeTargetEvent();
			this._target = value;
			this.invalidProperty = false;
			this.addTargetEvent();
		}

		private _ease:string;
		private _easeData:any;
		public get ease():string
		{
			return this._ease;
		}

		public set ease(val:string)
		{
			if(!flower.Tween.easeCache[val])
			{
				var func:Function = flower.EaseFunction[val];
				if(func == null)
				{
					return ;
				}
				var cache:Array<any> = [];
				for(var i:number = 0;i <= 2000; i++)
				{
					cache[i] = func(i / 2000);
				}
				flower.Tween.easeCache[val] = cache;
			}
			this._ease = val;
			this._easeData = flower.Tween.easeCache[val];
		}

		private _startEvent:string = "";
		public get startEvent():string
		{
			return this._startEvent;
		}

		public set startEvent(type:string)
		{
			this.removeTargetEvent();
			this._startEvent = type;
			this.addTargetEvent();
		}

		private _startTarget:flower.EventDispatcher;
		public get startTarget():flower.EventDispatcher
		{
			return this._startTarget;
		}

		public set startTarget(value:flower.EventDispatcher)
		{
			this.removeTargetEvent();
			this._startTarget = value;
			this.addTargetEvent();
		}

		private removeTargetEvent()
		{
			var target:flower.EventDispatcher;
			if(this._startTarget)
			{
				target = this._startTarget;
			}
			else
			{
				target = this._target;
			}
			if(target && this._startEvent && this._startEvent != "")
			{
				target.removeListener(this._startEvent,this.startByEvent,this);
			}
		}

		private addTargetEvent()
		{
			var target:flower.EventDispatcher;
			if(this._startTarget)
			{
				target = this._startTarget;
			}
			else
			{
				target = this._target;
			}
			if(target && this._startEvent && this._startEvent != "")
			{
				target.addListener(this._startEvent,this.startByEvent,this);
			}
		}

		private startByEvent()
		{
			this._timeLine.gotoAndPlay(0);
		}

		private _timeLine:flower.TimeLine;
		public get timeLine():flower.TimeLine
		{
			if(!this._timeLine)
			{
				this._timeLine = new flower.TimeLine();
				this._timeLine.addTween(this);
			}
			return this._timeLine;
		}

		public $setTimeLine(value:flower.TimeLine)
		{
			if(this._timeLine)
			{
				this._timeLine.removeTween(this);
			}
			this._timeLine = value;
		}

		private pugins:Array<flower.IPlugin> = new Array<flower.IPlugin>();
		private initParmas()
		{
			var controller:flower.IPlugin;
			var params:any = this._propertiesTo;
			var allPlugins:any = flower.Tween.plugins;
			if(params)
			{
				var keys:Array<string> = flower.ObjectDo.keys(allPlugins);
				var deletes:Array<string> = new Array<string>();
				for(var i:number = 0,len:number = keys.length;i < len; i++)
				{
					if(keys[i] in params)
					{
						var plugin:any = allPlugins[keys[i]];
						controller = new plugin();
						deletes = deletes.concat(controller.init(this,params,this._propertiesFrom));
						this.pugins.push(controller);
					}
				}
				for(i = 0; i < deletes.length; i++)
				{
					delete params[deletes[i]];
				}
				keys = flower.ObjectDo.keys(params);
				for(i = 0; i < keys.length; i++)
				{
					var key:any = keys[i];
					if(!(typeof(key) == "string"))
					{
						delete params[key];
						keys.splice(i,1);
						i--;
						continue;
					}
					var attribute:any = params[key];
					if(!(typeof(attribute) == "number") || !(key in this._target))
					{
						delete params[key];
						keys.splice(i,1);
						i--;
						continue;
					}
				}
				if(keys.length)
				{
					controller = new flower.BasicPlugin();
					controller.init(this,params,this._propertiesFrom);
					this.pugins.push(controller);
				}
			}
			this.invalidProperty = true;
		}

		public invalidate()
		{
			this.invalidProperty = false;
		}

		private _complete:Function;
		private _completeThis:any;
		private _completeParams:any;
		public call(callBack:Function,thisObj:any = null,...args):flower.Tween
		{
			this._complete = callBack;
			this._completeThis = thisObj;
			this._completeParams = args;
			return this;
		}

		private _update:Function;
		private _updateThis:any;
		private _updateParams:any;
		public update(callBack:Function,thisObj:any = null,...args):flower.Tween
		{
			this._update = callBack;
			this._updateThis = thisObj;
			this._updateParams = args;
			return this;
		}

		public $update(time:number):boolean
		{
			if(!this.invalidProperty)
			{
				this.initParmas();
			}
			this._currentTime = time - this.$startTime;
			if(this._currentTime > this.$time)
			{
				this._currentTime = this.$time;
			}
			var length:number = this.pugins.length;
			var s:number = this._easeData[2000 * (this._currentTime / this.$time) | 0];
			for(var i:number = 0;i < length; i++)
			{
				this.pugins[i].update(s);
			}
			if(this._update != null)
			{
				this._update.apply(this._updateThis,this._updateParams);
			}
			if(this._currentTime == this.$time)
			{
				if(this._complete != null)
				{
					this._complete.apply(this._completeThis,this._completeParams);
				}
			}
			return true;
		}

		public dispose():void {
			if(this.timeLine) {
				this.timeLine.removeTween(this);
			}
		}

		public static to(target:any,time:number,propertiesTo:any,ease:string = "None",propertiesFrom:any = null):flower.Tween
		{
			var tween:flower.Tween = new flower.Tween(target,time,propertiesTo,ease,propertiesFrom);
			tween.timeLine.play();
			return tween;
		}

		public static plugins:any;
		public static easeCache:any;
		public static registerPlugin(paramName:string,plugin:any)
		{
			if(flower.Tween.plugins == null)
			{
				flower.Tween.plugins = {};
			}
			flower.Tween.plugins[paramName] = plugin;
		}

		public static hasPlugin(paramName:string):boolean
		{
			return flower.Tween.plugins[paramName]?true:false;
		}

	}
}

flower.Tween.easeCache = {};
