class ResItemInfo {

    /**
     * 实际的加载地址
     */
    url;

    /**
     * plist 地址
     */
    plist;

    /**
     * 预设的宽
     */
    settingWidth;

    /**
     * 预设的高
     */
    settingHeight;

    /**
     * 支持的缩放倍数
     */
    scale;

    /**
     * 支持的语言
     */
    language;

    /**
     * 是否更新旧的纹理
     * @native
     */
    update = UPDATE_RESOURCE ? false : null;

    static $pools = [];

    static create() {
        if (ResItemInfo.$pools.length) {
            return ResItemInfo.$pools.pop();
        } else {
            return new ResItemInfo();
        }
    }

    static release(info) {
        info.update = false;
        ResItemInfo.$pools.push(info);
    }
}

exports.ResItemInfo = ResItemInfo;