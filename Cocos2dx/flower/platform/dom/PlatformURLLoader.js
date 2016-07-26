class PlatformURLLoader {

    static isLoading = false;
    static loadingList = [];
    static canvas;
    static context;

    static loadText(url, back, errorBack, thisObj, method, params, contentType) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadText, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2001, url);
        }
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
        xhr.send();
    }

    static loadTexture(url, back, errorBack, thisObj, params) {
        if (PlatformURLLoader.isLoading) {
            PlatformURLLoader.loadingList.push([PlatformURLLoader.loadTexture, url, back, errorBack, thisObj]);
            return;
        }
        PlatformURLLoader.isLoading = true;
        if (TIP) {
            $tip(2002, url);
        }
        params = params || {};
        params.img = "base64";
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
        var xhr = new XMLHttpRequest();
        var method;
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
                var str = xhr.responseText;
                var size = str.split("|")[0];
                var content = "data:image/png;base64," + str.split("|")[1];
                var width = size.split(",")[0];
                var height = size.split(",")[1];
                back.call(thisObj, content, width, height);
            }
            PlatformURLLoader.isLoading = false;
        };
        xhr.send();
    }
}