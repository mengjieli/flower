module ImagePlugin {
    export class PlistFrame {

        private _name:string;
        private _x:number;
        private _y:number;
        private _width:number;
        private _height:number;
        private _rotation:boolean = false;
        private _offX:number = 0;
        private _offY:number = 0;
        private _moveX:number;
        private _moveY:number;
        private _sourceHeight:number;
        private _sourceWidth:number;
        private _texture:flower.Texture2D;
        private _plist:Plist;

        public constructor(name:string) {
            this._name = name;
        }

        public decode(xml:flower.XMLElement) {
            var content;
            for (var i = 0; i < xml.list.length; i++) {
                if (xml.list[i].name == "key") {
                    content = xml.list[i + 1].value;
                    if (content) {
                        while (content.indexOf("{") != -1) {
                            content = content.slice(0, content.indexOf("{")) + content.slice(content.indexOf("{") + 1, content.length);
                        }
                        while (content.indexOf("}") != -1) {
                            content = content.slice(0, content.indexOf("}")) + content.slice(content.indexOf("}") + 1, content.length);
                        }
                    }
                    if (xml.list[i].value == "frame") {
                        this._x = parseInt(content.split(",")[0]);
                        this._y = parseInt(content.split(",")[1]);
                        this._width = parseInt(content.split(",")[2]);
                        this._height = parseInt(content.split(",")[3]);
                    }
                    else if (xml.list[i].value == "rotated") {
                        if (xml.list[i + 1].name == "true") this._rotation = true;
                        else  this._rotation = false;
                    }
                    else if (xml.list[i].value == "offset") {
                        this._offX = parseInt(content.split(",")[0]);
                        this._offY = parseInt(content.split(",")[1]);
                    }
                    else if (xml.list[i].value == "sourceSize") {
                        this._sourceWidth = parseInt(content.split(",")[0]);
                        this._sourceHeight = parseInt(content.split(",")[1]);
                    }
                    i++;
                }
            }
            this._moveX = this._offX + (this._sourceWidth - this._width) / 2;
            this._moveY = this._offY + (this._sourceHeight - this._height) / 2;
        }

        public get name():string {
            return this._name;
        }

        public $setPlist(plist:Plist) {
            this._plist = plist;
        }

        public get texture():flower.Texture2D {
            if (!this._texture) {
                this._texture = this._plist.texture.createSubTexture(this._x, this._y, this._width, this._height, this._moveX, this._moveY, this._rotation);
            }
            return this._texture;
        }

        public clearTexture():void {
            this._texture = null;
        }
    }
}