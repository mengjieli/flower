class PlatformURLLoader {

    static isLoading = false;
    static loadingFrame;
    static loadingFunc;
    static loadingArgs;
    static loadingId = 0;
    static checkFrame;
    static loadingList = [];

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj, method, params, contentType]);
            return;
        }
        if (TIP) {
            $tip(2001, url);
        }
        PlatformURLLoader.isLoading = true;
        PlatformURLLoader.loadingFunc = PlatformURLLoader.realLoadText;
        PlatformURLLoader.loadingArgs = arguments;
        PlatformURLLoader.loadingFunc.apply(null, arguments);
    }

    static realLoadText(url, back, errorBack, thisObj, method, params, contentType) {
        PlatformURLLoader.loadingFrame = Platform.frame;
        PlatformURLLoader.loadingId++;
        var id = PlatformURLLoader.loadingId;
        if (url.slice(0, "http://".length) == "http://") {
            PlatformURLLoader.checkFrame = Platform.frame + 120;
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
                if (id != PlatformURLLoader.loadingId) {
                    return;
                }
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
                PlatformURLLoader.loadingId++;
            };
            xhr.send();
        } else {
            PlatformURLLoader.checkFrame = Platform.frame + 3;
            var res;
            var end = url.split(".")[url.split(".").length - 1];
            if (end != "plist" && end != "xml" && end != "json") {
                res = cc.loader.getRes(url);
            }
            if (res) {
                if (id != PlatformURLLoader.loadingId) {
                    return;
                }
                back.call(thisObj, res);
                PlatformURLLoader.isLoading = false;
                PlatformURLLoader.loadingId++;
            } else {
                cc.loader.loadTxt(url, function (error, data) {
                    if (id != PlatformURLLoader.loadingId) {
                        return;
                    }
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
                    PlatformURLLoader.loadingId++;
                });
            }
        }
    }

    static loadTexture(url, back, errorBack, thisObj, params) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj, params]);
            return;
        }
        if (TIP) {
            $tip(2002, url);
        }
        PlatformURLLoader.isLoading = true;
        PlatformURLLoader.loadingFunc = PlatformURLLoader.realLoadTexture;
        PlatformURLLoader.loadingArgs = arguments;
        PlatformURLLoader.loadingFunc.apply(null, arguments);

    }

    static realLoadTexture(url, back, errorBack, thisObj, params) {
        PlatformURLLoader.loadingFrame = Platform.frame;
        var isHttp = false;
        if (url.slice(0, "http://".length) == "http://") {
            PlatformURLLoader.checkFrame = Platform.frame + 120;
            isHttp = true;
        } else {
            PlatformURLLoader.checkFrame = Platform.frame + 3;
        }
        PlatformURLLoader.loadingId++;
        var id = PlatformURLLoader.loadingId;
        var texture;
        if(Platform.native && isHttp) {
            cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, img) {
                if (id != PlatformURLLoader.loadingId) {
                    return;
                }
                if (err) {
                    errorBack.call(thisObj);
                }
                else {
                    if (!CACHE) {
                        cc.loader.release(url);
                    }
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
                PlatformURLLoader.loadingId++;
            });
        } else {
            if(Platform.native) {
                texture = cc.TextureCache.getInstance().addImage(url);
            } else {
                texture = cc.textureCache.addImage(url);
            }
            back.call(thisObj, texture, texture.getContentSize().width, texture.getContentSize().height);
            PlatformURLLoader.isLoading = false;
            PlatformURLLoader.loadingId++;
        }
    }

    static run() {
        if (PlatformURLLoader.isLoading == false) {
            if (PlatformURLLoader.loadingList.length) {
                var item = PlatformURLLoader.loadingList.shift();
                item[0].apply(null, item.slice(1, item.length));
            }
        } else {
            if (Platform.frame >= PlatformURLLoader.checkFrame) {
                console.log("Try load again: " + PlatformURLLoader.loadingArgs[0]);
                PlatformURLLoader.loadingFunc.apply(null, PlatformURLLoader.loadingArgs);
            }
        }
    }
}