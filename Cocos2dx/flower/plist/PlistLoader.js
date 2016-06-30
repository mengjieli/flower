class PlistLoader extends EventDispatcher {

    res;
    _url;
    _nativeURL
    textureURL;
    frames;
    disposeFlag = false;
    plist;

    constructor(url, nativeURL) {
        super();
        this._url = url;
        this._nativeURL = nativeURL;
        this.__load();
    }

    __load() {
        var plist = PlistManager.getInstance().getPlist(this._nativeURL);
        if (plist) {
            this.plist = plist;
            this.loadTexture();
        } else {
            var res = new ResItem(this._nativeURL, ResType.TEXT);
            res.addURL(this._nativeURL);
            var loader = new URLLoader(res);
            loader.addListener(Event.COMPLETE, this.loadPlistComplete, this);
            loader.addListener(IOErrorEvent.ERROR, this.loadError, this);
            loader.load();
        }
    }

    loadError(e) {
        if (this.hasListener(IOErrorEvent.ERROR)) {
            this.dispatch(new IOErrorEvent(IOErrorEvent.ERROR, e.message));
        } else {
            $error(2004, this.url);
        }
    }

    loadPlistComplete(e) {
        var frames = [];
        this.frames = frames;
        var content = e.data;
        var xml = XMLElement.parse(content);
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
        var frameFrame;
        var frame;
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
                    for (var c = 0; c < this._nativeURL.length; c++) {
                        if (this._nativeURL.charAt(c) == "/") {
                            end = c;
                        }
                    }
                    if (end == -1) this.textureURL = attributes.list[i + 1].value;
                    else  this.textureURL = this._nativeURL.slice(0, end + 1) + attributes.list[i + 1].value;
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
        this.loadTexture();
    }

    loadTexture() {
        var flag = true;
        if (this.plist) {
            var texture = this.plist.texture;
            if (!texture.hasDispose) {
                flag = false;
                texture.$addCount();
            }
        }
        if (flag) {
            var loader = new URLLoader(this.textureURL || this.plist.texture.nativeURL);
            loader.addListener(Event.COMPLETE, this.loadTextureComplete, this);
            loader.addListener(IOErrorEvent.ERROR, this.loadError, this);
            loader.load();
        } else {
            CallLater.add(this.loadComplete, this, [this.plist]);
        }
    }

    loadTextureComplete(e) {
        if (this.disposeFlag) {
            return;
        }
        var texture = e.data;
        texture.$addCount();
        if (this.plist) {
            this.plist.texture = texture;
            this.loadComplete(this.plist);
        } else {
            var plist = new Plist(this.url, texture);
            var list = this.frames || [];
            for (var i = 0, len = list.length; i < len; i++) {
                plist.addFrame(list[i]);
            }
            PlistManager.getInstance().addPlist(plist);
            this.loadComplete(plist);
        }
        this.dispose();
    }

    loadComplete(plist) {
        plist.texture.$delCount();
        //var texture = plist.getFrameTexture(this.childName);
        this.dispatchWidth(Event.COMPLETE, plist);
    }

    dispose() {
        this.frames = null;
        this.disposeFlag = true;
    }

    get url() {
        return this._url;
    }
}