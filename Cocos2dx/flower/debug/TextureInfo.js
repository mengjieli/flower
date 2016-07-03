class TextureInfo {

    __texture;

    constructor(texture) {
        this.__texture = texture;
    }

    get url() {
        return this.__texture.url;
    }

    get nativeURL() {
        return this.__texture.nativeURL;
    }

    get count() {
        return this.__texture.count;
    }
}

exports.TextureInfo = TextureInfo;