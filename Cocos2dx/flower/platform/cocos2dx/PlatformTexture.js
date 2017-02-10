class PlatformTexture {

    textrue;
    url;

    constructor(url, texture) {
        this.url = url;
        this.textrue = texture;
    }

    dispose() {
        if (Platform.native) {
            cc.TextureCache.getInstance().removeTextureForKey(this.url);
        } else {
            this.textrue.releaseData();
        }
        this.textrue = null;
    }
}