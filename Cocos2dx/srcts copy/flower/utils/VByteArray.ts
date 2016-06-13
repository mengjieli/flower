module flower {
	export class VByteArray {
		private bytes:Array<any>;
		private big:boolean;
		private _position:number;
		private length:number;

		public constructor(big:boolean = true)
		{
			this.bytes = [];
			this.big = big;
			this.position = 0;
			this.length = 0;
		}

		public readFromArray(bytes:any)
		{
			this.bytes.length = 0;
			this.position = 0;
			this.length = 0;
			this.bytes = bytes;
			this.length = this.bytes.length;
		}

		public writeInt(val:any)
		{
			val = +val & ~0;
			if(val >= 0)
			{
				val *= 2;
			}
			else
			{
				val = ~val;
				val *= 2;
				val++;
			}
			this.writeUInt(val);
		}

		public writeUInt(val:any)
		{
			val = val < 0?0:val;
			val = +val & ~0;
			var flag:boolean = false;
			val = val < 0?-val:val;
			var val2:number = 0;
			if(val >= 0x10000000)
			{
				val2 = val / 0x10000000;
				val = val & 0xFFFFFFF;
				flag = true;
			}
			if(flag || val >> 7)
			{
				this.bytes.splice(this.position,0,0x80 | val & 0x7F);
				this.position++;
				this.length++;
			}
			else
			{
				this.bytes.splice(this.position,0,val & 0x7F);
				this.position++;
				this.length++;
			}
			if(flag || val >> 14)
			{
				this.bytes.splice(this.position,0,0x80 | (val >> 7) & 0x7F);
				this.position++;
				this.length++;
			}
			else if(val >> 7)
			{
				this.bytes.splice(this.position,0,(val >> 7) & 0x7F);
				this.position++;
				this.length++;
			}
			if(flag || val >> 21)
			{
				this.bytes.splice(this.position,0,0x80 | (val >> 14) & 0x7F);
				this.position++;
				this.length++;
			}
			else if(val >> 14)
			{
				this.bytes.splice(this.position,0,(val >> 14) & 0x7F);
				this.position++;
				this.length++;
			}
			if(flag || val >> 28)
			{
				this.bytes.splice(this.position,0,0x80 | (val >> 21) & 0x7F);
				this.position++;
				this.length++;
			}
			else if(val >> 21)
			{
				this.bytes.splice(this.position,0,(val >> 21) & 0x7F);
				this.position++;
				this.length++;
			}
			if(flag)
			{
				this.writeUInt(Math.floor(val2));
			}
		}

		public get position():number
		{
			return this._position;
		}

		public set position(val:number)
		{
			this._position = val;
		}

		public writeByte(val:any)
		{
			val = +val & ~0;
			this.bytes.splice(this.position,0,val);
			this.length += 1;
			this.position += 1;
		}

		public writeBoolean(val:any)
		{
			val = !!val;
			this.bytes.splice(this.position,0,val == true?1:0);
			this.length += 1;
			this.position += 1;
		}

		public writeUTF(val:any)
		{
			val = "" + val;
			var arr:Array<any> = System.stringToBytes(val);
			this.writeUInt(arr.length);
			for(var i:number = 0;i < arr.length; i++)
			{
				this.bytes.splice(this.position,0,arr[i]);
				this.position++;
			}
			this.length += arr.length;
		}

		public writeUTFBytes(val:any,len:number)
		{
			val = "" + val;
			var arr:Array<any> = System.stringToBytes(val);
			for(var i:number = 0;i < len; i++)
			{
				if(i < arr.length)
					this.bytes.splice(this.position,0,arr[i]);
				else
					this.bytes.splice(this.position,0,0);
				this.position++;
			}
			this.length += len;
		}

		public writeBytes(b:flower.VByteArray,start:any = null,len:any = null)
		{
			start = +start & ~0;
			len = +len & ~0;
			var copy:Array<any> = b.data;
			for(var i:number = start;i < copy.length && i < start + len; i++)
			{
				this.bytes.splice(this.position,0,copy[i]);
				this.position++;
			}
			this.length += len;
		}

		public writeByteArray(byteArray:Array<any>)
		{
			this.bytes = this.bytes.concat(byteArray);
			this.length += byteArray.length;
		}

		public readBoolean():boolean
		{
			var val:boolean = this.bytes[this.position] == 0?false:true;
			this.position += 1;
			return val;
		}

		public readInt():number
		{
			var val:number = this.readUInt();
			if(val % 2 == 1)
			{
				val = Math.floor(val / 2);
				val = ~val;
			}
			else
			{
				val = Math.floor(val / 2);
			}
			return val;
		}

		public readUInt():number
		{
			var val:number = 0;
			val += this.bytes[this.position] & 0x7F;
			if(this.bytes[this.position] >> 7)
			{
				this.position++;
				val += (this.bytes[this.position] & 0x7F) << 7;
				if(this.bytes[this.position] >> 7)
				{
					this.position++;
					val += (this.bytes[this.position] & 0x7F) << 14;
					if(this.bytes[this.position] >> 7)
					{
						this.position++;
						val += (this.bytes[this.position] & 0x7F) << 21;
						if(this.bytes[this.position] >> 7)
						{
							this.position++;
							val += ((this.bytes[this.position] & 0x7F) << 24) * 16;
							if(this.bytes[this.position] >> 7)
							{
								this.position++;
								val += ((this.bytes[this.position] & 0x7F) << 24) * 0x800;
								if(this.bytes[this.position] >> 7)
								{
									this.position++;
									val += (this.bytes[this.position] << 24) * 0x40000;
								}
							}
						}
					}
				}
			}
			this.position++;
			return val;
		}

		public readByte():number
		{
			var val:number = this.bytes[this.position];
			this.position += 1;
			return val;
		}

		public readShort():number
		{
			var val:number;
			var bytes:Array<any> = this.bytes;
			if(this.big)
			{
				val = bytes[this.position] | bytes[this.position + 1] << 8;
			}
			else
			{
				val = bytes[this.position] << 8 | bytes[this.position + 1];
			}
			if(val > (1 << 15))
				val = val - (1 << 16);
			this.position += 2;
			return val;
		}

		public readUTF():string
		{
			var len:number = this.readUInt();
			var val:string = System.numberToString(this.bytes.slice(this.position,this.position + len));
			this.position += len;
			return val;
		}

		public readUTFBytes(len:any):string
		{
			len = +len & ~0;
			var val:string = System.numberToString(this.bytes.slice(this.position,this.position + len));
			this.position += len;
			return val;
		}

		public get bytesAvailable():number
		{
			return this.length - this.position;
		}

		public get data():Array<any>
		{
			return this.bytes;
		}

		public toString():string
		{
			var str:string = "";
			for(var i:number = 0;i < this.bytes.length; i++)
			{
				str += this.bytes[i] + (i < this.bytes.length - 1?",":"");
			}
			return str;
		}

	}
}

