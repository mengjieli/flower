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

    constructor() {
    }

    addInfo(url, settingWidth, settingHeight, scale, language) {
        var info = new ResItemInfo();
        info.url = url;
        info.settingWidth = settingWidth;
        info.settingHeight = settingHeight;
        info.scale = scale;
        info.language = language;
        this.__loadList.push(info);
    }
}

exports.ResItem = ResItem;