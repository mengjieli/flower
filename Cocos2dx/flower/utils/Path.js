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

    static isPeerDirection(url1, url2) {
        var arr1 = url1.split("/");
        var arr2 = url2.split("/");
        if (arr1.length != arr2.length) {
            return false;
        }
        for (var i = 0; i < arr1.length - 1; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }

    static joinPath(path1, path2) {
        var path = path1;
        if (path.charAt(path.length - 1) != "/") {
            for (var i = path.length - 2; i >= 0; i--) {
                if (path.charAt(i) == "/") {
                    path = path.slice(0, i + 1);
                    break;
                } else if (i == 0) {
                    path = "";
                }
            }
        }
        if (path2.charAt(0) == "/") {
            path2 = path2.slice(1, path2.length);
        }
        while ((path2.slice(0, 2) == "./" || path2.slice(0, 3) == "../") && path != "") {
            if(path2.slice(0, 2) == "./") {
                path2 = path2.slice(2, path2.length);
            } else {
                path2 = path2.slice(3, path2.length);
                for (var i = path.length - 2; i >= 0; i--) {
                    if (path.charAt(i) == "/") {
                        path = path.slice(0, i + 1);
                        break;
                    } else if (i == 0) {
                        path = "";
                    }
                }
            }
        }
        path += path2;
        return path;
    }
}

exports.Path = Path;