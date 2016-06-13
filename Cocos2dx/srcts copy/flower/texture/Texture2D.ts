module flower {
    export class Texture2D {

        private _source:flower.Rectangle;
        private _offX:number = 0;
        private _offY:number = 0;
        private _sourceRotation:boolean = false;
        private _width:number;
        private _height:number;
        private _url:string;
        private _nativeURL:string;
        public $count:number;
        private _nativeTexture:any;
        private _parentTexture:Texture2D;
        private _hasDispose:boolean = false;

        public constructor(nativeTexture:any, url:string, nativeURL:string, w:number, h:number) {
            this._nativeTexture = nativeTexture;
            this._url = url;
            this._nativeURL = nativeURL;
            this.$count = 0;
            this._width = w;
            this._height = h;
        }

        public createSubTexture(startX:number, startY:number, width:number, height:number, offX:number = 0, offY:number = 0, rotation:boolean = false):Texture2D {
            var sub:Texture2D = new flower.Texture2D(this._nativeTexture, this._url, this._nativeURL, width, height);
            sub._parentTexture = this._parentTexture || this;
            var rect = flower.Rectangle.create();
            rect.x = startX;
            rect.y = startY;
            rect.width = width;
            rect.height = height;
            sub._source = rect;
            sub._sourceRotation = rotation;
            sub._offX = offX;
            sub._offY = offY;
            return sub;
        }

        public dispose() {
            if (flower.Texture2D.safeLock == true) {
                flower.DebugInfo.debug("|释放纹理| 操作失败，此方法提供内部结构使用，外部禁止使用，请用TextureManager.disposeTexure()代替，url:" + this.url, flower.DebugInfo.ERROR);
                return;
            }
            if (this.$count != 0) {
                flower.DebugInfo.debug("|释放纹理| 纹理计数器不为0，此纹理不会被释放，计数为 " + this.$count + "，地址为" + this.url, flower.DebugInfo.ERROR);
                return;
            }
            System.disposeTexture(this._nativeTexture, this._nativeURL);
            this._nativeTexture = null;
            if (flower.Engine.TIP) {
                flower.DebugInfo.debug("|释放纹理| " + this.url, flower.DebugInfo.TIP);
            }
            this._hasDispose = true;
        }

        public $addCount() {
            if (this._parentTexture) {
                this._parentTexture.$addCount();
            } else {
                this.$count++;
            }
        }

        public $delCount() {
            if (this._parentTexture) {
                this._parentTexture.$delCount();
            } else {
                this.$count--;
                if (this.$count < 0) {
                    this.$count = 0;
                }
                if (this.$count == 0) {
                    if (flower.Engine.DEBUG && this == flower.Texture2D.blank) {
                        flower.DebugInfo.debug2(flower.DebugInfo.ERROR, "空白图像被释放了");
                        return;
                    }
                }
            }
        }

        public getCount():number {
            if (this._parentTexture) {
                this._parentTexture.getCount();
            } else {
                return this.$count;
            }
        }

        public get url():string {
            return this._url;
        }

        public get nativeURL():string {
            return this._nativeURL;
        }

        public get width():number {
            return this._width;
        }

        public get height():number {
            return this._height;
        }

        public get hasDispose():boolean {
            return this._hasDispose;
        }

        public get source():flower.Rectangle {
            return this._source;
        }

        public get offX():number {
            return this._offX;
        }

        public get offY():number {
            return this._offY;
        }

        public get sourceRotation():boolean {
            return this._sourceRotation;
        }

        public get $nativeTexture():any {
            return this._nativeTexture;
        }

        public static safeLock:boolean;
        public static blank:flower.Texture2D;
    }
}
flower.Texture2D.safeLock = true;
