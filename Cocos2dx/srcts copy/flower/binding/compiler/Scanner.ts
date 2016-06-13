module flower {
	export class Scanner {
		public start:number;
		public moves:any;
		public endInfos:any;
		public befores:any;
		public inputs:any;
		public tokenPos:number;
		public tokenContent:any;
		public tokenContentLength:number;
		public commonInfo:any;
		public lastToken:any;

		public constructor()
		{
			this.start = flower.ScannerTable.start;
			this.moves = flower.ScannerTable.moves;
			this.endInfos = flower.ScannerTable.endInfos;
			this.befores = flower.ScannerTable.befores;
			this.inputs = flower.ScannerTable.inputs;
			this.tokenPos = 0;
			this.tokenContent = null;
			this.tokenContentLength = 0;
			this.commonInfo = null;
			this.lastToken = null;
		}

		public setCommonInfo(info:any)
		{
			this.commonInfo = info;
		}

		public setTokenContent(content:string)
		{
			content += "\r\n";
			this.tokenContent = content;
			this.tokenPos = 0;
			this.tokenContentLength = content.length;
			this.lastToken = null;
		}

		public getNextToken():any
		{
			if(this.tokenContentLength == 0)
			{
				return null;
			}
			var recordPos:number = this.tokenPos;
			var ch:number;
			var findStart:number = this.tokenPos;
			var state:number = this.start;
			var receiveStack:Array<any> = [];
			var lastEndPos:number = -1;
			var lastEndState:number = -1;
			while(this.tokenPos < this.tokenContentLength)
			{
				ch = this.tokenContent.charCodeAt(this.tokenPos);
				if(ch == 92 && this.tokenPos < this.tokenContent.length)
				{
					this.tokenPos++;
				}
				if(this.inputs[ch] == undefined)
				{
					ch = 20013;
				}
				if(this.moves[state] == undefined || this.moves[state][ch] == undefined)
					break;
				state = this.moves[state][ch];
				if(this.endInfos[state] != undefined)
				{
					lastEndPos = this.tokenPos;
					lastEndState = state;
					receiveStack.push([this.tokenPos,state]);
					if(this.endInfos[state] == true)
						break;
				}
				this.tokenPos++;
			}
			var last:any;
			if(receiveStack.length)
			{
				while(receiveStack.length)
				{
					last = receiveStack.pop();
					lastEndPos = last[0];
					lastEndState = last[1];
					if(this.lastToken == null || this.befores[lastEndState] == undefined || (this.befores[lastEndState] != undefined && this.befores[lastEndState][this.lastToken] != undefined))
					{
						this.tokenPos = lastEndPos + 1;
						var str:string = this.tokenContent.slice(findStart,this.tokenPos);
						var result:string = this.getTokenComplete(lastEndState,str);
						if(result == null)
							return this.getNextToken();
						this.commonInfo.tokenPos = findStart;
						if(flower.TokenType.TokenTrans[result] != undefined)
							this.lastToken = this.commonInfo.tokenValue;
						else
							this.lastToken = result;
						return result;
					}
				}
			}
			if(this.tokenPos < this.tokenContent.length)
			{
			}
			else
			{
				this.commonInfo.tokenValue = null;
				return flower.TokenType.Type.endSign;
			}
			return null;
		}

		public getFilePosInfo(content:string,pos:number):string
		{
			var line:number = 1;
			var charPos:number = 1;
			for(var i:number = 0;i < content.length && pos > 0; i++)
			{
				charPos++;
				if(content.charCodeAt(i) == 13)
				{
					if(content.charCodeAt(i + 1) == 10)
					{
						i++;
						pos--;
					}
					charPos = 1;
					line++;
				}
				else if(content.charCodeAt(i + 1) == 10)
				{
					if(content.charCodeAt(i) == 13)
					{
						i++;
						pos--;
					}
					charPos = 1;
					line++;
				}
				pos--;
			}
			return "第" + line + "行，第" + charPos + "个字符(后面10个):" + content.slice(charPos,charPos + 10);
		}

		public installId(commonInfo:any,content:string):Object
		{
			if(commonInfo.ids[content])
			{
				return commonInfo.ids[content];
			}
			var id:any = {"name":content};
			commonInfo.ids[content] = id;
			return id;
		}

		public getTokenComplete(token:any,content:string):string
		{
			this.commonInfo.tokenValue = null;
			switch(token)
			{
				case 1 :
					return null;
				case 37 :
					return flower.TokenType.Type["null"];
				case 26 :
					return flower.TokenType.Type["as"];
				case 27 :
					return flower.TokenType.Type["is"];
				case 38 :
					return flower.TokenType.Type["true"];
				case 39 :
					return flower.TokenType.Type["false"];
				case 3 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 4 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 5 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 6 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 7 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 8 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 9 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 10 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 11 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 12 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 13 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 14 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 15 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 30 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 31 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 18 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 16 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 17 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 19 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 29 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 28 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 36 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 35 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 20 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 21 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 22 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 23 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 24 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["op"];
				case 25 :
				case 42 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["valueInt"];
				case 33 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["valueOxInt"];
				case 32 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["valueNumber"];
				case 34 :
					this.commonInfo.tokenValue = content;
					return flower.TokenType.Type["valueString"];
				case 2 :
				case 41 :
				case 44 :
				case 45 :
				case 46 :
				case 47 :
				case 48 :
				case 49 :
				case 51 :
				case 52 :
				case 53 :
				case 54 :
				case 55 :
					this.commonInfo.tokenValue = this.installId(this.commonInfo,content);
					return flower.TokenType.Type["id"];
			}
			return null;
		}

	}
}

