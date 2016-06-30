class TextureManager {

    list = [];

    /**
     * 创建纹理
     * @param nativeTexture
     * @param url
     * @param nativeURL
     * @param w
     * @param h
     * @param settingWidth
     * @param settingHeight
     * @returns {*}
     */
    $createTexture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].url == url) {
                if (DEBUG) {
                    $error(1003, url);
                }
                return this.list[i];
            }
        }
        if (TIP) {
            $tip(1004, nativeURL);
        }
        var texture = new Texture(nativeTexture, url, nativeURL, w, h, settingWidth, settingHeight);
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

    $getTextureByURL(url) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].url == url) {
                return this.list[i];
            }
        }
        return null;
    }

    $check() {
        var texture;
        for (var i = 0; i < this.list.length; i++) {
            texture = this.list[i];
            if (texture.$count == 0) {
                if (texture.dispose()) {
                    this.list.splice(i, 1);
                    i--;
                }
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