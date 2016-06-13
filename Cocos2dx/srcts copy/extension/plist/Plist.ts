module ImagePlugin {
    export class Plist {

        private frames:Array<PlistFrame> = [];
        private _url:string;
        private _texture:flower.Texture2D;
        private _cacheFlag:boolean = false;

        public constructor(url:string, texture:flower.Texture2D) {
            this._url = url;
            this._texture = texture;
        }

        public addFrame(frame:PlistFrame):void {
            this.frames.push(frame);
            frame.$setPlist(this);
        }

        public get url():string {
            return this._url;
        }

        public get texture():flower.Texture2D {
            return this._texture;
        }

        public set texture(val:flower.Texture2D) {
            if (this._texture == val) {
                return;
            }
            if (this._texture && this._cacheFlag) {
                this._texture.$delCount();
            }
            this._texture = val;
            for (var i = 0, len = this.frames.length; i < len; i++) {
                this.frames[i].clearTexture();
            }
        }

        public cache() {
            if (this._texture) {
                this._texture.$addCount();
                this._cacheFlag = true;
            }
        }

        public delCache() {
            if (this._texture && this._cacheFlag) {
                this._texture.$delCount();
                this._cacheFlag = false;
            }
        }

        public getFrameTexture(name:string):flower.Texture2D {
            if (this.texture.hasDispose) {
                this._texture = flower.TextureManager.getInstance().getTextureByNativeURL(this.texture.nativeURL);
            }
            for (var i = 0, len = this.frames.length; i < len; i++) {
                if (this.frames[i].name == name) {
                    return this.frames[i].texture;
                }
            }
            return null;
        }
    }
}