module test {
	export class TestWebSocket {
		private socket:flower.VBWebSocket;

		public constructor()
		{
			this.socket = new flower.VBWebSocket();
			this.socket.connect("localhost",9999);
			this.socket.addListener(flower.Event.CONNECT,this.onConnect,this);
			this.socket.addListener(flower.Event.ERROR,this.onError,this);
			this.socket.addListener(flower.Event.CLOSE,this.onClose,this);
			this.socket.register(2,this.onLoginBack,this);
		}

		private onConnect(e:flower.Event)
		{
			var bytes:flower.VByteArray = new flower.VByteArray();
			bytes.writeUInt(1);
			bytes.writeUTF("limengjie");
			bytes.writeInt(-1);
			this.socket.send(bytes);
		}

		private onLoginBack(cmd:number,bytes:flower.VByteArray)
		{
			var str:string = bytes.readUTF();
			var num:number = bytes.readInt();
			trace(str,num,bytes.position,bytes.bytesAvailable);
		}

		private onError(e:flower.Event)
		{
			trace("connect error");
		}

		private onClose(e:flower.Event)
		{
			trace("connect close");
		}

	}
}

