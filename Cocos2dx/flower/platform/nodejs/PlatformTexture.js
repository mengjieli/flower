class PlatformTexture {

    textrue;
    url;

    constructor(url, texture) {
        this.url = url;
        this.textrue = texture;
    }

    dispose() {
        this.textrue = null;
    }
}