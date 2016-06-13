module flower {
	export class URLLoaderList extends flower.EventDispatcher {

		private list:Array<any>;
		private dataList:Array<any>;
		private index:number;

		public constructor(list:Array<any>)
		{
			super();
			this.list = list;
			this.dataList = [];
			this.index = 0;
			this.loadNext();
		}

		private loadNext()
		{
			if(this.index >= this.list.length)
			{
				this.dispatchWidth(flower.Event.COMPLETE,this.dataList);
				this.list = null;
				this.dataList = null;
				this.dispose();
				return ;
			}
			var item:any = this.list[this.index];
			var load:flower.URLLoader = new flower.URLLoader(item);
			load.addListener(flower.Event.COMPLETE,this.onComplete,this);
		}

		private onComplete(e:flower.Event)
		{
			this.dataList[this.index] = e.data;
			this.index++;
			this.loadNext();
		}
	}
}

