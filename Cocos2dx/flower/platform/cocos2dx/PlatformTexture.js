class PlatformTexture {

    textrue;
    url;

    constructor() {

    }

    dispose() {
        cc.TextureCache.getInstance().removeTextureForKey(this.url);
    }
}