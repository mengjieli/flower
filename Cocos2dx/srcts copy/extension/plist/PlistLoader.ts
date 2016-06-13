module ImagePlugin {
    export class PlistLoader extends flower.EventDispatcher {

        private childName:string;
        private res;
        private textureRes;
        private _url:string;
        private textureURL:string;
        private frames:Array<PlistFrame>;
        private disposeFlag:boolean = false;
        private plist:Plist;

        public constructor(res) {
            super();
            if (typeof(res) == "string") {
                this.childName = res.split("#")[1];
                res = res.split("#")[0];
                this._url = res;
            } else {
                this.childName = res.url.split("#")[1];
                res.url = res.url.split("#")[0];
                this._url = res.url;
                this.textureRes = new flower.ResItem();
                this.textureRes.type = flower.ResType.TEXTURE;
                this.textureRes.serverURL = res.serverURL;
                this.textureRes.localURL = res.localURL;
                this.textureRes.local = res.local;
            }
            this.res = res;
            this.load();
        }

        private load() {
            var plist = PlistMananger.getInstance().getPlist(this._url);
            if (plist) {
                this.plist = plist;
                this.loadTexture();
            } else {
                var loader = new flower.URLLoader(this.res);
                loader.addListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
                loader.addListener(flower.IOErrorEvent.ERROR, this.loadError, this);
            }
        }

        private loadError(e:flower.IOErrorEvent) {
            if (this.hasListener(flower.IOErrorEvent.ERROR)) {
                this.dispatch(new flower.IOErrorEvent(flower.IOErrorEvent.ERROR, e.message));
            } else {
                flower.DebugInfo.debug(e.data, flower.DebugInfo.ERROR);
            }
        }

        private loadPlistComplete(e:flower.Event) {
            var frames = [];
            this.frames = frames;
            var content = e.data;
            var xml = flower.XMLElement.parse(content);
            xml = xml.list[0];
            var reslist;
            var attributes;
            for (var i = 0; i < xml.list.length; i++) {
                if (xml.list[i].name == "key") {
                    if (xml.list[i].value == "frames") {
                        reslist = xml.list[i + 1];
                    }
                    else if (xml.list[i].value == "metadata") {
                        attributes = xml.list[i + 1];
                    }
                    i++;
                }
            }
            var frame:PlistFrame;
            for (i = 0; i < reslist.list.length; i++) {
                if (reslist.list[i].name == "key") {
                    frame = new PlistFrame(reslist.list[i].value);
                    frame.decode(reslist.list[i + 1]);
                    frames.push(frame);
                    i++;
                }
            }
            for (i = 0; i < attributes.list.length; i++) {
                if (attributes.list[i].name == "key") {
                    if (attributes.list[i].value == "realTextureFileName") {
                        var end = -1;
                        for (var c = 0; c < this._url.length; c++) {
                            if (this._url.charAt(c) == "/") {
                                end = c;
                            }
                        }
                        if (end == -1) this.textureURL = attributes.list[i + 1].value;
                        else  this.textureURL = this._url.slice(0, end + 1) + attributes.list[i + 1].value;
                    }
                    else if (attributes.list[i].value == "size") {
                        var size = attributes.list[i + 1].value;
                        size = size.slice(1, size.length - 1);
                        //this.width = Math.floor(size.split(",")[0]);
                        //this.height = Math.floor(size.split(",")[1]);
                    }
                    i++;
                }
            }
            if (this.textureRes) {
                this.textureRes.url = this.textureURL;
            }
            this.loadTexture();
        }

        private loadTexture():void {
            var flag = true;
            if (this.plist) {
                var texture = this.plist.texture;
                if (!texture.hasDispose) {
                    flag = false;
                    texture.$addCount();
                }
            }
            if (flag) {
                var loader = new flower.URLLoader(this.textureRes || this.textureURL || this.plist.texture.nativeURL);
                loader.addListener(flower.Event.COMPLETE, this.loadTextureComplete, this);
                loader.addListener(flower.IOErrorEvent.ERROR, this.loadError, this);
            } else {
                flower.CallLater.add(this.loadComplete, this, [this.plist]);
            }
        }

        private loadTextureComplete(e:flower.Event):void {
            if (this.disposeFlag) {
                return;
            }
            var texture = e.data;
            texture.$addCount();
            if (this.plist) {
                this.plist.texture = texture;
                this.loadComplete(this.plist);
            } else {
                var plist = new Plist(this._url, texture);
                var list = this.frames || [];
                for (var i = 0, len = list.length; i < len; i++) {
                    plist.addFrame(list[i]);
                }
                PlistMananger.getInstance().addPlist(plist);
                this.loadComplete(plist);
            }
            this.dispose();
        }

        private loadComplete(plist:Plist) {
            plist.texture.$delCount();
            var texture = plist.getFrameTexture(this.childName);
            this.dispatchWidth(flower.Event.COMPLETE, texture);
        }

        public dispose() {
            this.frames = null;
            this.disposeFlag = true;
        }

        public get url():string {
            return this._url;
        }
    }
}