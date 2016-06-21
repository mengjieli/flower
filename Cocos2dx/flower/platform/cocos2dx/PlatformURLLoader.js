class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        if (url.slice(0, "http://".length) == "http://") {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onloadend = function () {
                if (xhr.status != 200) {
                    errorBack.call(thisObj);
                } else {
                    back.call(thisObj, xhr.responseText);
                }
                PlatformURLLoader.isLoading = false;
            };
            xhr.send();
        } else {
            var res = cc.loader.getRes(url);
            if (res) {
                if (res instanceof String) {

                } else {
                    res = JSON.stringify(res);
                }
                back.call(thisObj, res);
                PlatformURLLoader.isLoading = false;
            } else {
                cc.loader.load(url, function () {
                    //console.log("what?",arguments);
                }, function (error, data) {
                    if (error) {
                        errorBack.call(thisObj);
                    }
                    else {
                        if (data instanceof String) {

                        } else {
                            data = JSON.stringify(data);
                        }
                        back.call(thisObj, data);
                    }
                    PlatformURLLoader.isLoading = false;
                });
            }
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
        cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, img) {
            if (err) {
                errorBack.call(thisObj);
            }
            else {
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
            PlatformURLLoader.isLoading = false;
        });
    }
}