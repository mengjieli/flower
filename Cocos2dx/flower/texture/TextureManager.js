class TextureManager {

    list = [];

    /**
     * 创建纹理
     * @param nativeTexture
     * @param url
     * @param nativeURL
     * @param w
     * @param h
     * @returns {*}
     */
    $createTexture(nativeTexture, url, nativeURL, w, h) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].url == url) {
                if (DEBUG) {
                    $error(1003, url);
                }
                return this.list[i];
            }
        }
        if (TIP) {
            $tip(1004, url);
        }
        var texture = new Texture(nativeTexture, url, nativeURL, w, h);
        this.list.push(texture);
        return texture;
    }

    $getTextureByNativeURL(url) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].nativeURL == url) {
                return this.list[i];
            }
        }
        return null;
    }

    $check() {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].$count == 0) {
                this.list.splice(i, 1)[0].dispose();
                return;
            }
        }
    }


    static instance;

    static getInstance() {
        if (TextureManager.instance == null) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }
}