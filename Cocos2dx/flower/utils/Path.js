class Path {
    static getFileType(url) {
        var end = url.split("?")[0];
        end = end.split("/")[end.split("/").length - 1];
        if (end.split(".").length == 1) {
            return "";
        }
        return end.split(".")[end.split(".").length - 1];
    }

    static getPathDirection(url) {
        var arr = url.split("/");
        if (arr.length == 1) {
            return "";
        }
        return url.slice(0, url.length - arr[arr.length - 1].length);
    }

    static getName(url) {
        var arr = url.split("/");
        return arr[arr.length - 1];
    }

    static joinPath(path1, path2) {
        var path = path1;
        if (path.charAt(path.length - 1) != "/") {
            path += "/";
        }
        if (path2.charAt(0) == "/") {
            path2 = path2.slice(1, path2.length);
        }
        path += path2;
        return path;
    }
}

exports.Path = Path;