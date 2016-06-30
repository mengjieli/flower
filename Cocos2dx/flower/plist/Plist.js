class Plist {

    frames = [];
    _url;
    _texture;
    _cacheFlag = false;

    constructor(url, texture) {
        this._url = url;
        this._texture = texture;
    }

    addFrame(frame) {
        this.frames.push(frame);
        frame.$setPlist(this);
    }

    get url() {
        return this._url;
    }

    get texture() {
        return this._texture;
    }

    set texture(val) {
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

    cache() {
        if (this._texture) {
            this._texture.$addCount();
            this._cacheFlag = true;
        }
    }

    delCache() {
        if (this._texture && this._cacheFlag) {
            this._texture.$delCount();
            this._cacheFlag = false;
        }
    }

    getFrameTexture(name) {
        if (this.texture.hasDispose) {
            this._texture = TextureManager.getInstance().$getTextureByURL(this.texture.url);
        }
        for (var i = 0, len = this.frames.length; i < len; i++) {
            if (this.frames[i].name == name) {
                return this.frames[i].texture;
            }
        }
        return null;
    }
}