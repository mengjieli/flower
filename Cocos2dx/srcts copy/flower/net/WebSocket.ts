module flower {
	export class WebSocket extends flower.EventDispatcher {
		private _ip:string;
		private _port:number;
		public localWebSocket:any;

		public constructor()
		{
			super();
		}

		public connect(ip:string,port:number)
		{
			if(this.localWebSocket)
			{
				System.releaseWebSocket(this.localWebSocket);
			}
			this._ip = ip;
			this._port = port;
			this.localWebSocket = System.bindWebSocket(ip,port,this,this.onConnect,this.onReceiveMessage,this.onError,this.onClose);
		}

		public get ip():string
		{
			return this._ip;
		}

		public get port():number
		{
			return this._port;
		}

		public onConnect()
		{
			this.dispatchWidth(flower.Event.CONNECT);
		}

		public onReceiveMessage(type:string,data:any)
		{
		}

		public send(data:any)
		{
			System.sendWebSocketUTF(this.localWebSocket,data);
		}

		public onError()
		{
			this.dispatchWidth(flower.Event.ERROR);
		}

		public onClose()
		{
			this.dispatchWidth(flower.Event.CLOSE);
		}

		public close()
		{
			if(this.localWebSocket)
			{
				System.releaseWebSocket(this.localWebSocket);
			}
		}

	}
}

