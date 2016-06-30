class PlistManager {

    plists = [];
    caches = {};
    loadingPlist = [];

    constructor() {

    }

    addPlist(plist) {
        this.plists.push(plist);
    }

    addPlistWidthConfig(content) {

    }

    cache(url) {
        this.caches[url] = true;
    }

    delCache(url) {
        delete this.caches[url];
    }

    getPlist(url) {
        for (var i = 0, len = this.plists.length; i < len; i++) {
            if (this.plists[i].url == url) {
                return this.plists[i];
            }
        }
        return null;
    }

    load(url, nativeURL) {
        var loader;
        var list = this.loadingPlist;
        var url;
        for (var i = 0, len = list.length; i < len; i++) {
            if (url == list[i].url) {
                loader = list[i];
                break;
            }
        }
        if (!loader) {
            loader = new PlistLoader(url, nativeURL);
            list.push(loader);
            loader.addListener(Event.COMPLETE, this.__onLoadPlistComplete, this);
        }
        return loader;
    }

    __onLoadPlistComplete(e) {
        var loader = e.currentTarget;
        var list = this.loadingPlist;
        for (var i = 0, len = list.length; i < len; i++) {
            if (loader == list[i]) {
                list.splice(i, 1);
                break;
            }
        }
    }

    getTexture(url) {
        var arr = url.split("#");
        var plistURL = arr[0];
        var frameName = arr[1];
        var plist = this.getPlist(url);
        if (!plist) {
            return null;
        }
        var texture = plist.getFrameTexture(frameName);
        if (!texture || texture.hasDispose == false) {
            return null;
        }
        return texture;
    }

    static instance = new PlistManager();

    static getInstance() {
        return PlistManager.instance;
    }
}