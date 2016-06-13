module flower {
	export class ResItem {
		public url:string;
		public type:string;
		public serverURL:string;
		public localURL:string;
		public local:boolean = true;

		public constructor()
		{
		}

		public get loadURL():string
		{
			if(this.local)
			{
				return this.localURL + this.url;
			}
			return this.serverURL + this.url;
		}

	}
}

