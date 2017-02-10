class ResItem {
    /**
     * 使用时的路径
     */
    __url;

    /**
     * 实际的加载地址有哪些
     */
    __loadList = [];

    /**
     * 资源类型
     */
    __type;

    constructor(url, type) {
        this.__url = url;
        if (type) {
            this.__type = type;
        } else {
            this.__type = ResType.getURLType(url);
        }
    }

    addURL(url) {
        var info = ResItemInfo.create();

        var plist = null;
        var splitURL = null;
        var array = url.split("#PLIST#");
        if (array.length == 2) {
            url = array[0];
            plist = array[1];
        }
        array = url.split("#SPLIT#");
        if (array.length == 2) {
            url = array[0];
            splitURL = array[1];
        }
        if (plist && !splitURL) {
            array = plist.split("#SPLIT#");
            if (array.length == 2) {
                plist = array[0];
                splitURL = array[1];
            }
        }
        array = url.split("/");
        var last = array.pop();
        var nameArray = last.split(".");
        var name = "";
        var end = "";
        if (nameArray.length == 1) {
            name = nameArray[0];
        } else {
            end = nameArray[nameArray.length - 1];
            name = last.slice(0, last.length - end.length - 1);
        }
        nameArray = name.split("@");
        var settingWidth;
        var settingHeight;
        var scale;
        var language;
        for (var i = 1; i < nameArray.length; i++) {
            var content = nameArray[i];
            var code = content.charCodeAt(0);
            if (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0) || code == ".".charCodeAt(0)) {
                var nums = content.split("x");
                if (nums.length == 1) {
                    scale = parseFloat(content);
                } else if (nums.length == 2) {
                    settingWidth = parseInt(nums[0]);
                    settingHeight = parseInt(nums[1]);
                }
            } else {
                language = content;
            }
        }
        info.url = url;
        info.plist = plist;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale || 1;
        info.language = language;
        info.update = false;
        info.splitURL = splitURL;
        this.__loadList.push(info);
    }

    addInfo(url, plist, settingWidth, settingHeight, scale, language, update = false, splitURL = null) {
        var info = ResItemInfo.create();
        info.url = url;
        info.plist = plist;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale || 1;
        info.language = language;
        info.update = update;
        info.splitURL = splitURL;
        this.__loadList.push(info);
        return info;
    }

    getLoadInfo(language, scale) {
        var loadList = this.__loadList;
        if (loadList.length == 1) {
            return loadList[0];
        }
        var info;
        for (var i = 0; i < loadList.length; i++) {
            if (language && language != loadList[i].language) {
                continue;
            }
            if (!info) {
                info = loadList[i];
            } else if (scale != null) {
                if (loadList[i].scale != null && math.abs(loadList[i].scale - scale) < math.abs(info.scale - scale)) {
                    info = loadList[i];
                }
            }
        }
        if (!info) {
            info = loadList[0];
        }
        return info;
    }

    get type() {
        return this.__type;
    }

    get url() {
        return this.__url;
    }

    static $pools = [];

    static create(url) {
        var plist = null;
        var splitURL = null;
        var array = url.split("#PLIST#");
        if (array.length == 2) {
            url = array[0];
            plist = array[1];
        }
        array = url.split("#SPLIT#");
        if (array.length == 2) {
            url = array[0];
            splitURL = array[1];
        }
        if (plist && !splitURL) {
            array = plist.split("#SPLIT#");
            if (array.length == 2) {
                plist = array[0];
                splitURL = array[1];
            }
        }
        array = url.split("/");
        var last = array.pop();
        var nameArray = last.split(".");
        var name = "";
        var end = "";
        if (nameArray.length == 1) {
            name = nameArray[0];
        } else {
            end = nameArray[nameArray.length - 1];
            name = last.slice(0, last.length - end.length - 1);
        }
        nameArray = name.split("@");
        var settingWidth;
        var settingHeight;
        var scale;
        var language;
        for (var i = 1; i < nameArray.length; i++) {
            var content = nameArray[i];
            var code = content.charCodeAt(0);
            if (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0) || code == ".".charCodeAt(0)) {
                var nums = content.split("x");
                if (nums.length == 1) {
                    scale = parseFloat(content);
                } else if (nums.length == 2) {
                    settingWidth = parseInt(nums[0]);
                    settingHeight = parseInt(nums[1]);
                }
            } else {
                language = content;
            }
        }
        var useURL = "";
        for (var i = 0; i < array.length; i++) {
            useURL += array[i] + "/";
        }
        useURL += nameArray[0] + (end != "" ? "." + end : "");
        var res;
        if (ResItem.$pools.length) {
            res = ResItem.$pools.pop();
            res.__url = useURL;
            res.__type = ResType.getType(end);
            res.__loadList.length = 0;
        } else {
            res = new ResItem(useURL, ResType.getType(end));
        }
        res.addInfo(url, plist, settingWidth, settingHeight, scale, language, false, splitURL);
        return res;
    }

    static release(item) {
        while (item.__loadList.length) {
            ResItemInfo.release(item.__loadList.pop());
        }
        ResItem.$pools.push(item);
    }
}

exports.ResItem = ResItem;