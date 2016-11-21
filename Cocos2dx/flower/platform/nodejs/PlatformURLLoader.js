class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];
    static canvas;
    static context;

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj, method, params, contentType]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
        if (url.slice(0, 7) != "http://") {
            var file = new File(url);
            if (file.exists) {
                setTimeout(function () {
                    back.call(thisObj, file.readContent());
                    PlatformURLLoader.isLoading = false;
                }, 0);
            } else {
                setTimeout(function () {
                    errorBack.call(thisObj);
                    PlatformURLLoader.isLoading = false;
                }, 0);
            }
        } else {
            var hasQ = url.split("?").length > 1 ? true : false;
            var hasParam = hasQ ? (url.split("?")[1].length ? true : false) : false;
            var pstr = hasParam ? (hasQ ? "&" : "") : "?";
            for (var key in params) {
                pstr += key + "=" + params[key] + "&";
            }
            if (pstr.charAt(pstr.length - 1) == "&") {
                pstr = pstr.slice(0, pstr.length - 1);
            }
            if (pstr != "?") {
                url += pstr;
            }
            if (method == null || method == "") {
                method = "GET";
            }
            var ip = url.slice(7, url.length);
            ip = ip.split("/")[0];
            var path = url.slice(7 + ip.length, url.length);
            var port = 0;
            if (ip.split(":").length == 2) {
                port = ip.split(":")[1];
                ip = ip.split(":")[0];
            }
            var request = new PlatformHttpRequest(ip, port, path);
            request.get();
            request.addListener(Event.COMPLETE, function (e) {
                PlatformURLLoader.isLoading = false;
                back.call(thisObj, request.data);
            });
            request.addListener(Event.ERROR, function (e) {
                errorBack.call(thisObj);
                PlatformURLLoader.isLoading = false;
            });
        }

    }

    static loadTexture(url, back, errorBack, thisObj, params) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj, params]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2002, url);
        }
        params = params || {};
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
        var textureId = PlatformURLLoader.textureId++;
        var msg = new flower.VByteArray();
        msg.writeUInt(10);
        msg.writeUInt(textureId);
        msg.writeUTF(url);
        Platform.sendToClient(msg);
        PlatformURLLoader.loadTextureBack = function (id, width, height) {
            if (id != textureId) {
                return;
            }
            if(width && height) {
                back.call(thisObj, id, width, height);
            } else {
                errorBack.call(thisObj);
            }
            PlatformURLLoader.isLoading = false;
        }
    }

    static loadTextureBack(id, width, height) {

    }

    static textureId = 1;
}