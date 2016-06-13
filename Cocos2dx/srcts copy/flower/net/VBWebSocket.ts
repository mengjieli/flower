module flower {
	export class VBWebSocket extends flower.WebSocket {
		public static id:number;
		private _remote:boolean;
		private remotes:any = {};
		private backs:any = {};
		private zbacks:any = {};

		public constructor(remote:boolean = false)
		{
			super();
			this._remote = remote;
			this.remotes = {};
			this.backs = {};
			this.zbacks = {};
		}

		public get remote():boolean
		{
			return this._remote;
		}

		public onReceiveMessage(type:string,data:any)
		{
			var bytes:flower.VByteArray = new flower.VByteArray();
			if(type == "string")
			{
				bytes.readFromArray(System.JSON_parser(data));
			}
			else
			{
				bytes.readFromArray(data);
			}
			var pos:number;
			var cmd:number = bytes.readUInt();
			var removeList:Array<any>;
			var a:Array<any>;
			var i:number;
			var f:number;
			var backList:Array<any>;
			//trace("[receive] cmd = ",cmd," data = ",bytes.toString());
			if(cmd == 0)
			{
				var backCmd:number = bytes.readUInt();
				var zbackList:Array<any> = this.zbacks[backCmd];
				if(zbackList)
				{
					removeList = [];
					var errorCode:number = bytes.readUInt();
					a = zbackList.concat();
					for(i = 0; i < a.length; i++)
					{
						a[i].func.call(a[i].thisObj,backCmd,errorCode);
						if(a[i].once)
						{
							removeList.push(a[i].id);
						}
					}
					for(i = 0; i < removeList.length; i++)
					{
						for(f = 0; f < this.zbacks[cmd].length; f++)
						{
							if(this.zbacks[cmd][f].id == removeList[i])
							{
								this.zbacks[cmd].splice(f,1);
								break;
							}
						}
					}
				}
				bytes.position = 0;
				bytes.readUInt();
				pos = bytes.position;
				backList = this.backs[cmd];
				if(backList)
				{
					removeList = [];
					a = backList.concat();
					for(i = 0; i < a.length; i++)
					{
						bytes.position = pos;
						a[i].func.call(a[i].thisObj,cmd,bytes);
						if(a[i].once)
						{
							removeList.push(a[i].id);
						}
					}
					for(i = 0; i < removeList.length; i++)
					{
						for(f = 0; f < this.backs[cmd].length; f++)
						{
							if(this.backs[cmd][f].id == removeList[i])
							{
								this.backs[cmd].splice(f,1);
								break;
							}
						}
					}
				}
			}
			else
			{
				var remoteId:number = 0;
				if(this._remote)
				{
					remoteId = bytes.readUInt();
				}
				pos = bytes.position;
				if(remoteId)
				{
					var remote:flower.Remote = this.remotes[remoteId];
					if(remote)
					{
						remote.doNext(cmd,bytes);
					}
				}
				else
				{
					backList = this.backs[cmd];
					if(backList)
					{
						removeList = [];
						a = backList.concat();
						for(i = 0; i < a.length; i++)
						{
							bytes.position = pos;
							a[i].func.call(a[i].thisObj,cmd,bytes);
							if(a[i].once)
							{
								removeList.push(a[i].id);
							}
						}
						for(i = 0; i < removeList.length; i++)
						{
							for(f = 0; f < this.backs[cmd].length; f++)
							{
								if(this.backs[cmd][f].id == removeList[i])
								{
									this.backs[cmd].splice(f,1);
									break;
								}
							}
						}
					}
				}
			}
		}

		public send(data:any)
		{
			System.sendWebSocketBytes(this.localWebSocket,data.data);
		}

		public registerRemote(remote:flower.Remote)
		{
			this.remotes[remote.id] = remote;
		}

		public removeRemote(remote:flower.Remote)
		{
			delete this.remotes[remote.id];
		}

		public register(cmd:number,back:Function,thisObj:any)
		{
			if(this.backs[cmd] == null)
			{
				this.backs[cmd] = [];
			}
			this.backs[cmd].push({func:back,thisObj:thisObj,id:flower.VBWebSocket.id++});
		}

		public registerOnce(cmd:number,back:Function,thisObj:any)
		{
			if(this.backs[cmd] == null)
			{
				this.backs[cmd] = [];
			}
			this.backs[cmd].push({func:back,thisObj:thisObj,once:true,id:flower.VBWebSocket.id++});
		}

		public remove(cmd:number,back:Function,thisObj:any)
		{
			var list:Array<any> = this.backs[cmd];
			if(list)
			{
				for(var i:number = 0;i < list.length; i++)
				{
					if(list[i].func == back && list[i].thisObj == thisObj)
					{
						list.splice(i,1);
						i--;
					}
				}
			}
		}

		public registerZero(cmd:number,back:Function,thisObj:any)
		{
			if(this.zbacks[cmd] == null)
			{
				this.zbacks[cmd] = [];
			}
			this.zbacks[cmd].push({func:back,thisObj:thisObj,id:flower.VBWebSocket.id++});
		}

		public removeZeroe(cmd:number,back:Function,thisObj:any)
		{
			var list:Array<any> = this.zbacks[cmd];
			if(list)
			{
				for(var i:number = 0;i < list.length; i++)
				{
					if(list[i].func == back && list[i].thisObj == thisObj)
					{
						list.splice(i,1);
						i--;
					}
				}
			}
		}

		public registerZeroOnce(cmd:number,back:Function,thisObj:any)
		{
			if(this.zbacks[cmd] == null)
			{
				this.zbacks[cmd] = [];
			}
			this.zbacks[cmd].push({func:back,thisObj:thisObj,once:true,id:flower.VBWebSocket.id++});
		}

	}
}

flower.VBWebSocket.id = 0;
