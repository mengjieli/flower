module flower {
    export class URLLoader extends flower.EventDispatcher {
        private _res:flower.ResItem;
        private _isLoading:boolean = false;
        private _data:any;
        private _linkLoader:flower.URLLoader;
        private _links:Array<any>;
        private _type:string;
        private _selfDispose = false;

        public constructor(res:string|flower.ResItem) {
            super();
            var val:any = res;
            if (typeof(res) == "string") {
                res = new flower.ResItem();
                if (this.type != "") {
                    (<flower.ResItem>res).type = this.type;
                }
                else {
                    var end:string = val.split(".")[1];
                    (<flower.ResItem>res).type = Res.getEndType(end);
                }
                (<flower.ResItem>res).local = flower.Res.local;
                (<flower.ResItem>res).localURL = flower.Res.localURL;
                (<flower.ResItem>res).serverURL = flower.Res.serverURL;
                (<flower.ResItem>res).url = val;
            }
            this._res = <flower.ResItem>res;
            this._type = this._res.type;
            this.load();
        }

        public get url():string {
            return this._res ? this._res.url : "";
        }

        public get loadURL():string {
            return this._res ? this._res.loadURL : "";
        }

        public get type():string {
            return this._res ? this._res.type : "";
        }

        private addLink(loader:flower.URLLoader) {
            if (!this._links) {
                this._links = [];
            }
            this._links.push(loader);
        }

        private load() {
            if (this._isLoading || !this._res || this._data) {
                return;
            }
            this._isLoading = true;
            for (var i:number = 0; i < flower.URLLoader.list.length; i++) {
                if (flower.URLLoader.list[i].loadURL == this.loadURL) {
                    this._linkLoader = flower.URLLoader.list[i];
                    break;
                }
            }
            if (this._linkLoader) {
                this._linkLoader.addLink(this);
                return;
            }
            flower.URLLoader.list.push(this);
            if (this.type == flower.ResType.TEXTURE) {
                this.loadTexture();
            }
            else {
                this.loadText();
            }
        }

        private loadTexture() {
            var texture:flower.Texture2D = flower.TextureManager.getInstance().getTextureByNativeURL(this._res.loadURL);
            if (texture) {
                texture.$addCount();
                this._data = texture;
                new flower.CallLater(this.loadComplete, this);
            }
            else {
                var func:Function = System.URLLoader.loadTexture.func;
                func(this._res.loadURL, this.loadTextureComplete, this.loadError, this);
            }
        }

        private loadTextureComplete(nativeTexture:any, width:number, height:number) {
            var texture:flower.Texture2D = flower.TextureManager.getInstance().createTexture(nativeTexture, this.url, this._res.loadURL, width, height);
            this._data = texture;
            texture.$addCount();
            new flower.CallLater(this.loadComplete, this);
        }

        private setTextureByLink(texture:flower.Texture2D) {
            texture.$addCount();
            this._data = texture;
            this.loadComplete();
        }

        private loadText() {
            var func:Function = System.URLLoader.loadText.func;
            func(this._res.loadURL, this.loadTextComplete, this.loadError, this);
        }

        private loadTextComplete(content:string) {
            if (this._type == flower.ResType.TEXT) {
                this._data = content;
            }
            else if (this._type == flower.ResType.JSON) {
                this._data = System.JSON_parser(content);
            }
            new flower.CallLater(this.loadComplete, this);
        }

        private setTextByLink(content:string) {
            if (this._type == flower.ResType.TEXT) {
                this._data = content;
            }
            else if (this._type == flower.ResType.JSON) {
                this._data = System.JSON_parser(content);
            }
            this.loadComplete();
        }

        private setJsonByLink(content:any) {
            this._data = content;
            this.loadComplete();
        }

        private loadComplete() {
            if (this._links) {
                for (var i:number = 0; i < this._links.length; i++) {
                    if (this._type == flower.ResType.TEXTURE) {
                        this._links[i].setTextureByLink(this._data);
                    }
                    else if (this._type == flower.ResType.TEXT) {
                        this._links[i].setTextByLink(this._data);
                    }
                    else if (this._type == flower.ResType.JSON) {
                        this._links[i].setJsonByLink(this._data);
                    }
                }
            }
            this._links = null;
            this._isLoading = false;
            if (!this._res || !this._data) {
                this._selfDispose = true;
                this.dispose();
                this._selfDispose = false;
                return;
            }
            for (var i:number = 0; i < flower.URLLoader.list.length; i++) {
                if (flower.URLLoader.list[i] == this) {
                    flower.URLLoader.list.splice(i, 1);
                    break;
                }
            }
            this.dispatchWidth(flower.Event.COMPLETE, this._data);
            this._selfDispose = true;
            this.dispose();
            this._selfDispose = false;
        }

        private loadError() {
            if (this.hasListener(flower.IOErrorEvent.ERROR)) {
                this.dispatch(new flower.IOErrorEvent(flower.IOErrorEvent.ERROR, "[加载纹理失败] " + this._res.localURL));
            }
            else {
                flower.DebugInfo.debug("[加载纹理失败] " + this._res.localURL, flower.DebugInfo.ERROR);
            }
        }

        public dispose() {
            if(!this._selfDispose) {
                super.dispose();
                return;
            }
            if (this._data && this._type == flower.ResType.TEXTURE) {
                this._data.$delCount();
                this._data = null;
            }
            this._res = null;
            this._data = null;
            super.dispose();
            for (var i:number = 0; i < flower.URLLoader.list.length; i++) {
                if (flower.URLLoader.list[i] == this) {
                    flower.URLLoader.list.splice(i, 1);
                    break;
                }
            }
        }

        public static list:Array<any>;

        public static clear() {
            while (flower.URLLoader.list.length) {
                var loader:flower.URLLoader = flower.URLLoader.list.pop();
                loader.dispose();
            }
        }

    }
}

flower.URLLoader.list = [];
