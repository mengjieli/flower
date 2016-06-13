 class Flower extends Sprite {

	public constructor()
	{
		super();
		if(System.IDE == "flash")
		{
			System.stage = this["stage"];
			flower.Res.local = false;
			flower.Res.serverURL = "http://localhost:5000/";
		}
		else
		{
			flower.Res.local = true;
			flower.Res.localURL = "";
		}
		var engine = new flower.Engine();
		engine.addListener(flower.Event.READY,this.onEngineReady,this);
		var rect = new flower.RectUI();
		rect.fillColor = 0x555555;
		rect.percentWidth = 100;
		rect.percentHeight = 100;
		engine.addChild(rect);
	}

	 private onEngineReady() {
		 new test.TestCase();
	 }
}

