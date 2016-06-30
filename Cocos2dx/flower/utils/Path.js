class Path {
    static getFileEnd(url) {
        var end = url.split("?")[0];
        end = end.split("/")[end.split("/").length - 1];
        if (end.split(".").length == 1) {
            return "";
        }
        return end.split(".")[end.split(".").length - 1];
    }

    static getPathDirection(url) {
        var arr = url.split("/");
        if(arr.length == 1) {
            return "";
        }
        return url.slice(0,url.length-arr[arr.length-1].length);
    }
}

exports.Path = Path;