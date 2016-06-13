module flower {
	export class XMLElement extends flower.XMLAttribute {
		public namesapces:Array<flower.XMLNameSpace>;
		public attributes:Array<flower.XMLAttribute>;
		public list:Array<flower.XMLElement>;
		public value:string;

		public constructor()
		{
			super();
			this.namesapces = new Array<flower.XMLNameSpace>();
			this.attributes = new Array<flower.XMLAttribute>();
			this.list = new Array<flower.XMLElement>();
		}

		public addNameSpace(nameSpace:flower.XMLNameSpace):void {
			this.namesapces.push(nameSpace);
		}

		public getAttribute(name:string):flower.XMLAttribute {
			for(var i = 0; i < this.attributes.length; i++) {
				if(this.attributes[i].name == name) {
					return this.attributes[i];
				}
			}
			return null;
		}

		public getNameSapce(name:string):flower.XMLNameSpace
		{
			for(var i:number = 0;i < this.namesapces.length; i++)
			{
				if(this.namesapces[i].name == name)
				{
					return this.namesapces[i];
				}
			}
			return null;
		}

		public getElementByAttribute(atrName:string,value:string):flower.XMLElement
		{
			for(var i:number = 0;i < this.list.length; i++)
			{
				for(var a:number = 0;a < this.list[i].attributes.length; a++)
				{
					if(this.list[i].attributes[a].name == atrName && this.list[i].attributes[a].value == value)
					{
						return this.list[i];
					}
				}
			}
			return null;
		}

		public getElement(name:string):flower.XMLElement {
			for(var i = 0; i < this.list.length; i++) {
				if(this.list[i].name == name) {
					return this.list[i];
				}
			}
			return null;
		}

		public getElements(atrName:string):Array<flower.XMLElement> {
			var res:Array<flower.XMLElement> = [];
			for(var i = 0; i < this.list.length; i++) {
				if(this.list[i].name == atrName) {
					res.push(this.list[i]);
				}
			}
			return res;
		}

		public getAllElements():Array<flower.XMLElement> {
			var res:Array<flower.XMLElement> = [this];
			for(var i = 0; i < this.list.length; i++) {
				res = res.concat(this.list[i].getAllElements());
			}
			return res;
		}

		public parse(content:string)
		{
			var delStart:number = -1;
			for(var i:number = 0;i < content.length; i++)
			{
				if(content.charAt(i) == "\r" || content.charAt(i) == "\n")
				{
					content = content.slice(0,i) + content.slice(i + 1,content.length);
					i--;
				}
				if(delStart == -1 && (content.slice(i,i + 2) == "<!" || content.slice(i,i + 2) == "<?"))
				{
					delStart = i;
				}
				if(delStart != -1 && content.charAt(i) == ">")
				{
					content = content.slice(0,delStart) + content.slice(i + 1,content.length);
					i = i - (i - delStart + 1);
					delStart = -1;
				}
			}
			this.readInfo(content);
			if(this.value == "") {
				this.value = null;
			}
		}

		private readInfo(content:string,startIndex:number = 0):number
		{
			var leftSign:number = -1;
			var len:number = content.length;
			var c:string;
			var j:number;
			for(var i:number = startIndex;i < len; i++)
			{
				c = content.charAt(i);
				if(c == "<")
				{
					for(j = i + 1; j < len; j++)
					{
						c = content.charAt(j);
						if(c != " " && c != "\t")
						{
							i = j;
							break;
						}
					}
					for(j = i + 1; j < len; j++)
					{
						c = content.charAt(j);
						if(c == " " || c == "\t" || c == "/" || c == ">")
						{
							this.name = content.slice(i,j);
							i = j;
							break;
						}
					}
					break;
				}
			}
			var end:boolean = false;
			var attribute:flower.XMLAttribute;
			var nameSpace:flower.XMLNameSpace;
			for(; i < len; i++)
			{
				c = content.charAt(i);
				if(c == "/")
				{
					end = true;
				}
				else if(c == ">")
				{
					i++;
					break;
				}
				else if(c == " " || c == "\t")
				{
				}
				else
				{
					for(j = i + 1; j < len; j++)
					{
						c = content.charAt(j);
						if(c == "=" || c == " " || c == "\t")
						{
							var atrName:string = content.slice(i,j);
							if(atrName.split(":").length == 2)
							{
								nameSpace = new flower.XMLNameSpace();
								this.namesapces.push(nameSpace);
								nameSpace.name = atrName.split(":")[1];
							}
							else
							{
								attribute = new flower.XMLAttribute();
								this.attributes.push(attribute);
								attribute.name = atrName;
							}
							break;
						}
					}
					j++;
					var startSign:string;
					for(; j < len; j++)
					{
						c = content.charAt(j);
						if(c == "\"" || c == "'")
						{
							i = j + 1;
							startSign = c;
							break;
						}
					}
					j++;
					for(; j < len; j++)
					{
						c = content.charAt(j);
						if(c == startSign && content.charAt(j - 1) != "\\")
						{
							if(attribute)
							{
								attribute.value = content.slice(i,j);
								attribute = null;
							}
							else
							{
								nameSpace.value = content.slice(i,j);
								nameSpace = null;
							}
							i = j;
							break;
						}
					}
				}
			}
			if(end == true)
				return i;
			var contentStart:number;
			for(; i < len; i++)
			{
				c = content.charAt(i);
				if(c != " " && c != "\t")
				{
					contentStart = i;
					i--;
					break;
				}
			}
			for(; i < len; i++)
			{
				c = content.charAt(i);
				if(c == "<")
				{
					for(j = i + 1; j < len; j++)
					{
						c = content.charAt(j);
						if(c != " " && c != "\t")
						{
							break;
						}
					}
					if(c == "/")
					{
						for(j = i + 1; j < len; j++)
						{
							c = content.charAt(j);
							if(c == " " || c == "\t" || c == ">")
							{
								var endName:string = content.slice(i + 2,j);
								if(endName != this.name)
								{
									flower.DebugInfo.debug("开始标签和结尾标签不一致，开始标签：" + this.name + " ，结尾标签：" + endName,flower.DebugInfo.ERROR);
								}
								break;
							}
						}
						if(this.list.length == 0)
						{
							i--;
							for(; i >= 0; i--)
							{
								c = content.charAt(i);
								if(c != " " && c != "\t")
								{
									break;
								}
							}
							this.value = content.slice(contentStart,i + 1);
						}
						for(; j < len; j++)
						{
							c = content.charAt(j);
							if(c == ">")
							{
								i = j + 1;
								break;
							}
						}
						end = true;
						break;
					}
					else
					{
						var element:flower.XMLElement = new flower.XMLElement();
						this.list.push(element);
						i = element.readInfo(content,i) - 1;
					}
				}
			}
			return i;
		}

		public static parse(content:string):flower.XMLElement
		{
			var xml:flower.XMLElement = new flower.XMLElement();
			xml.parse(content);
			return xml;
		}

	}
}

