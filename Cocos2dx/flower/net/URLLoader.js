class URLLoader extends EventDispatcher {

    _createRes = false;
    _res;
    _isLoading = false;
    _data;
    _linkLoader;
    _links;
    _type;
    _selfDispose = false;
    _language;
    _scale;
    _loadInfo;
    _method;
    _params;

    constructor(res) {
        super();
        this.$setResource(res);
        this._language = LANGUAGE;
        this._scale = SCALE ? SCALE : null;
    }

    $setResource(res) {
        if (typeof(res) == "string") {
            var resItem = Res.getRes(res);
            if (resItem) {
                res = resItem;
            } else {
                this._createRes = true;
                res = ResItem.create(res);
            }
        }
        this._res = res;
        this._type = this._res.type;
    }

    get url() {
        return this._res ? this._res.url : "";
    }

    get loadURL() {
        return this._loadInfo ? this._loadInfo.url : "";
    }

    get type() {
        return this._res ? this._res.type : "";
    }

    set language(val) {
        this._language = val;
    }

    set scale(val) {
        this._scale = val * (SCALE ? SCALE : 1);
    }

    set method(val) {
        this._method = val;
    }

    get method() {
        return this._method;
    }

    set params(val) {
        this._params = val;
    }

    get params() {
        return this._params;
    }

    $addLink(loader) {
        if (!this._links) {
            this._links = [];
        }
        this._links.push(loader);
    }

    load(res) {
        if (res) {
            this.$setResource(res);
        }
        if (this._isLoading) {
            dispatchWidth(Event.ERROR, "URLLoader is loading, url:" + this.url);
            return;
        }
        this._loadInfo = this._res.getLoadInfo(this._language, this._scale);
        this._isLoading = true;
        if (this.type != ResType.TEXT) {
            for (var i = 0; i < URLLoader.list.length; i++) {
                if (URLLoader.list[i].loadURL == this.loadURL && URLLoader.list[i].type == this.type) {
                    this._linkLoader = URLLoader.list[i];
                    break;
                }
            }
        }
        if (this._linkLoader) {
            this._linkLoader.$addLink(this);
            return;
        }
        URLLoader.list.push(this);
        if (this.type == ResType.IMAGE) {
            this.loadTexture();
        } else if (this.type == ResType.PLIST) {
            this.loadPlist();
        } else {
            this.loadText();
        }
    }

    loadTexture() {
        var texture = TextureManager.getInstance().$getTextureByURL(this.url);
        if (this._loadInfo.update) {
            texture = null;
        }
        if (texture) {
            texture.$addCount();
            this._data = texture;
            new CallLater(this.loadComplete, this);
        }
        else {
            if (this._loadInfo.plist) {
                var loader = new URLLoader(this._loadInfo.plist);
                loader.addListener(Event.COMPLETE, this.onLoadTexturePlistComplete, this);
                loader.addListener(IOErrorEvent.ERROR, this.loadError, this);
                loader.load();
            } else {
                PlatformURLLoader.loadTexture(this._loadInfo.url, this.loadTextureComplete, this.loadError, this);
            }
        }
    }

    onLoadTexturePlistComplete(e) {
        var plist = e.data;
        this._data = plist.getFrameTexture(this.url);
        this.loadComplete();
    }

    loadTextureComplete(nativeTexture, width, height) {
        nativeTexture = new PlatformTexture(this._loadInfo.url, nativeTexture);
        var oldTexture;
        if (this._loadInfo.update) {
            oldTexture = TextureManager.getInstance().$getTextureByURL(this.url);
        }
        if (oldTexture) {
            oldTexture.$update(nativeTexture, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
        } else {
            var texture = TextureManager.getInstance().$createTexture(nativeTexture, this.url, this._loadInfo.url, width, height, this._loadInfo.settingWidth, this._loadInfo.settingHeight);
            this._data = texture;
            texture.$addCount();
        }
        new CallLater(this.loadComplete, this);
    }

    setTextureByLink(texture) {
        texture.$addCount();
        this._data = texture;
        this.loadComplete();
    }

    loadPlist() {
        var plist = PlistManager.getInstance().getPlist(this.url);
        if (plist) {
            this._data = plist;
            new CallLater(this.loadComplete, this);
        } else {
            var load = PlistManager.getInstance().load(this.url, this._loadInfo.url);
            load.addListener(Event.COMPLETE, this.loadPlistComplete, this);
            load.addListener(IOErrorEvent.ERROR, this.loadError, this);
        }
    }

    loadPlistComplete(e) {
        this._data = e.data;
        new CallLater(this.loadComplete, this);
    }

    setPlistByLink(plist) {
        this._data = plist;
        this.loadComplete();
    }

    loadText() {
        PlatformURLLoader.loadText(this._loadInfo.url, this.loadTextComplete, this.loadError, this, this._method, this._params);
    }

    loadTextComplete(content) {
        if (this._type == ResType.TEXT) {
            this._data = content;
        }
        else if (this._type == ResType.JSON) {
            this._data = JSON.parse(content);
        }
        new CallLater(this.loadComplete, this);
    }

    setTextByLink(content) {
        if (this._type == ResType.TEXT) {
            this._data = content;
        }
        else if (this._type == ResType.JSON) {
            this._data = JSON.parse(content);
        }
        this.loadComplete();
    }

    setJsonByLink(content) {
        this._data = content;
        this.loadComplete();
    }

    loadComplete() {
        if (this._links) {
            for (var i = 0; i < this._links.length; i++) {
                if (this._type == ResType.IMAGE) {
                    this._links[i].setTextureByLink(this._data);
                }
                else if (this._type == ResType.TEXT) {
                    this._links[i].setTextByLink(this._data);
                }
                else if (this._type == ResType.JSON) {
                    this._links[i].setJsonByLink(this._data);
                } else if (this._type == ResType.PLIST) {
                    this._links[i].setPlistByLink(this._data);
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
        for (var i = 0; i < URLLoader.list.length; i++) {
            if (URLLoader.list[i] == this) {
                URLLoader.list.splice(i, 1);
                break;
            }
        }
        this.dispatchWidth(Event.COMPLETE, this._data);
        this._selfDispose = true;
        this.dispose();
        this._selfDispose = false;
    }

    loadError(e) {
        if (this.hasListener(IOErrorEvent.ERROR)) {
            this.dispatch(new IOErrorEvent(IOErrorEvent.ERROR, getLanguage(2003, this._loadInfo.url)));
            if (this._links) {
                for (var i = 0; i < this._links.length; i++) {
                    this._links[i].loadError();
                }
            }
            this.dispose();
        }
        else {
            $error(2003, this._loadInfo.url);
        }
    }

    dispose() {
        if (!this._selfDispose) {
            super.dispose();
            return;
        }
        if (this._data && this._type == ResType.IMAGE) {
            this._data.$delCount();
            this._data = null;
        }
        if (this._createRes && this._res) {
            ResItem.release(this._res);
        }
        this._res = null;
        this._data = null;
        super.dispose();
        for (var i = 0; i < URLLoader.list.length; i++) {
            if (URLLoader.list[i] == this) {
                URLLoader.list.splice(i, 1);
                break;
            }
        }
    }

    static list = [];

    static clear() {
        while (URLLoader.list.length) {
            var loader = URLLoader.list.pop();
            loader.dispose();
        }
    }
}

exports.URLLoader = URLLoader;