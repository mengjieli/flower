module flower {
	export class TextureManager {
		private list:Array<flower.Texture2D> = new Array<flower.Texture2D>();

		public constructor()
		{
			if(flower.TextureManager.classLock == true)
			{
				flower.DebugInfo.debug("无法创建对象TextureManager，此类为单例模式，请访问TextureManager.getInstance()",flower.DebugInfo.WARN);
				return ;
			}
		}

		public createTexture(nativeTexture:any,url:string,nativeURL:string,w:number,h:number):flower.Texture2D
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				if(this.list[i].url == url)
				{
					if(flower.Engine.DEBUG)
					{
						flower.DebugInfo.debug("|重复创建纹理| " + url,flower.DebugInfo.ERROR);
					}
					return this.list[i];
				}
			}
			if(flower.Engine.TIP)
			{
				flower.DebugInfo.debug("|创建纹理| " + url,flower.DebugInfo.TIP);
			}
			var texture:flower.Texture2D = new flower.Texture2D(nativeTexture,url,nativeURL,w,h);
			this.list.push(texture);
			return texture;
		}

		public getTextureByNativeURL(url:string):flower.Texture2D
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				if(this.list[i].nativeURL == url)
				{
					return this.list[i];
				}
			}
			return null;
		}

		public $check()
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				if(this.list[i].$count == 0)
				{
					flower.Texture2D.safeLock = false;
					this.list.splice(i,1)[0].dispose();
					flower.Texture2D.safeLock = true;
					return ;
				}
			}
		}

		public static classLock:boolean;
		public static ist:flower.TextureManager;
		public static getInstance():flower.TextureManager
		{
			if(!flower.TextureManager.ist)
			{
				flower.TextureManager.classLock = false;
				flower.TextureManager.ist = new flower.TextureManager();
				flower.TextureManager.classLock = true;
			}
			return flower.TextureManager.ist;
		}

	}
}

flower.TextureManager.classLock = true;
