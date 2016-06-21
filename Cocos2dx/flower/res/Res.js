class Res {

    static __resItems = [];

    /**
     * 查询存储的 ResItem，通过 url 查找匹配的项
     * @param url
     */
    static getRes(url) {
        var list = Res.__resItems;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].url == url) {
                return list[i];
            }
        }
        return null;
    }

    static addRes(res) {
        var list = Res.__resItems;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].url == res.url) {
                list.splice(i, 1);
                break;
            }
        }
        list.push(res);
    }
}

exports.Res = Res;