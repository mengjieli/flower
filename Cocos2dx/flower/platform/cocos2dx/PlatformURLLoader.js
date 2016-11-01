class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj, method, params, contentType]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        if (url.slice(0, "http://".length) == "http://") {
            var pstr = "?";
            for (var key in params) {
                pstr += key + "=" + params[key] + "&";
            }
            if (pstr.charAt(pstr.length - 1) == "&") {
                pstr = pstr.slice(0, pstr.length - 1);
            }
            if (pstr != "?") {
                url += pstr;
            }
            var xhr = cc.loader.getXMLHttpRequest();
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
            xhr.send();
        } else {
            var res;
            var end = url.split(".")[url.split(".").length - 1];
            if (end != "plist" && end != "xml" && end != "json") {
                res = cc.loader.getRes(url);
            }
            if (res) {
                back.call(thisObj, res);
                PlatformURLLoader.isLoading = false;
            } else {
                cc.loader.loadTxt(url, function (error, data) {
                    if (error) {
                        errorBack.call(thisObj);
                    }
                    else {
                        if (!CACHE) {
                            cc.loader.release(url);
                        }
                        if (data instanceof Array) {
                            data = JSON.stringify(data[0]);
                        }
                        back.call(thisObj, data);
                    }
                    PlatformURLLoader.isLoading = false;
                });
            }
        }
    }

    static loadTexture(url, back, errorBack, thisObj,params) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj,params]);
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
                //    back.call(thisObj, new cc.Texture2D(texture), texture.width, texture.height);
                //}
            }
            PlatformURLLoader.isLoading = false;
        });
    }
}