class ResType {
    static TEXT = 1;
    static JSON = 2;
    static IMAGE = 3;
    static PLIST = 4;

    static getURLType(url) {
        if (url.split(".").length == 1) {
            return ResType.TEXT;
        }
        var end = url.split(".")[url.split(".").length - 1];
        return ResType.getType(end);
    }

    static getType(end) {
        if (end == "json") {
            return ResType.JSON;
        }
        if (end == "png" || end == "jpg" || end == "PNG" || end == "JPG") {
            return ResType.IMAGE;
        }
        if (end == "plist") {
            return ResType.PLIST;
        }
        return ResType.TEXT;
    }
}

exports.ResType = ResType;