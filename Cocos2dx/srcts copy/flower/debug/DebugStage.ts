module flower {
	export class DebugStage extends flower.Stage {
		private initFlag:boolean;
		private toolBar:flower.DebugToolBar;

		public constructor()
		{
			super();
		}

		public show()
		{
			if(!this.initFlag)
			{
				if(flower.Engine.getInstance().isReady)
				{
					this.init();
				}
				else
				{
					flower.Engine.getInstance().addListener(flower.Event.READY,this.init,this);
				}
			}
			this.visible = true;
		}

		public hide()
		{
			this.visible = false;
		}

		private init(e:flower.Event = null)
		{
			if(!this.visible)
			{
				return ;
			}
			this.initFlag = true;
			this.toolBar = new flower.DebugToolBar();
			flower.Engine.getInstance().addChild(this.toolBar);
		}

	}
}

