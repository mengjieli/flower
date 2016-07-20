class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        var xhr = new XMLHttpRequest();
        if (method == null || method == "") {
            method = "GET";
        }
        if (method == "GET") {
            xhr.open("GET", url, true);
        } else if (method == "POST") {
            xhr.open("POST", url, true);
            if (!contentType) {
                contentType = "application/x-www-form-urlencoded";
            }
            xhr.setRequestHeader("Content-Type", contentType);
        } else if (method == "HEAD") {
            xhr.open("HEAD", url, true);
            xhr.open("HEAD", url, true);
        }
        xhr.onloadend = function () {
            if (xhr.status != 200) {
                errorBack.call(thisObj);
            } else {
                if (method == "HEAD") {
                    back.call(thisObj, xhr.getAllResponseHeaders());
                } else {
                    back.call(thisObj, xhr.responseText);
                }
            }
            PlatformURLLoader.isLoading = false;
        };
        if (params && params != "") {
            xhr.send(params);
        } else {
            xhr.send();
        }
    }

    static loadTexture(url, back, errorBack, thisObj) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2002, url);
        }
        var image = new Image();
        image.src = url;
        image.onload = function () {
            back.call(thisObj, image, image.width, image.height);
            PlatformURLLoader.isLoading = false;
        }

        return;
        cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, img) {
            if (err) {
                errorBack.call(thisObj);
            }
            else {
                if (!CACHE) {
                    cc.loader.release(url);
                }
                var texture;
                if (Platform.native) {
                    texture = img;
                } else {
                    texture = new cc.Texture2D();
                    texture.initWithElement(img);
                    texture.handleLoadedTexture();
                }
                back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
                //if (Platform.native) {
                //    back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
                //} else {
                //
                //    back.call(thisObj, new cc.Texture2D(texture), texture.width, texture.height);
                //}
            }
        });
    }
}