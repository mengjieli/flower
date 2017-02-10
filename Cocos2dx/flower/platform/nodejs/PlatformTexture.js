class PlatformTexture {

    textrue;
    url;
    id;

    constructor(url,id) {
        this.url = url;
        this.id = id;
    }

    dispose() {
        this.textrue = null;
    }
}