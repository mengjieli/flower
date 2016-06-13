module test {
	export class TestBinding extends flower.Sprite {
		private label:flower.Label;

		public constructor()
		{
			super();
			flower.Engine.getInstance().addChild(this);
			var txt:flower.Label = new flower.Label();
			txt.text = "点击改变位置";
			txt.color = 0xff00ff;
			this.addChild(txt);
			this.label = txt;
			flower.DataManager.ist.addDataDeinf({"name":"MainData","desc":"派克总数据","members":{"x":{"desc":"游戏版本号","type":"int"},"y":{"desc":"游戏版本号","type":"int"}}});
			flower.DataManager.ist.addRootData("main","MainData");
			flower.Formula["and"] = function (a:any,b:any):boolean
			{
				a = +a || 0;
				b = +b || 0;
				return a && b?true:false;
			}
;
			txt.bindProperty("x","{main.x}");
			txt.bindProperty("y","{main.y}");
			txt.bindProperty("text","x:{main.x},y:{main.y},我说呢根本不可能\nx+y:{add(main.x,main.y)},\nand:{and(main.x,main.y)},\nprint:{this.print()}");
			txt.addListener(flower.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
		}

		private onTouch(e:flower.TouchEvent)
		{
			trace(this.label.x,this.label.y);
			if(this.label.x > 30)
			{
				this.label.dispose();
			}
			flower.DataManager.ist.main.x.value += 10;
			flower.DataManager.ist.main.y.value += 20;
			trace(this.label.x,this.label.y);
		}

	}
}

